const { validationResult } = require('express-validator');
const {updateRewardsPoints} = require('../../../helpers/update-rewards')
const db = require("../../../models");
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const StudentQuery = db.StudentQuery;
const Employee = db.Employee;
const Branch = db.Branch;
const Student = db.Student;
const Ratings = db.Ratings;
const Subject = db.Subject;
const Classes = db.Classes;
const Section = db.Section;
const SubjectList = db.SubjectList;
const Users   = db.Users;
const Comment = db.Comment;
const Notification = db.Notification;
const moment = require("moment");
const sequelize = db.sequelize;
const bcrypt = require("bcryptjs");

module.exports = {
  create,
  list,
  listFaculty,
  update,
  view,
  deleteQuery,
  deleteMultipleQuery,
  listSubject,
  queryResponse,
  getRatingLikes,
  statusUpdate,
  canResponse,
  dashboardCount,
  teacherQueryList,
  listAllSubject,
  subjectQueryCount
};


/**
 * API for create new query
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()
  let user = req.user

  if(user.role == 'student'){
    let student = await Student.findByPk(user.userVlsId)
    req.body.class_vls_id = student.class_id
  }
  req.body.query_status   = 'open'
  req.body.query_date     = formatDate() 

  if(req.body.tags)
    req.body.tags = JSON.stringify(req.body.tags)
  
  let createdQuery = await StudentQuery.create(req.body);
    
    let notificatonData = {}
    let users = await querySubjectTeacher(createdQuery.subject_code)
    notificatonData.branch_vls_id = createdQuery.branch_vls_id
    notificatonData.school_vls_id = createdQuery.school_vls_id
    notificatonData.status        = 'general'
    notificatonData.message       = '{name} created new query for {subjectname}.'
    notificatonData.notificaton_type = 'query'
    notificatonData.notificaton_type_id = createdQuery.query_vls_id
    notificatonData.start_date    = createdQuery.query_date
    notificatonData.users         = JSON.stringify(users)
    notificatonData.added_by      = user.userVlsId
    notificatonData.added_type    = user.role
    notificatonData.event_type    = 'created'
    await Notification.create(notificatonData)
    
    await updateRewardsPoints(user, 'create_query', "increment")
    //notification
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
  let branchVlsId   = params.branch_vls_id
  let myQuery       = params.myQuery

  if(!schoolVlsId) throw 'schoolVlsId is required'
  if(!branchVlsId) throw 'branchVlsId is required'

  //start pagination
  let limit   = 10
  let offset  = 0
  let search  = '';
  let status  = ['Open', 'Inprogress', 'Closed','Rejected'];
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
              },
              tags : { 
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

  //search faculity  
  if(params.query_level)
    whereCondition.query_level = params.query_level

  // faculity  
  if(params.facultyVlsId)
    whereCondition.faculty_vls_id = params.facultyVlsId

  //search student
  if(params.studentVlsId)
    whereCondition.student_vls_id = params.studentVlsId

  if(params.subject_code && params.subject_code != 'mySubject')
    whereCondition.subject_code = params.subject_code
  
  if(params.subject_code == 'mySubject'){

        let subjects_code = await Subject.findAll({
           where:{
                  teacher_id  : user.userVlsId
                 },
            attributes: ['code']   
        }).then(subject => subject.map(subject => subject.code));
    
    whereCondition.subject_code = { [Op.in] : subjects_code }
  }

  if(params.class_vls_id)
    whereCondition.class_vls_id = params.class_vls_id

  if(myQuery){
    if(user.role == 'student'){
      whereCondition.student_vls_id = user.userVlsId
    }else{
      whereCondition.faculty_vls_id = user.userVlsId
    }
  }

  if(params.faculty_vls_id)
    whereCondition.faculty_vls_id = params.faculty_vls_id

  let sectionFilter = {}
  if(params.section_id)
    sectionFilter.section_id = params.section_id

  if(params.query_date_start)
    whereCondition.query_date = { [Op.gte] : params.query_date_start+" 00:00:00"}

  if(params.query_date_end)
    whereCondition.query_date = { [Op.lte] : params.query_date_end+" 23:59:59"}


  let allCount      = await StudentQuery.count({ where: whereCondition,
                            include: [
                                { 
                                  model:Student,
                                  as:'postedBy',
                                  where : sectionFilter,
                                  attributes: ['student_vls_id']
                                } ]
                              })
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
                                  where : sectionFilter,
                                  attributes: ['student_vls_id']
                                },
                                { 
                                  model:Employee,
                                  as:'respondedBy',
                                  attributes: ['faculty_vls_id','name', 'photo']
                                },
                                { 
                                  model:SubjectList,
                                  as:'subjectList',
                                  attributes: ['id','subject_name','code']
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
                                    'is_comment',
                                    'subject_code',
                                    'reject_comment',
                                    'query_level'
                                  ]
                      });
  let queryArray = []
  await Promise.all(
    studentQuery.map(async query => {
      let queryData    = query.toJSON()
      let ratingLikes  = await queryRatingLikes(query.query_vls_id);
      queryData.ratingLikes = ratingLikes
      queryArray.push(queryData)
    })
  )
  let includeArr = [
                      { 
                        model:Student,
                        as:'postedBy',
                        where : sectionFilter,
                        attributes: ['student_vls_id']
                      } 
                   ]

  //conditon for counts 
  whereCondition.query_status = 'open'
  let open  = await StudentQuery.count({
                      where : whereCondition,
                      include : includeArr
                    })

  whereCondition.query_status = 'Closed'
  let closed  = await StudentQuery.count({
                      where : whereCondition,
                      include : includeArr
                    })

  let counts =  { open , closed }
  return { success: true, message: "All query data", total : allCount ,data:queryArray , counts}

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
    let notificatonData = {}
    let users = await querySubjectTeacher(query.subject_code)
    notificatonData.branch_vls_id = query.branch_vls_id
    notificatonData.school_vls_id = query.school_vls_id
    notificatonData.status        = 'general'
    notificatonData.message       = '{name} updated query for {subjectname}.'
    notificatonData.notificaton_type = 'query'
    notificatonData.notificaton_type_id = query.query_vls_id
    notificatonData.start_date    = query.query_date
    notificatonData.users         = JSON.stringify(users)
    notificatonData.added_by      = req.user.userVlsId
    notificatonData.added_type    = req.user.role
    notificatonData.event_type    = 'updated'
    await Notification.create(notificatonData)
    //notification
  return { success: true, message: "Query updated successfully", data: query }
  
};


/**
 * API for delete query
 */
