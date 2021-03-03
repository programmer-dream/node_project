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
const CommunityRatingLike = db.CommunityRatingLike;
const Notification = db.Notification;



module.exports = {
  create,
  view,
  list,
  update,
  deleteCommunity,
  addUsers,
  addAdmins,
  getRatingLikes,
  adminsList
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
  
  let createdCommunity = await saveCommunity(data, user, classStudents, req.user)
  
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
async function saveCommunity(data, user, classStudents, auth){
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

  //add principal
  let principal = await Employee.findOne({
    where : {
        branch_vls_id : user.branch_vls_id,
        isPrincipal   : 1
    },
    attributes : ['faculty_vls_id']
  })
  let principalObj = { id  : principal.faculty_vls_id,
                       type: 'employee'
                     }
  data.group_admin_user_id_list.push(principalObj)
    //add principal

  data.group_admin_user_id_list = JSON.stringify(data.group_admin_user_id_list)
  
  let createdCommunity = await CommunityChat.create(data)
  //notification
    let notificatonData = {}
    notificatonData.branch_vls_id = data.branch_vls_id
    notificatonData.school_vls_id = data.school_vls_id
    notificatonData.status        = 'general'
    notificatonData.message       = '{name} added you in '+createdCommunity.group_name+' community'
    notificatonData.notificaton_type = 'community'
    notificatonData.notificaton_type_id = createdCommunity.community_chat_vls_id
    notificatonData.start_date    = data.start_date
    notificatonData.users         = data.user_list
    notificatonData.added_by      = auth.userVlsId
    notificatonData.added_type    = auth.role
    notificatonData.event_type    = 'added'
    await Notification.create(notificatonData)
    notificatonData.users         = data.group_admin_user_id_list
    notificatonData.message = '{name} added you as admin in '+createdCommunity.group_name+' community'
    await Notification.create(notificatonData)
    //notification
  return createdCommunity
}


/**
 * API for view community 
 */
async function view(id, user){

  let userCommunity   = await CommunityChat.findByPk(id)

  if(!userCommunity) throw 'Community not found'

  let communityJSON   = userCommunity.toJSON()

  let userList   = JSON.parse(userCommunity.user_list)
  let adminsList = JSON.parse(userCommunity.group_admin_user_id_list)

  let userType = await getType(user.role)

  let allUser = userList.concat(adminsList)

  let isAuthorised =  allUser.filter( singleUser => {
       return singleUser.id == user.userVlsId && singleUser.type == userType
    });

  if(isAuthorised.length < 1) throw 'Unauthorised user'

  communityJSON.users_list_details = await addUserList(userList);
  communityJSON.admin_list_details = await addUserList(adminsList);
  communityJSON.ratings_likes = await queryRatingLikes(userCommunity.community_chat_vls_id)
  let communityWithUser = communityJSON
  
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
  let whereCondition = {
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
    }

  if(params.community_status)
    whereCondition.community_status = params.community_status

  let communities = await CommunityChat.findAll({
    limit:limit,
    offset:offset,
    order: [
             ['community_chat_vls_id', orderBy]
           ],
    where: whereCondition,
    attributes:['community_chat_vls_id',
                'group_name',
                'group_type',
                'user_list',
                'group_admin_user_id_list',
                'tags',
                'start_date',
                'community_status',
                'group_description'
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
      communityJSON.ratings_likes = await queryRatingLikes(community.community_chat_vls_id)
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
  
  let updatedCommunity = await updateCommunity(data, id, req.user)
  
  return { success: true, message: "Community updated successfully" , data : updatedCommunity}
}


/**
 * API for save community 
 */
async function updateCommunity(data, id, auth){

  data.tags          = JSON.stringify(data.tags)

  let community = await CommunityChat.findByPk(id)

  if(community){
    let updatedCommunity = await CommunityChat.update(data,{
      where : { community_chat_vls_id:id }
    })
    community = await CommunityChat.findByPk(id)
    //notification
    let notificatonData = {}
    notificatonData.branch_vls_id = community.branch_vls_id
    notificatonData.school_vls_id = community.school_vls_id
    notificatonData.status        = 'general'
    notificatonData.message       = '{name} updated a community.'
    notificatonData.notificaton_type = 'community'
    notificatonData.notificaton_type_id = community.community_chat_vls_id
    notificatonData.start_date    = community.start_date
    notificatonData.users         = community.user_list
    notificatonData.added_by      = auth.userVlsId
    notificatonData.added_type    = auth.role
    notificatonData.event_type    = 'updated'
    await Notification.create(notificatonData)
    notificatonData.users         = community.group_admin_user_id_list
    await Notification.create(notificatonData)
    //notification
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
async function addUsers(id, body , user){
  if(!body.user_list) throw 'user_list field is required'

  if(!Array.isArray(body.user_list)) throw 'user_list must be an array'
  let userList = body.user_list
  let data = {
      user_list : JSON.stringify(userList)
  }
  let oldCommunity = await CommunityChat.findByPk(id)
  let updatedUsers = await usersUpdated(oldCommunity.user_list , data.user_list)

  let chat  = await CommunityChat.update(data,{
    where : { community_chat_vls_id : id }
  })
//notification
  let notificatonData = {}
  let community = await CommunityChat.findByPk(id)
  
  notificatonData.branch_vls_id = community.branch_vls_id
  notificatonData.school_vls_id = community.school_vls_id
  notificatonData.status        = 'general'
  notificatonData.notificaton_type = 'community'
  notificatonData.notificaton_type_id = community.community_chat_vls_id
  notificatonData.start_date    = community.start_date
  notificatonData.added_by      = user.userVlsId
  notificatonData.added_type    = user.role
  
  if(updatedUsers.deletedUsers.length){
    let msg = updatedUsers.deletedUsers.length+' user'
    if(updatedUsers.deletedUsers.length > 1)
        msg = updatedUsers.deletedUsers.length+' users'

    notificatonData.event_type    = 'deleted'
    notificatonData.message = '{name} removed you from '+community.group_name+' community'
    notificatonData.users   = JSON.stringify(updatedUsers.deletedUsers)
    await Notification.create(notificatonData)
    if(updatedUsers.oldUsers.length){
      //for already user
      notificatonData.message = '{name} removed '+msg+' from '+community.group_name+' community'
      notificatonData.users   = JSON.stringify(updatedUsers.oldUsers)
      await Notification.create(notificatonData)
    }
  }
  if(updatedUsers.addedUsers.length){
    let msg = updatedUsers.addedUsers.length+' user'
    if(updatedUsers.addedUsers.length > 1)
        msg = updatedUsers.addedUsers.length+' users'

    notificatonData.event_type    = 'added'
    //for new user
    notificatonData.message = '{name} added you in '+community.group_name+' community'
    notificatonData.users   = JSON.stringify(updatedUsers.addedUsers)
    await Notification.create(notificatonData)
    if(updatedUsers.oldUsers.length){
      //for already user
      notificatonData.message = '{name} added '+msg+' in '+community.group_name+' community'
      notificatonData.users   = JSON.stringify(updatedUsers.oldUsers)
      await Notification.create(notificatonData)
    }
  }
  //notification

  let usersArray = await addUserList(userList);

  return { success: true, message: "Community user added successfully", users_list_details: usersArray }
}


/**
 * API for add community user 
 */
async function addAdmins(id, body, user){
  if(!body.admin_list) throw 'admin_list field is required'

  if(!Array.isArray(body.admin_list)) throw 'user_list must be an array'
    let userList = body.admin_list

    let data = {
        group_admin_user_id_list : JSON.stringify(userList)
    }

    let oldCommunity = await CommunityChat.findByPk(id)
    let updatedUsers = await usersUpdated(oldCommunity.group_admin_user_id_list , data.group_admin_user_id_list)

    let chat  = await CommunityChat.update(data,{
      where : { community_chat_vls_id : id }
    })
  //notification
    let notificatonData = {}
    let community = await CommunityChat.findByPk(id)
    
    notificatonData.branch_vls_id = community.branch_vls_id
    notificatonData.school_vls_id = community.school_vls_id
    notificatonData.status        = 'general'
    notificatonData.notificaton_type = 'community'
    notificatonData.notificaton_type_id = community.community_chat_vls_id
    notificatonData.start_date    = community.start_date
    notificatonData.added_by      = user.userVlsId
    notificatonData.added_type    = user.role
    notificatonData.event_type    = 'added'
    notificatonData.users         = community.group_admin_user_id_list

    if(updatedUsers.deletedUsers.length){
      let msg = updatedUsers.deletedUsers.length+' admin'
      if(updatedUsers.deletedUsers.length > 1)
          msg = updatedUsers.deletedUsers.length+' admin'

      notificatonData.event_type    = 'deleted'
      notificatonData.message = '{name} removed you from '+community.group_name+' community'
      notificatonData.users   = JSON.stringify(updatedUsers.deletedUsers)
      await Notification.create(notificatonData)
      if(updatedUsers.oldUsers.length){
        //for already user
        notificatonData.message = '{name} removed '+msg+' from  '+community.group_name+' community'
        notificatonData.users   = JSON.stringify(updatedUsers.oldUsers)
        await Notification.create(notificatonData)
      }
    }
    if(updatedUsers.addedUsers.length){
      let msg = updatedUsers.addedUsers.length+' admin'
      if(updatedUsers.addedUsers.length > 1)
          msg = updatedUsers.addedUsers.length+' admins'

      notificatonData.event_type    = 'added'
      notificatonData.message = '{name} added you as admin in '+community.group_name+' community'
      notificatonData.users   = JSON.stringify(updatedUsers.addedUsers)
      await Notification.create(notificatonData)
      if(updatedUsers.oldUsers.length){
        //for already user
        notificatonData.message = '{name} added '+msg+' in '+community.group_name+' community'
        notificatonData.users   = JSON.stringify(updatedUsers.oldUsers)
        await Notification.create(notificatonData)
      }
    }
    //notification
  
  let usersArray = await addUserList(userList);

  return { success: true, message: "Community addmins added successfully", admin_list_details: usersArray }

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
                attributes: [
                        ['faculty_vls_id','id'],
                        'name',
                        'photo',
                        'isPrincipal',
                        'isAdmin'
                      ]
              })
              dbUser = dbUser.toJSON()
              dbUser.type = "employee"
          break;
          case 'student' : 
              dbUser = await Student.findOne({
                where : { student_vls_id : user.id},
                attributes: [['student_vls_id','id'],'name','photo']
              })
              dbUser = dbUser.toJSON()
              dbUser.type = "student"
              dbUser.isPrincipal = null
              dbUser.isAdmin     = null
          break;
        }
        allUser.push(dbUser)
      })
  )
  return allUser
}


