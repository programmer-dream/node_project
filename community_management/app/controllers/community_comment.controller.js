const { validationResult } = require('express-validator');
const updateRewardsPoints = require('../../../helpers/update-rewards')
const db         = require("../../../models");
const moment     = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const imageThumbnail = require('image-thumbnail');
const fs       = require('fs')

const Op         = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const User       = db.Authentication;
const CommunityChat = db.CommunityChat;
const Student    = db.Student;
const Employee   = db.Employee;
const CommunityCommunication   = db.CommunityCommunication;
const config = require("../../../config/env.js");



module.exports = {
  create,
  list,
  update,
  view,
  deleteComment,
};

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
 * API for create new comment
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()
  //if(!req.user) throw 'User not found'
  let tokenUser = req.user
  if(req.files.file && req.files.file.length > 0){
      req.body.file_url  = req.body.uplodedPath + req.files.file[0].filename;
      req.body.file_type  = await isImage(req.files.file[0].originalname);

      if(req.body.file_type == 'image'){
        let options = { width: 150, height: 150 , responseType: 'base64'}  
        let dirpath = config.pdf_path+req.body.file_url

        const thumbnail = await imageThumbnail(dirpath, options);
        let imageBuffer = new Buffer(thumbnail, 'base64');

        let fileName = req.body.uplodedPath+"thumb_"+Date.now()+'.png';
        fs.writeFileSync(config.pdf_path+fileName, imageBuffer, 'utf8');

        req.body.image_thumbnail = fileName
      }

  }
  req.body.sender_user_vls_id = req.user.userVlsId
  req.body.sender_type        = req.user.role  
  req.body.reply_date         = moment().format('YYYY-MM-DD HH:mm:ss')
  
  let createdComment = await CommunityCommunication.create(req.body);

  if(createdComment){
      let commentEnable = { is_commented : 1} 
      await CommunityChat.update(commentEnable, {
        where : { community_chat_vls_id : createdComment.community_chat_vls_id}
      })

      if(req.user.role === 'student'){
          user  = await Student.findByPk(createdComment.sender_user_vls_id)
      }else{
          user  = await Employee.findByPk(createdComment.sender_user_vls_id)
      }
      if(user || user != null){
        user = {'name': user.name, 'photo': user.photo }
      }
    commentWithUser = createdComment.toJSON()
    commentWithUser.user = user
  }
    await updateRewardsPoints(tokenUser, 0.2, "increment")
  return { success: true, message: "Comment created successfully", data:commentWithUser }
  

};


/**
 * API for view comment
 */
async function view(id){
  let comment    = await CommunityCommunication.findByPk(id)           
  return { success: true, message: "View Comment details", data:comment }
};


/**
 * API for list comment according to school and student
 */
async function list(params){
  let community_chat_vls_id   = params.community_chat_vls_id
  if(!community_chat_vls_id) throw 'community_chat_vls_id is required'

  //start pagination
  let limit = 10
  let offset = 0
  let orderBy = 'desc';
  let whereCondition = {}
    whereCondition.community_chat_vls_id = community_chat_vls_id

  if(params.size)
     limit = parseInt(params.size)
  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit

  if(params.orderBy)
      orderBy = params.orderBy

  if(params.id){
    whereCondition.community_chat_communication_vls_id = {[Op.lt]: params.id}
    offset = 0
  }
  let count = await CommunityCommunication.count({
          where:whereCondition
  })
  let comments  = await CommunityCommunication.findAll({  
                      limit:limit,
                      offset:offset,
                      where:whereCondition,
                      order: [
                              ['community_chat_communication_vls_id', orderBy]
                      ]
                      });
  let comentWithUser = await setUsers(comments)

  return { success: true, message: "All Comment data", total : count, data:comentWithUser }
};


/**
 * set users to item array for query comments
 */
async function setUsers(comments){
  let comentWithUser = [];
  let user = null;

  await Promise.all(
      comments.map(async item => {
          item = item.toJSON();
          item.user = user
          if(item.sender_type === 'student'){
            user  = await Student.findByPk(item.sender_user_vls_id)
          }else{
            user  = await Employee.findByPk(item.sender_user_vls_id)
          }

          if(user || user != null){
            item.user = {'name': user.name, 'photo': user.photo }
          }

          comentWithUser.push(item)
      })
    );

  return comentWithUser;
}


/**
 * API for comment update 
 */
async function update(req){
  //start validation 
  let commentWithUser  = {}
  let id   = req.params.id
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  if(req.files.file && req.files.file.length > 0){
      req.body.file_url  = req.body.uplodedPath + req.files.file[0].filename;
  }

  req.body.user_vls_id = req.user.userVlsId
  req.body.user_type   = req.user.role
  let comment = await CommunityCommunication.findByPk(id)

  if(!comment) throw 'Comment not updated'

  let updateComment = await comment.update(req.body);

  if(updateComment){

      if(req.user.role === 'student'){
          user  = await Student.findByPk(comment.sender_user_vls_id)
      }else{
          user  = await Employee.findByPk(comment.sender_user_vls_id)
      }
      if(user || user != null){
        user = {'name': user.name, 'photo': user.photo }
      }
    }

    commentWithUser = comment.toJSON()
    commentWithUser.user = user

  return { success: true, message: "Comment updated successfully", data: commentWithUser }

};


/**
 * API for delete comment
 */
async function deleteComment(id) {
  let num = await CommunityCommunication.destroy({
      where: { community_chat_communication_vls_id: id }
    })

  if(num != 1) 
    throw 'Comment not found'

  return { success:true, message:"Comment deleted successfully!"}
  
};


/**
 * API for get today's date
 */
function formatDate() {
  var d = new Date(),
  month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
   year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
  return [year, month, day].join('-');
}