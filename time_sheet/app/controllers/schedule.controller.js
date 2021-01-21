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
const bcrypt     = require("bcryptjs");

module.exports = {
  currentSchedule
};


/**
 * API for list meetings
 */
async function currentSchedule(user){
  let userData  = await User.findByPk(user.id)
  let role      = user.role
  let id        = user.userVlsId
  let branch_id = userData.branch_vls_id
  let today     = moment().format('YYYY-MM-DD')

  let timeTable = await getTimetable(id, today, branch_id, user)
  let meetings  = await getMeeting(id, today, branch_id, user)
  let schedules = timeTable.concat(meetings)

  let allSchedules = []
  await Promise.all(
      schedules.map(async schedule => {
        let currSchedule  = schedule.toJSON()
        if(currSchedule.timesheet_id){
          currSchedule.type = 'time_table'
        }else{
          currSchedule.type = 'meeting'
          currSchedule.end_time = moment(currSchedule.start_time,'HH:mm').add(currSchedule.duration,'minutes').format("HH:mm")
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
    case 'guardian':
          student = await Student.findAll({
            where :{ parent_vls_id : id},
            attributes: ['student_vls_id','name','email','parent_vls_id','class_id']
          })
      break;
  }
  if(Array.isArray(student)) {
    let allChild = []
    await Promise.all(
      student.map(async child => {
        let parentChild = child.toJSON()
        whereCondition.class_id = parentChild.class_id

        timeTable = await Routine.findAll({
            where :whereCondition,
            attributes: ['timesheet_id','start_time','end_time','room_no'],
            include: [{ 
                        model:SubjectList,
                        as:'subjectList',
                        attributes: [ 'id','code','subject_name' ]
                      }]
        })
        parentChild.timeTable = timeTable
        allChild.push(parentChild)
      })
    )
    timeTable = allChild
  }else{
    timeTable = await Routine.findAll({
        where :whereCondition,
        attributes: ['timesheet_id','start_time','end_time','room_no','title'],
        include: [{ 
                    model:SubjectList,
                    as:'subjectList',
                    attributes: [ 'id','code','subject_name' ]
                  }]
    })
  } 
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