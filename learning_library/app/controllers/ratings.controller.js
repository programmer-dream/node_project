const { validationResult } = require('express-validator');
const db = require("../../../models");
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const Ratings = db.LibraryRatings;

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
    let userEntry = await Ratings.findOne({ 
                            where : { 
                              user_vls_id : req.body.user_vls_id, 
                              learning_library_vls_id : req.body.learning_library_vls_id,
                              user_type: req.user.role 
                            } 
                          })

    let rattings 
    let message 
    let data
    if(!userEntry || userEntry == null){
      rattings = await Ratings.create(req.body);
      message = 'Rating created successfully'
      data = rattings.toJSON()
    }else{
      await userEntry.update(req.body)
      message = 'Rating updated successfully'
      data = req.body
    }
    
    //get rating avg
    let ratingsData = await Ratings.findOne({
      attributes: [
                    [ Sequelize.fn('SUM', Sequelize.col('ratings')), 'total_ratings' ],
                    [ Sequelize.fn('COUNT', Sequelize.col('ratings')), 'total_count' ]
                  ],
      where:{ learning_library_vls_id: req.body.learning_library_vls_id },
      group:['learning_library_vls_id']
    })

    let avg = null

    if(ratingsData){
    //get rating & likes
      let ratingData = ratingsData.toJSON();
      avg = parseInt(ratingData.total_ratings) / ratingData.total_count
    }

    data.avg = avg

    return { success: true, message: message, data:data }
    
  }catch(err){
    throw err.message
  }
};