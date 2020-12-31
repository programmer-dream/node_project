const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const path = require('path')
const Routine     = db.Routine;
const User        = db.Authentication;
const AcademicYear= db.AcademicYear;

const sequelize = db.sequelize;
const bcrypt = require("bcryptjs");

module.exports = {
  create,
  list,
  update
};


/**
 * API for create new query
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  if(req.user.role != 'teacher' || req.user.role != 'principle') throw 'Unauthorized User'
  let timetable = req.body.timetable
  let timeData = []

  user = await User.findByPk(req.user.id)

  academicYear = await AcademicYear.findOne({
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
            status = 0
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
 * API for list query according to school and student
 */
async function list(params){
  let level        = ['Basic','Intermediate','Expert'];
  let orderBy       = 'desc';
  let tag           = '';
  let limit         = 10;
  let offset        = 0;
  let search        = '';
  let schoolVlsId   = params.schoolVlsId
  let branchVlsId   = params.branchVlsId

  if(!schoolVlsId) throw 'schoolVlsId is required'
  if(!branchVlsId) throw 'branchVlsId is required'
  if(params.level && !level.includes(params.level) ) throw 'level must be Basic,Intermediate or Expert'

  if(params.search)
    search = params.search

  let whereCondition = {
      [Op.or]:{
                description: { 
                  [Op.like]: `%`+search+`%`
                },
              topic : { 
                [Op.like]: `%`+search+`%` 
              }
           }
    };
  //start pagination
  if(params.size)
     limit = parseInt(params.size)
  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit
  //end pagination
  whereCondition.branch_vls_id = branchVlsId
  whereCondition.school_vls_id = schoolVlsId
  //status 
  if(params.level){
    level = []
    level.push(params.level)
    whereCondition.recommended_student_level = { [Op.in]: level }
  }

  //orderBy 
  if(params.orderBy)
     orderBy = params.orderBy

  //search tag
  if(params.tag){
     tag = params.tag
     whereCondition.tags = { [Op.like]: `%`+tag+`%` }
  }

  let total = await LearningLibrary.count({ where: whereCondition })

  let learningLibrary  = await LearningLibrary.findAll({  
                      limit:limit,
                      offset:offset,
                      where: whereCondition,
                      order: [
                              ['learning_library_vls_id', orderBy]
                      ],
                      attributes: [
                          'learning_library_vls_id',
                          'subject', 
                          'description', 
                          'topic', 
                          'subject', 
                          'URL',
                          'recommended_student_level',
                          'tags',
                          'cover_photo'
                        ]
                      });

  return { success: true, message: "All Learning library data", total:total, data:learningLibrary }

};


/**
 * API for query update 
 */
async function update(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()
  let timetable = req.body.timetable
  let timeData = []

  user = await User.findByPk(req.user.id)

  academicYear = await AcademicYear.findOne({
    where:{school_id : user.school_id}
  })
  let num = await Routine.destroy({
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
            status = 0
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
