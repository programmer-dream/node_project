const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const Ratings = db.Ratings;

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
    // Check if user exists in table
    let userEntry = await Ratings.findOne({ where : { user_vls_id : req.body.user_vls_id, query_vls_id : req.body.query_vls_id } })
    console.log(userEntry,"userEntry")

    //get rating avg
    let ratingsData = await Ratings.findOne({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('ratings')), 'total_ratings'],
      [Sequelize.fn('COUNT', Sequelize.col('ratings')), 'total_count']],
      where:{ query_vls_id: req.body.query_vls_id },
      group:['query_vls_id']
    })
    let avg = null

    if(ratingsData){
    //get rating & likes
      let ratingData = ratingsData.toJSON();
      avg = parseInt(ratingData.total_ratings) / ratingData.total_count
    }

    let rattings 
    let message 
    let data
    if(!userEntry || userEntry == null){
      rattings = await Ratings.create(req.body);
      message = 'Rating created successfully'
      data = rattings
      data.avg = avg
    }else{
      userEntry.update(req.body)
      message = 'Rating updated successfully'
      data = req.body
      data.avg = avg
    }
    
    return { success: true, message: message, data:data };
  }catch(err){
    throw err.message
  }
};