const { validationResult } = require('express-validator');
const db 	 	 = require("../../../models");
const moment 	 = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const mailer     = require('../../../helpers/nodemailer')
const axios     = require('axios').default;
const Op 	 	 = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const sequelize  = db.sequelize;
const Student    = db.Student;
const Section    = db.Section;
const SubjectList    = db.SubjectList;
const Authentication = db.Authentication;
const Guardian   	 = db.Guardian;
const Classes   	 = db.Classes;
const SchoolDetails = db.SchoolDetails;
const Employee 		= db.Employee;
const Branch  		= db.Branch;
const VlsMeetings = db.VlsMeetings;
const AcademicYear   = db.AcademicYear;
const VlsVideoServices  = db.VlsVideoServices;
const Notification   = db.Notification;

module.exports = {
  create,
  list,
  view, 
  update,
  deleteMeeting,
  getEnabledService,
  getUserDetails,
  subjectOnlineClassCount,
  getUserDefaultSetting
};


/**
 * API for create meeting
 */
async function create(body, user){ 
    let authentication = await Authentication.findByPk(user.id)
    let academicYear   = await AcademicYear.findOne({
                            where:{school_id:authentication.school_id},
                            order : [
                             ['id', 'desc']
                            ]
                          })
    body.academic_year_id = academicYear.id
    body.created_by = JSON.stringify({id:user.userVlsId,type:user.role})
    let meeting = await VlsMeetings.create(body);
    let you     = 'you'

    //create new notification
    if(meeting.class_id){
      let classStudent = await getStudents(body)
      let meetingType = 'live class'
      if(meeting.meeting_type =='online_meeting')
          meetingType = 'online meeting'

      let subject = await SubjectList.findOne({
        attributes:['subject_name'],
        where : {code: meeting.subject_code}
      })
      if(subject)
          you = subject.subject_name
      
      let notificatonData = {}
      notificatonData.branch_vls_id = meeting.branch_vls_id
      notificatonData.school_vls_id = meeting.school_vls_id
      notificatonData.status        = 'important'
      notificatonData.message       = `{name} added ${meetingType} for ${you}.`
      notificatonData.notificaton_type = 'live_class'
      notificatonData.notificaton_type_id = meeting.meeting_id
      notificatonData.start_date    = meeting.meeting_date
      notificatonData.users         = JSON.stringify(classStudent)
      notificatonData.added_by      = user.userVlsId
      notificatonData.added_type    = user.role
      notificatonData.event_type    = 'created'
      await Notification.create(notificatonData)
      let teacherObj = { id  : meeting.teacher_id,
                       type: 'employee'
                     }
      notificatonData.message       = `{name} added ${meetingType} for you.`
      notificatonData.users = JSON.stringify([teacherObj])
      await Notification.create(notificatonData)
    }

  	return { success: true, message: "meeting create successfully",data:meeting}
};


/**
 * API for list meeting
 */
async function list(params, user){
  let whereCondition   = {is_deleted : 0,
                          meeting_type:"live_classes"
                         }
  let liveClassState   = params.liveClassState
  let orderBy          = 'desc';
  let limit            = 10
  let offset           = 0 
  let search           = '' 
  let currentDate      = moment().format('YYYY-MM-DD')
  let currentTime      = moment().utcOffset("+05:30").format('H:mm');

  if(params.orderBy)
     orderBy = params.orderBy

  if(params.size)
     limit = parseInt(params.size)

  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit

  if(params.search)
    search = params.search

  if(params.school_vls_id)
    whereCondition.school_vls_id = params.school_vls_id

  if(params.branch_vls_id)
    whereCondition.branch_vls_id = params.branch_vls_id

  if(params.class_id)
    whereCondition.class_id = params.class_id

  if(params.section_id)
    whereCondition.section_id = params.section_id

  let searchDescTitle = { 
                  description: { 
                    [Op.like]: `%`+search+`%`
                  },
                  title : { 
                    [Op.like]: `%`+search+`%` 
                  }
                }
  let currentUser    = JSON.stringify({id:user.userVlsId,type:user.role})
  
  if(params.subject_code)
      whereCondition.subject_code = params.subject_code

  switch(user.role){
      case 'teacher' : 
          whereCondition.teacher_id = user.userVlsId
          break;
      case 'student' : 
          let student = await Student.findOne({
                          where : { student_vls_id : user.userVlsId}
                        })
          whereCondition.class_id = student.class_id
          break;
      default:
          //whereCondition.created_by = currentUser
          break;
  }
  let pastCondition = null
  //date filters
  if(liveClassState == "past"){
      pastCondition = { 
        [Op.or] : [{
          'meeting_date' : sequelize.where(sequelize.fn('date', sequelize.col('meeting_date')), '<', currentDate)
         },{
           [Op.and]: [{
              'meeting_date' : sequelize.where(sequelize.fn('date', sequelize.col('meeting_date')), '=', currentDate)
           },{
              'meeting_end' : sequelize.where(sequelize.fn('time',sequelize.col('meeting_end')),'<=',currentTime)
           }]
         }]
       }
     
  }else if(liveClassState == "upcoming"){
    whereCondition[Op.gt] = sequelize.where(sequelize.fn('date', sequelize.col('meeting_date')), '>', currentDate)

  }else{
    whereCondition[Op.eq] = sequelize.where(sequelize.fn('date', sequelize.col('meeting_date')), '=', currentDate)
    whereCondition[Op.gt] = sequelize.where(sequelize.col('meeting_end'),'>',currentTime)
  }
  
  whereCondition[Op.and] = [ searchDescTitle, pastCondition]

  let count = await VlsMeetings.count({
        where : whereCondition
    });
  
  let meetings = await VlsMeetings.findAll({
    where : whereCondition,
    limit : limit,
    offset: offset,
    order: [
             ['meeting_id', orderBy]
           ]
  });
  
  let finalMeetings = []
  await Promise.all(
    meetings.map(async meeting => {
        meeting = meeting.toJSON()
        meeting.self_created = 0

        if(meeting.created_by == currentUser)
            meeting.self_created = 1
        
        finalMeetings.push(meeting)
    })
  )
  return { success: true, message: "meeting listing",data:finalMeetings, count}
};


