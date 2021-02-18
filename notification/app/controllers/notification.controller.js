const { validationResult } = require('express-validator');
const db 	 	     = require("../models");
const moment 	   = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const Op 	 	     = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const User       = db.Authentication;
const Employee   = db.Employee;
const Student    = db.Student;
const Guardian   = db.Guardian;
const sequelize  = db.sequelize;
const Notification   = db.Notification;
const NotificationReadBy   = db.NotificationReadBy;


module.exports = {
  list,
  readNotifications
};



/**
 * API for notification list
 */
async function list(params , user){
  let limit   = 10
  let offset  = 0
  let orderBy = 'desc';

  let schoolVlsId   = params.schoolVlsId
  let branchVlsId   = params.branch_vls_id

  if(!schoolVlsId) throw 'schoolVlsId is required'
  if(!branchVlsId) throw 'branchVlsId is required'

  let whereCondition = {
    branch_vls_id : branchVlsId,
    school_vls_id : schoolVlsId,
  }
  //check user
    let userObj = '{"id":'+user.userVlsId+',"type":"'+user.role+'"}';
    whereCondition.users = { [Op.like]: `%`+userObj+`%`}
  //check users
  if(params.size)
     limit = parseInt(params.size)
  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit
  
  let notifications = await Notification.findAll({
    limit : limit,
    offset: offset,
    where : whereCondition,
    order : [
             ['notification_vls_id', orderBy]
            ]
  })
  let allNotifications = []
  await Promise.all(
    notifications.map(async notification => {
      notification = notification.toJSON()
      let is_read =   await isRead(notification.notification_vls_id , user.userVlsId, user.role)
      notification.isRead = is_read
      allNotifications.push(notification)
    })
  )
  return { success: true, message: "Notification list", data: allNotifications}
};


/**
 * API for notification read by 
 */
async function readNotifications(body, user){
  let notificationIds = body.notificationIds
  let readByArray = []
  if(Array.isArray(notificationIds) && notificationIds.length){
      notificationIds.forEach(function(id){
        let obj = {
          notification_vls_id : id,
          user_vls_id : user.userVlsId,
          user_type : user.role
        }
        readByArray.push(obj)
      })
  }
  //return readByArray
  let notificationReadBy  = await NotificationReadBy.bulkCreate(readByArray)
  
  return { success: true, message: "Notification read successfully" }
};


/**
 * API for notification read
 */
async function isRead(id , userId, type){
  let readBy  = await NotificationReadBy.count({
        where: { 
          notification_vls_id : id,
          user_vls_id : userId ,
          user_type : type
         }
      })
  if(readBy) return true

  return false
};