async function deleteQuery(id , user) {
  let query = await StudentQuery.findByPk(id)

  if(!query) throw 'Query not found'

  let num = await StudentQuery.destroy({
      where: { query_vls_id: id }
    })

  await Notification.update({is_deleted: 1},{
      where:{ 
              notificaton_type   :  'query',
              notificaton_type_id:  id
            }
  });

  await Ratings.destroy({
      where:{query_vls_id: id}
    })

  await Comment.destroy({
      where:{query_vls_id: id}
    })

  return { success:true, message:"Query deleted successfully!"}
  
};



/**
 * API for Bulk delete query
 */
async function deleteMultipleQuery(body, user) {

  // if(user.role != 'branch-admin') throw "unauthorised user"
  if(!body.queryIds || (!Array.isArray(body.queryIds) || body.queryIds.length <= 0 ) ) throw "queryIds are requeried"

  let queryIds = body.queryIds
  
  await StudentQuery.destroy({
      where: { query_vls_id: queryIds }
    })

  await Ratings.destroy({
      where:{query_vls_id: queryIds}
    })

  await Comment.destroy({
      where:{query_vls_id: queryIds}
    })

  return { success:true, message:"Query's deleted successfully!"}
  
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
 * API for get list subjects
 */
async function listSubject(params, user){

  if(!params.branch_vls_id && user.role != "super-admin") throw 'branch id is required'

  try{

    let wherecondition = { branch_vls_id: { [Op.eq]: null } }
    if(params.branch_vls_id && params.branch_vls_id != "null" )
      wherecondition = {branch_vls_id:params.branch_vls_id}

    let subjects  = await SubjectList.findAll({
                        where:wherecondition,
                        attributes: ['id','subject_name','code']
                      });

    return { success: true, message: "list subject data", data:subjects }

  }catch(err){
    throw err.message
  }
};


/**
 * API for get list subjects
 */
async function listAllSubject(params, user){

  if(user.role == "super-admin") throw 'school id is required'
  
  try{
    let school_id = params.school_id
    let userData = await Users.findOne({ where: { user_name: user.userId } });
    if(user.role != "super-admin") 
      school_id = userData.school_id

    let wherecondition = { school_vls_id: school_id }
    if(userData.branch_vls_id && userData.branch_vls_id != null )
      wherecondition = { branch_vls_id: userData.branch_vls_id }

    let subjects  = await SubjectList.findAll({
                        where:wherecondition,
                        attributes: ['id','subject_name','code']
                      });

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

  let canResponses = await canResponse(body.queryId, user)
  
  if(!canResponses.success) throw "User can not add/update to this query"

  try{
    let queryId                 = body.queryId
    let updateField             = {}
    updateField.response        = body.response
    updateField.query_status    = 'Inprogress'
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

    let dbQuery = await StudentQuery.findByPk(queryId);
    let users = [{ 'id': dbQuery.student_vls_id, 'type': 'student'}]
    let notificatonData = {}
    notificatonData.branch_vls_id = dbQuery.branch_vls_id
    notificatonData.school_vls_id = dbQuery.school_vls_id
    notificatonData.status        = 'general'
    notificatonData.message       = '{name} answered on your query'
    notificatonData.notificaton_type = 'query'
    notificatonData.notificaton_type_id = dbQuery.query_vls_id
    notificatonData.start_date    = dbQuery.query_date
    notificatonData.users         = JSON.stringify(users)
    notificatonData.added_by      = user.userVlsId
    notificatonData.added_type    = user.role
    notificatonData.event_type    = 'answered'
    await Notification.create(notificatonData)

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
      where:{ likes        : 1,
              query_vls_id : id
            }
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
      where:{ 
            query_vls_id  : id,
            user_vls_id   : user.userVlsId,
            user_role     : user.role,
          }
    })

    return { success:true, message:"Rating & like data",like:like,avg:avg,data:userRating};
  }catch(err){
    throw err.message
  }
};


