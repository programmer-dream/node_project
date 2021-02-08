const { validationResult } = require('express-validator');
const db 	 	     = require("../models");
const moment 	   = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const Op 	 	     = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const User       = db.Authentication;
const CommunityChat = db.CommunityChat;
const Student    = db.Student;
const Employee   = db.Employee;
const Guardian   = db.Guardian;
const Role        = db.Role;


module.exports = {
  create,
  view,
  list,
  update,
  deleteCommunity
};


/**
 * API for create community 
 */
async function create(req){
  let user = req.user
  let data = req.body
  
  user = await getUser(user.id)

  let createdCommunity = await saveCommunity(data, user)
  
	return { success: true, message: "Community created successfully" , data : createdCommunity}
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
 * API for save community 
 */
async function saveCommunity(data, user){
  data.branch_vls_id = user.branch_vls_id
  data.school_vls_id = user.school_id
  data.user_list     = JSON.stringify(data.user_list)
  data.tags          = JSON.stringify(data.tags)
  data.group_admin_user_id_list = JSON.stringify(data.group_admin_user_id_list)

  let createdCommunity = await CommunityChat.create(data)
  return createdCommunity
}


/**
 * API for view community 
 */
async function view(id){
  
  let userCommunity = await CommunityChat.findByPk(id)

  return { success: true, message: "Community view", data : userCommunity}
}


/**
 * API for list community 
 */
async function list(req){
  let user = req.user
  
  let userCommunity = await CommunityChat.findAll()

  return { success: true, message: "Community list", data : userCommunity}
}


/**
 * API for update community 
 */
async function update(req){
  let id   = req.params.id
  let data = req.body
  
  let updatedCommunity = await updateCommunity(data, id)
  
  return { success: true, message: "Community updated successfully" , data : updatedCommunity}
}


/**
 * API for save community 
 */
async function updateCommunity(data, id){
  data.user_list     = JSON.stringify(data.user_list)
  data.tags          = JSON.stringify(data.tags)
  data.group_admin_user_id_list = JSON.stringify(data.group_admin_user_id_list)

  let community = await CommunityChat.findByPk(id)

  if(community){
    let updatedCommunity = await CommunityChat.update(data,{
      where : { community_chat_vls_id:id }
    })
    community = await CommunityChat.findByPk(id)
  }else{
    throw 'Community not found'
  }

  return community
}


/**
 * API for delete community 
 */
async function deleteCommunity(id){
    let chat  = await CommunityChat.destroy({ where: { community_chat_vls_id : id } })
    
    if(!chat) throw 'Community Not found'

  return { success: true, message: "Community deleted successfully" }
}