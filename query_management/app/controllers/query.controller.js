const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;

const StudentQuery = db.StudentQuery;
const Employee = db.Employee;
const Branch = db.Branch;
const Student = db.Student;
const Ratings = db.Ratings;
const Subject = db.Subject;

const sequelize = db.sequelize;
const bcrypt = require("bcryptjs");

module.exports = {
  create,
  list,
  listFaculty,
  update,
  view,
  deleteQuery,
  listSubject,
  queryResponse,
  getRatingLikes,
  statusUpdate
};


/**
 * API for create new query
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  req.body.query_status   = 'open'
  req.body.query_date     = formatDate() 

  if(req.body.tags)
    req.body.tags = JSON.stringify(req.body.tags)
  
  let createdQuery = await StudentQuery.create(req.body);

  return { success: true, message: "Query created successfully", data:createdQuery }
};


/**
 * API for view query
 */
async function view(id){
  let studentQuery    = await StudentQuery.findOne({
    where:{query_vls_id:id},
    include: [{ 
                    model:Student,
                    as:'postedBy',
                    attributes: ['student_vls_id']
                  },
                  { 
                    model:Employee,
                    as:'respondedBy',
                    attributes: ['faculty_vls_id','name', 'photo']
                  }]
    })           
  return { success: true, message: "View query details", data: studentQuery }

};


/**
 * API for list query according to school and student
 */
async function list(params,user){

  let schoolVlsId   = params.schoolVlsId
  let branchVlsId   = params.branchVlsId
  let myQuery       = params.myQuery

  if(!schoolVlsId) throw 'schoolVlsId is required'
  if(!branchVlsId) throw 'branchVlsId is required'
    
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

  whereCondition.branch_vls_id = branchVlsId
  whereCondition.school_vls_id = schoolVlsId


  //status 
  if(params.status){
    status = []
    status.push(params.status)
    whereCondition.query_status = { [Op.in]: status }
  }

  //orderBy 
  if(params.orderBy)
     orderBy = params.orderBy

  //search tag
  if(params.tag){
     tag = params.tag
     whereCondition.tags = { [Op.like]: `%`+tag+`%` }
  }

  //search faculity  
  if(params.facultyVlsId)
    whereCondition.faculty_vls_id = params.facultyVlsId

  //search student
  if(params.studentVlsId)
    whereCondition.student_vls_id = params.studentVlsId

  if(myQuery){
    if(user.role == 'student'){
      whereCondition.student_vls_id = user.userVlsId
    }else{
      whereCondition.faculty_vls_id = user.userVlsId
    }
  }

  let allCount      = await StudentQuery.count({ where: whereCondition })
  //end pagination
  let studentQuery  = await StudentQuery.findAll({  
                      limit:limit,
                      offset:offset,
                      where: whereCondition,
                      order: [
                               ['query_vls_id', orderBy]
                             ],
                      include: [
                                { 
                                  model:Student,
                                  as:'postedBy',
                                  attributes: ['student_vls_id']
                                },
                                { 
                                  model:Employee,
                                  as:'respondedBy',
                                  attributes: ['faculty_vls_id','name', 'photo']
                                },
                                { 
                                  model:Subject,
                                  as:'subject',
                                  attributes: ['subject_vls_id','name']
                                }
                              ],
                      attributes: [
                                    'query_vls_id', 
                                    'query_date', 
                                    'query_status', 
                                    'description',
                                    'tags',
                                    'topic',
                                    'faculty_vls_id',
                                    'student_vls_id',
                                    'response',
                                    'response_date',
                                    'is_comment'
                                  ]
                      });
  return { success: true, message: "All query data", total : allCount ,data:studentQuery }

};


/**
 * API for list faculty school
 */
async function listFaculty(params){
  if(!params.id) throw 'branchVlsId is required'
 
  let branchVlsId = params.id
  let employee  = await Employee.findAll({
                      where: { isTeacher : 1, branch_vls_id:branchVlsId },
                      attributes: [
                                    'faculty_vls_id', 
                                    'name', 
                                    'photo'
                                  ],
                  });
  return { success: true, message: "All query data", data:employee }

};


