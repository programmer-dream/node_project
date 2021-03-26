const { validationResult } = require('express-validator');
const db 	 	 = require("../../../models");
const moment 	 = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const { updateRewardsPoints } = require('../../../helpers/update-rewards')
const Op 	 	 = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const User       = db.Authentication;
const sequelize  = db.sequelize;
const VlsRewards = db.VlsRewards;


module.exports = {
  createOrUpdate,
  view
};


/**
 * API for create or update new reward
 */
async function createOrUpdate(body, user){
	let rewards = await VlsRewards.findOne()
	
	if(rewards){
  		rewards.update(body)
  	}else{
  		rewards = await VlsRewards.create(body)
  	}	
  	return { success: true, message: "Reward updated successfully", data:rewards}
};


/**
 * API for view reward
 */
async function view(params, user){
  	let rewards = await VlsRewards.findOne()

  	return { success: true, message: "View reward", data:rewards }
};


