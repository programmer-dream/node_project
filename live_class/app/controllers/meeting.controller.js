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


module.exports = {
  create
  
};


/**
 * API for create new meeting
 */
async function create(req){
  
  	return { success: true, message: "Assignment created successfully"}
};
