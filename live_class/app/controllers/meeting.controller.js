const { validationResult } = require('express-validator');
const db 	 	 = require("../../../models");
const moment 	 = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const mailer     = require('../../../helpers/nodemailer')
const Op 	 	 = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const sequelize  = db.sequelize;
const Student    = db.Student;
const Section    = db.Section;
const SubjectList    = db.SubjectList;
const Authentication = db.Authentication;
const Guardian   	 = db.Guardian;
const Classes   	 = db.Classes;
const SchoolDetails = db.SchoolDetails;
const Employee 		= db.Employee;
const Branch  		= db.Branch;
const VlsMeetings = db.VlsMeetings;


module.exports = {
  create,
  list,
  view, 
  update,
  deleteMeeting
};


/**
 * API for create meeting
 */
async function create(body, user){ 
    
    let meeting = await VlsMeetings.create(body);
  	return { success: true, message: "meeting create successfully",data:meeting}
};


/**
 * API for list meeting
 */
async function list(query, user){ 
    
  let meetings = await VlsMeetings.findAll();

  return { success: true, message: "meeting listing",data:meetings}
};


/**
 * API for view meeting
 */
async function view(params, user){ 
    
  let meeting = await VlsMeetings.findOne({
    where : { meeting_id :  params.meeting_id}
  });

  if(!meeting) throw 'meeting not found'

  return { success: true, message: "meeting view",data:meeting}
};


/**
 * API for view meeting
 */
async function update(params, body, user){ 
  let meeting = await VlsMeetings.findOne({
    where : { meeting_id :  params.meeting_id}
  });

  if(!meeting) throw 'meeting not found'

  meeting.update(body);
  return { success: true, message: "meeting updated successfully",data:meeting}
};


/**
 * API for view meeting
 */
async function deleteMeeting(params, user){ 
    
  let meeting = await VlsMeetings.findOne({
    where : { meeting_id :  params.meeting_id}
  });

  if(!meeting) throw 'meeting not found'

  meeting.destroy();
  return { success: true, message: "meeting deleted successfully",}
};