/**
 * API for status update query
 */
async function statusUpdate(id, user, body) {

  //if(user.role != 'student') throw 'unauthorised user'
  let whereCondition = { query_vls_id : id }
  let status = "Rejected"
  let message = '{name} rejected query for {subjectname}.'
  let reject_comment = ""
  if(user.role == 'student'){
    whereCondition = { student_vls_id : user.userVlsId, query_vls_id : id }
    status = "Closed"
    message = '{name} closed query for {subjectname}.'
  }

  if(body.reject_comment){
    reject_comment = body.reject_comment
  }

  try{
    let userId = user.userVlsId
    let query = await StudentQuery.findOne({
                       where: whereCondition
                    });

    if(query){
      query.update({query_status: status, reject_comment: reject_comment})
    }else{
      throw new Error('Query not found')
    }

    let notificatonData = {}
    let dbQuery = await StudentQuery.findByPk(id)
    let users   = {}

    if(user.role == 'student'){
      users = await querySubjectTeacher(query.subject_code)
    }else{
      users = [{ 'id': query.student_vls_id, 'type': 'student'}]
    }

    notificatonData.branch_vls_id = dbQuery.branch_vls_id
    notificatonData.school_vls_id = dbQuery.school_vls_id
    notificatonData.status        = 'general'
    notificatonData.message       = message
    notificatonData.notificaton_type = 'query'
    notificatonData.notificaton_type_id = dbQuery.query_vls_id
    notificatonData.start_date    = dbQuery.query_date
    notificatonData.users         = JSON.stringify(users)
    notificatonData.added_by      = user.userVlsId
    notificatonData.added_type    = user.role
    notificatonData.event_type    = status
    await Notification.create(notificatonData)
    //notification
    return { success:true, message:"Status updated successfully",data:query}

  }catch(err){
    throw err.message
  }
};

