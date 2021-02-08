const { validationResult } = require('express-validator');
const db 	 	     = require("../models");
const moment 	   = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const Op 	 	     = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const User       = db.Authentication;
const Chat       = db.Chat;
const Student    = db.Student;
const Employee   = db.Employee;
const Guardian   = db.Guardian;
const Role        = db.Role;


module.exports = {
  create,
  viewChat,
  updateChat,
  deleteChat,
  listUser,
  searchFaculty
};


/**
 * API for create chat 
 */
async function create(req){
  let user = req.user
  let data = req.body
  
  user = await getUser(user.id)

  if(req.files.file && req.files.file.length > 0){
      data.attachment      = req.body.uplodedPath + req.files.file[0].filename;
      data.attachmentType  = await isImage(req.files.file[0].originalname);
  }

  let createdChat = await saveChat(data, user)
  
	return { success: true, message: "Chat created successfully"}
};


/**
 * API for get user 
 */
async function getUser(id){
  user = await User.findOne({
    where : { auth_vls_id :  id},
    attributes: ['branch_vls_id','school_id']
  })
  return user
};


/**
 * API for save chat 
 */
async function saveChat(data, user){

  data.branch_vls_id = user.branch_vls_id
  data.school_vls_id = user.school_id
  data.date          = moment().format('YYYY-MM-DD HH:mm:ss')

  let createdChat = await Chat.create(data)
  return createdChat
}


/**
 * API for save chat 
 */
async function editChat(data , id){

  let editedChat = await Chat.update(data,{
      where : { chat_vls_id : id }
  })
  return editedChat
}

/**
 * API for view chat 
 */
async function viewChat(req){
  let user = req.user
  
  let whereCondition = {
      [Op.or]:{
              sender_user_vls_id: user.userVlsId,
              receiver_user_vls_id : user.userVlsId
           }
    };
  let userChat = await Chat.findAll({
              where : whereCondition,
              order: [
                       ['date', 'desc']
                     ]     
            })
  userchat = await addChatUser(userChat);

  return { success: true, message: "Chat listing", data : userchat}
}

/**
 * API for add user chat 
 */
async function addChatUser(userChat){
  let userChatArray = []
  await Promise.all(
    userChat.map(async chat => {
        let senderUser   = {}
        let receiverUser = {}
        let uChat = chat.toJSON();
        //add sender user
        switch(uChat.sender_type){
          case 'employee' : 
              senderUser = await Employee.findOne({
                where : { faculty_vls_id : uChat.sender_user_vls_id},
                attributes: ['name','photo']
              })
          break;
          case 'student' : 
              senderUser = await Student.findOne({
                where : { student_vls_id : uChat.sender_user_vls_id},
                attributes: ['name','photo']
              })
          break;
          case 'guardian' : 
              senderUser = await Guardian.findOne({
                where : { parent_vls_id : uChat.sender_user_vls_id },
                attributes: ['name','photo']
              })
          break;
        }
        //add receiver user
        switch(uChat.receiver_type){
          case 'employee' : 
              receiverUser = await Employee.findOne({
                where : { faculty_vls_id : uChat.receiver_user_vls_id},
                attributes: ['name','photo']
              })
          break;
          case 'student' : 
              receiverUser = await Student.findOne({
                where : { student_vls_id : uChat.receiver_user_vls_id},
                attributes: ['name','photo']
              })
          break;
          case 'guardian' : 
              receiverUser = await Guardian.findOne({
                where : { parent_vls_id : uChat.receiver_user_vls_id },
                attributes: ['name','photo']
              })
          break;
        }
        uChat.senderUser = senderUser
        uChat.receiverUser = receiverUser
        userChatArray.push(uChat)
    })
  )
  return userChatArray
}


/**
 * API for update chat 
 */
async function updateChat(req){
    let user = req.user
    let data = req.body
    let id   = req.params.id

    let isChat = await  isUserAuthorised(id , user)

    if(isChat) throw 'unauthorised user'

    let editedChat = await editChat(data , id)
    
    if(editedChat[0]) 
      return { success: true, message: "Chat updated successfully"}

    return { success: true, message: "Error while updating chat"}
}

/**
 * API for update chat 
 */
async function deleteChat(params, user){
    let id   = params.id

    let isChat = await  isUserAuthorised(id , user)

    if(isChat) throw 'unauthorised user'

    let chat  = await Chat.destroy({ where: { chat_vls_id: id } })
    
    if(!chat) throw 'Chat Not found'

  return { success: true, message: "Chat deleted successfully" }
}


