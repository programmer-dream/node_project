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


module.exports = {
  create,
  view,
  list,
  update,
  deleteCommunity,
  addUsers,
  addAdmins,
  getRatingLikes
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

  let userCommunity   = await CommunityChat.findByPk(id)

  if(!userCommunity) throw 'Community not found'

  let communityJSON   = userCommunity.toJSON()

  let userList   = JSON.parse(userCommunity.user_list)
  let adminsList = JSON.parse(userCommunity.group_admin_user_id_list)

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
      where:{likes:1,query_vls_id:id}
    })
    //get rating avg
    let ratings = await CommunityRatingLike.findOne({
      attributes: [
                    [ Sequelize.fn('SUM', Sequelize.col('ratings')), 'total_ratings' ],
                    [ Sequelize.fn('COUNT', Sequelize.col('ratings')), 'total_count' ]
                  ],
      where:{query_vls_id:id},
      group:['query_vls_id']
    })

    if(ratings){
    //get rating & likes
      let ratingData = ratings.toJSON();
      avg = parseInt(ratingData.total_ratings) / ratingData.total_count
    }

    userRating  = await CommunityRatingLike.findOne({
      attributes: ['ratings','likes'],
      where:{query_vls_id:id,user_vls_id:user.userVlsId}
    })

    return { success:true, message:"Rating & like data",like:like,avg:avg,data:userRating};
  }catch(err){
    throw err.message
  }
};
