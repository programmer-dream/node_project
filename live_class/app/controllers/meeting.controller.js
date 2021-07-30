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


module.exports = {
  create,
  list,
  view, 
  update,
  deleteMeeting,
  getEnabledService,
  getUserDetails
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
  	return { success: true, message: "meeting create successfully",data:meeting}
};


/**
 * API for list meeting
 */
async function list(query, user){ 
  
  let whereCondition = {}
  let currentUser    = JSON.stringify({id:user.userVlsId,type:user.role})

  if(user.role == 'teacher'){
      whereCondition.created_by = currentUser
  }
  
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
          whereCondition.created_by = currentUser
          break;
  }

  let meetings = await VlsMeetings.findAll({
    where : whereCondition
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
  return { success: true, message: "meeting listing",data:finalMeetings}
};


/**
 * API for view meeting
 */
async function view(params, user){ 
    
  let meeting = await VlsMeetings.findOne({
    where : { meeting_id :  params.meeting_id},
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
    where : { meeting_id :  params.meeting_id}
  });

  if(!meeting) throw 'meeting not found'

  meeting.update(body);
  return { success: true, message: "meeting updated successfully",data:meeting}
};


/**
 * API for delete meeting
 */
async function deleteMeeting(params, user){ 
    
  let meeting = await VlsMeetings.findOne({
    where : { meeting_id :  params.meeting_id}
  });

  if(!meeting) throw 'meeting not found'

  meeting.destroy();
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