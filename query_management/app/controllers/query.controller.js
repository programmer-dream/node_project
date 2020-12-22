const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;

const StudentQuery = db.StudentQuery;
const Employee = db.Employee;
const Branch = db.Branch;
const Student = db.Student;

const sequelize = db.sequelize;
const bcrypt = require("bcryptjs");

module.exports = {
  create,
  list,
  listFaculty,
  update,
  view,
  deleteQuery,
  assignQuery,
  listSubject,
  queryResponse
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
  let studentQuery    = await StudentQuery.findOne({
    where:{id:id},
    include: [{ 
                    model:Student,
                    as:'postedBy',
                    attributes: ['student_vls_id','name', 'photo']
                  },
                  { 
                    model:Employee,
                    as:'asignedTo',
                    attributes: ['faculty_vls_id','name', 'photo']
                  }]
    })           
  return { success: true, 
           message: "View query details", 
           data:studentQuery 
         };
};
/**
 * API for list query according to school and student
 */
async function list(params){
  let whereCondition = {};
  let schoolVlsId   = params.schoolVlsId
  let branchVlsId   = params.branchVlsId
  if(!schoolVlsId) throw 'schoolVlsId is required'
    whereCondition.school_vls_id = schoolVlsId
  if(!branchVlsId) throw 'branchVlsId is required'
    whereCondition.branch_vls_id = branchVlsId
  //start pagination
  let limit   = 10
  let offset  = 0
  let search  = '';
  let status  = ['open','closed'];
  let orderBy = 'desc';
  let tag     = '';
  let faculty = [];
  let student = [];
  if(params.size)
     limit = parseInt(params.size)
  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit
  //search
  if(params.search)
    search = params.search
    whereCondition.topic = { [Op.like]: `%`+search+`%` }
  //status 
  if(params.status)
    status = []
    status.push(params.status)
    whereCondition.query_status={ [Op.in]: status }
  //orderBy 
  if(params.orderBy)
     orderBy = params.orderBy
  //search tag
  if(params.tag)
     tag = params.tag
    whereCondition.tags = { [Op.like]: `%`+tag+`%` }
  //search faculity  
  if(params.facultyVlsId)
    whereCondition.faculty_vls_id = params.facultyVlsId
  //search student
  if(params.studentVlsId)
    whereCondition.student_vls_id = params.studentVlsId

  let allCount      = await StudentQuery.count()
  //end pagination
  let studentQuery  = await StudentQuery.findAll({  
                      limit:limit,
                      offset:offset,
                      where:{
                            [Op.or]:[
                              whereCondition ,
                              {
                                description: { [Op.like]: `%`+search+`%`},
                                tags : { [Op.like]: `%`+tag+`%` }
                             }]
                           },
                      order: [
                              ['query_vls_id', orderBy]
                      ],
                      include: [{ 
                              model:Student,
                              as:'postedBy',
                              attributes: ['student_vls_id','name', 'photo']
                            },{ 
                          model:Employee,
                          as:'asignedTo',
                          attributes: ['faculty_vls_id','name', 'photo']
                        }],
                      attributes: ['query_vls_id', 'query_date', 'query_status', 'subject', 'description','tags','topic','faculty_vls_id','student_vls_id','response','response_date','is_comment']
                      });
  return { success: true, message: "All query data", total : allCount ,data:studentQuery };
};
/**
 * API for list faculty school
 */
async function listFaculty(params){
  if(!params.branchVlsId) throw 'branchVlsId is required'
 
  let branchVlsId = params.branchVlsId
  let employee  = await Employee.findAll({
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
      let query = await StudentQuery.findByPk(id)
     
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
  if(num != 1) throw 'Query not found'
  return { success:true, message:"Query deleted successfully!"};
  
};
/**
 * API for delete query
 */
async function assignQuery(body) {
  let queryVlsId   = body.queryVlsId
  let facultyVlsId = body.facultyVlsId
  if(!facultyVlsId) throw 'facultyVlsId is required'
  if(!queryVlsId)   throw   'queryVlsId is required'
    updateField = {
      faculty_vls_id:facultyVlsId
    }
  let num = await StudentQuery.update(updateField,{
                       where:{
                              query_vls_id : queryVlsId
                             }
                    });
  if(num != 1) throw 'Query not found'
  return { success:true, message:"Query assigned successfully!"};
  
};

/**
 * API for get today's date
 */
function formatDate() {
  var d = new Date(),
  month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
   year = d.getFullYear();
   hour = d.getHours();
   min  = d.getMinutes();
   sec  = d.getSeconds()
  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
  date =  [year, month, day].join('-') + ' '+hour+ ':'+min+':'+sec;
  return date;
}
/**
 * API for get today's date
 */
async function listSubject(params){
  try{
    if(!params.id) throw 'branch id is required'
    
    let branchVlsId = params.id
    let employee  = await Branch.findOne({
                    where:{branch_vls_id:branchVlsId},
                    attributes: ['subjects'],
                  });
    let subjects = employee.toJSON()
    subjectListing = JSON.parse(subjects.subjects)
    return { success: true, message: "Branch data", data:subjectListing };
  }catch(err){
    return { success: false, message: err.message};
  }
};
/**
 * query response Api 
 */
async function queryResponse(body){
  try{
    if(!body.queryId) throw 'QueryId is required'
    if(!body.response) throw'response is required'
    let queryId               = body.queryId
    let updateField           = {}
    updateField.response      = body.response
    updateField.response_date = formatDate()
    //return updateField
    let num = await StudentQuery.update(updateField,{
                       where:{
                              query_vls_id : body.queryId
                             }
                    });
  if(num != 1) throw 'Query not found'
    return { success: true, message: "Response updated successfully" };
  }catch(err){
    return { success: false, message: err.message};
  }
};