/**
 * function for get rating likes
 */
async function queryRatingLikes(communityId){
    //get query likes
     let likes =  await CommunityRatingLike.findOne({
              where : {
                community_chat_vls_id : communityId,
                likes : 1
              },
        attributes:[
          [ Sequelize.fn('SUM', Sequelize.col('likes')), 'likeCount' ]
        ]
     })
     let likesData = likes.toJSON()

     if(likesData.likeCount){
      likes = likesData.likeCount
     }else{
      likes = 0
     }
     //get query rating 
     let ratings =  await CommunityRatingLike.findOne({
              where : {
                community_chat_vls_id : communityId,
              },
        attributes:[
          [ Sequelize.fn('AVG', Sequelize.col('ratings')), 'ratingsCount' ] 
        ]
     })

     let ratingsData = ratings.toJSON()

     if(ratingsData.ratingsCount){
        ratings = ratingsData.ratingsCount
     }else{
      ratings = 0
     }

     return {likes , ratings}
}




/**
 * API for get ratings and likes
 */
async function getRatingLikes(id, user) {
  try{
    let avg = null;
    //get like count
    let like  = await CommunityRatingLike.count({
      where:{likes:1,community_chat_vls_id:id}
    })
    //get rating avg
    let ratings = await CommunityRatingLike.findOne({
      attributes: [
                    [ Sequelize.fn('SUM', Sequelize.col('ratings')), 'total_ratings' ],
                    [ Sequelize.fn('COUNT', Sequelize.col('ratings')), 'total_count' ]
                  ],
      where:{community_chat_vls_id:id},
      group:['community_chat_vls_id']
    })

    if(ratings){
    //get rating & likes
      let ratingData = ratings.toJSON();
      avg = parseInt(ratingData.total_ratings) / ratingData.total_count
    }

    userRating  = await CommunityRatingLike.findOne({
      attributes: ['ratings','likes'],
      where:{community_chat_vls_id:id,user_vls_id:user.userVlsId}
    })

    return { success:true, message:"Rating & like data",like:like,avg:avg,data:userRating};
  }catch(err){
    throw err.message
  }
};