/**
 * API for check can response
 */
async function canResponse(id, user) {
    let query = await StudentQuery.findOne({
                       where:{
                              query_vls_id : id
                             },
                      attributes: ['class_vls_id','faculty_vls_id','subject_code']
                    });
    
    let class_id      = query.class_vls_id
    let subject_code  = query.subject_code

    let classes = await Classes.findOne({
                       where:{
                              class_vls_id : class_id,
                              teacher_id   : user.userVlsId
                             },
                        attributes: ['class_vls_id']   
                    })
    if(classes){
      return { success : true, message:"User can response"}
    }

    let section = await Section.findOne({
                     where:{
                            class_id     : class_id,
                            teacher_id   : user.userVlsId
                           },
                      attributes: ['id']   
                  })

    if(section){
      return { success : true, message:"User can response"}
    }

    let subject = await Subject.findOne({
                     where:{
                            teacher_id   : user.userVlsId,
                            code         : subject_code
                           },
                      attributes: ['code']   
                  })
    
    if(subject){
      return { success : true, message:"User can response"}
    }

    return { success : false, message:"User can not respond to this query"}
};


/**
 * API for query dashboard
 */
async function dashboardCount(user, queryParams) {
  let statusArray = ['Open', 'Inprogress', 'Closed']
  let queryCount = {}
  let userData = await Users.findOne({ where: { user_name: user.userId } });
  
  if(queryParams.student_vls_id){
    queryCount = await studentCount(queryParams.student_vls_id, statusArray)
    let queryObj = {
      new: queryCount.Open,
      answered: queryCount.Inprogress,
      resolved: queryCount.Closed
    }
    return { success   : true , message  : "Dashboard query count", data : queryObj }
  }

  if(user.role == 'student'){
      queryCount = await studentCount(user.userVlsId, statusArray)
  }else if(user.role == 'teacher'){

    let classes = await Classes.findAll({
                         where:{
                                teacher_id   : user.userVlsId
                               },
                          attributes: ['class_vls_id']   
                      });

    let sections = await Section.findAll({
                     where:{
                            teacher_id   : user.userVlsId
                           },
                      attributes: ['class_id']   
                  });
    //return sections
    if(classes.length > 0 || sections.length > 0){

      let allClasses = []
        classes.map(singleClass => {
          allClasses.push(singleClass.class_vls_id)
        })

       sections.map(section => {
          allClasses.push(section.class_id)
        })

      allClasses = allClasses.filter(function(elem, pos) {
                return allClasses.indexOf(elem) == pos;
            })

      await Promise.all(allClasses);

      queryCount = await teacherCount(allClasses, statusArray)

      let subjects_code = await Subject.findAll({
                           where:{
                                  teacher_id   : user.userVlsId
                                 },
                            attributes: ['code']
                              
                        }).then(subject => subject.map(subject => subject.code));

      let subjectQueryCount = await subjectCount(subjects_code, statusArray)

      queryCount.Open         += subjectQueryCount.Open
      queryCount.Inprogress   += subjectQueryCount.Inprogress
      queryCount.Closed       += subjectQueryCount.Closed

    }else{
      let subjects_code = await Subject.findAll({
                           where:{
                                  teacher_id   : user.userVlsId
                                 },
                            attributes: ['code']
                              
                        }).then(subject => subject.map(subject => subject.code));

      queryCount = await subjectCount(subjects_code, statusArray)
    }

  }else if(user.role == "school-admin"){
      let school_id = queryParams.school_vls_id
      let branch_id = queryParams.branch_vls_id
      if(!school_id){
        school_id = userData.school_id
      }
      let allClasses = await schoolQueryClasses(school_id, branch_id)
      queryCount = await teacherCount(allClasses, statusArray)

  }else{
      let allClasses = await branchQueryClasses(userData.branch_vls_id)
      queryCount = await teacherCount(allClasses, statusArray)
  }
  
  
  let queryCountObj = {
    new: queryCount.Open,
    answered: queryCount.Inprogress,
    resolved: queryCount.Closed
  }

  return { success   : true , message  : "Dashboard query count", data : queryCountObj }
};


