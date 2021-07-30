const { validationResult } = require('express-validator');
const db 	 	 = require("../../../models");
const moment 	 = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const mailer     = require('../../../helpers/nodemailer')
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
  getEnabledService
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
          whereCondition.created_by = currentUser
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
    where : { meeting_id :  params.meeting_id}
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
      where : { school_vls_id :  params.school_vls_id, status:1 }
  });
  if(!serviceEnabled) throw 'No service enabled'

  return { success: true, message: "list service", data: serviceEnabled }
};