/**
 * API for view meeting
 */
async function view(params, user){ 
    
  let meeting = await VlsMeetings.findOne({
    where : { meeting_id :  params.meeting_id,
              is_deleted:0
            },
    include:[{ 
                model:SubjectList,
                as:'subjectList',
            },{ 
                model:Classes,
                as:'class',
            },{ 
                model:Employee,
                as:'teacher',
            },{ 
                model:Section,
                as:'section',
            }]
  });

  if(!meeting) throw 'meeting not found'

  return { success: true, message: "meeting view",data:meeting}
};


/**
 * API for update meeting
 */
async function update(params, body, user){ 
  let meeting = await VlsMeetings.findOne({
    where : { meeting_id :  params.meeting_id,
              is_deleted:0
            }
  });

  if(!meeting) throw 'meeting not found'

  meeting.update(body);
  if(meeting.class_id){
      let classStudent = await getStudents(meeting)
      let meetingType = 'live class'
      if(meeting.meeting_type =='online_meeting')
          meetingType = 'online meeting'

      let notificatonData = {}
      notificatonData.branch_vls_id = meeting.branch_vls_id
      notificatonData.school_vls_id = meeting.school_vls_id
      notificatonData.status        = 'important'
      notificatonData.message       = `{name} updated ${meetingType} details.`
      notificatonData.notificaton_type = 'live_class'
      notificatonData.notificaton_type_id = meeting.meeting_id
      notificatonData.start_date    = meeting.meeting_date
      notificatonData.users         = JSON.stringify(classStudent)
      notificatonData.added_by      = user.userVlsId
      notificatonData.added_type    = user.role
      notificatonData.event_type    = 'created'
      await Notification.create(notificatonData)
      let teacherObj = { id  : meeting.teacher_id,
                       type: 'employee'
                     }
      notificatonData.users = JSON.stringify([teacherObj])
      await Notification.create(notificatonData)
    }
  return { success: true, message: "meeting updated successfully",data:meeting}
};


/**
 * API for delete meeting
 */
async function deleteMeeting(params, user){ 
    
  let meeting = await VlsMeetings.findOne({
    where : { meeting_id :  params.meeting_id,
              is_deleted:0
            }
  });
  
  if(!meeting) throw 'meeting not found'
  //return meeting.class_id
  if(meeting.class_id){
      let classStudent = await getStudents(meeting)
      
      let meetingType = 'live class'
      if(meeting.meeting_type =='online_meeting')
          meetingType = 'online meeting'

      let notificatonData = {}
      notificatonData.branch_vls_id = meeting.branch_vls_id
      notificatonData.school_vls_id = meeting.school_vls_id
      notificatonData.status        = 'important'
      notificatonData.message       = `{name} deleted ${meetingType}.`
      notificatonData.notificaton_type = 'live_class'
      notificatonData.notificaton_type_id = meeting.meeting_id
      notificatonData.start_date    = meeting.meeting_date
      notificatonData.users         = JSON.stringify(classStudent)
      notificatonData.added_by      = user.userVlsId
      notificatonData.added_type    = user.role
      notificatonData.event_type    = 'created'
      await Notification.create(notificatonData)
      let teacherObj = { id  : user.userVlsId,
                       type: 'employee'
                     }
      notificatonData.users = JSON.stringify([teacherObj])
      await Notification.create(notificatonData)
    }
    meeting.update({is_deleted:1});
  //meeting.destroy();
  return { success: true, message: "meeting deleted successfully",}
};

