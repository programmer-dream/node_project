const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;

const StudentQuery = db.StudentQuery;
const Employee = db.Employee;
const Branch = db.Branch;

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
  listSubject
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
  let optional      = []
  let schoolVlsId   = params.schoolVlsId
  let facultyVlsId  = params.facultyVlsId
  let branchVlsId   = params.branchVlsId
  if(!schoolVlsId) throw 'schoolVlsId is required'
    optional.push({school_vls_id  : schoolVlsId})
  if(!branchVlsId) throw 'branchVlsId is required'
    optional.push({branch_vls_id  : branchVlsId})
  //start pagination
  let limit   = 10
  let offset  = 0
  let search  = '';
  let status  = ['open','closed'];
  let orderBy = 'desc';
  let tag     = '';
  if(params.size)
     limit = parseInt(params.size)
  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit
  if(params.search)
      search = params.search
  if(params.status)
    status = []
    status.push(params.status)
  if(params.orderBy)
     orderBy = params.orderBy
  if(params.tag)
     tag = params.tag
  if(params.facultyVlsId) 
    optional.push({faculty_vls_id : facultyVlsId})
  if(params.studentVlsId) 
    optional.push({student_vls_id : studentVlsId})
  //end pagination
  let studentQuery  = await StudentQuery.findAll({  
                      limit:limit,
                      offset:offset,
                      where:{
                             [Op.or]:optional,
                             branch_vls_id  : branchVlsId,
                             topic: { [Op.like]: `%`+search+`%` },
                             description: { [Op.like]: `%`+search+`%` },
                             tags: { [Op.like]: `%`+tag+`%` },
                             query_status:{ [Op.in]: status }
                             },
                      order: [
                              ['query_vls_id', orderBy]
                      ],
                      attributes: ['query_vls_id', 'query_date', 'query_status', 'subject', 'description','tags','topic']
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

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
  return [year, month, day].join('-');
}
/**
 * API for get today's date
 */
async function listSubject(params){
  try{
    if(!params.id) throw 'branch id is required'
    //start pagination
    let limit = 10
    let offset = 0
    if(params.size)
       limit = parseInt(params.size)
    if(params.page)
        offset = 0 + (parseInt(params.page) - 1) * limit
    //end pagination
    let branchVlsId = params.id
    let employee  = await Branch.findAll({
                    limit:limit,
                    offset:offset,
                    where:{branch_vls_id:branchVlsId},
                    attributes: ['branch_name', 'address', 'contact1','emailId1','subjects'],
                  });
    return { success: true, message: "Branch data", data:employee };
  }catch(err){
    console.log(err)
    return { success: false, message: err.message};
  }
};