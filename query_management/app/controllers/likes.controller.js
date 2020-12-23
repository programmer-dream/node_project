const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const Ratings = db.Ratings;

module.exports = {
  addUpdateLikes,
};

/**
 * API for create/update new Rating
 */
async function addUpdateLikes(req){
  try{
    const errors = validationResult(req);
    if(errors.array().length)
       return { success: false, message: errors.array() }

    if(!req.user) throw 'User not found'

    req.body.user_vls_id = req.user.userVlsId 

    // Check if user exists in table
    let userEntry = await Ratings.findOne({ where : { user_vls_id : req.body.user_vls_id, query_vls_id : req.body.query_vls_id } })
    console.log(userEntry,"userEntry")

    let likes 
    let message 
    let data 
    if(!userEntry || userEntry == null){
      likes = await Ratings.create(req.body);
      message = 'like created successfully'
      data = likes
    }else{
      (userEntry.likes == 1) ? req.body.likes = 0 : req.body.likes = 1
      
      userEntry.update(req.body)
      message = 'like updated successfully'
      data = req.body
    }
    
    return { success: true, message: message, data:data };
  }catch(err){
    return { success: false, message: err.message};
  }
};