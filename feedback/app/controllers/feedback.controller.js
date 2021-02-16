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


module.exports = {
  create,
  view,
  update,
  list,
  deleteFeedback
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

  	if(!feedback) throw 'Feedback not created'

  	return { success: true, message: "Feedback created successfully", data:feedback }
};


/**
 * API for feedback view
 */
async function view(params , user){
  let id  = params.id 

  let feedback = await Feedback.findOne({
    where : { feedback_id : id}
  })
  feedback = feedback.toJSON()
  feedback.feedback_user = await getUser(feedback.user_vls_id , feedback.user_type)
  if(!feedback) throw 'Feedback not found'

  return { success: true, message: "Feedback view", data: feedback}
};


/**
 * API for feedback list
 */
async function list(params , user){
  let limit   = 10
  let offset  = 0
  let orderBy = 'desc';

  let schoolVlsId   = params.schoolVlsId
  let branchVlsId   = params.branch_vls_id

  if(!schoolVlsId) throw 'schoolVlsId is required'
  if(!branchVlsId) throw 'branchVlsId is required'

  let whereCondition = {
    branch_vls_id : branchVlsId,
    school_vls_id : schoolVlsId
  }
  if(params.size)
     limit = parseInt(params.size)
  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit

  let allFeedback = await Feedback.findAll({
    limit : limit,
    offset: offset,
    where : whereCondition,
    order : [
             ['feedback_id', orderBy]
            ]
  })
  let feedbackArr = []
  await Promise.all(
    allFeedback.map(async feedback => {
      feedback = feedback.toJSON()
      feedback.feedback_user = await getUser(feedback.user_vls_id , feedback.user_type)
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
  feedbackData  = req.body
  let feedback  = await Feedback.update(feedbackData,
  { 
    where : { feedback_id : id }

  })
  if(feedback[0])
     feedback  = await Feedback.findByPk(id)

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
