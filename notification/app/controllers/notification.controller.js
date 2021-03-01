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
const SubjectList   = db.SubjectList;
const Assignment    = db.Assignment;
const StudentQuery  = db.StudentQuery;
const Classes       = db.Classes;
const Section       = db.Section;


module.exports = {
  list,
  readNotifications,
  create,
  customList,
  update,
  deleteNotification,
  unreadCount
};



/**
 * API for notification list
 */
async function list(params , user){
  let limit   = 10
  let offset  = 0
  let orderBy = 'desc';
  //return user
  let notiType = await getType(user.role)
  let userObj = '{"id":'+user.userVlsId+',"type":"'+notiType+'"}';

  let whereCondition = await getWhereCondition(user , userObj)
  //console.log(whereCondition ,'whereCondition')
  //return 'done'
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
      //updated message
        let updatedMessage = await getUserWithMessage(notification.added_by , notification.added_type , notification.message)
      //updated message
      notification.message = updatedMessage
      notification.message = await updatedSubject(notification)
      notification.isRead  = is_read
      allNotifications.push(notification)
    })
  )

  allNotifications.sort(function(a,b) {
    return b.notification_vls_id - a.notification_vls_id;
  });
  return { success: true, message: "Notification list", data: allNotifications}
};

/**
 * API for list user chat created  
 */
async function getType(role){
  switch(role){
    case 'student': return 'student'
      break;
    case 'guardian': return 'guardian'
      break;
    default : return 'employee'
      break;  
  }
}

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


/**
 * API for get user 
 */
async function getUserWithMessage(userId , type , message){
  let user = {};
  switch(type){
    case 'student': 
        user = await Student.findOne({
          where : { student_vls_id : userId},
          attributes: ['name']
        })
      break ;
    case 'guardian': 
        user = await Guardian.findOne({
          where : { parent_vls_id : userId },
          attributes: ['name']
        })
      break ;
    case 'teacher': 
    case 'branch-admin': 
    case 'school-admin': 
    case 'principal': 
        user = await Employee.findOne({
          where : { faculty_vls_id : userId },
          attributes: ['name']
        })
      break ;
  }
  return message.replace("{name}", user.name); 
}


/**
 * API for update subject 
 */
async function updatedSubject(notification){
    let type = {}
    switch(notification.notificaton_type){
      case 'assignment': 
           type = await Assignment.findOne({
            where : { assignment_vls_id : notification.notificaton_type_id},
            attributes: ['subject_code']
          })
        break ;
      case 'query':
           type = await StudentQuery.findOne({
            where : {query_vls_id : notification.notificaton_type_id },
             attributes: ['subject_code']
          }) 
        break;
      default : return notification.message
  }
  let code = type.subject_code
  let subject = await SubjectList.findOne({
            where : {code : code },
             attributes: ['subject_name']
          })
  let message = notification.message
  return message.replace("{subjectname}", subject.subject_name);
}

/**
 * API for create custom notification 
 */
async function create(req){
    const errors = validationResult(req);
    if(errors.array().length) throw errors.array()

    let targetId = false
    if(req.body.school_vls_id){
      targetId = true
    }else if(req.body.branch_vls_id){
      targetId = true
    }else if(req.body.class_id){
      targetId = true
    }else if(req.body.section_id){
      targetId = true
    }else if(req.body.users){
      targetId = true
    }

    if(!targetId){
      throw "Please add atleast form { school_vls_id , branch_vls_id, class_id, section_id , users }for send notification"
    }

    let user = req.user
    let customNotification = req.body

    if(customNotification.users)
        customNotification.users = JSON.stringify(customNotification.users)

    customNotification.notificaton_type = 'custom_notification'
    customNotification.event_type       = 'created'
    customNotification.notificaton_type_id = 0
    customNotification.added_by   = user.userVlsId
    customNotification.added_type = user.role
    customNotification.start_date = moment().format('YYYY-MM-DD HH:mm:ss')

    let notification = await Notification.create(customNotification)

    return { success: true, message: "Notification created successfully", data : notification}
}


/**
 * API for notification list
 */
async function customList(params , user){
  let limit   = 10
  let offset  = 0
  let orderBy = 'desc';

  let whereCondition = { 
      notificaton_type : 'custom_notification',
      added_by : user.userVlsId,
      added_type : user.role
  }
  
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

  return { success: true, message: "Custom notification list", data: notifications}
}

/**
 * API for create custom notification 
 */