/**
 * API for query update 
 */
async function update(req){
  let id       = req.params.id
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()
  //return 'test'
  let isResponsed = await StudentQuery.findOne({
    where : {query_vls_id : id}
  })
  if(isResponsed.response) throw 'Query could not be updated because  faculty already responded'

  req.body.query_status  = 'open'
  req.body.query_date    = formatDate() 

  if(req.body.tags)
    req.body.tags        = JSON.stringify(req.body.tags)
  let num                = await StudentQuery.update(req.body,{
                             where:{ query_vls_id : id }
                          });

  if(!num) throw 'Query not updated'
  
  let query = await StudentQuery.findByPk(id)
     
  return { success: true, message: "Query updated successfully", data: query }
  
};


/**
 * API for delete query
 */
async function deleteQuery(id) {
  let num = await StudentQuery.destroy({
      where: { query_vls_id: id }
    })

  if(num != 1) throw 'Query not found'

  return { success:true, message:"Query deleted successfully!"}
  
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
  if(!params.id) throw 'branch id is required'

  try{
    let branchVlsId = params.id
    let branch  = await Branch.findOne({
                    where:{branch_vls_id:branchVlsId},
                    attributes: ['branch_vls_id'],
                    include: [{ 
                        model:Subject,
                        as:'subject',
                        attributes: ['subject_vls_id','name']
                      }]
                  });
    let subjects =  branch.subject
    return { success: true, message: "list subject data", data:subjects }

  }catch(err){
    throw err.message
  }
};


/**
 * query response Api 
 */
async function queryResponse(body, user){

  if(!body.queryId) throw 'QueryId is required'
  if(!body.response) throw'response is required'

  try{
    let queryId                 = body.queryId
    let updateField             = {}
    updateField.response        = body.response
    updateField.response_date   = formatDate()
    updateField.faculty_vls_id  =  user.userVlsId


    let num = await StudentQuery.update(updateField,{
                       where:{
                              query_vls_id : queryId
                             }
                    });
  let respondedBy = await Employee.findOne({
    where : {faculty_vls_id:user.userVlsId},
    attributes: ['faculty_vls_id','name','photo']
  });
  
  if(num != 1) throw 'Query not found'
  
  return { success: true, message: "Response updated successfully" ,respondedBy:respondedBy};
  
  }catch(err){
    throw err.message
  }

};


/**
 * API for delete query
 */
async function getRatingLikes(id, user) {
  try{
    let avg = null;
    //get like count
    let like  = await Ratings.count({
      where:{likes:1,query_vls_id:id}
    })
    //get rating avg
    let ratings = await Ratings.findOne({
      attributes: [
                    [ Sequelize.fn('SUM', Sequelize.col('ratings')), 'total_ratings' ],
                    [ Sequelize.fn('COUNT', Sequelize.col('ratings')), 'total_count' ]
                  ],
      where:{query_vls_id:id},
      group:['query_vls_id']
    })

    if(ratings){
    //get rating & likes
      let ratingData = ratings.toJSON();
      avg = parseInt(ratingData.total_ratings) / ratingData.total_count
    }

    userRating  = await Ratings.findOne({
      attributes: ['ratings','likes'],
      where:{query_vls_id:id,user_vls_id:user.userVlsId}
    })

    return { success:true, message:"Rating & like data",like:like,avg:avg,data:userRating};
  }catch(err){
    throw err.message
  }
};


/**
 * API for status update query
 */
async function statusUpdate(id, user) {
  if(user.role != 'student') throw 'unauthorised user'

  try{
    let userId = user.userVlsId
    let query = await StudentQuery.findOne({
                       where:{
                              query_vls_id : userId,
                              query_vls_id : id
                             }
                    });

    if(query){
      query.update({query_status:'Closed'})
    }else{
      throw new Error('Query not found')
    }

    return { success:true, message:"Status updated successfully",data:query}

  }catch(err){
    throw err.message
  }
};
