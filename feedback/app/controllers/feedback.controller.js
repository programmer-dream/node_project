const { validationResult } = require('express-validator');
const db 	 	     = require("../models");
const moment 	   = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const Op 	 	     = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const User       = db.Authentication;
const Employee   = db.Employee;
const Student    = db.Student;
const Guardian   = db.Guardian;
const sequelize  = db.sequelize;
const Feedback   = db.Feedback;
const Meeting    = db.Meeting;
const Notification = db.Notification;


module.exports = {
  create,
  view,
  update,
  list,
  deleteFeedback,
  closeFeedback,
  setMeeting,
  deleteMultiFeedback
};


/**
 * API for create new feedback
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

    let user = req.user
    let feedbackData =  req.body
    feedbackData.user_vls_id   = user.userVlsId
    feedbackData.user_type     = user.role
    feedbackData.status        = 'open'
    feedbackData.open_date     = moment().format('YYYY-MM-DD HH:mm:ss')
    
  	let feedback 		 = await Feedback.create(feedbackData)
    //notification
    let userObj  = await getPrincipal(feedback.branch_vls_id)
    let notificatonData = {}
    notificatonData.branch_vls_id = feedback.branch_vls_id
    notificatonData.school_vls_id = feedback.school_vls_id
    notificatonData.status        = 'general'
    notificatonData.message       = '{name} added feedback for you.'
    notificatonData.notificaton_type = 'feedback'
    notificatonData.notificaton_type_id = feedback.feedback_id
    notificatonData.start_date    = feedback.open_date
    notificatonData.users         = JSON.stringify([userObj])
    notificatonData.added_by      = user.userVlsId
    notificatonData.added_type    = user.role
    notificatonData.event_type    = 'added'
    await Notification.create(notificatonData)
    //notification
  	if(!feedback) throw 'Feedback not created'

  	return { success: true, message: "Feedback created successfully", data:feedback }
};


/**
 * API for feedback view
 */
async function view(params , user){
  let id  = params.id 

  let feedback = await Feedback.findOne({
    where : { feedback_id : id},
    include : [{ 
                model:Meeting,
                as:'meetingData',
                include : [{ 
                    model:Employee,
                    as:'meetingUser',
                    attributes:['name','photo']
                  }]
              }]
  })

  feedback = feedback.toJSON()
  if(!feedback) throw 'Feedback not found'

  feedback.feedback_user = await getUser(feedback.user_vls_id , feedback.user_type)

  if(feedback.related_to && feedback.related_to != "")
    feedback.feedback_related_user = await getUser(feedback.related_to, feedback.related_type)

  return { success: true, message: "Feedback view", data: feedback}
};


/**
 * API for feedback list
 */
async function list(params , user){
  let limit   = 10
  let offset  = 0
  let orderBy = 'desc';
  let search = ''
  let schoolVlsId   = params.schoolVlsId
  let branchVlsId   = params.branch_vls_id
  let students = []

  if(!schoolVlsId) throw 'schoolVlsId is required'
  if(!branchVlsId) throw 'branchVlsId is required'

  if(params.search) 
    search = params.search

  let whereCondition = {
      [Op.or]:{
                description: { 
                  [Op.like]: `%`+search+`%`
                },
              title : { 
                [Op.like]: `%`+search+`%` 
              }
           }
    };

  whereCondition.branch_vls_id = branchVlsId
  whereCondition.school_vls_id = schoolVlsId
  let roleArr = ['principal','branch-admin',
                 'school-admin','super-admin']        
  if(!roleArr.includes(user.role)){
    whereCondition.user_vls_id = user.userVlsId
    whereCondition.user_type   = user.role
  }

  if(params.size)
     limit = parseInt(params.size)

  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit

  if(params.status)
     whereCondition.status = params.status

  if(params.feedback_type)
     whereCondition.feedback_type = params.feedback_type

   if(params.class_id){
    students = await Student.findAll({ where : {class_id : params.class_id},
        attributes: ['student_vls_id']
        }).then(student => student.map(student => student.student_vls_id));
   }

   if(params.section_id){
    if(!params.class_id) throw "class_id is required when selecting section"

    students = await Student.findAll({ where : {class_id : params.class_id, section_id: params.section_id},
        attributes: ['student_vls_id']
        }).then(student => student.map(student => student.student_vls_id));;
   }


   if(params.related_to){
      if(!params.related_type) throw 'related_type is required with related_to'

      whereCondition.related_to = params.related_to
      whereCondition.related_type = params.related_type
   }else if(students.length > 0){
      whereCondition.related_to = { [Op.in] : students }
      whereCondition.related_type = "student"
   }

  if(params.orderBy) 
    orderBy = params.orderBy

  let allFeedback = await Feedback.findAll({
    limit : limit,
    offset: offset,
    where : whereCondition,
    order : [
             ['feedback_id', orderBy]
            ],
    include : [{ 
                model:Meeting,
                as:'meetingData',
                include : [{ 
                    model:Employee,
                    as:'meetingUser',
                    attributes:['name','photo']
                  }]
              }]
  })
  let feedbackArr = []
  await Promise.all(
    allFeedback.map(async feedback => {
      feedback = feedback.toJSON()
      feedback.feedback_user = await getUser(feedback.user_vls_id , feedback.user_type)
      if(feedback.related_to && feedback.related_to != "")
        feedback.feedback_related_user = await getUser(feedback.related_to, feedback.related_type)

      feedbackArr.push(feedback)
    })
  )
  return { success: true, message: "Feedback list", data: feedbackArr}
};


