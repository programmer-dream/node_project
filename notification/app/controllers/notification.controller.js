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
const Notification   = db.Notification;


module.exports = {
  create,
  view,
  update,
  list,
  deleteNotification
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
    
  	let feedback 		 = await Notification.create(feedbackData)

  	if(!feedback) throw 'Notification not created'

  	return { success: true, message: "Notification created successfully", data:feedback }
};


/**
 * API for feedback view
 */
async function view(params , user){
  let id  = params.id 

  let feedback = await Notification.findOne({
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
  feedback.feedback_user = await getUser(feedback.user_vls_id , feedback.user_type)
  if(!feedback) throw 'Notification not found'

  return { success: true, message: "Notification view", data: feedback}
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
    school_vls_id : schoolVlsId,
  }
  //check user
    let userObj = '{"id":'+user.userVlsId+',"type":"'+user.role+'"}';
    whereCondition.users = { [Op.like]: `%`+userObj+`%`}
  //check users
  if(params.size)
     limit = parseInt(params.size)
  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit
  //console.log(whereCondition)
  let notifications = await Notification.findAll({
    limit : limit,
    offset: offset,
    where : whereCondition,
    order : [
             ['notification_vls_id', orderBy]
            ]
    
  })
  return { success: true, message: "Notification list", data: notifications}
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
     feedback  = await Notification.findByPk(id)

  return { success: true, message: "Notification updated successfully", data:feedback }
};


/**
 * API for feedback delete 
 */
async function deleteNotification(id){
  let feedback  = await Notification.destroy({
				    where: { feedback_id : id }
				  })

  if(!feedback) throw 'Notification Not found'
  return { success: true, message: "Notification deleted successfully" }
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
