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
const Role       = db.Role;


module.exports = {
  create,
  view,
  list,
  update,
  deleteCommunity,
  addUsers,
  addAdmins
};


/**
 * API for create community 
 */
async function create(req){
  let user = req.user
  let data = req.body
  let classStudents   = []
  user = await getUser(user.id)
  
  if(data.class_id){
    classStudents   = await getClassStudents(data.class_id, data.section_id)
  }
  
  let createdCommunity = await saveCommunity(data, user, classStudents)
  
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
async function saveCommunity(data, user, classStudents){
  let allStudents    = []

  if(classStudents.length){
    allStudents   = classStudents
  }else{
    allStudents   = data.user_list
  }

  data.branch_vls_id = user.branch_vls_id
  data.school_vls_id = user.school_id
  data.tags          = JSON.stringify(data.tags)
  
  data.user_list     = JSON.stringify(allStudents)
  
  data.group_admin_user_id_list = JSON.stringify(data.group_admin_user_id_list)

  let createdCommunity = await CommunityChat.create(data)
  return createdCommunity
}


/**
 * API for view community 
 */
async function view(id){
  let userList   = []
  let adminsList = []
  let communityWithUser = {}
  let userCommunity  = await CommunityChat.findByPk(id)
  communityWithUser  = userCommunity.toJSON()

  if(userCommunity.user_list){
    userIds = JSON.parse(userCommunity.user_list)
    userList = await Student.findAll({
      where : { 
        student_vls_id : { 
          [Op.in] : userIds
        } 
      },
      attributes:['student_vls_id','name','photo']
    })
    communityWithUser.users = userList
  }

  if(userCommunity.group_admin_user_id_list){
    userIds = JSON.parse(userCommunity.group_admin_user_id_list)
    adminsList = await Employee.findAll({
      where : { 
        faculty_vls_id : { 
          [Op.in] : userIds
        } 
      },
      attributes:['faculty_vls_id','name','photo']
    })
    communityWithUser.admins = adminsList
  }

  return { success: true, message: "Community view", data : communityWithUser}
}


/**
 * API for list community 
 */
async function list(params , user){

  let userId = user.userVlsId
  let type   = user.role

  if(user.role != 'student'){
     type = 'employee'
  }
  let limit   = 10
  let offset  = 0
  let search  = '';
  let orderBy = 'desc';

  if(params.size)
     limit = parseInt(params.size)

  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit

  if(params.search) 
    search = params.search

  if(params.orderBy)
     orderBy = params.orderBy

  let userObj = '{"id":'+userId+',"type":"'+type+'"}';
  let communities = await CommunityChat.findAll({
    limit:limit,
    offset:offset,
    order: [
             ['community_chat_vls_id', orderBy]
           ],
    where: {
      [Op.or]:{
            user_list: { 
                [Op.like]: `%`+userObj+`%`
              },
            group_admin_user_id_list : { 
              [Op.like]: `%`+userObj+`%` 
            }
         },
      [Op.and]: {
        [Op.or]:{
            group_name: { 
                [Op.like]: `%`+search+`%`
              },
            tags : { 
              [Op.like]: `%`+search+`%` 
            }
         }
      }
    },
    attributes:['community_chat_vls_id',
                'group_name',
                'group_type',
                'user_list',
                'group_admin_user_id_list'
                ]
  })

  let communityIds = []
   await Promise.all(
    communities.map(async community => {
      let communityJSON  = community.toJSON()
      let userList  = JSON.parse(community.user_list)
      let adminList = JSON.parse(community.group_admin_user_id_list)

      communityJSON.users_list_details = await addUserList(userList);
      communityJSON.admin_list_details = await addUserList(adminList);
      communityIds.push(communityJSON)

    })
   )

  return { success: true, message: "Community list", data : communityIds}
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


/**
 * API for add community user 
 */
async function addUsers(id, body){
  if(!body.user_list) throw 'user_list field is required'

  if(!Array.isArray(body.user_list)) throw 'user_list must be an array'
  let data = {
      user_list : JSON.stringify(body.user_list)
  }
  let chat  = await CommunityChat.update(data,{
    where : { community_chat_vls_id : id }
  })
    
  return { success: true, message: "Community user added successfully" }
}


/**
 * API for add community user 
 */
async function addAdmins(id, body){
  if(!body.admin_list) throw 'admin_list field is required'

  if(!Array.isArray(body.admin_list)) throw 'user_list must be an array'
  let data = {
      group_admin_user_id_list : JSON.stringify(body.admin_list)
  }
  let chat  = await CommunityChat.update(data,{
    where : { community_chat_vls_id : id }
  })
    
  return { success: true, message: "Community addmins added successfully" }
}


/**
 * API for get class students 
 */
async function getClassStudents(classId, sectionId = null){
  let studentArray = []
  let whereCondition = {
    class_id :  classId
  }

  if(sectionId)
    whereCondition.section_id = sectionId

  let studentIds = await Student.findAll({
    where : whereCondition,
    attributes:[['student_vls_id','id']]
  });

  await Promise.all(
    studentIds.map(async student => {
      student      = student.toJSON()
      student.type = 'student'
      studentArray.push(student)
    })
  )
  return studentArray
}

/**
 * API for add user in community 
 */
async function addUserList(userList){
  //return userList
  let allUser = []
  await Promise.all(
    userList.map(async user => {
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
        }
        allUser.push(dbUser.toJSON())
      })
  )
  return allUser
}