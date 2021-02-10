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
  let startDate = moment().format('YYYY-MM-DD')
  let endDate   = moment().format('YYYY-MM-DD')
  let finalArr  = []
  
  
  if(query.startDate)
     startDate = moment(query.startDate)

  if(query.endDate)
     endDate   = moment(query.endDate)

  let startFilter = startDate
  let endFilter   = endDate

  //get date wise time table
  let dateWiseTimeTable = {}
  while (startDate <= endDate) {
    let timeTable = []
    let start = moment(startDate).format('YYYY-MM-DD')
    let day = moment(startDate).format('dddd')
    console.log(day, "daydaydaydaydayday")
    let getData   = await getExamDates(branch_id, user, start)

    if(getData)
      timeTable  = await getTimetable(branch_id, user, day)

    if(!dateWiseTimeTable[start])
        dateWiseTimeTable[start] = []

    if(timeTable && timeTable.length > 0)
        dateWiseTimeTable[start] = timeTable

    startDate = moment(startDate, 'YYYY-MM-DD').add(1, 'days');
  }
  //get date wise time table
  let meetings  = await getMeeting(branch_id, user, startFilter, endFilter)
  //return meetings
  let exams     = await getExamSchedule(branch_id, user, startFilter, endFilter)
  
  let assignment= await getAssignment(branch_id, user, startFilter, endFilter)

  let schedules = meetings.concat(assignment)
      finalArr  = schedules

  if(role == 'student' ){
      finalArr = schedules.concat(exams)
  }
  //return finalArr
  let dayData = {}
  //return finalArr
  await Promise.all(
      finalArr.map(async schedule => {
        let currSchedule  = schedule.toJSON()
        if(currSchedule.duration){
          currSchedule.type = 'meeting'
          currSchedule.end_time = moment(currSchedule.start_time,'HH:mm').add(currSchedule.duration,'minutes').format("HH:mm")
            let mDate = moment(currSchedule.date).format('YYYY-MM-DD')
            if(!dayData[mDate])
                  dayData[mDate] = []

            dayData[mDate].push(currSchedule)
        }else if(currSchedule.assignment_completion_date){
          currSchedule.type = 'assignment'
          currSchedule.start_time = '17:30'
          currSchedule.end_time   = '18:00'
          let aDate = moment(currSchedule.assignment_completion_date).format('YYYY-MM-DD')
          if(!dayData[aDate])
                dayData[aDate] = []

            dayData[aDate].push(currSchedule)
        }else if (currSchedule.exam_date) {
          currSchedule.type = 'exam'
          let eDate = moment(currSchedule.exam_date).format('YYYY-MM-DD')
          if(!dayData[eDate])
                dayData[eDate] = []

            dayData[eDate].push(currSchedule)
        }        
      })
  )
  //return dayData
  let scheduleDates = Object.keys(dateWiseTimeTable)
  await Promise.all(
      scheduleDates.map(async currentDate => {
        if(!dayData[currentDate])
            dayData[currentDate] = []

         if(dateWiseTimeTable[currentDate]){
            dateWiseTimeTable[currentDate].map( timetable => {
              timetable = timetable.toJSON()
              timetable.type = "time_table"
              dayData[currentDate].push(timetable)
            })
         } 
      })
  )
  
  // let newArr = allSchedules.sort( compare );
  return { success: true, message: "Today's schedule", data:dayData }
};


/**
 * API for get current day time table schedule
 */
