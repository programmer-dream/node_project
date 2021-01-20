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
const Assignment = db.Assignment;

module.exports = {
  create,
  view,
  update,
  deleteAssignment
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
async function deleteAssignment(meetingId, user){
  let meeting  = await Meeting.destroy({
				    where: { id: meetingId }
				  })

  if(!meeting) throw 'Meeting Not found'
  return { success: true, message: "Meeting deleted successfully" }
};