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
const bcrypt     = require("bcryptjs");

module.exports = {
  create,
  view,
  update,
  list,
  deleteMeeting,
  listParent,
  attendMeeting
};


/**
 * API for create new meeting
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  if(req.user.role != 'principal' && req.user.role != 'branch-admin') throw 'Unauthorized User'

      req.body.originator_type = 'principal'
    if(req.user.role == 'branch-admin') 
       req.body.originator_type    = 'branch_admin'

    let reqDate = moment(req.body.date + ' '+req.body.time)
    if (moment() > reqDate) {
        throw "we can't create a meeting in past date time"
    }

    if(req.body.attendee_type =='teacher'){
      let teacher_id = req.body.attendee_vls_id
      let day        = moment(req.body.date).format('dddd')
      let start_time = req.body.time
      let duration   = req.body.duration
      let end_time   = moment(start_time,'HH:mm').add(duration, 'minutes').format('HH:mm')
      await checkTeacherTimings(teacher_id, day, start_time, duration, end_time)
    }
    await checkMeetingTimings(reqDate)

    req.body.meeting_author_vls_id = req.user.userVlsId
  	let user 		         = await User.findByPk(req.user.id)
  	req.body.school_id 	 = user.school_id
  	req.body.branch_id 	 = user.branch_vls_id

  	let meetingData      = req.body
  	
  	let meeting 		     = await Meeting.create(meetingData)

  	if(!meeting) throw 'meeting not created'

  	return { success: true, message: "Meeting created successfully", data:meeting }
};


/**
 * API for list meetings
 */
async function list(user){
  let whereCondition = {}
  if(user.role == 'principal' || user.role == 'branch-admin'){
    whereCondition.meeting_author_vls_id = user.userVlsId
  }else{
    let attendee_type = 'parent'
    if(user.role == 'teacher'){
      attendee_type = 'teacher'
    }

    whereCondition.attendee_vls_id  = user.userVlsId
    whereCondition.attendee_type    = user.attendee_type
  }

  let meetings = await Meeting.findAll({
    where:whereCondition,
    include: [{ 
                model:Employee,
                as:'addedBy'
              }]
  })

  let mettingWithUser = []
  await Promise.all(
    meetings.map(async meeting => {
       let meetingData = meeting.toJSON()
       let userData   = {}
      if(meeting.attendee_type == 'parent') {
        userData = await Guardian.findByPk(meeting.attendee_vls_id)
      }else{
        userData = await Employee.findByPk(meeting.attendee_vls_id)
      }
      meetingData.meetingUser = userData
      mettingWithUser.push(meetingData)
    })
  )

  return { success: true, message: "Meeting listing", data:mettingWithUser }
};


/**
 * API for list parent 
 */
async function listParent(params ,user){
  if(!params.class_id) throw 'class_id is required'

  let userData           = await User.findByPk(user.id)
  let class_id           = params.class_id
  
  let whereCondition     = {
      school_id     : userData.school_id,
      branch_vls_id : userData.branch_vls_id,
      class_id      : class_id
  }

  let student  = await Student.findAll({
				  	where : whereCondition,
				  	include: [{ 
                        model:Guardian,
                        as:'parent'
                      }]
				  })

  return { success: true, message: "listing parent", data: student }
};


/**
 * API for meeting view
 */
async function view(params , user){
  let meeting = await Meeting.findOne({
    where : {id:params.id},
    include: [{ 
                model:Employee,
                as:'addedBy'
              }]
  })

  if(!meeting) throw 'Meeting not found'

  return { success: true, message: "Meeting view", data: meeting}
};


/**
 * API for meeting update 
 */
