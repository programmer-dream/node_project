const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;

const StudentQuery = db.StudentQuery;
const Employee = db.Employee;

const sequelize = db.sequelize;
const bcrypt = require("bcryptjs");

module.exports = {
  create,
  list,
  listFaculty,
  update,
  view,
  deleteQuery
};
/**
 * API for create new query
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length)
     return { success: false, message: errors.array() }
  req.body.query_status   = 'open'
  req.body.query_date     = formatDate() 
  if(req.body.tags)
    req.body.tags         = JSON.stringify(req.body.tags)
  let createdQuery        = await StudentQuery.create(req.body);

  return { success: true, message: "Query created successfully", data:createdQuery };
};
/**
 * API for view query
 */
async function view(id){
  let studentQuery    = await StudentQuery.findByPk(id)           
  return { success: true, 
           message: "View query details", 
           data:studentQuery 
         };
};
/**
 * API for list query according to school and student
 */
async function list(params){
  let schoolVlsId   = params.schoolVlsId
  let studentVlsId  = params.studentVlsId
  if(!schoolVlsId) throw 'schoolVlsId is required'
  if(!studentVlsId) throw 'studentVlsId is required'

  //start pagination
  let limit = 10
  let offset = 0
  if(params.size)
     limit = parseInt(params.size)
  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit
  //end pagination

  let studentQuery  = await StudentQuery.findAll({  
                      limit:limit,
                      offset:offset,
                      where:{school_vls_id : schoolVlsId,
                               student_vls_id : studentVlsId},
                      attributes: ['query_vls_id', 'query_date', 'query_status', 'subject', 'description','tags']
                      });
  return { success: true, message: "All query data", data:studentQuery };
};
/**
 * API for list faculty school
 */
async function listFaculty(params){
  if(!params.branchVlsId) throw 'branchVlsId is required'
  //start pagination
  let limit = 10
  let offset = 0
  if(params.size)
     limit = parseInt(params.size)
  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit
  //end pagination
  let branchVlsId = params.branchVlsId
  let employee  = await Employee.findAll({
                  limit:limit,
                  offset:offset,
                  where:{isTeacher : 1,branch_vls_id:branchVlsId},
                  attributes: ['faculty_vls_id', 'name', 'photo'],
                });
  return { success: true, message: "All query data", data:employee };
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
  let id                 = req.params.id
  req.body.query_status  = 'open'
  req.body.query_date    = formatDate() 

  if(req.body.tags)
    req.body.tags        = JSON.stringify(req.body.tags)
  let num                = await StudentQuery.update(req.body,{
                             where:{
                                    query_vls_id : id
                                   }
                          });
  if(!num) throw 'Query not updated'
      let query = await StudentQuery.findByPk(1)
     
  return { success: true, 
           message: "Query updated successfully", 
           data   : query 
         };
};
/**
 * API for delete query
 */
async function deleteQuery(id) {
  let num = await StudentQuery.destroy({
      where: { query_vls_id: id }
    })
  if(num != 1) throw 'Branch not found'
  return { success:true, message:"Branch deleted successfully!"};
  
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