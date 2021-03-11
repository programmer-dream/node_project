const { validationResult } = require('express-validator');
const db 	 	     = require("../models");
const moment 	   = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const Op 	 	     = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const User       = db.Authentication;
const Employee   = db.Employee;
const sequelize  = db.sequelize;
const SchoolDetails= db.SchoolDetails;
const Branch  		 = db.Branch;
const Role         = db.Role;
const Ticket         = db.Ticket;


module.exports = {
  create
};


/**
 * API for create ticket
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  let ticket 	  = await Ticket.findAll();
  let ticket_data = req.body
  let user        = req.user

  //modify data
  ticket_data.user_id     = user.userVlsId
  ticket_data.user_type   = user.role
  ticket_data.ticket_type = 'application'
  ticket_data.status = 'new'
  ticket_data.open_date = moment().format('YYYY-MM-DD HH:mm:ss')
  return ticket_data
   //create ticket
  //let ticket = await Ticket.create(ticket_data);

  return req.body

  return { success: true, message: "Ticket created successfully", data : ticket}
};

