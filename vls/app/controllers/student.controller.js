const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const StudentPersonal = db.StudentPersonal;
const StudentSchoolPersonal = db.StudentSchoolPersonal;
const Authentication = db.Authentication;
const sequelize = db.sequelize;
const bcrypt = require("bcryptjs");

module.exports = {
  view
};

async function view(id){
  if(!id) return { success: false,message: 'Student not found' };
  	let school = await StudentSchoolPersonal.findByPk(id)
  	return { success: true, message: "Student data", data : school};
};