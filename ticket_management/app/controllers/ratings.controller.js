const { validationResult } = require('express-validator');
const db = require("../../../models");
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const TicketRating = db.TicketRating;

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
    let userEntry = await TicketRating.findOne({ 
                        where : { 
                          user_vls_id : req.body.user_vls_id, 
                          ticket_vls_id : req.body.ticket_vls_id 
                        } 
                      })

    let rattings 
    let message 
    let data
    if(!userEntry || userEntry == null){
      rattings = await TicketRating.create(req.body);
      message = 'Rating created successfully'
      data = rattings.toJSON()
    }else{
      await userEntry.update(req.body)
      message = 'Rating updated successfully'
      data = req.body
    }
    
    //get rating avg
    let ratingsData = await TicketRating.findOne({
      attributes: [
                    [ Sequelize.fn('AVG', Sequelize.col('ratings')), 'avg' ]
                  ],
      where:{ ticket_vls_id: req.body.ticket_vls_id },
      group:['ticket_vls_id']
    })
    
    return { success: true, message: message, data:ratingsData }
    
  }catch(err){
    throw err.message
  }
};