/**
 * function for get school Classes
 */
async function schoolQueryClasses(school_id, branch_id){
    let wherecondition = { school_vls_id: school_id }
    if(branch_id){
      wherecondition.branch_vls_id = branch_id
    }
    let branches  = await Branch.findAll({
                          where:wherecondition,
                          attributes: ['branch_vls_id']
                        });

    let branchIds = []
          branches.map(branch => {
            branchIds.push(branch.branch_vls_id)
          })
    await Promise.all(branchIds);
      let classes = await Classes.findAll({
                           where:{ branch_vls_id : {
                                    [Op.in]: branchIds
                                  }
                                },
                            attributes: ['class_vls_id']   
                        });

        let allClasses = []
          classes.map(singleClass => {
            allClasses.push(singleClass.class_vls_id)
          })

      await Promise.all(allClasses);

      return allClasses
}

/**
 * function for get branch for Classes
 */
async function branchQueryClasses(branch_vls_id){

    let classes = await Classes.findAll({
                         where:{ branch_vls_id   : branch_vls_id },
                          attributes: ['class_vls_id']   
                      });

      let allClasses = []
        classes.map(singleClass => {
          allClasses.push(singleClass.class_vls_id)
        })

      await Promise.all(allClasses);

      return allClasses
}


/**
 * function for get student query count
 */
async function studentCount(student_id, statusArray){
  let statusOb = {}
  await Promise.all(
    statusArray.map(async status =>{
      let whereCondition = {
                      query_status : status,
                      student_vls_id: student_id
                    }
      statusOb[status] = await getQueryCount(whereCondition)
    })
  );

  return statusOb

};

/**
 * function for get teacher query count
 */
async function teacherCount(allClasses, statusArray){
  let statusOb = {}
  await Promise.all(
    statusArray.map(async status =>{
      let whereCondition = {
                      query_status : status,
                      class_vls_id : {
                        [Op.in]: allClasses
                      }
                     }
      statusOb[status] = await getQueryCount(whereCondition)
    })
  );

  return statusOb
    
};

/**
 * function for get subject teacher query count
 */
async function subjectCount(allCode, statusArray){
  let statusOb = {}
  // statusArray.shift();

  await Promise.all(
    statusArray.map(async status =>{
      let whereCondition = {
                      query_status : status,
                      subject_code   : {
                        [Op.in]: allCode
                      }
                     }
      statusOb[status] = await getQueryCount(whereCondition)
    })
  );

  return statusOb
};

/**
 * function for get query count
 */
async function getQueryCount(whereCondition){

  let queryCount = await StudentQuery.count({ where: whereCondition });

  return queryCount
};

/**
 * function for list query for subject teacher
 */
async function teacherQueryList(user , params){
    let limit   = 10
    let offset  = 0
    let orderBy = 'asc';
    //return user
    if(params.size)
       limit = parseInt(params.size)
    if(params.page)
        offset = 0 + (parseInt(params.page) - 1) * limit

    let subjects_code = await Subject.findAll({
                           where:{
                                  teacher_id   : user.userVlsId
                                 },
                            attributes: ['code']
                              
                        }).then(subject => subject.map(subject => subject.code));

    let allQuery = null
    if(subjects_code.length > 0){
      allQuery = await StudentQuery.findAll({ 
          limit:limit,
          offset:offset,
          order: [
                    ['query_vls_id', orderBy]
                 ],
          where: { 
              subject_code : { [Op.in] : subjects_code }
          },
          include: [{ 
                        model:SubjectList,
                        as:'subjectList',
                        attributes: ['id','subject_name','code']
                      }]
      });
      
    }
    return { success : false, message : "Query list", data : allQuery }
};


/**
 * function for list query for subject teacher
 */
