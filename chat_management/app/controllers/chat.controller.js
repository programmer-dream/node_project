const { validationResult } = require('express-validator');
const db 	 	     = require("../models");
const moment 	   = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const Op 	 	     = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const User       = db.Authentication;


module.exports = {
  inbox
};


/**
 * API for create chat 
 */
async function inbox(user){
  
  	return { success: true, message: "Chat created successfully"}
};


