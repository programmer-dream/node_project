const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const path = require('path')
const VideoLearningLibrary = db.VideoLearningLibrary;
const Ratings         = db.Ratings;

const sequelize = db.sequelize;
const bcrypt = require("bcryptjs");

module.exports = {
  create,
  list,
  update,
  view,
  deleteLibrary,
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

  if(req.files.coverPhoto){
    req.body.cover_photo = req.body.uplodedPath + req.files.coverPhoto[0].filename;
  }

  if(req.body.tags)
    req.body.tags = JSON.stringify(req.body.tags)

  let learningLibrary = await VideoLearningLibrary.create(req.body);

  return { success: true, message: "Video Learning library created successfully", data:learningLibrary }

};


/**
 * API for view query
 */
async function view(id){
  let learningLibrary = await VideoLearningLibrary.findByPk(id)      
  return { success: true, message: "Video Learning library details", data:learningLibrary };
};


/**
 * API for list query according to school and student
 */
async function list(params){
  let level        = ['Basic','Intermediate','Expert'];
  let orderBy       = 'desc';
  let tag           = '';
  let limit         = 10;
  let offset        = 0;
  let search        = '';
  if(params.level && !level.includes(params.level) ) throw 'level must be Basic,Intermediate or Expert'

  if(params.search)
    search = params.search

  let whereCondition = {
      [Op.or]:{
                description: { 
                  [Op.like]: `%`+search+`%`
                },
              topic : { 
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
  //orderBy 
  if(params.orderBy)
     orderBy = params.orderBy

  //search tag
  if(params.tag){
     tag = params.tag
     whereCondition.tags = { [Op.like]: `%`+tag+`%` }
  }

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
                          'subject', 
                          'URL',
                          'recommended_student_level',
                          'tags',
                          'cover_photo'
                        ]
                      });

  return { success: true, message: "All Video Learning library data", total:total, data:learningLibrary }
};


/**
 * API for query update 
 */
async function update(req){
  //start validation 
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  if(!req.files.file) throw 'Please attach a file'

  //end validation
  let id = req.params.id
  
  req.body.URL          = "/videos/" + req.files.file[0].filename;
  req.body.video_format = path.extname(req.files.file[0].originalname);
  req.body.video_size   = req.files.file[0].size; 

  if(req.files.coverPhoto){
    req.body.cover_photo = req.body.uplodedPath + req.files.coverPhoto[0].filename;
  }

  if(req.body.tags)
    req.body.tags = JSON.stringify(req.body.tags)

  let num = await VideoLearningLibrary.update(req.body,{
                 where:{
                        video_learning_library_vls_id : id
                       }
              });

  if(!num) 
    throw 'Learning library not updated'
  
  let query = await VideoLearningLibrary.findByPk(id)
     
  return { success: true, message: "Video Learning library updated successfully", data: query }

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

  return { success:true, message:"Video Learning library deleted successfully!"};
  
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
    let avg = null

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

    userRating  = await Ratings.findOne({
      attributes: ['ratings','likes'],
      where:{video_learning_library_vls_id:id,user_vls_id:user.userVlsId}
    })

    return { success:true, message:"Rating & like data",like:like,avg:avg,data:userRating}
    
  }catch(err){
    throw err.message;
  }
};