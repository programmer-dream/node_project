const { validationResult } = require('express-validator');
const db 	 	     = require("../models");
const moment 	   = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const Op 	 	     = db.Sequelize.Op;
const Sequelize  = db.Sequelize;


module.exports = {
  list
};


/**
 * API for assignment list
 */
async function list(params , user){
  
  return { success: true, message: "Exam list"}
};