/**
 * API for delete meeting
 */
async function getEnabledService(params, user){ 
    
  let serviceEnabled = await VlsVideoServices.findOne({
      where : { school_vls_id :  params.school_vls_id, status:1 },
      attributes: { exclude: ['api_key','api_secret'] }
  });
   
  
  if(!serviceEnabled) throw 'No service enabled'

  return { success: true, message: "list service", data: serviceEnabled }
};

/**
 * API for get user details
 */
async function getUserDetails(params, user){ 
    
  let serviceEnabled = await VlsVideoServices.findOne({
      where : { school_vls_id :  params.school_vls_id, status:1 },
      attributes: ['Base_url','api_key','api_secret']
  });
  
  if(!serviceEnabled) 
    throw 'Video service setting not updated in school'

  if(!serviceEnabled.api_key &&  !serviceEnabled.api_secret && !serviceEnabled.Base_url) 
    throw 'Video service setting not updated in school'

    let base_url = serviceEnabled.Base_url
   const data = JSON.stringify({ "grant_type": "client_credentials", "client_id":serviceEnabled.api_key, "client_secret": serviceEnabled.api_secret });
    
    const config = {
        method: 'post',
        url: `${base_url}/oauth2/token#Application`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    
  let tokenDetailsObj = await tokenDetails(config);
  if(!tokenDetailsObj.access_token && !tokenDetailsObj.scope)
    throw 'token details not found'

  let accessUserDetailsObj = await accessUserDetails(base_url, tokenDetailsObj.access_token, tokenDetailsObj.scope.enterprise);

  if(!accessUserDetailsObj.users)
    throw 'user details not found'

  tokenDetailsObj.user_id = accessUserDetailsObj.users[0].id
  tokenDetailsObj.base_url = serviceEnabled.Base_url
  
  return { success: true, message: "Video service user details", data: tokenDetailsObj }
};

async function tokenDetails(config){
  return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                resolve(response.data)
            })
            .catch(function (error) {
                reject(error)
            });
    })
}

async function accessUserDetails(Base_url, accessToken, enerpriseID){

  const config = {
        method: 'get',
        url: `${Base_url}/v1/enterprise/${enerpriseID}/users?access_token=${accessToken}`,
        headers: {
            'Content-Type': 'application/json'
        }
    };

  return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                resolve(response.data)
            })
            .catch(function (error) {
                reject(error)
            });
    })
}

async function getStudents(body){
  let studentsArr = []

  if(body.section_id && body.class_id){
      let whereCodition  = {
        class_id   : body.class_id,
        section_id : body.section_id,
        school_id  : body.school_vls_id
      }
      let allStudents = await Student.findAll({
                where : whereCodition,
                attributes : ['student_vls_id']
              })
      await Promise.all(
        allStudents.map(async function( student){
          let studentObj = {
            id   : student.student_vls_id,
            type : 'student'
          }
          studentsArr.push(studentObj)
        })
      )
  }else{

    let whereCodition  = {
        class_id   : body.class_id,
        school_id  : body.school_vls_id
      }
      let allStudents = await Student.findAll({
                where : whereCodition,
                attributes : ['student_vls_id']
              })
      await Promise.all(
        allStudents.map(async function( student){
          let studentObj = {
            id   : student.student_vls_id,
            type : 'student'
          }
          studentsArr.push(studentObj)
        })
      )
  }
  return studentsArr
}

/**
 * function subject wise online class counts 
 */
async function subjectOnlineClassCount(params, user){
  let finalData     = []
  let classCondtion = {}
  let orderBy       = 'asc'
  let condition     = {is_deleted : 0}

  let subjectFilter = {}
  if(user.role =='super-admin'){
    if(!params.school_vls_id) throw 'school_vls_id is required'
    return await branchWiseCounts(params.school_vls_id)
  }

  if(!params.branch_vls_id) throw 'branch_vls_id is required'
     classCondtion.branch_vls_id = params.branch_vls_id
     subjectFilter.branch_vls_id = params.branch_vls_id

  if(params.class_vls_id)
      classCondtion.class_vls_id = params.class_vls_id

  if(params.subject_code)
      subjectFilter.code = params.subject_code
  
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
      condition.class_id = sClass.class_vls_id

      let counts    = await getSubjectCounts(condition, allSubject)
      counts.classes = { className: sClass.name, 
                         class_vls_id: sClass.class_vls_id
                       }
      finalData.push(counts)
    })
  )
  return { success : true, message : "Classes counts", data : finalData }
}


