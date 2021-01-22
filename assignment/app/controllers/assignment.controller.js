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
const Assignment = db.Assignment;
const Classes    = db.Classes;
const SubjectList= db.SubjectList;

module.exports = {
  create,
  view,
  update,
  list,
  deleteAssignment,
  assignToStudents
};


/**
 * API for create new assignment
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

    if(!req.files.file) throw 'Please attach a file'

    let user = req.user
    let assignmentData =  req.body
    assignmentData.added_by  = user.userVlsId
    assignmentData.user_role = user.role
    assignmentData.assignment_date = moment()
    assignmentData.url  = req.body.uplodedPath + req.files.file[0].filename;
    
  	let assignment 		 = await Assignment.create(assignmentData)

  	if(!assignment) throw 'Assignment not created'

  	return { success: true, message: "Assignment created successfully", data:assignment }
};


/**
 * API for assignment view
 */
async function view(params , user){
  let assignment = await Assignment.findOne({
    where : {assignment_vls_id:params.id},
    include: [{ 
                model:Employee,
                as:'addedBY',
                attributes: ['name','photo']
            },
            { 
                model:Classes,
                as:'class',
                attributes: ['name']
            },{ 
                model:SubjectList,
                as:'subjectList',
                attributes: ['subject_name']
            }]
  })

  if(!assignment) throw 'Assignment not found'

  return { success: true, message: "Assignment view", data: assignment}
};


/**
 * API for assignment list
 */
async function list(params , user){

  let assignment = await Assignment.findAll({
    where : {added_by : user.userVlsId},
    include: [{ 
                model:Employee,
                as:'addedBY',
                attributes: ['name','photo']
            },{ 
                model:Classes,
                as:'class',
                attributes: ['name']
            },{ 
                model:SubjectList,
                as:'subjectList',
                attributes: ['subject_name']
            }]
  })

  return { success: true, message: "Assignment list", data: assignment}
};


/**
 * API for assignment update 
 */
async function update(req){
  	const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

    let user                 = req.user
    let assignmentData       = req.body
    assignmentData.added_by  = user.userVlsId
    assignmentData.user_role = user.role
    assignmentData.assignment_completion_date = moment(assignmentData.assignment_completion_date).format('YYYY-MM-DD')
    if(req.body.uplodedPath){
      assignmentData.url     = req.body.uplodedPath + req.files.file[0].filename;
    }

	 let assignment        = await Assignment.update(assignmentData,{
              						  where : 
                                { assignment_vls_id:req.params.id }
              						  })
   
  	if(!assignment[0]) throw 'Assignment not updated'
       assignment  = await Assignment.findByPk(req.params.id)

  	return { success: true, message: "Assignment updated successfully", data:assignment }
};


/**
 * API for assignment delete 
 */
async function deleteAssignment(assignmentId, user){
  let assignment  = await Assignment.destroy({
				    where: { assignment_vls_id: assignmentId }
				  })

  if(!assignment) throw 'Assignment Not found'
  return { success: true, message: "Assignment deleted successfully" }
};


/**
 * API for assignment assign to student  
 */
async function assignToStudents(req){
  let user       = req.user
  let id         = req.params.id
  let studentIds = req.body.studentIds
  if(!req.body.studentIds) throw 'studentIds is required'
    let arrStr = JSON.stringify(req.body.studentIds)
    let asingedStudents = { student_vls_ids : arrStr}
  
    //return asingedStudents
    let assignment  = await Assignment.update(asingedStudents,{
            where: { assignment_vls_id: id }
          })

  if(!assignment) throw 'Assignment Not found'
      assignment  = await Assignment.findByPk(id)

  return { success: true, message: "Assignment assigned to student successfully" ,data : assignment}
};