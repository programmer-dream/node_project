const { validationResult } = require('express-validator');
const db = require("../models");
const moment = require("moment");
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const path = require('path')
const Routine     = db.Routine;
const User        = db.Authentication;
const AcademicYear= db.AcademicYear;
const Subject     = db.Subject;
const Student     = db.Student;

const sequelize = db.sequelize;
const bcrypt = require("bcryptjs");

module.exports = {
  create,
  teacherView,
  parentView,
  update
};


/**
 * API for create new query
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  //if(req.user.role != 'teacher' || req.user.role != 'principle') throw 'Unauthorized User'
  let timetable = req.body.timetable
  let timings   = await checkEnterTimings(timetable)

  let timeData  = []

  user          = await User.findByPk(req.user.id)

  academicYear  = await AcademicYear.findOne({
                    where:{school_id:user.school_id}
                  })

  if(!academicYear) throw 'Academic year not found'
  
  await Promise.all(
    timetable.map(async timetable => {
        let status     = 1
        let section_id = 0
        if(!timetable.subject_code) throw 'subject_code required'
        if(!timetable.start_time) throw 'start_time required'
        if(!timetable.end_time)   throw 'end_time required'
        if(!timetable.room_no)   throw 'room_no required'
        if(timetable.start_time === timetable.end_time )   throw 'Start and end timings are same'

        let start = moment(timetable.start_time,'hh:mm')
        let end   = moment(timetable.end_time,'hh:mm')
        if(start.isAfter(end))
          throw 'end_time is must be greater then start time'

        if(!timetable.status)
            status     = 0
        if(timetable.section_id)
            section_id = timetable.section_id

        let body = {
              day              : moment(req.body.day, 'd').format('dddd'),
              class_id         : req.body.class_id,
              school_vls_id    : user.school_id,
              branch_vls_id    : user.branch_vls_id,
              teacher_id       : user.user_vls_id,
              academic_year_id : academicYear.id,
              section_id       : section_id,
              room_no          : timetable.room_no, 
              status           : status,
              subject_code     : timetable.subject_code,
              start_time       : timetable.start_time,
              end_time         : timetable.end_time
          }
         
          await getScheduleData(user.school_id, req.body.class_id, section_id, timetable.subject_code, timetable.start_time, timetable.end_time ,body.day)

            timeData.push(body)
    })
  )
  return 'done'
  let routine = await Routine.bulkCreate(timeData);
  return { success: true, message: "Time sheet created successfully", data:routine }
};


/**
 * API for teacher view
 */
async function teacherView(params , user){
    if(!params.class_id) throw 'class_id is required'
    let sectionCondtion = ''
    //return user
    let whereCondition  = {
                            class_id   : params.class_id
                          }
    if(params.section_id){
        whereCondition.section_id = params.section_id
          sectionCondtion = " AND section_id = "+params.section_id
      }

    let stime = await sequelize.query("SELECT DISTINCT(start_time) FROM routines WHERE class_id = "+params.class_id+sectionCondtion+"  ORDER BY cast(REPLACE(start_time,':','') as unsigned) ASC LIMIT 1",{ type: Sequelize.QueryTypes.SELECT });

    let etime = await sequelize.query("SELECT DISTINCT(end_time) FROM routines WHERE class_id = "+params.class_id+sectionCondtion+"  ORDER BY cast(REPLACE(end_time,':','') as unsigned) DESC LIMIT 1",{ type: Sequelize.QueryTypes.SELECT });

    let start_time  = ""
    let end_time    = ""

    if(stime && stime[0]){
      start_time = stime[0].start_time
    }

    if(etime && etime[0]){
      end_time   = etime[0].end_time
    } 
    
    let timesheet = await Routine.findAll({
                    where:whereCondition,
                    attributes: ['day',
                               'start_time',
                               'end_time',
                               'room_no'
                               ],
                    include: [{ 
                      model:Subject,
                      as:'subject',
                      attributes: [
                                  'subject_vls_id',
                                  'name'
                                ]
                  }]
                })

    let daysData = {}

    await Promise.all(
      timesheet.map(async timesheet => {
          let day = {
            start_time   : timesheet.start_time,
            end_time     : timesheet.end_time,
            room_no      : timesheet.room_no,
            subject_name : timesheet.subject.name
          }

          if(!daysData[timesheet.day])
            daysData[timesheet.day] = []

          daysData[timesheet.day].push(day)
      })
    )
  return { success: true, message: "List teacher timesheet", start_time : start_time, end_time : end_time, data:daysData }
};


/**
 * API for parent view
 */
