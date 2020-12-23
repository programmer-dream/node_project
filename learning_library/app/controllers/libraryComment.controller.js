const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const LibraryComment = db.LibraryComment;
const Student = db.Student;
const Employee = db.Employee;
const LearningLibrary = db.LearningLibrary;

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
  try{
    const errors = validationResult(req);
    if(errors.array().length)
       return { success: false, message: errors.array() }
    if(!req.user) throw 'User not found'
    req.body.user_vls_id = req.user.userVlsId
    req.body.user_type   = req.user.role  

    let createdComment     = await LibraryComment.create(req.body);
    if(createdComment){
        let id   = req.body.learning_library_vls_id;
        let num  = await LearningLibrary.update({is_comment:1},{
                      where:{
                            learning_library_vls_id : id
                          }
                    });
    }
    return { success: true, message: "Comment created successfully", data:createdComment };
  }catch(err){
    return { success: false, message: err.message};
  }
};
/**
 * API for view comment
 */
async function view(id){
  let comment    = await LibraryComment.findByPk(id)           
  return { success: true, 
           message: "View Comment details", 
           data:comment 
         };
};
/**
 * API for list comment according to school and student
 */
async function list(params){
  let learningLibraryVlsId   = params.learningLibraryVlsId
  if(!learningLibraryVlsId) throw 'learningLibraryVlsId is required'

  //start pagination
  let limit = 10
  let offset = 0
  if(params.size)
     limit = parseInt(params.size)
  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit
  //end pagination
  let allCount  = await LibraryComment.count()

  let comments  = await LibraryComment.findAll({  
                      limit:limit,
                      offset:offset,
                      where:{learning_library_vls_id : learningLibraryVlsId},
                      attributes: ['branch_vls_id','learning_library_vls_id', 'comment_body', 'user_vls_id', 'school_vls_id', 'user_type']
                      });

  //let comentWithUser = []
  let comentWithUser = await setUsers(comments)

  return { success: true, message: "All Comment data", total:allCount, data:comentWithUser };
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
        }else{
          user  = await Employee.findByPk(item.user_vls_id)
        }

        if(user || user != null){
          item.user = {'name': user.name, 'photo': user.photo }
        }
        console.log(item, "item")
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
  const errors = validationResult(req);
  if(errors.array().length)
     return { success: false, message: errors.array() }
  //end validation
  let id   = req.params.id
  if(!req.user) throw 'User not found'
  req.body.user_vls_id = req.user.userVlsId
  req.body.user_type   = req.user.role
  let num              = await LibraryComment.update(req.body,{
                           where:{
                                  id : id
                                 }
                       });
  if(!num) throw 'Comment not updated'
      let comment = await LibraryComment.findByPk(id)
     
  return { success: true, 
           message: "Comment updated successfully", 
           data   : comment 
         };
};
/**
 * API for delete comment
 */
async function deleteComment(id) {
  let num = await LibraryComment.destroy({
      where: { id: id }
    })
  if(num != 1) throw 'Comment not found'
  return { success:true, message:"Comment deleted successfully!"};
  
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