async function update(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  if(req.user.role != 'principal' && req.user.role != 'branch-admin') throw 'Unauthorized User'

    req.body.originator_type = 'principal'
    if(req.user.role == 'branch-admin') 
       req.body.originator_type    = 'branch_admin'

    //check start
    let reqDate = moment(req.body.date + ' '+req.body.time)
    if (moment() > reqDate) {
        throw "we can't create a meeting in past date time"
    }

    if(req.body.attendee_type =='teacher'){
      let teacher_id = req.body.attendee_vls_id
      let day        = moment(req.body.date).format('dddd')
      let start_time = req.body.time
      let duration   = req.body.duration
      let end_time   = moment(start_time,'HH:mm').add(duration, 'minutes').format('HH:mm')
      await checkTeacherTimings(teacher_id, day, start_time, duration, end_time)
    }
    await checkMeetingTimings(reqDate , req.body.duration, req.params.id)
    //check end
    req.body.meeting_author_vls_id = req.user.userVlsId
  	let user 		         = await User.findByPk(req.user.id)
  	req.body.school_id 	 = user.school_id
  	req.body.branch_id 	 = user.branch_vls_id
  	let meetingData      = req.body
  	
  	let meeting          = await Meeting.update(meetingData,{
						  		where : { id:req.params.id }
						  	})
  	if(!meeting[0]) throw 'meeting not updated'
      meetingData  = await Meeting.findByPk(req.params.id)

  	return { success: true, message: "Meeting updated successfully", data:meetingData }
};


/**
 * API for meeting delete 
 */
async function deleteMeeting(meetingId, user){
  let meeting  = await Meeting.destroy({
				    where: { id: meetingId }
				  })

  if(!meeting) throw 'Meeting Not found'
  return { success: true, message: "Meeting deleted successfully" }
};


/**
 * API for meeting delete 
 */
async function attendMeeting(meetingId,body){
  if(!body.attendee_status) throw 'attendee_status is required'
  if(body.attendee_status == 'reject' && !body.attendee_remarks) 
  		throw 'attendee_remarks is required'

  let meetingData = {
  	attendee_status  : body.attendee_status,
  	attendee_remarks : body.attendee_remarks
  } 
  return meetingData
  let meeting  = await Meeting.update(body,{
        				    where: { id: meetingId }
        				  })

  if(!meeting[0]) throw 'Meeting Not found'

    meetingData  = await Meeting.findByPk(meetingId)

  return { success: true, message: "Meeting status updated successfully",data:meetingData }
};


/**
 * API for teacher timings for class  
 */
async function checkTeacherTimings(teacher_id, day, start_time, duration, end_time){

    let routines = await Routine.findAll({
                  where : {teacher_id : teacher_id,
                           day        : day
                          },
                        attributes: ['start_time','end_time']
                })
    await Promise.all(
      routines.map(async routine => {
        if(routine.start_time == start_time)
           throw 'Your metting time is confict with other metting'
      
        let time       = moment(start_time, 'hh:mm')
        let time2      = moment(end_time, 'hh:mm')
        let beforeTime = moment(routine.start_time, 'hh:mm')
        let afterTime  = moment(routine.end_time, 'hh:mm')
        
        if(start_time == routine.start_time || 
           end_time   == routine.end_time )
          throw 'Your metting time is confict with teacher class schedule'
        
        if (time.isBetween(beforeTime, afterTime)) 
            throw 'Your metting start time is confict with teacher class schedule'

        if (time2.isBetween(beforeTime, afterTime)) 
            throw 'Your metting end time is confict with teacher class schedule'
      })
    )
};

/**
 * API for metting timings for class  
 */
async function checkMeetingTimings(reqDate ,reqDuration, id=null){
    let whereCondition = {}

    if(id){
      whereCondition.id =  { [Op.ne]: id }
    }

    let allMeeting = await Meeting.findAll({
      where : whereCondition,
      attributes: ['date','time','duration']
    })

    await Promise.all(
      allMeeting.map(async meeting => {
          let date      = moment(meeting.date).format('YYYY-MM-DD')
          let duration  = meeting.duration
          let startTime = date + ' '+meeting.time
          let endTime   = moment(startTime).add(duration, 'minutes').format('YYYY-MM-DD HH:mm')
          let endMoment = moment(reqDate).add(reqDuration, 'minutes').format('YYYY-MM-DD HH:mm')
             endMoment = moment(endMoment)
          
          if (reqDate.isSame(startTime))
              throw 'Metting start time is confict with other metting'
          if (reqDate.isBetween(startTime, endTime))
              throw 'Your metting time is confict with other metting'

          if (endMoment.isBetween(startTime, endTime))
              throw 'Your metting time is confict with other metting'
      })
    )
};