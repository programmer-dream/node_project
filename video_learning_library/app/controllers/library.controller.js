const { validationResult } = require('express-validator');
const {updateRewardsPoints} = require('../../../helpers/update-rewards')
const db = require("../../../models");
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const path = require('path')
const VideoLearningLibrary = db.VideoLearningLibrary;
const VideoLibraryComment = db.VideoLibraryComment;
const Ratings              = db.VideoLibraryRatings;
const ThumbnailGenerator   = require('fs-thumbnail');
const SubjectList          = db.SubjectList;
const Authentication       = db.Authentication;
const thumbGen = new ThumbnailGenerator({
    verbose: true, // Whether to print out warning/errors
    size: [500, 300], // Default size, either a single number of an array of two numbers - [width, height].
    quality: 70, // Default quality, between 1 and 100
});

const sequelize = db.sequelize;
const bcrypt = require("bcryptjs");
const config = require("../../../config/env.js");

module.exports = {
  create,
  list,
  update,
  view,
  deleteLibrary,
  deleteMultipleQuery,
  getRatingLikes
};


/**
 * API for create new query
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  if(!req.files.file) 
    throw 'Please attach a file'

  req.body.URL          = "/videos/" + req.files.file[0].filename;
  req.body.video_format = path.extname(req.files.file[0].originalname);
  req.body.video_size   = req.files.file[0].size;

  let videos_path =  config.videos_path
  let img_path    = videos_path+ '/cover_photo/'+ Date.now()+'cover_photo.png';

  let thumbnailPath = await thumbGen.getThumbnail({
      path: req.files.file[0].path,
      output: img_path,
      size: 300, // You can override the default size per thumbnail
      quality: 70, // You can override the default quality per thumbnail
    });

  if(thumbnailPath){
    req.body.cover_photo = img_path.replace('./uploads', '');
  }

  if(req.body.tags)
    req.body.tags = JSON.stringify(req.body.tags)

  let learningLibrary = await VideoLearningLibrary.create(req.body);

  return { success: true, message: "Video Learning library created successfully", data:learningLibrary }

};


/**
 * API for view query
 */
async function view(id, user){
  let user_detail = await Authentication.findByPk(user.id)
  let branchId    = user_detail.branch_vls_id
  
  let isSubjectExist = false
  let learningLibrary = await VideoLearningLibrary.findOne({
    where : {video_learning_library_vls_id : id},
    include: [{ 
                model:SubjectList,
                as:'subjectList',
                attributes: ['id','subject_name','code']
            }]
  });
  // return learningLibrary
  if(learningLibrary){
      learningLibrary = learningLibrary.toJSON()
      if(learningLibrary.subjectList){
        let branchSubjects = await SubjectList.findAll({
                          where: {branch_vls_id : branchId },
                          attributes: ['id','subject_name','code']
                        });

        await Promise.all(
          branchSubjects.map(async subject => {
                if(learningLibrary.subjectList.subject_name.toLowerCase() == subject.subject_name.toLowerCase())
                  isSubjectExist = true
          })
        );
      }
      learningLibrary.isSubjectExist = isSubjectExist

    }
    
    await updateRewardsPoints(user, 'watch_online_video', "increment")
  //return branchSubjects     
  return { success: true, message: "Video Learning library details", data:learningLibrary };
};


/**
 * API for list query according to school and student
 */
async function list(params , user){
  let level        = ['Basic','Intermediate','Expert'];
  let orderBy       = 'desc';
  let tag           = '';
  let limit         = 10;
  let offset        = 0;
  let search        = '';
  let subjectCode   = ""
  if(params.level && !level.includes(params.level) ) throw 'level must be Basic,Intermediate or Expert'

  if(params.subject){
    let subject = await getSubjectCode(params.subject)
    if(subject && subject.code){
      subjectCode = subject.code
    }else{
      return { success: true, message: "All Learning library data", total:0, data:[] }
    }

  }


  if(params.search)
    search = params.search

  let whereCondition = {
      [Op.or]:{
                description: { 
                  [Op.like]: `%`+search+`%`
                },
              topic : { 
                [Op.like]: `%`+search+`%` 
              },
              tags : { 
                [Op.like]: `%`+search+`%` 
              }
           }
    };
  //start pagination
  if(params.size)
     limit = parseInt(params.size)

  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit
  //status 
  if(params.level){
    level = []
    level.push(params.level)
    whereCondition.recommended_student_level = { [Op.in]: level }
  }

  if(subjectCode && subjectCode != "")
    whereCondition.subject_code = subjectCode

  //orderBy 
  if(params.orderBy)
     orderBy = params.orderBy

  let total = await VideoLearningLibrary.count({ where: whereCondition })

  let learningLibrary  = await VideoLearningLibrary.findAll({  
                      limit:limit,
                      offset:offset,
                      where: whereCondition,
                      order: [
                              ['video_learning_library_vls_id', orderBy]
                      ],
                      attributes: [
                          'video_learning_library_vls_id',
                          'subject', 
                          'description', 
                          'topic', 
                          'subject_code', 
                          'URL',
                          'recommended_student_level',
                          'tags',
                          'cover_photo'
                        ],
                        include: [{ 
                            model:SubjectList,
                            as:'subjectList',
                            attributes: ['id','subject_name','code']
                        }]
                      });
  await Promise.all(
    learningLibrary.map(async item => {
        data = await getRatingLikes(item.video_learning_library_vls_id, user)
        item.ratings = {
            like : data.like,
            avg  : data.avg,
            user_data : data.data
          }
    })
  )
  return { success: true, message: "All Learning library data", total:total, data:learningLibrary }
};