async function update(req){
    const errors = validationResult(req);
    if(errors.array().length) throw errors.array()
    let id = req.params.id

    let notification = await Notification.findByPk(id)
    if(!notification) throw 'notification not found'

    let targetId = false
    if(req.body.school_vls_id){
      targetId = true
    }else if(req.body.branch_vls_id){
      targetId = true
    }else if(req.body.class_id){
      targetId = true
    }else if(req.body.section_id){
      targetId = true
    }

    if(!targetId){
      throw "Please add atleast one id { school_vls_id , branch_vls_id, class_id, section_id }for send notification"
    }

    let customNotification = req.body
    
    notification =  await notification.update(customNotification)
    
    return { success: true, message: "Notification updated successfully", data : notification}
}


/**
 * API for  delete notification
 */
async function deleteNotification(notificationId){

  let notification = await Notification.findByPk(notificationId)
  if(!notification) throw 'notification not found'

  notification  = await Notification.destroy({
            where: { notification_vls_id: notificationId }
          })

  if(!notification) throw 'Notification Not found'
  return { success: true, message: "Notification deleted successfully" }
};


/**
 * API for  delete notification
 */
async function getWhereCondition(user , userObj){
  let whereCondition = {}
  let authUser  = await User.findByPk(user.id)

  switch(user.role){
    case 'student' :
      let student  = await Student.findByPk(user.userVlsId)
        whereCondition = {
          [Op.or]:[{
                    branch_vls_id: authUser.branch_vls_id,
                    users : { [Op.eq]: null }
                 },{
                    school_vls_id : authUser.school_id,
                    users : { [Op.eq]: null }
                 },{
                    class_id : student.class_id,
                    users : { [Op.eq]: null }
                 },{
                    section_id : student.section_id,
                    users : { [Op.eq]: null }
                 },{
                    users : { [Op.like]: `%`+userObj+`%`}
                 }]
      }
      break;
    case 'teacher': 
      //class ids
      let classes = await Classes.findAll({
                where : { teacher_id : user.userVlsId },
                attributes: ['class_vls_id']
              }).then(classes => classes.map(classes => classes.class_vls_id));
      //section ids
      let section = await Section.findAll({
                where : { teacher_id : user.userVlsId },
                attributes: ['id']
              }).then(section => section.map(section => section.id));
      
      let employee = await Employee.findOne({
                where : { faculty_vls_id : user.userVlsId },
                attributes: ['branch_vls_id']
              })
        whereCondition = {
          [Op.or]:[{
                    branch_vls_id: authUser.branch_vls_id,
                    users : { [Op.eq]: null }
                 },{
                    school_vls_id : authUser.school_id,
                    users : { [Op.eq]: null }
                 },{
                    class_id : { [Op.in]: classes },
                    users : { [Op.eq]: null },
                    section_id : { [Op.eq]: null }
                 },{
                    section_id : { [Op.in]: section },
                    users : { [Op.eq]: null }
                 },{
                    users : { [Op.like]: `%`+userObj+`%`}
                 }]
        }
      break;
    case 'branch-admin': 
    case 'school-admin': 
    case 'principal': 
      whereCondition = {
          [Op.or]:[{
                    branch_vls_id: authUser.branch_vls_id,
                    users : { [Op.eq]: null }
                 },{
                    school_vls_id : authUser.school_id,
                    users : { [Op.eq]: null }
                 },{
                    users : { [Op.like]: `%`+userObj+`%`}
                 }]
      }
      break;
    case 'guardian': 
      let classIds  = await Student.findAll({
        where : { parent_vls_id : user.userVlsId },
        attributes: ['class_id']
      }).then(student => student.map(student => student.class_id));

      let sectionIds  = await Student.findAll({
        where : { parent_vls_id : user.userVlsId },
        attributes: ['section_id']
      }).then(student => student.map(student => student.section_id));

      whereCondition = {
          [Op.or]:[{
                    branch_vls_id: authUser.branch_vls_id,
                    users : { [Op.eq]: null }
                 },{
                    school_vls_id : authUser.school_id,
                    users : { [Op.eq]: null }
                 },{
                    class_id : { [Op.in]: classIds },
                    users : { [Op.eq]: null },
                    section_id : { [Op.eq]: null }
                 },{
                    section_id : { [Op.in]: sectionIds },
                    users : { [Op.eq]: null }
                 },{
                    users : { [Op.like]: `%`+userObj+`%`}
                 }]
      }
      break;
  }
  return whereCondition
}
    

/**
 * API for  unread count notification
 */
async function unreadCount( user ){
  let notiType = await getType(user.role)

  let userObj = '{"id":'+user.userVlsId+',"type":"'+notiType+'"}';
  let whereCondition = await getWhereCondition(user , userObj)
  
  let notifications = await Notification.findAll({
    where : whereCondition,
  })

  let unreadCount = 0
  await Promise.all(
    notifications.map(async notification => {
      notification = notification.toJSON()
      let is_read =   await isRead(notification.notification_vls_id , user.userVlsId, user.role)
      if(!is_read)
         unreadCount++
    })
  )
    return { success: true, message: "Notification count",data :unreadCount }

}