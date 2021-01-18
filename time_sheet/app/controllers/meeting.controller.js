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
const bcrypt     = require("bcryptjs");

module.exports = {
  create,
  view,
  update,
  list,
  deleteMeeting,
  listParent
};


/**
 * API for create new meeting
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  if(req.user.role != 'principal') throw 'Unauthorized User'

  	let user 		     = await User.findByPk(req.user.id)
  	req.body.school_id 	 = user.school_id
  	req.body.branch_id 	 = user.branch_vls_id
  	let meetingData      = req.body
  	
  	let meeting 		 = await Meeting.create(meetingData)

  	if(!meeting) throw 'meeting not created'

  	return { success: true, message: "Meeting created successfully", data:meeting }
};


/**
 * API for list meetings
 */
async function list(user){
  let meetings = await Meeting.findAll()

  return { success: true, message: "Meeting listing", data:meetings }
};


/**
 * API for list parent 
 */
async function listParent(params ,user){
  if(!params.class_id) throw 'class_id is required'

  let class_id = params.class_id
  let student  = await Student.findAll({
				  	where:{ class_id : class_id },
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
  let meeting = await Meeting.findByPk(params.id)

  if(!meeting) throw 'Meeting not found'

  return { success: true, message: "Meeting view", data: meeting}
};


/**
 * API for meeting update 
 */
async function update(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  if(req.user.role != 'principal') throw 'Unauthorized User'

  	let user 		     = await User.findByPk(req.user.id)
  	req.body.school_id 	 = user.school_id
  	req.body.branch_id 	 = user.branch_vls_id
  	let meetingData      = req.body
  	
  	let meeting          = await Meeting.update(meetingData,{
						  		where : { id:req.params.id }
						  	})
  	if(!meeting) throw 'meeting not updated'

  	return { success: true, message: "Meeting updated successfully", data:meeting }
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