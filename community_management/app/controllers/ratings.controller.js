const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const CommunityRatingLike = db.CommunityRatingLike;

module.exports = {
  addUpdateRatings,
};

/**
 * API for create/update new Rating
 */
async function addUpdateRatings(req){
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
                          user_type   : req.body.user_type, 
                          community_chat_vls_id: req.body.community_chat_vls_id  
                        } 
                      })

    let rattings 
    let message 
    let data
    if(!userEntry || userEntry == null){
      rattings = await CommunityRatingLike.create(req.body);
      message = 'Rating created successfully'
      data = rattings.toJSON()
    }else{
      await userEntry.update(req.body)
      message = 'Rating updated successfully'
      data = req.body
    }
    
    //get rating avg
    let ratingsData = await CommunityRatingLike.findOne({
      attributes: [
                    [ Sequelize.fn('AVG', Sequelize.col('ratings')), 'total_ratings' ]
                  ],
      where:{ community_chat_vls_id: req.body.community_chat_vls_id },
      group:['community_chat_vls_id']
    })
    ratingsData = ratingsData.toJSON()
    let avg = null

    if(ratingsData){
        avg = ratingsData.total_ratings
    }

    data.avg = avg

    return { success: true, message: message, data:data }
    
  }catch(err){
    throw err.message
  }
};