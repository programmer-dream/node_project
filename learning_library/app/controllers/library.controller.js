const { validationResult } = require('express-validator');
const db = require("../models");
const gm = require("gm");
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const path = require('path')
const LearningLibrary = db.LearningLibrary;
const Ratings         = db.Ratings;
const SubjectList     = db.SubjectList;
const config = require("../../../config/env.js");

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

   //return true
  // return req.body
  if(!req.files.file) throw 'Please attach a file'

  req.body.URL           = req.body.uplodedPath + req.files.file[0].filename;
  req.body.document_type = path.extname(req.files.file[0].originalname);
  req.body.document_size = req.files.file[0].size; 

  let cover_path_pic = new Promise((resolve, reject) => {
        let cover_path = makePdfImage(req,req.body.uplodedPath)
        setTimeout(resolve, 2500, cover_path);
      });
  let cover_path = await Promise.all([cover_path_pic])

  if(cover_path && cover_path.length > 0){
    req.body.cover_photo = cover_path[0];
  }

  if(req.body.tags)
    req.body.tags = JSON.stringify(req.body.tags)

  let learningLibrary = await LearningLibrary.create(req.body);

  return { success: true, message: "Learning library created successfully", data:learningLibrary }

};


/**
 * API for view query
 */
async function view(id){
  let learningLibrary    = await LearningLibrary.findOne({
    where : {learning_library_vls_id : id},
    include: [{ 
                model:SubjectList,
                as:'subjectList',
                attributes: ['id','subject_name','code']
            }]
  })      
  return { success: true, message: "Learning library details", data:learningLibrary }
};


/**
 * API for list query according to school and student
 */
async function list(params, user){
  //return user
  let level        = ['Basic','Intermediate','Expert'];
  let orderBy       = 'desc';
  let tag           = '';
  let limit         = 10;
  let offset        = 0;
  let search        = '';
  let schoolVlsId   = params.schoolVlsId
  let branchVlsId   = params.branchVlsId

  if(!schoolVlsId) throw 'schoolVlsId is required'
  if(!branchVlsId) throw 'branchVlsId is required'
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
  //end pagination
  whereCondition.branch_vls_id = branchVlsId
  whereCondition.school_vls_id = schoolVlsId
  //status 
  if(params.level){
    level = []
    level.push(params.level)
    whereCondition.recommended_student_level = { [Op.in]: level }
  }

  //orderBy 
  if(params.orderBy)
     orderBy = params.orderBy

  let total = await LearningLibrary.count({ where: whereCondition })

  let learningLibrary  = await LearningLibrary.findAll({  
                      limit:limit,
                      offset:offset,
                      where: whereCondition,
                      order: [
                              ['learning_library_vls_id', orderBy]
                      ],
                      attributes: [
                          'learning_library_vls_id',
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
        data = await getRatingLikes(item.learning_library_vls_id, user)
        item.ratings = {
            like      : data.like,
            avg       : data.avg,
            user_data : data.data
          }
    })
  )
  return { success : true,
           message : "All Learning library data", 
           total : total, 
           data : learningLibrary
         }

};


/**
 * API for query update 
 */
async function update(req){
  //start validation 
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  //end validation
  let id      = req.params.id
  let library = await LearningLibrary.findByPk(id)

  if(!library) throw 'Learning library not found'

  if(req.files.file){
    req.body.URL           = req.body.uplodedPath + req.files.file[0].filename;
    req.body.document_type = path.extname(req.files.file[0].originalname);
    req.body.document_size = req.files.file[0].size; 

    let cover_path_pic = new Promise((resolve, reject) => {
        let cover_path = makePdfImage(req,req.body.uplodedPath)
        setTimeout(resolve, 2500, cover_path);
      });
    let cover_path = await Promise.all([cover_path_pic])

    if(cover_path && cover_path.length > 0){
      req.body.cover_photo = cover_path[0];
    }
  }

  if(req.body.tags)
    req.body.tags = JSON.stringify(req.body.tags)

  let num = await LearningLibrary.update(req.body,{
                         where:{ learning_library_vls_id : id }
                      });

  if(!num) throw 'Learning library not updated'
  
  let query = await LearningLibrary.findByPk(id)
     
  return { success: true, message: "Learning library updated successfully", data: query }

};


/**
 * API for delete query
 */
async function deleteLibrary(id) {
  let num = await LearningLibrary.destroy({
                where: { learning_library_vls_id: id }
              })

  if(num != 1) throw 'Learning library not found'
  
  return { success:true, message:"Learning library deleted successfully!"}
  
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
      where:{likes:1,learning_library_vls_id:id}
    })

    //get rating avg
    let ratings = await Ratings.findOne({
      attributes: [
                    [ Sequelize.fn('SUM', Sequelize.col('ratings')), 'total_ratings' ],
                    [ Sequelize.fn('COUNT', Sequelize.col('ratings')), 'total_count' ]
                  ],
      where:{learning_library_vls_id:id},
      group:['learning_library_vls_id']
    })

    if(ratings){
    //get rating & likes
      let ratingData = ratings.toJSON();
        avg          = parseInt(ratingData.total_ratings) / ratingData.total_count
    } 
      whereCondition.learning_library_vls_id = id

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

async function makePdfImage(req, path){
    let image = Date.now()+'cover_photo.png';
    let pathToFile =  "./"+req.files.file[0].path

    let pathToSnapshot = config.pdf_path + path+ image;
      gm(pathToFile).thumb(300, // Width
                            300, // Height
                            pathToSnapshot, // Output file name
                            100, // Quality from 0 to 100
        function (error, stdout, stderr, command) {
            if (!error) {
              console.log("done")
            }else{
              console.log(error);
            }
        });
     return path+image
}