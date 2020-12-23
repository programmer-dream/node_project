const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const path = require('path')
const LearningLibrary = db.LearningLibrary;
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

   //return true
  if(!req.file) throw 'Please attach a file'
      req.body.URL           = req.body.uplodedPath + req.file.filename;
      req.body.document_type = path.extname(req.file.originalname);
      req.body.document_size = req.file.size;
  if(req.body.tags)
    req.body.tags         = JSON.stringify(req.body.tags)
  let learningLibrary     = await LearningLibrary.create(req.body);

  return { success: true, message: "Learning library created successfully", data:learningLibrary };
};


/**
 * API for view query
 */
async function view(id){
  let learningLibrary    = await LearningLibrary.findByPk(id)      
  return { success: true, 
           message: "Learning library details", 
           data:learningLibrary 
         };
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
  let schoolVlsId   = params.schoolVlsId
  let branchVlsId   = params.branchVlsId

  if(!schoolVlsId) throw 'schoolVlsId is required'
  if(!branchVlsId) throw 'branchVlsId is required'
  if(!level.includes(params.level) ) throw 'level must be Basic,Intermediate or Expert'

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

  //search tag
  if(params.tag){
     tag = params.tag
     whereCondition.tags = { [Op.like]: `%`+tag+`%` }
  }
  let total = await LearningLibrary.count()
  let learningLibrary  = await LearningLibrary.findAll({  
                      limit:limit,
                      offset:offset,
                      where: whereCondition,
                      order: [
                              ['learning_library_vls_id', orderBy]
                      ],
                      ttributes: ['subject', 'description', 'topic', 'subject', 'URL','recommended_student_level','tags']
                      });
  return { success: true, message: "All Learning library data", total:total, data:learningLibrary };
};


/**
 * API for query update 
 */
async function update(req){
  //start validation 
  const errors = validationResult(req);
  if(errors.array().length)
     return { success: false, message: errors.array() }
  //end validation
  let id = req.params.id
  if(!req.file) throw 'Please attach a file'
      req.body.URL           = req.file.filename;
      req.body.document_type = path.extname(req.file.originalname);
      req.body.document_size = req.file.size; 

  if(req.body.tags)
    req.body.tags        = JSON.stringify(req.body.tags)
  let num                = await LearningLibrary.update(req.body,{
                             where:{
                                    learning_library_vls_id : id
                                   }
                          });
  if(!num) throw 'Learning library not updated'
      let query = await LearningLibrary.findByPk(id)
     
  return { success: true, 
           message: "Learning library updated successfully", 
           data   : query 
         };
};


/**
 * API for delete query
 */
async function deleteLibrary(id) {
  let num = await LearningLibrary.destroy({
      where: { learning_library_vls_id: id }
    })
  if(num != 1) throw 'Learning library not found'
  return { success:true, message:"Learning library deleted successfully!"};
  
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
    //get like count
    let like  = await Ratings.count({
      where:{likes:1,learning_library_vls_id:id}
    })
    //get rating avg
    let ratings = await Ratings.findOne({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('ratings')), 'total_ratings'],
      [Sequelize.fn('COUNT', Sequelize.col('ratings')), 'total_count']],
      where:{learning_library_vls_id:id},
      group:['learning_library_vls_id']
    })
    //get rating & likes
    let ratingData = ratings.toJSON();
    let avg = parseInt(ratingData.total_ratings) / ratingData.total_count

    userRating  = await Ratings.findOne({
      attributes: ['ratings','likes'],
      where:{learning_library_vls_id:id,user_vls_id:user.userVlsId}
    })

    return { success:true, message:"Rating & like data",like:like,avg:avg,data:userRating};
  }catch(err){
    throw err.message;
  }
};