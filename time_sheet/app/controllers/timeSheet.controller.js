const { validationResult } = require('express-validator');
const db = require("../models");
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
        if(!timetable.subject_id) throw 'subject_id required'
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
              subject_id       : timetable.subject_id,
              start_time       : timetable.start_time,
              end_time         : timetable.end_time
          }
        timeData.push(body)
    })
  )
  let routine = await Routine.bulkCreate(timeData);
  return { success: true, message: "Time sheet created successfully", data:routine }
};


/**
 * API for teacher view
 */
async function teacherView(params , user){
    if(!params.class_id) throw 'class_id is required'
      
    let whereCondition  = {
                            teacher_id : user.userVlsId, 
                            class_id   : params.class_id
                          }
    if(params.section_id)
        whereCondition.section_id = params.section_id

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
  return { success: true, message: "List teacher timesheet", data:daysData }
};


/**
 * API for parent view
 */
async function parentView(params , user){
  let whereCondition = {}

  if(user.role == 'student'){
    let student = await Student.findByPk(user.userVlsId)
        whereCondition.class_id   = student.class_id
  }else{
    if(!params.class_id) throw 'class_id is required'
      whereCondition.class_id   = params.class_id 
  }
    if(params.section_id)
        whereCondition.section_id = params.section_id
      
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
  return { success: true, message: "List parent timesheet", data:daysData }
};


/**
 * API for query update 
 */
async function update(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()
  let timetable = req.body.timetable
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
        if(!timetable.subject_id) throw 'subject_id required'
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
              subject_id       : timetable.subject_id,
              start_time       : timetable.start_time,
              end_time         : timetable.end_time
          }
        timeData.push(body)
    })
  )
  let routine = await Routine.bulkCreate(timeData);
  return { success: true, message: "Time sheet updated successfully", data:routine }
};