/**
 * API for feedback update 
 */
async function update(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()
  let id = req.params.id 

  let user = req.user
  let feedbackData  = req.body
  let feedback  = await Feedback.update(feedbackData,
  { 
    where : { feedback_id : id }

  })
  if(feedback[0])
     feedback  = await Feedback.findByPk(id)
   //notification
    let userObj  = await getPrincipal(feedback.branch_vls_id)
    let notificatonData = {}
    notificatonData.branch_vls_id = feedback.branch_vls_id
    notificatonData.school_vls_id = feedback.school_vls_id
    notificatonData.status        = 'general'
    notificatonData.message       = '{name} updated feedback for you.'
    notificatonData.notificaton_type = 'feedback'
    notificatonData.notificaton_type_id = feedback.feedback_id
    notificatonData.start_date    = feedback.open_date
    notificatonData.users         = JSON.stringify([userObj])
    notificatonData.added_by      = user.userVlsId
    notificatonData.added_type    = user.role
    notificatonData.event_type    = 'updated'
    await Notification.create(notificatonData)
    //notification
  return { success: true, message: "Feedback updated successfully", data:feedback }
};


/**
 * API for feedback delete 
 */
async function deleteFeedback(id){
  let feedback  = await Feedback.destroy({
				    where: { feedback_id : id }
				  })

  if(!feedback) throw 'Feedback Not found'
  return { success: true, message: "Feedback deleted successfully" }
};

/**
 * API for feedback delete 
 */
async function deleteMultiFeedback(body){
  let ids  = body.ids
  if(!Array.isArray(ids)) throw 'ids field must be an array'
  if(ids.length < 1 ) throw 'please select atleast one id to delete'
  
  let feedback  = await Feedback.destroy({
            where: { 
              feedback_id : { [Op.in] : ids }
            }
          })

  if(!feedback) throw 'Feedback Not found'
  return { success: true, message: "Feedback deleted successfully" }
};


/**
 * API for feedback users 
 */
async function getUser(id , type){
  let user = {}
  switch (type) {
    case 'student':
       user =  await Student.findOne({
        where : {student_vls_id : id},
        attributes: ['name','photo']
        })
      break;
    case 'guardian':
        user =  await Guardian.findOne({
          where : {parent_vls_id : id},
          attributes: ['name','photo']
        })
      break;
    default :
        user =  await Employee.findOne({
          where : {faculty_vls_id : id},
          attributes: ['name','photo']
        })
      break;
  }
  return user
};


/**
 * API for close feedback 
 */