async function parentView(params , user){
  let whereCondition = {}
  let sectionCondtion = ''

  if(user.role == 'student'){
    let student = await Student.findByPk(user.userVlsId)
        whereCondition.class_id   = student.class_id
        params.class_id = student.class_id
  }else{
    if(!params.class_id) throw 'class_id is required'
      whereCondition.class_id   = params.class_id 
  }

  if(params.section_id){
      whereCondition.section_id = params.section_id
      sectionCondtion = " AND section_id = "+params.section_id
  }

  let stime = await sequelize.query("SELECT DISTINCT(start_time) FROM routines WHERE class_id = "+params.class_id+sectionCondtion+"  ORDER BY cast(REPLACE(start_time,':','') as unsigned) ASC LIMIT 1",{ type: Sequelize.QueryTypes.SELECT });

  let etime = await sequelize.query("SELECT DISTINCT(end_time) FROM routines WHERE class_id = "+params.class_id+sectionCondtion+"  ORDER BY cast(REPLACE(end_time,':','') as unsigned) DESC LIMIT 1",{ type: Sequelize.QueryTypes.SELECT });

    let start_time  = ""
    let end_time    = ""

    if(stime && stime[0]){
      start_time = stime[0].start_time
    }

    if(etime && etime[0]){
      end_time   = etime[0].end_time
    } 

    let timesheet = await Routine.findAll({
                    where:whereCondition,
                    attributes: ['day',
                                 'start_time',
                                 'end_time',
                                 'room_no'
                                 ],
                    include: [{ 
                      model:Subject,
                      as:'subject',
                      attributes: [
                                    'subject_vls_id',
                                    'name'
                                  ]
                    }]
                  })

    let daysData = {}
    await Promise.all(
      timesheet.map(async timesheet => {
          let day = {
            start_time   : timesheet.start_time,
            end_time     : timesheet.end_time,
            room_no      : timesheet.room_no,
            subject_name : timesheet.subject.name
          }

          if(!daysData[timesheet.day])
            daysData[timesheet.day] = []

          daysData[timesheet.day].push(day)
      })
    )
  return { success: true, message: "List parent timesheet", start_time:start_time, end_time: end_time ,data:daysData }
};


/**
 * API for query update 
 */
async function update(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()
  let timetable = req.body.timetable
  let timings   = await checkEnterTimings(timetable)

  let timeData  = []

  user          = await User.findByPk(req.user.id)

  academicYear  = await AcademicYear.findOne({
                    where:{school_id : user.school_id}
                  })
  let num       = await Routine.destroy({
                          where:{
                            branch_vls_id : user.branch_vls_id,
                            school_vls_id : user.school_id,
                            class_id      : req.body.class_id,
                            day           : req.body.day
                          }
                        });
  if(!academicYear) throw 'Academic year not found'

  await Promise.all(
    timetable.map(async timetable => {
        let status     = 1
        let section_id = 0
        if(!timetable.subject_code) throw 'subject_code required'
        if(!timetable.start_time) throw 'start_time required'
        if(!timetable.end_time)   throw 'end_time required'
        if(!timetable.room_no)   throw 'room_no required'
        if(!timetable.status)
            status     = 0
        if(timetable.section_id)
            section_id = timetable.section_id
        let body = {
              day              : req.body.day,
              class_id         : req.body.class_id,
              school_vls_id    : user.school_id,
              branch_vls_id    : user.branch_vls_id,
              teacher_id       : user.user_vls_id,
              academic_year_id : academicYear.id,
              section_id       : section_id,
              room_no          : timetable.room_no, 
              status           : status,
              subject_code     : timetable.subject_code,
              start_time       : timetable.start_time,
              end_time         : timetable.end_time
          }

          await getScheduleData(user.school_id, req.body.class_id, section_id, timetable.subject_code, timetable.start_time, timetable.end_time ,body.day)

        timeData.push(body)
    })
  )
  let routine = await Routine.bulkCreate(timeData);
  return { success: true, message: "Time sheet updated successfully", data:routine }
};


/**
 * method to check if schedule exist
 */
async function getScheduleData(school_id, class_id, section_id, subject_code, start_time, end_time, day){
 
  let routines = await Routine.findAll({
    where : {
              class_id       : class_id,
              section_id     : section_id,
              school_vls_id  : school_id,
              day            : day
          },
          attributes: ['subject_code','start_time','end_time']
  })
   await Promise.all(
      routines.map(async routine => {
      if(routine.start_time === start_time)
         throw `subject_code ${routine.subject_code} timings are overlapping with subject_code ${subject_code}`
    
      let time       = moment(start_time, 'hh:mm')
      let beforeTime = moment(routine.start_time, 'hh:mm')
      let afterTime  = moment(routine.end_time, 'hh:mm')
      
      if (time.isBetween(beforeTime, afterTime)) 
          throw `subject_code ${routine.subject_code} timings are overlapping with subject_code ${subject_code}`  
    })
  )
  
  return true
}

async function checkEnterTimings(timetable){
  let length = timetable.length
  await Promise.all(
      timetable.map(async (routine, index) => {
        for(let i = 0; i < length; i++ ){
          if (timetable[index] != timetable[i]) {
            if(timetable[index].start_time === timetable[i].start_time)
              throw `subject_code ${timetable[index].subject_code} timings are overlapping with subject_code ${timetable[i].subject_code}`
            
            let time       = moment(timetable[index].start_time, 'hh:mm')
            let beforeTime = moment(timetable[i].start_time, 'hh:mm')
            let afterTime  = moment(timetable[i].end_time, 'hh:mm')
            
            if (time.isBetween(beforeTime, afterTime)) 
                throw `subject_code ${timetable[index].subject_code} timings are overlapping with subject_code ${timetable[i].subject_code}`
          }
        }
    })
  )
}