const { validationResult } = require('express-validator');
const db = require("../../../models");
const Op = db.Sequelize.Op;
const CommunityRatingLike = db.CommunityRatingLike;

module.exports = {
  addUpdateLikes,
};

/**
 * API for create/update new Rating
 */
async function addUpdateLikes(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()
  if(!req.user) throw 'User not found'

  try{
    req.body.user_vls_id = req.user.userVlsId 
    req.body.user_type   = req.user.role 
    // Check if user exists in table
    let userEntry = await CommunityRatingLike.findOne({ 
                        where : { 
                          user_vls_id : req.body.user_vls_id, 
                          community_chat_vls_id : req.body.community_chat_vls_id 
                        } 
                      });

    let likes 
    let message 
    let data 
    if(!userEntry || userEntry == null){
      req.body.likes = 1
      likes = await CommunityRatingLike.create(req.body);
      message = 'like created successfully'
      data = likes
    }else{
      (userEntry.likes == 1) ? req.body.likes = 0 : req.body.likes = 1
      userEntry.update(req.body)
      message = 'like updated successfully'
      data = req.body
    }
    
    return { success: true, message: message, data:data }
    
  }catch(err){
    throw err.message
  }
};