/**
 * API for update chat 
 */
async function isUserAuthorised(id , user){
    let isChat = await Chat.findOne({
      where : { 
                chat_vls_id        : id,
                sender_user_vls_id : user.userVlsId
              }
    })
    if(isChat) return true

    return false
}


/**
 * API for check file type  
 */
async function isImage(file){
  let ext     = ['.jpeg','.jpg','.png','.gif']
  let fileExt = path.extname(file)

  if(ext.includes(fileExt)) return 'image'

  return 'document'
}


/**
 * API for list user chat created  
 */
async function listUser(user){
  let type = await getType(user.role)
  let whereCondition = {
              [Op.or]:[{
                    sender_user_vls_id: user.userVlsId,
                    sender_type : type
                  },{
                  receiver_user_vls_id : user.userVlsId,
                  receiver_type : type
                }],
    };
  let chat = await Chat.findAll({
            where : whereCondition,
            attributes:[
                        'sender_user_vls_id',
                        'receiver_user_vls_id',
                        'sender_type',
                        'receiver_type'
                        ],
            group :['sender_user_vls_id',
                    'receiver_user_vls_id',
                    'sender_type',
                    'receiver_type'
                   ] 
          })
  //return chat
  let chatUserIds = []
  let ids = []
  await Promise.all(
    chat.map(async uChat => {
      uChat = uChat.toJSON()
            console.log(uChat)
      let obj = {}
      if((uChat.sender_user_vls_id != user.userVlsId && uChat.sender_type != type) ){
         obj = { 
                  id : uChat.sender_user_vls_id ,
                  type : uChat.sender_type 
               }
        if(!ids.includes(uChat.sender_user_vls_id)){
          ids.push(uChat.sender_user_vls_id)
          chatUserIds.push(obj)
        }
      }
      if(uChat.receiver_user_vls_id != user.userVlsId && uChat.receiver_type != type){
         obj = { 
                  id : uChat.receiver_user_vls_id ,
                  type : uChat.receiver_type 
               }
        if(!ids.includes(uChat.receiver_user_vls_id)){
           ids.push(uChat.receiver_user_vls_id)
           chatUserIds.push(obj)
        }
      }
    })
  )

  let userChatList = await getChatUser(chatUserIds)

  return { success: true, message: "User listing",
           data: userChatList}
}


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
 * API for get user chat 
 */
async function getChatUser(userList){
  let userChatList = []
  let dbUser       = {}

  await Promise.all(
    userList.map(async user => {
        let userJson = {}
        let whereCondition = {
              [Op.or]:[{
                    sender_user_vls_id: user.id,
                    sender_type : user.type
                  },{
                  receiver_user_vls_id : user.id,
                  receiver_type : user.type
                }],
            };
          
          let lastMsg = await Chat.findOne({
                    where : whereCondition,
                    attributes:['chat_message'],
                    order : [
                        ['created_at', 'DESC']
                      ]
                  })
          whereCondition.status = 'unread'
          let unreadCount = await Chat.count({
                    where : whereCondition
                  })
        switch(user.type){
          case 'employee' : 
              dbUser = await Employee.findOne({
                where : { faculty_vls_id : user.id},
                attributes: [['faculty_vls_id','id'],'name','photo']
              })
          break;
          case 'student' : 
              dbUser = await Student.findOne({
                where : { student_vls_id : user.id},
                attributes: [['student_vls_id','id'],'name','photo']
              })
          break;
          case 'guardian' : 
              dbUser = await Guardian.findOne({
                where : { parent_vls_id : user.id},
                attributes: [['parent_vls_id','id'],'name','photo']
              })
          break;
        }
        userJson = dbUser.toJSON()
        userJson.type = user.type
        if(lastMsg){
          userJson.chat_message = lastMsg.chat_message
        }else{
          userJson.chat_message = ''
        }
        userJson.unreadCount = unreadCount
        userChatList.push(userJson)
    })
  )
  return userChatList
}

/**
 * API for search faculty
 */
async function searchFaculty(params){
  let search = ''

  if(params.search) 
    search = params.search

  let faculty  = await Employee.findAll({
                          where:{
                            name : { 
                              [Op.like]: `%`+search+`%`
                            },
                            isTeacher : 1
                          }
                        });
  return { success: true, message: "Faculty list" ,data : faculty};
}