/**
 * function to subject code
 */
async function getSubjectCode(subject){
  let whereCodition = {
    branch_vls_id: { [Op.eq]: null },  
    [Op.eq]: sequelize.where(sequelize.fn('lower', sequelize.col('subject_name')), '=', subject) 
  }
  let subjectData = SubjectList.findOne({
                      where: whereCodition,
                      attributes: ['id','subject_name','code']
                    });

  return subjectData
}

/**
 * API for query update 
 */
async function update(req){
  //start validation 
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  let id = req.params.id

  let videoLibrary = await VideoLearningLibrary.findByPk(id)

  if(!videoLibrary) throw 'Video Learning library not found'

  if(req.files.file){
    req.body.URL          = "/videos/" + req.files.file[0].filename;
    req.body.video_format = path.extname(req.files.file[0].originalname);
    req.body.video_size   = req.files.file[0].size; 

    let videos_path =  config.videos_path
    let img_path    = videos_path+ '/cover_photo/'+ Date.now()+'cover_photo.png';

    let thumbnailPath = await thumbGen.getThumbnail({
        path: req.files.file[0].path,
        output: img_path,
        size: 300, // You can override the default size per thumbnail
        quality: 70, // You can override the default quality per thumbnail
      });

    req.body.cover_photo = img_path.replace('./uploads', '');
  }

  if(req.body.tags)
    req.body.tags = JSON.stringify(req.body.tags)

  let num = await VideoLearningLibrary.update(req.body,{
                 where:{
                        video_learning_library_vls_id : id
                       }
              });

  if(!num) 
    throw 'Video Learning library not updated'
  
    videoLibrary = await VideoLearningLibrary.findByPk(id)
     
  return { success: true, message: "Video Learning library updated successfully", data: videoLibrary }

};


/**
 * API for delete query
 */
async function deleteLibrary(id) {

  let num = await VideoLearningLibrary.destroy({
      where: { video_learning_library_vls_id: id }
    })
  if(num != 1) 
    throw 'Learning library not found'

  await Ratings.destroy({
      where: { video_learning_library_vls_id: id }
    })

  await VideoLibraryComment.destroy({
      where: { video_learning_library_vls_id: id }
    })

  return { success:true, message:"Video Learning library deleted successfully!"};
  
};


/**
 * API for Bulk delete query
 */
async function deleteMultipleQuery(body, user) {

  // if(user.role != 'branch-admin') throw "unauthorised user"
  if(!body.libraryIds || (!Array.isArray(body.libraryIds) || body.libraryIds.length <= 0 ) ) throw "queryIds are requeried"

  let queryIds = body.queryIds
  
  await VideoLearningLibrary.destroy({
      where: { video_learning_library_vls_id: queryIds }
    })

  await Ratings.destroy({
      where:{video_learning_library_vls_id: queryIds}
    })

  await VideoLibraryComment.destroy({
      where:{video_learning_library_vls_id: queryIds}
    })

  return { success:true, message:"Video learning library's deleted successfully!"}
  
};

/**
 * API for get today's date
 */
function formatDate() {
  var d = new Date(),
  month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
   year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
  return [year, month, day].join('-');
}

/**
 * API for get rating and likes for learning library
 */
async function getRatingLikes(id, user) {
  try{
    let avg = 0
    let whereCondition = {}
    //get like count
    let like  = await Ratings.count({
      where:{likes:1,video_learning_library_vls_id:id}
    })

    //get rating avg
    let ratings = await Ratings.findOne({
      attributes: [ 
                    [ Sequelize.fn('SUM', Sequelize.col('ratings')), 'total_ratings' ],
                    [ Sequelize.fn('COUNT', Sequelize.col('ratings')), 'total_count' ]
                  ],
      where:{video_learning_library_vls_id:id},
      group:['video_learning_library_vls_id']
    })

    if(ratings){
    //get rating & likes
      let ratingData = ratings.toJSON();
        avg          = parseInt(ratingData.total_ratings) / ratingData.total_count
    }
      whereCondition.video_learning_library_vls_id = id

    if(user)
      whereCondition.user_vls_id = user.userVlsId

    userRating  = await Ratings.findOne({
      attributes : ['ratings','likes'],
      where : whereCondition
    })

    return { success:true, message:"Rating & like data",like:like,avg:avg,data:userRating}
    
  }catch(err){
    throw err.message;
  }
};