async function queryRatingLikes(queryId){
    //get query likes
     let likes =  await Ratings.findOne({
              where : {
                query_vls_id : queryId,
                likes : 1
              },
        attributes:[
          [ Sequelize.fn('SUM', Sequelize.col('likes')), 'likeCount' ]
        ]
     })
     let likesData = likes.toJSON()

     if(likesData.likeCount){
      likes = likesData.likeCount
     }else{
      likes = 0
     }
     //get query rating 
     let ratings =  await Ratings.findOne({
              where : {
                query_vls_id : queryId,
              },
        attributes:[
          [ Sequelize.fn('AVG', Sequelize.col('ratings')), 'ratingsCount' ] 
        ]
     })

     let ratingsData = ratings.toJSON()

     if(ratingsData.ratingsCount){
        ratings = ratingsData.ratingsCount
     }else{
      ratings = 0
     }

     return {likes , ratings}
}

/**
 * function for get subject teacher 
 */
async function querySubjectTeacher(code){
  let allTeacher = await Subject.findAll({
    where : { code : code },
    attributes : ['teacher_id']
  })

  let teachers = []
  await Promise.all(
    allTeacher.map(async teacher => {
      let obj = { id : teacher.teacher_id, type : 'employee' }
      teachers.push(obj)
    })
  )
  return teachers
}


/**
 * function subeject wise query counts 
 */
async function subjectQueryCount(params, user){
  let finalData     = []
  let classCondtion = {}
  let orderBy       = 'asc'
  let monthFilter   = false
  let condition     = {}
  let subjectFilter = {}
  let isStatusFilter= null

  if(!params.branch_vls_id) throw 'branch_vls_id is required'
     classCondtion.branch_vls_id = params.branch_vls_id
     subjectFilter.branch_vls_id = params.branch_vls_id

  if(params.class_vls_id)
      classCondtion.class_vls_id = params.class_vls_id

  if(params.level)
      condition.query_level = params.level

  if(params.status){
      condition.query_status = params.status
      isStatusFilter = true
  }

  if(params.faculty_vls_id)
      condition.faculty_vls_id = params.faculty_vls_id

  if(params.subject_code)
      subjectFilter.code = params.subject_code

  if(params.month){
      let year   = moment().format('YYYY')
      let lDigit = moment(year+"-"+params.month, "YYYY-MM").daysInMonth()
      let startDate  = year+'-'+params.month+'-01'
      let endDate    = year+'-'+params.month+'-'+lDigit
      condition[Op.and]= [
                sequelize.where(sequelize.fn('date', sequelize.col('query_date')), '>=', startDate),
                sequelize.where(sequelize.fn('date', sequelize.col('query_date')), '<=', endDate),
            ]
  } 
  
  let classes  = await Classes.findAll({  
      where:classCondtion,
      attributes: ['class_vls_id','name']
  });

  let allSubject = await SubjectList.findAll({
      attributes:['subject_name','code'],
      where : subjectFilter
  })
  
  await Promise.all(
    classes.map(async sClass => {
      let classId            = sClass.class_vls_id
      condition.class_vls_id = classId

      let counts    = await getSubjectData(condition, allSubject, isStatusFilter)
      counts.classes = { className: sClass.name, 
                         class_vls_id: sClass.class_vls_id
                       }
      finalData.push(counts)
    })
  )
  return { success : true, message : "Query counts", data : finalData }
}

async function getSubjectData(whereCondition, allSubject,isStatusFilter =null){
  let obj = {}
  await Promise.all(
    allSubject.map(async subject => {
        whereCondition.subject_code = subject.code

        if(!isStatusFilter){
            let counts = await queryCount(whereCondition)

          obj[subject.subject_name] = counts
        }else{
          if(whereCondition.query_status == 'open') {
             let open  = await StudentQuery.count({where : whereCondition})
              obj[subject.subject_name] = { open }
            }
          if(whereCondition.query_status == 'closed') {
             let closed  = await StudentQuery.count({where : whereCondition})
              obj[subject.subject_name] = { closed }
          }
        }
    })
  )
  return obj
}


async function queryCount(whereCondition){
  let statuses = ['open', 'closed']
  let obj = {}
  await Promise.all(
    statuses.map(async itemStatus => {
        whereCondition.query_status = itemStatus
        let count  = await StudentQuery.count({
            where : whereCondition
          })
        obj[itemStatus] = count
    })
  )
  return obj
}