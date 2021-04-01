const { validationResult } = require('express-validator');
const {updateRewardsPoints , getUserRewardsPoint, updateReedeemPoint} = require('../../../helpers/update-rewards')
const db 	 	     = require("../../../models");
const moment 	   = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const exceljs    = require('exceljs')
const Op 	 	     = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const User       = db.Authentication;
const Employee   = db.Employee;
const sequelize  = db.sequelize;
const SchoolDetails= db.SchoolDetails;
const Branch  		 = db.Branch;
const Role         = db.Role;
const PassionInterest  = db.PassionInterest;
const PassionComment   = db.PassionComment;
const Student          = db.Student;
const Notification     = db.Notification;
const PassionAcceptedBy= db.PassionAcceptedBy;


module.exports = {
  create,
  view,
  list,
  update,
  deletePassion,
  acceptBlog
};


/**
 * API for create passion
 */
async function create(req){
  let passionArray = {}
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  if(req.body.passion_type)
      req.body.passion_type = JSON.stringify(req.body.passion_type)

  if(req.body.passion_type !=""){
     passionArray = JSON.parse(req.body.passion_type)
  }
  let user                = req.user
  let passion_data        = req.body
  passion_data.added_by   = user.userVlsId
  passion_data.user_type  = user.role
  
  let passionInterest = await PassionInterest.create(passion_data)

  if(Array.isArray(passionArray)){
    let assignedStudent = await getStudents(passionArray)
    //create notification 
    let notificatonData           = {}
    notificatonData.status        = 'general'
    notificatonData.message       = '{name} created new blog.'
    notificatonData.notificaton_type = 'blog'
    notificatonData.notificaton_type_id = passionInterest.passion_vls_id
    notificatonData.start_date    = moment().format('YYYY-MM-DD HH:mm:ss')
    notificatonData.users         = JSON.stringify(assignedStudent)
    notificatonData.added_by      = user.userVlsId
    notificatonData.added_type    = user.role
    notificatonData.event_type    = 'created'
    await Notification.create(notificatonData)
  }

  return { success: true, message: "Passion created successfully", data : passionInterest}
};


/**
 * API for view Passion
 */
async function view(id, user){
	let passionInterest = await PassionInterest.findByPk(id);

  let accepted = await isAccepted(id , user)
    
  passionInterest = passionInterest.toJSON()
  passionInterest.is_accepted = accepted

	return { success: true, message: "Passion view", data : passionInterest }
}


/**
 * API for list Passion
 */
async function list(params , user){
	let limit   = 10
	let offset  = 0
	let orderBy = 'desc';
	let search  = ''
  let authUser = await User.findByPk(user.userVlsId)
  let allPassions = []

  if(params.search) 
     search = params.search

  let whereCondition = {
      [Op.or]:{
                passion_name: { 
                  [Op.like]: `%`+search+`%`
                },
                description : { 
                  [Op.like]: `%`+search+`%` 
                }
           }
    };

  let interestArr
  if(user.role == 'student'){
     let student = await Student.findOne({
      where : { student_vls_id : user.userVlsId },
      attributes: ['interest']
     })
     student = student.toJSON()
     if(student.interest != ''){
       interestArr = JSON.parse(student.interest)

       let orArray = []
       interestArr.forEach(function (passion){
          orArray.push(Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('passion_type')), 'LIKE', '%'+passion+'%'))
       })

       whereCondition.passion_type = {
          [Op.or]:orArray
        }
    }
  }
  
  
  if(params.passion_type)
     whereCondition.passion_type = params.passion_type

	if(params.orderBy == 'asc') 
	 	 orderBy = params.orderBy

	if(params.size)
	 	 limit = parseInt(params.size)

	if(params.page)
	   offset = 0 + (parseInt(params.page) - 1) * limit
  
	let passions = await PassionInterest.findAll({
		limit : limit,
	    offset: offset,
	    where : whereCondition,
	    order : [
	             ['passion_vls_id', orderBy]
	            ]
            });

  await Promise.all(
      passions.map(async passion => {
        passion = passion.toJSON()
        passion.is_accepted = await isAccepted(passion.passion_vls_id , user)
        allPassions.push(passion)
      })
  )

  allPassions.sort(function(a,b) {
    return b.passion_vls_id - a.passion_vls_id;
  });

	return { success: true, message: "Passion listing", data : allPassions}
}


/**
 * API for update Passion
 */
async function update(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  let passionId    = req.params.id
  
  passion = await PassionInterest.findByPk(passionId);

  if(req.body.passion_type)
      req.body.passion_type = JSON.stringify(req.body.passion_type)

  let passion_data = req.body

  if(!passion) throw 'Passion and interst not found'
      
  passion.update(passion_data)

  return { success: true, message: "Passion updated successfully", data : passion }
};


/**
 * API for delete Passion
 */
async function deletePassion(id){

	let passion = await PassionInterest.findByPk(id);
	if(!passion) throw 'Passion and interst not found'

  //delete all comment
  await PassionComment.destroy({
    where:{ passion_vls_id:  passion.passion_vls_id}
  });

	passion.destroy();

	return { success: true, message: "Passion deleted successfully"}
}


/**
 * API for get interested student 
 */
async function getStudents(passionArr){
    let allStudent = []
    let allStudents = []
    await Promise.all(
      passionArr.map(async search => {
         let students = await Student.findAll({
          where : {[Op.or] : { interest: { [Op.like]: `%`+search+`%` } } }
         }).then(students => students.map( students => students.student_vls_id))

         allStudent = allStudent.concat(students)
      })
    )
    uniqueIds = allStudent.filter(function(elem, pos) {
      return allStudent.indexOf(elem) == pos;
    })

    await Promise.all(
      uniqueIds.map(async id => {
        allStudents.push({id : id, type : "student" })
      })
    )

    return allStudents
}


/**
 * API for is accpeted check 
 */
async function isAccepted(passionId , user){
    let isAccepted = await PassionAcceptedBy.findOne({
      where : { passion_vls_id  : passionId, 
                user_vls_id : user.userVlsId,
                user_type : user.role
              }
    })

    if(isAccepted) return true

    return false
}

/**
 * API for accept blog 
 */
async function acceptBlog(body , user){
    if(!body.passion_vls_id) throw 'passion_vls_id is required'

    let isAccepted = await PassionAcceptedBy.findOne({
      where : { passion_vls_id  : body.passion_vls_id, 
                user_vls_id : user.userVlsId,
                user_type : user.role
              }
    })

    if(isAccepted) throw 'you already accepted this blog'

    isAccepted = await PassionAcceptedBy.create(
      { passion_vls_id  : body.passion_vls_id, 
        user_vls_id : user.userVlsId,
        user_type : user.role
      }
    )

    return { success: true, message: "Passion accepted successfully",data:isAccepted} 
}