async function closeFeedback(id, body, user){
  
  if(user.role != 'principal') throw 'Unauthorized user'
  if(!body.remarks) throw 'remarks field is required'
  if(!body.feedback_rating) throw 'feedback_rating field is required'

  let feedbackData  = {
    status            : 'closed',
    remarks           : body.remarks,
    feedback_rating   : body.feedback_rating,
    close_date        : moment().format('YYYY-MM-DD HH:mm:ss'),
    closed_by         : user.userVlsId,
    closed_user_type  : user.role
  }

  let feedback  = await Feedback.findByPk(id)

  if(!feedback) throw 'Feedback not found'
      feedback.update(feedbackData)
    
  //notification
    let userObj = await getfeedbackUser(feedback)
    let notificatonData = {}
    notificatonData.branch_vls_id = feedback.branch_vls_id
    notificatonData.school_vls_id = feedback.school_vls_id
    notificatonData.status        = 'general'
    notificatonData.message       = '{name} closed feedback with remark.'
    notificatonData.notificaton_type = 'feedback'
    notificatonData.notificaton_type_id = feedback.feedback_id
    notificatonData.start_date    = feedback.open_date
    notificatonData.users         = JSON.stringify([userObj])
    notificatonData.added_by      = user.userVlsId
    notificatonData.added_type    = user.role
    notificatonData.event_type    = 'closed'
    await Notification.create(notificatonData)
    //notification
  
  let updatedFeedback  = await Feedback.findByPk(id)
  updatedFeedback = updatedFeedback.toJSON()
  updatedFeedback.feedback_user = await getUser(updatedFeedback.user_vls_id , updatedFeedback.user_type)

  return { success: true, message: "Feedback updated successfully", data:updatedFeedback }
};

/**
 * API for add metting feedback 
 */
async function setMeeting(feedbackId , body){
  if(!body.meeting_vls_id) throw 'meeting_vls_id field is required'

  let feedback  = await Feedback.findByPk(feedbackId)
  let meetingData = {
    meeting_vls_id : body.meeting_vls_id
  }
  if(!feedback) throw 'Feedback not found'
      feedback.update(meetingData)
  //notification
    let userObj = await getfeedbackUser(feedback)
    let principal = await  getPrincipal(feedback.branch_vls_id)
    let notificatonData = {}
    notificatonData.branch_vls_id = feedback.branch_vls_id
    notificatonData.school_vls_id = feedback.school_vls_id
    notificatonData.status        = 'general'
    notificatonData.message       = '{name} schedule meeting regarding your feedback'
    notificatonData.notificaton_type = 'feedback'
    notificatonData.notificaton_type_id = feedback.feedback_id
    notificatonData.start_date    = feedback.open_date
    notificatonData.users         = JSON.stringify([userObj])
    notificatonData.added_by      = principal.id
    notificatonData.added_type    = 'principal'
    notificatonData.event_type    = 'meeting'
    await Notification.create(notificatonData)
    //notification
  return { success: true, message: "Feedback updated successfully", data:feedback }
}

/**
 * API for get branch principal
 */
async function getPrincipal(branchId){
  let user =  await Employee.findOne({
          where : {
              branch_vls_id : branchId,
              isPrincipal : 1
            },
          attributes: ['faculty_vls_id']
        })
  let userObj = {
    id : user.faculty_vls_id,
    type: 'employee'
  }
  return userObj
} 

/**
 * API for get feedback objects
 */
async function getfeedbackUser(feedback){
  let user = {}
  let userObj = {};
  switch(feedback.user_type){
    case 'student': 
        user = await Student.findOne({
          where : { student_vls_id : feedback.user_vls_id},
          attributes: ['student_vls_id']
        })
        userObj = { id : user.student_vls_id , type : 'student'}
      break ;
    case 'guardian': 
        user = await Guardian.findOne({
          where : { parent_vls_id : feedback.user_vls_id },
          attributes: ['parent_vls_id']
        })
        userObj = { id : user.parent_vls_id , type : 'guardian'}
      break ;
    case 'teacher': 
    case 'branch-admin': 
    case 'school-admin': 
    case 'principal': 
        user = await Employee.findOne({
          where : { faculty_vls_id : feedback.user_vls_id },
          attributes: ['faculty_vls_id']
        })
        userObj = { id : user.faculty_vls_id , type : 'employee'}
      break ;
  }
  return userObj 
}