async function getTimetable(branch_id, user, day){
  let student   = {}
  let timeTable = {}
  let whereCondition = { 
                          day : day,
                          branch_vls_id : branch_id
                       }
  
  switch(user.role) {
    case 'teacher':
          whereCondition.teacher_id = user.userVlsId
      break;
    case 'student':
          student = await Student.findByPk(user.userVlsId)
          whereCondition.class_id = student.class_id
          if(student.section_id && student.section_id > 0)
            whereCondition.section_id = student.section_id
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
async function getMeeting(branch_id, user, start, end){
      start = moment(start).format('YYYY-MM-DD')
      end   = moment(end).format('YYYY-MM-DD')

      let whereCondition = { 
                              branch_id : branch_id,
                              [Op.and]: [
                                  sequelize.where(sequelize.fn('date', sequelize.col('date')), '>=', start),
                                  sequelize.where(sequelize.fn('date', sequelize.col('date')), '<=', end),
                              ] 
                           }

      switch(user.role) {
      case 'teacher':
            whereCondition.attendee_type = 'teacher'
            whereCondition.attendee_vls_id = user.userVlsId
        break;
      case 'branch-admin':
      case 'principal':
            whereCondition.meeting_author_vls_id = user.userVlsId
        break;
      case 'student':
            return []
        break;
      case 'guardian':
            whereCondition.attendee_vls_id = user.userVlsId
            whereCondition.attendee_type   = 'parent'
        break;
    }

    let meetings = await Meeting.findAll({
      where :whereCondition,
      attributes: [['meeting_title','title'],
                   ['time','start_time'],
                   'duration','meeting_mode','meeting_location','date']
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
async function getExamSchedule(branch_id, user, start, end ){
  start = moment(start).format('YYYY-MM-DD')
  end   = moment(end).format('YYYY-MM-DD')
  let exams  = {}
  let student= {}
  let whereCondition = { 
                          Branch_vls_id : branch_id,
                          [Op.and]: [
                                  sequelize.where(sequelize.fn('date', sequelize.col('exam_date')), '>=', start),
                                  sequelize.where(sequelize.fn('date', sequelize.col('exam_date')), '<=', end),
                              ]
                       }
  if(user.role == 'student') {
    student = await Student.findByPk(user.userVlsId)
    whereCondition.class_id = student.class_id

    exams = ExamSchedule.findAll({
                  where : whereCondition,
                  attributes: ['title',
                                'start_time',
                                'end_time',
                                'subject_code',
                                'exam_date'],
                  include: [{ 
                              model:SubjectList,
                              as:'subject',
                              attributes: [ 'subject_name']
                            }]
                 })
    return exams
  }else{
    return []
  }
}


/**
 * API for get current day time table schedule
 */
async function getExamDates(branch_id, user, reqDate){
  if(user.role != 'student' && user.role != 'teacher')
      return false

  if(user.role == 'teacher')
      return true

  let whereCondition = { 
                          Branch_vls_id : branch_id
                       }

  student = await Student.findByPk(user.userVlsId)
  whereCondition.class_id = student.class_id
  whereCondition.exam_date = sequelize.where(sequelize.fn('date', sequelize.col('exam_date')), '>=', reqDate)

  let examDates = await ExamSchedule.findOne({
    where : whereCondition,
    attributes: [
      [Sequelize.fn('max', Sequelize.col('exam_date')), 'maxExamDate'],
      [Sequelize.fn('min', Sequelize.col('exam_date')), 'minExamDate']
    ],
    group: ['class_id']
  })

  if(examDates){
    examDates = examDates.toJSON()
    //return examDates
    let examMax = examDates.maxExamDate
    let examMin = examDates.minExamDate

    let momentMax = moment(examMax).format('YYYY-MM-DD')
    let momentMin = moment(examMin).format('YYYY-MM-DD')
    
    if(moment(reqDate).isBetween(momentMin, momentMax)){
      return false
    }else if(moment(reqDate).isSame(momentMin)){
      return false
    }else if(moment(reqDate).isSame(momentMax)){
      return false
    }else{
      return true
    }
  }
  return true
}


/**
 * API for get current day assignment
 */
async function getAssignment(branch_id, user, start, end){
  start = moment(start).format('YYYY-MM-DD')
  end   = moment(end).format('YYYY-MM-DD')
  let exams    = {}
  let student  = {}
  
  let whereCondition = {
    branch_vls_id : branch_id,
    [Op.and]: [
                sequelize.where(sequelize.fn('date', sequelize.col('assignment_completion_date')), '>=', start),
                sequelize.where(sequelize.fn('date', sequelize.col('assignment_completion_date')), '<=', end),
            ]  
  }
  
  switch(user.role) {
    case 'teacher':
          whereCondition.added_by = user.userVlsId
      break;
    case 'student':
          student = await Student.findByPk(user.userVlsId)
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