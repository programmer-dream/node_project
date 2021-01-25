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
const Employee    = db.Employee;
const SubjectList = db.SubjectList;
const ExamSchedule = db.ExamSchedule;
const Exam         = db.Exam;

const sequelize = db.sequelize;
const bcrypt = require("bcryptjs");

module.exports = {
  create,
  teacherView,
  parentView,
  update,
  deleteTimetable,
  getExamSchedule
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
        let room_no     = 1
        let section_id = 0
        if(timetable.subject_code == null || timetable.subject_code == undefined || timetable.subject_code == "") throw 'subject_code required'
        if(!timetable.start_time) throw 'start_time required'
        if(!timetable.day)        throw 'day required'
        if(!timetable.end_time)   throw 'end_time required'
        if(!timetable.room_no)    throw 'room_no required'
        if(timetable.start_time === timetable.end_time )   throw 'Start and end timings are same'

        let start = moment(timetable.start_time,'hh:mm')
        let end   = moment(timetable.end_time,'hh:mm')
        if(start.isAfter(end))
          throw 'end_time is must be greater then start time'

        if(!timetable.status)
            status     = 0
        if(timetable.section_id)
            section_id = timetable.section_id

          if(timetable.room_no)
            room_no = timetable.room_no

        let body = {
              day              : moment(timetable.day, 'd').format('dddd'),
              class_id         : req.body.class_id,
              school_vls_id    : user.school_id,
              branch_vls_id    : user.branch_vls_id,
              teacher_id       : timetable.teacher_id,
              academic_year_id : academicYear.id,
              section_id       : section_id,
              room_no          : room_no, 
              status           : status,
              subject_code     : timetable.subject_code,
              start_time       : timetable.start_time,
              end_time         : timetable.end_time
          }
         
          await getScheduleData(user.school_id, req.body.class_id, section_id, timetable.subject_code, timetable.start_time, timetable.end_time ,timetable.day)

          timeData.push(body)
    })
  )
  //return 'done'
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
                    attributes: ['timesheet_id',
                                 'day',
                                 'start_time',
                                 'end_time',
                                 'room_no',
                                 'class_id',
                                 'section_id'
                               ],
                    include: [{ 
                        model:SubjectList,
                        as:'subjectList',
                        attributes: [ 'id','code','subject_name' ]
                      },{ 
                        model:Employee,
                        as:'teacher',
                        attributes: [ 'faculty_vls_id', 'name', 'photo' ]
                      }]
                })

    let daysData = {}
    

    await Promise.all(
      timesheet.map(async timesheet => {
          let subject_id      = ""
          let subject_code    = ""
          let subject_name    = ""
          let teacher_name    = ""
          let teacher_photo   = ""
          let faculty_vls_id  = ""
          
          if(timesheet.subjectList){
            subject_id   = timesheet.subjectList.id
            subject_code = timesheet.subjectList.code
            subject_name = timesheet.subjectList.subject_name
          }

          if(timesheet.teacher){
            teacher_name    = timesheet.teacher.name
            teacher_photo   = timesheet.teacher.photo
            faculty_vls_id  = timesheet.teacher.faculty_vls_id
          }

          let day = {
            timesheet_id  : timesheet.timesheet_id,
            start_time    : timesheet.start_time,
            end_time      : timesheet.end_time,
            room_no       : timesheet.room_no,
            class_id      : timesheet.class_id,
            section_id    : timesheet.section_id,
            subject_id    : subject_id,
            subject_code  : subject_code,
            subject_name  : subject_name,
            teacher_name  : teacher_name,
            teacher_photo : teacher_photo,
            faculty_vls_id: faculty_vls_id,
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
                    attributes: ['timesheet_id',
                                 'day',
                                 'start_time',
                                 'end_time',
                                 'room_no',
                                 'class_id',
                                 'section_id'
                                 ],
                    include: [{ 
                        model:SubjectList,
                        as:'subjectList',
                        attributes: [ 'id','code','subject_name' ]
                      },{ 
                        model:Employee,
                        as:'teacher',
                        attributes: [ 'faculty_vls_id', 'name', 'photo' ]
                      }]
                  })
    
    let daysData = {}
    await Promise.all(
      timesheet.map(async timesheet => {
          let subject_id      = ""
          let subject_code    = ""
          let subject_name    = ""
          let teacher_name    = ""
          let teacher_photo   = ""
          let faculty_vls_id  = ""
          
          if(timesheet.subjectList){
            subject_id   = timesheet.subjectList.id
            subject_code = timesheet.subjectList.code
            subject_name = timesheet.subjectList.subject_name
          }

          if(timesheet.teacher){
            teacher_name    = timesheet.teacher.name
            teacher_photo   = timesheet.teacher.photo
            faculty_vls_id  = timesheet.teacher.faculty_vls_id
          }

          let day = {
            timesheet_id  : timesheet.timesheet_id,
            start_time    : timesheet.start_time,
            end_time      : timesheet.end_time,
            room_no       : timesheet.room_no,
            class_id      : timesheet.class_id,
            section_id    : timesheet.section_id,
            subject_id    : subject_id,
            subject_code  : subject_code,
            subject_name  : subject_name,
            teacher_name  : teacher_name,
            teacher_photo : teacher_photo,
            faculty_vls_id: faculty_vls_id,
          }

          if(!daysData[timesheet.day])
            daysData[timesheet.day] = []

          daysData[timesheet.day].push(day)
      })
    )
  return { success: true, message: "List parent timesheet", start_time:start_time, end_time: end_time ,data:daysData }
};


/**
 * API for time table update 
 */
async function update(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  let user       = await User.findByPk(req.user.id)
  let section_id = 0 
  let body       = req.body
  let id         = req.params.id

  let start = moment(body.start_time,'hh:mm')
  let end   = moment(body.end_time,'hh:mm')


  if(start.isAfter(end) || body.start_time == body.end_time)
    throw 'end_time is must be greater then start time'

  if(req.body.section_id)
        section_id          = req.body.section_id
        req.body.section_id = section_id

  let day  =  moment(req.body.day, 'd').format('dddd');
  req.body.day = day
  
  let rdata = await getScheduleData(user.school_id, body.class_id, section_id, body.subject_code, body.start_time, body.end_time, day, id)
  
  let data        = req.body
  let routine     = {}
  user            = await User.findByPk(req.user.id)
  academicYear    = await AcademicYear.findOne({
                        where:{school_id : user.school_id}
                    })  
  if(!academicYear) throw 'Academic year not found'

  num = await Routine.update(data,{
    where : { timesheet_id : id}
  });
  if(num) 
      routine   = await Routine.findByPk(id);

  return { success: true, message: "Time sheet updated successfully", data:routine }
};

/**
 * API for time table delete 
 */
async function deleteTimetable(timetableId, user){

  let userData   = await User.findByPk(user.id)
  let id         = timetableId

  let num = await Routine.destroy({
      where: { timesheet_id: timetableId }
    })

  if(num != 1) throw 'Not found'

  return { success: true, message: "Time sheet delete successfully" }
};


/**
 * method to check if schedule exist
 */
async function getScheduleData(school_id, class_id, section_id, subject_code, start_time, end_time, day, id = null){
  let whereCondition = {
      class_id       : class_id,
      section_id     : section_id,
      school_vls_id  : school_id,
      day            : day
  }
  if(id){
    whereCondition.timesheet_id =  { [Op.ne]: id }
  }
  
  let routines = await Routine.findAll({
    where : whereCondition,
          attributes: ['subject_code','start_time','end_time']
  })
   
   let startTime  = moment(start_time, 'hh:mm')
   let endTime = moment(end_time, 'hh:mm')

   await Promise.all(
      routines.map(async routine => {
        let beforeTime = moment(routine.start_time, 'hh:mm')
        let afterTime  = moment(routine.end_time, 'hh:mm')

        if(beforeTime === startTime)
           throw `subject_code ${routine.subject_code} timings are overlapping with subject_code ${subject_code}`
        
        if (startTime.isBetween(beforeTime, afterTime)) 
            throw `start_time subject_code ${routine.subject_code} timings are overlapping with subject_code ${subject_code}`

        if (endTime.isBetween(beforeTime, afterTime)) 
          throw `end_time subject_code ${routine.subject_code} timings are overlapping with subject_code ${subject_code}`  

        if (beforeTime.isBetween(startTime, endTime)) 
          throw `Timings are overlapping with other subject`  

        if (afterTime.isBetween(startTime, endTime)) 
          throw `Timings are overlapping with other subject`  

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


/**
 * API for time get exam schedule 
 */
async function getExamSchedule(user, params){
  let userDetails = await User.findByPk(user.id)
  let school_id   = userDetails.school_id
  let whereCondition = { school_id : school_id }

  if(user.role == 'student'){
    let student =  await Student.findByPk(user.userVlsId)
    if(student)
      whereCondition.class_id = student.class_id

  }else{
    if(!params.class_id ) throw 'class_id is required'
       whereCondition.class_id = params.class_id
  }
  
  let examSchedule   = await ExamSchedule.findAll({
                        where:whereCondition,
                          include: [{ 
                                      model:Exam,
                                      as:'exam',
                                      attributes: [ 'test_id',
                                                    'test_type',
                                                    'title','note',
                                                    'status']
                                    },{ 
                                      model:SubjectList,
                                      as:'subject',
                                      attributes: [ 'subject_name']
                                    }]
  })
  
  return { success: true, message: "Exam Schedule", data : examSchedule}
};