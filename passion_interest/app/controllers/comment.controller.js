const { validationResult } = require('express-validator');
const db = require("../../../models");
const Op = db.Sequelize.Op;
const Sequelize     = db.Sequelize;
const PassionComment = db.PassionComment;
const Student       = db.Student;
const Employee      = db.Employee;
const PassionInterest        = db.PassionInterest;
const Guardian      = db.Guardian;

module.exports = {
  create,
  list,
  update,
  view,
  deleteComment,
};
/**
 * API for create new comment
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()
  if(!req.user) throw 'User not found'

  try{
    let commentWithUser  = {}
    req.body.user_vls_id = req.user.userVlsId
    req.body.user_type   = req.user.role  

    let createdComment = await PassionComment.create(req.body);

    if(createdComment){
        let id   = req.body.passion_vls_id;
        let num  = await PassionInterest.update({is_comment:1},{
                      where:{ passion_vls_id : id }
                    });

      if(req.user.role === 'student'){  
          user  = await Student.findByPk(createdComment.user_vls_id)
      }else if(req.user.role === 'guardian'){
          user  = await Guardian.findByPk(createdComment.user_vls_id)
      }else{
          user  = await Employee.findByPk(createdComment.user_vls_id)
      }

      if(user || user != null){
        user = {'name': user.name, 'photo': user.photo }
      }
    }

    commentWithUser = createdComment.toJSON()
    commentWithUser.user = user

    return { success: true, message: "Comment created successfully", data:commentWithUser }

  }catch(err){
    throw err.message
  }
};


/**
 * API for view comment
 */
async function view(id){

  let comment    = await PassionComment.findByPk(id)
  if(!comment) throw 'Comment not found' 

  return { success: true, message: "View Comment details", data:comment }
};


/**
 * API for list comment according to school and student
 */
async function list(params){
  if(!params.passion_vls_id) throw 'passion_vls_id is required'
   let passionId = params.passion_vls_id
  //start pagination
  let limit = 10
  let offset = 0
  let orderBy = 'desc';
  let whereCondition = {}
    whereCondition.passion_vls_id = passionId

  if(params.size)
     limit = parseInt(params.size)
  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit

  if(params.id){
    whereCondition.id = {[Op.lt]: params.id}
    offset = 0
  }
  
  //end pagination
  let allCount  = await PassionComment.count({ where: {passion_vls_id : passionId} })

  let comments  = await PassionComment.findAll({  
                      limit:limit,
                      offset:offset,
                      where:whereCondition,
                      order: [
                              ['id', orderBy]
                      ],
                      attributes: [
                          'id',
                          'branch_vls_id',
                          'passion_vls_id', 
                          'comment_body', 
                          'user_vls_id', 
                          'school_vls_id', 
                          'user_type', 
                          'created_at'
                        ]
                      });

  let comentWithUser = await setUsers(comments)

  return { success: true, message: "All Comment data", total:allCount, data:comentWithUser }
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
          if(item.user_type === 'student'){
            user  = await Student.findByPk(item.user_vls_id)
          }else if(item.user_type === 'guardian'){
            user  = await Guardian.findByPk(item.user_vls_id)
          }else{
            user  = await Employee.findByPk(item.user_vls_id)
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
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  let id   = req.params.id
  if(!req.user) throw 'User not found'
  
  req.body.user_vls_id = req.user.userVlsId
  req.body.user_type   = req.user.role
  
  let num = await PassionComment.update(req.body,{
                     where:{ id: id }
                 });

  if(!num) throw 'Comment not updated'
  
  let comment = await PassionComment.findByPk(id)
     
  if(comment){
      if(req.user.role === 'student'){
          user  = await Student.findByPk(comment.user_vls_id)
      }else if(req.user.role === 'guardian'){
          user  = await Guardian.findByPk(comment.user_vls_id)
      }else{
          user  = await Employee.findByPk(comment.user_vls_id)
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
  let num = await PassionComment.destroy({
      where: { id: id }
    })

  if(num != 1) 
    throw 'Comment not found'

  return { success:true, message:"Comment deleted successfully!"}
  
};
