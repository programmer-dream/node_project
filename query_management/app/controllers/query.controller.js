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
const Classes = db.Classes;
const Section = db.Section;
const SubjectList = db.SubjectList;
const Users   = db.Users;
const Comment = db.Comment;
const Notification = db.Notification;

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
  teacherQueryList
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
    notificatonData.message       = 'is created a new query'
    notificatonData.notificaton_type = 'query'
    notificatonData.notificaton_type_id = createdQuery.query_vls_id
    notificatonData.start_date    = createdQuery.query_date
    notificatonData.users         = JSON.stringify(users)
    notificatonData.added_by      = user.userVlsId
    notificatonData.added_type    = user.role
    notificatonData.event_type    = 'created'
    await Notification.create(notificatonData)
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
  let status  = ['Open', 'Inprogress', 'Closed'];
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
                                    'reject_comment'
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
  return { success: true, message: "All query data", total : allCount ,data:queryArray }

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
    notificatonData.message       = 'is updated a new query'
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
async function deleteQuery(id) {
  let num = await StudentQuery.destroy({
      where: { query_vls_id: id }
    })

  if(num != 1) throw 'Query not found'

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
async function statusUpdate(id, user, body) {
  //if(user.role != 'student') throw 'unauthorised user'
  let whereCondition = { query_vls_id : id }
  let status = "Rejected"
  let reject_comment = ""
  if(user.role == 'student'){
    whereCondition = { student_vls_id : user.userVlsId, query_vls_id : id }
    status = "Closed"
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
    let users = await querySubjectTeacher(query.subject_code)
    notificatonData.branch_vls_id = dbQuery.branch_vls_id
    notificatonData.school_vls_id = dbQuery.school_vls_id
    notificatonData.status        = 'general'
    notificatonData.message       = 'is updated a new query'
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
async function dashboardCount(user) {
  // if(user.role != 'student' && user.role != 'teacher') 
  //       throw 'Unauthorised User'
  let statusArray = ['Open', 'Inprogress', 'Closed']
  let queryCount = {}
  let userData = await Users.findOne({ where: { user_name: user.userId } });

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

      let allClasses = await schoolQueryClasses(userData.school_id)
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
async function schoolQueryClasses(school_id){
    let wherecondition = { school_vls_id: school_id }
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