/**
 * function subject  online class counts 
 */
async function getSubjectCounts(condition, allSubject){
  let obj = {}
  
  await Promise.all(
    allSubject.map(async subject => {
        condition.subject_code = subject.code
        let counts    = await getCounts(condition)
        obj[subject.subject_name] = counts
    })
  )
  return obj
}


/**
 * function subject  online class counts 
 */
async function getCounts(condition){
  let obj              = {}
  let statuses         = ['past','today','upcoming']
  let currentDate      = moment().format('YYYY-MM-DD')

  await Promise.all(
    statuses.map(async status => {
      let resetCondition = {}

      if(status == 'past'){
        resetCondition[Op.lt] = sequelize.where(sequelize.fn('date', sequelize.col('meeting_date')), '<', currentDate)
      }else if(status == 'upcoming'){
        resetCondition[Op.gt] = sequelize.where(sequelize.fn('date', sequelize.col('meeting_date')), '>', currentDate)
      }else{
        resetCondition[Op.eq] = sequelize.where(sequelize.fn('date', sequelize.col('meeting_date')), '=', currentDate)
      }
      resetCondition = Object.assign(resetCondition, condition); 
  
      obj[status] = await VlsMeetings.count({
        where:resetCondition
      })

    })
  )
    
  return obj
}

/**
 * Bluejeans Get User’s Default Meeting Settings
 */
async function getUserDefaultSetting(params, user){

  if(!params.school_vls_id) throw 'school_vls_id is required'
  if(!params.meeting_id) throw 'meeting_id is required'

  let serviceEnabled = await VlsVideoServices.findOne({
      where : { school_vls_id :  params.school_vls_id, status:1 },
      attributes: ['Base_url','api_key','api_secret']
  });

  if(!serviceEnabled.api_key &&  !serviceEnabled.api_secret && !serviceEnabled.Base_url) 
    throw 'Video service setting not updated in school'

    let base_url = serviceEnabled.Base_url
   const data = JSON.stringify({ "grant_type": "client_credentials", "client_id":serviceEnabled.api_key, "client_secret": serviceEnabled.api_secret });
    
    const config = {
        method: 'post',
        url: `${base_url}/oauth2/token#Application`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
  let tokenDetailsObj = await tokenDetails(config);
  if(!tokenDetailsObj.access_token && !tokenDetailsObj.scope)
    throw 'token details not found'
  let accessUserDetailsObj = await accessUserDetails(base_url, tokenDetailsObj.access_token, tokenDetailsObj.scope.enterprise);

  if(!accessUserDetailsObj.users)
    throw 'user details not found'

  let user_id = accessUserDetailsObj.users[0].id

  let getUserData = await getUserSettings(base_url, tokenDetailsObj.access_token, user_id);

  let passcode = ''

  let meeting = await VlsMeetings.findByPk(params.meeting_id);
  let createdUser = JSON.parse(meeting.created_by)

  if(meeting.meeting_type =='online_meeting'){
    if(user.userVlsId == createdUser.id && user.role == createdUser.type)
        passcode = getUserData.moderatorPasscode
  }
  //return {user_id : user.userVlsId, teacher_id : meeting.teacher_id}
  if(user.userVlsId == meeting.teacher_id && user.role == 'teacher')
        passcode = getUserData.moderatorPasscode

  return { success: true, message: "meeting passcode",data:{passcode}}
}

async function getUserSettings(base_url, accessToken, user_id){

  const userConfig = {
      method: 'get',
      url: `${base_url}/v1/user/${user_id}/room?access_token=${accessToken}`,
      headers: {
          'Content-Type': 'application/json'
      }
  };

  return new Promise((resolve, reject) => {
        axios(userConfig)
            .then(function (response) {
                resolve(response.data)
            })
            .catch(function (error) {
                reject(error)
            });
    })
}

/**
 * Bluejeans Get User’s Default Meeting Settings
 */
async function branchWiseCounts(school_vls_id){
    let finalData    = []
    let branchCounts = {}
    let condition    = {}

    let allBranches  = await Branch.findAll({  
        where:{school_vls_id : school_vls_id},
        attributes: ['branch_vls_id','branch_name']
    });

    await Promise.all(
      allBranches.map(async branch => {
        condition.branch_vls_id = branch.branch_vls_id

         branchCounts    = await getCounts(condition)
         branchCounts.branch = { branchName: branch.branch_name, 
                                 branch_vls_id: branch.branch_vls_id
                               }
         finalData.push(branchCounts)
      })
    )
    return { success : true, message : "Branches counts", data : finalData }
}