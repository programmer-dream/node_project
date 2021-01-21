const { validationResult } = require('express-validator');
const db 	 	 = require("../models");
const moment 	 = require("moment");
const Op 	 	 = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const path 		 = require('path')
const User       = db.Authentication;
const Employee   = db.Employee;
const Meeting    = db.Meeting;
const Student    = db.Student;
const Guardian   = db.Guardian;
const sequelize  = db.sequelize;
const Routine    = db.Routine;
const SubjectList= db.SubjectList;
const ExamSchedule= db.ExamSchedule;
const Exam        = db.Exam;
const bcrypt      = require("bcryptjs");

module.exports = {
  currentSchedule
};


/**
 * API for list meetings
 */
async function currentSchedule(user, query){
  let userData  = await User.findByPk(user.id)
  let role      = user.role
  let id        = user.userVlsId
  let branch_id = userData.branch_vls_id
  let today     = moment().format('YYYY-MM-DD')
  let finalArr  = []
  if(query.date)
      today     = moment(query.date).format('YYYY-MM-DD')

  let timeTable = await getTimetable(id, today, branch_id, user)
  let meetings  = await getMeeting(id, today, branch_id, user)
  let exams     = await getExamSchedule(id, today, branch_id,user)
  
  let schedules = timeTable.concat(meetings)
      finalArr  = schedules
  if(role == 'student' ){
      finalArr = schedules.concat(exams)
  }
  
  let allSchedules = []
  await Promise.all(
      finalArr.map(async schedule => {
        let currSchedule  = schedule.toJSON()
        if(currSchedule.timesheet_id){
          currSchedule.type = 'time_table'
        }else if(currSchedule.duration){
          currSchedule.type = 'meeting'
          currSchedule.end_time = moment(currSchedule.start_time,'HH:mm').add(currSchedule.duration,'minutes').format("HH:mm")
        }else{
          currSchedule.type = 'exam'
        }
        allSchedules.push(currSchedule)
        
      })
  )
  
  let newArr = allSchedules.sort( compare );
  return { success: true, message: "Today's schedule", data:allSchedules }
};


/**
 * API for get current day time table schedule
 */
async function getTimetable(id, today, branch_id, user){
  let day       = moment(today).format('dddd')
  let student   = {}
  let timeTable = {}
  let whereCondition = { 
                          day           : day,
                          branch_vls_id : branch_id
                       }
  
  switch(user.role) {
    case 'teacher':
          whereCondition.teacher_id = id
      break;
    case 'student':
          student = await Student.findByPk(id)
          whereCondition.class_id = student.class_id
      break;
  }
  
  timeTable = await Routine.findAll({
      where :whereCondition,
      attributes: ['timesheet_id','start_time','end_time','room_no','title'],
      include: [{ 
                  model:SubjectList,
                  as:'subjectList',
                  attributes: [ 'id','code','subject_name' ]
                },{ 
                  model:Employee,
                  as:'teacher',
                  attributes: ['name']
                }]
  })
   
  return timeTable
}


/**
 * API for get current day meeting schedule
 */
async function getMeeting(id, today, branch_id, user){
      let start  = today+" 00:00"
      let end    = today+" 23:59"
      let whereCondition = { 
                              branch_id : branch_id,
                              date:{ 
                                    [Op.between]: [start, end]
                              } 
                           }

      switch(user.role) {
      case 'teacher':
            whereCondition.attendee_type = 'teacher'
            whereCondition.attendee_vls_id = id
        break;
      case 'student':
            student = await Student.findOne({
              where : {
                        student_vls_id : id
                      },
              include: [{ 
                model:Guardian,
                as:'parent',
                attributes: ['parent_vls_id']
              }]
            })
            whereCondition.attendee_vls_id = student.parent.parent_vls_id
            whereCondition.attendee_type = 'parent'
        break;
      case 'guardian':
            whereCondition.attendee_vls_id = id
            whereCondition.attendee_type   = 'parent'
        break;
    }

    let meetings = Meeting.findAll({
      where :whereCondition,
      attributes: [['meeting_title','title'],
                   ['time','start_time'],
                   'duration','meeting_mode','meeting_location']
    })
    return meetings
}

function compare( a, b ) {
    let aStart = moment(a.start_time,'HH:mm')
    let bStart   = moment(b.start_time,'HH:mm')
    if ( aStart.isBefore(bStart) ){
      return -1;
    }
    if ( aStart.isAfter(bStart) ){
      return 1;
    }
    return 0;
  }


/**
 * API for get current day time table schedule
 */
async function getExamSchedule(id, today, branch_id,user){
  let start  = today+" 00:00"
  let end    = today+" 23:59"
  let exams  = {}
  let student= {}
  let whereCondition = { 
                          Branch_vls_id : branch_id,
                          exam_date     : { 
                                            [Op.between]: [start, end]
                                          },
                       }
  if(user.role == 'student') {
    student = await Student.findByPk(id)
    whereCondition.class_id = student.class_id

    exams = ExamSchedule.findAll({
                  where : whereCondition,
                  attributes: ['title',
                                'start_time',
                                'end_time',
                                'subject_code'],
                  include: [{ 
                              model:SubjectList,
                              as:'subject',
                              attributes: [ 'subject_name']
                            }]
                 })
    return exams
  }
}