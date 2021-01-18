const { validationResult } = require('express-validator');
const db 	 	 = require("../models");
const moment 	 = require("moment");
const Op 	 	 = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const path 		 = require('path')
const User       = db.Authentication;
const Employee   = db.Employee;
const Meeting    = db.Meeting;
const sequelize  = db.sequelize;
const bcrypt     = require("bcryptjs");

module.exports = {
  create,
  view,
  update,
  list,
  deleteMeeting
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
 * API for create new meeting
 */
async function list(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  if(req.user.role != 'principal') throw 'Unauthorized User'

  	let user 		     = await User.findByPk(req.user.id)
  	req.body.school_id 	 = user.school_id
  	req.body.branch_id 	 = user.branch_vls_id
  	let meetingData      = req.body
  	
  	let meeting = Meeting.create(meetingData)
  	if(!meeting) throw 'meeting not created'

  	return { success: true, message: "Meeting created successfully", data:meeting }
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