/**
 * API for get admins list
 */
async function adminsList(user) {
  let userData =   await User.findOne({
              where : { auth_vls_id : user.id },
              attributes : ['branch_vls_id']
            })
  let branchId = userData. branch_vls_id
  
  let allAdmins = await Employee.findAll({
    where : { branch_vls_id : branchId},
    attributes : ['faculty_vls_id','isPrincipal','isAdmin','isTeacher','type','name']
  })
  return { success:true, message:"Admins list", data : allAdmins};
}

/**
 * API for get deleted user list
 */
async function usersUpdated(oldUsers , newUsers){
  let oldUsersArr  = JSON.parse(oldUsers)
  let newUsersArr  = JSON.parse(newUsers)

  var deletedUsers = oldUsersArr.filter(comparer(newUsersArr));
  var addedUsers = newUsersArr.filter(comparer(oldUsersArr));
  var oldUsers = newUsersArr.filter(comparer2(oldUsersArr));

  return { deletedUsers , addedUsers , oldUsers }
}


function comparer(otherArray){
  return function(current){
    return otherArray.filter(function(other){
      return other.id == current.id && other.type == current.type
    }).length == 0;
  }
}

function comparer2(otherArray){
  return function(current){
    return otherArray.filter(function(other){
      return other.id == current.id && other.type == current.type
    }).length == 1;
  }
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