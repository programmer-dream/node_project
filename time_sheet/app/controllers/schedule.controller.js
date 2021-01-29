const { validationResult } = require('express-validator');
const db 	 	      = require("../models");
const moment 	    = require("moment");
const Op 	 	      = db.Sequelize.Op;
const Sequelize   = db.Sequelize;
const path 		    = require('path')
const User        = db.Authentication;
const Employee    = db.Employee;
const Meeting     = db.Meeting;
const Student     = db.Student;
const Guardian    = db.Guardian;
const sequelize   = db.sequelize;
const Routine     = db.Routine;
const SubjectList = db.SubjectList;
const ExamSchedule= db.ExamSchedule;
const Exam        = db.Exam;
const Assignment  = db.Assignment;
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
  let timeTable = []
  if(query.date)
      today     = moment(query.date).format('YYYY-MM-DD')

  //check Api according to date 
  let getData   = await getExamDates(id, branch_id, today, role)
  if(getData)
     timeTable  = await getTimetable(id, today, branch_id, user)
  //check Api according to date

  let meetings  = await getMeeting(id, today, branch_id, user)
  let exams     = await getExamSchedule(id, today, branch_id,user)
  let assignment= await getAssignment(id, today, branch_id, user)

  let schedules = timeTable.concat(meetings,assignment)
      finalArr  = schedules
  if(role == 'student' ){
      finalArr = schedules.concat(exams)
  }
  // return assignment
  let allSchedules = []
  await Promise.all(
      finalArr.map(async schedule => {
        console.log(schedule)
        let currSchedule  = schedule.toJSON()
        if(currSchedule.timesheet_id){
          currSchedule.type = 'time_table'
        }else if(currSchedule.duration){
          currSchedule.type = 'meeting'
          currSchedule.end_time = moment(currSchedule.start_time,'HH:mm').add(currSchedule.duration,'minutes').format("HH:mm")
        }else if(currSchedule.assignment_completion_date){
          currSchedule.type = 'assignment'
          currSchedule.start_time = '00:00'
          currSchedule.end_time   = '00:00'
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
    case 'branch-admin':
    case 'principal':
          return []
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
                  attributes: ['name','photo']
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
      case 'branch-admin':
      case 'principal':
            whereCondition.meeting_author_vls_id = id
        break;
      case 'student':
            return []
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


/**
 * API for get current day time table schedule
 */
async function getExamDates(id, branch_id, date, role){
  if(role != 'student')
      return false

  let whereCondition = { 
                          Branch_vls_id : branch_id
                       }
  student = await Student.findByPk(id)
  whereCondition.class_id = student.class_id

  Dates = await ExamSchedule.findOne({
    where : whereCondition,
    attributes: [
    [Sequelize.fn('max', Sequelize.col('exam_date')), 'max'],
    [Sequelize.fn('min', Sequelize.col('exam_date')), 'min']],
    group: ['class_id']
  })
  let momentMax = moment(Dates.max).format('YYYY-MM-DD')
  let momentMin = moment(Dates.min).format('YYYY-MM-DD')
  let reqDate   = moment(date)

  if(reqDate.isBetween(momentMin,momentMax )){
    return false
  }else if(reqDate.isSame(momentMin)){
    return false
  }else if(reqDate.isSame(momentMax)){
    return false
  }else{
    return true
  }
}


/**
 * API for get current day assignment
 */
async function getAssignment(id, today, branch_id,user){
  let exams    = {}
  let student  = {}
  
  let whereCondition = {
    branch_vls_id : branch_id,
    [Op.eq]: sequelize.where(sequelize.fn('date', sequelize.col('assignment_completion_date')), '=', today)  
  }
  
  switch(user.role) {
    case 'teacher':
          whereCondition.added_by = id
      break;
    case 'student':
          student = await Student.findByPk(id)
          whereCondition.assignment_class_id = student.class_id
      break;
    case 'branch-admin':
    case 'principal':
          return []
      break;
  }
  assignments = await Assignment.findAll({
                      where : whereCondition,
                      attributes: ['assignment_vls_id',
                                    'assignment_type',
                                    'assignment_completion_date',
                                    'added_by',
                                    'title',
                                    'student_vls_ids'],
                      include: [{ 
                                    model:SubjectList,
                                    as:'subject',
                                    attributes: ['subject_name']
                                  }]
                     })
  if(user.role == 'student') {
    let filterAssignments = []
    await Promise.all(
        assignments.map(function( assignment){
          let idsArr = JSON.parse(assignment.student_vls_ids)
          if(Array.isArray(idsArr)){
              if(idsArr.includes(id))
                filterAssignments.push(assignment)
              
          }else{
            filterAssignments.push(assignment)
          }
        })
      )
    return filterAssignments
  }else{
    return assignments
  }
}