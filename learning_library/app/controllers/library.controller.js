const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const path = require('path')
const LearningLibrary = db.LearningLibrary;

const sequelize = db.sequelize;
const bcrypt = require("bcryptjs");

module.exports = {
  create,
  list,
  update,
  view,
  deleteLibrary
};
/**
 * API for create new query
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length)
     return { success: false, message: errors.array() }
   //return true
  if(!req.file) throw 'Please attach a file'
      req.body.URL           = req.file.filename;
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
  let schoolVlsId   = params.schoolVlsId
  let branchVlsId  = params.branchVlsId
  if(!schoolVlsId) throw 'schoolVlsId is required'
  if(!branchVlsId) throw 'branchVlsId is required'

  //start pagination
  let limit = 10
  let offset = 0
  if(params.size)
     limit = parseInt(params.size)
  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit
  //end pagination

  let learningLibrary  = await LearningLibrary.findAll({  
                      limit:limit,
                      offset:offset,
                      where:{school_vls_id : schoolVlsId,
                               branch_vls_id : branchVlsId},
                      attributes: ['subject', 'description', 'topic', 'subject', 'URL','recommended_student_level','tags']
                      });
  return { success: true, message: "All Learning library data", data:learningLibrary };
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