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
const StudentAssignment= db.StudentAssignment;

module.exports = {
  create,
  view,
  update,
  list,
  deleteAssignment,
  assignToStudents,
  createStudentAssignment,
  submitAssignment,
  changeAssignmentStatus
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
    assignmentData.assignment_completion_date = moment(assignmentData.assignment_completion_date).format('YYYY-MM-DD')
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

    let assingmentData = assignment.toJSON()
    let studentIds = JSON.parse(assingmentData.student_vls_ids)
    if(Array.isArray(studentIds) &&  studentIds.length > 0){
        let  students =  await Student.findAll({
              where :{ 
                student_vls_id :{ 
                  [Op.in]: studentIds }
                },
                attributes: ['student_vls_id','name','photo']
            })
        assingmentData.students = students
   }else{
      let whereCodition = { 
                class_id : assingmentData.assignment_class_id
                }
      if(assingmentData.assignment_class_id && assingmentData.assignment_class_id > 1)
          whereCodition.section_id = assingmentData.section_id

      let students =  await Student.findAll({
              where : whereCodition,
                attributes: ['student_vls_id','name','photo']
            })
        assingmentData.students = students
   }

   await Promise.all(
      assingmentData.students.map( async function (student, index){
          if(user.role == "student" && user.userVlsId != student.student_vls_id){
            assingmentData.students.splice(index, 1);
          }else{
            student = student.toJSON()
            student.status = "new"
            let studentAssignment = await StudentAssignment.findOne({
              where : {
                assignment_vls_id: assingmentData.assignment_vls_id,
                student_vls_id   : student.student_vls_id,
              }
            })

            if(studentAssignment)
              student.status = studentAssignment.assignment_status

            student.studentAssignment = studentAssignment
            assingmentData.students[index] = student
          }
      })
   );

  if(assingmentData.students.length <= 0) throw "You don't have access to this assignment"

  return { success: true, message: "Assignment view", data: assingmentData}
};


/**
 * API for assignment list
 */
async function list(params , user){
  let assignmentState  = params.assignmentState
  let class_id         = params.class_id

  if((user.role == 'branch-admin' || user.role == 'school-admin' || user.role == 'principal') && !class_id) 
    throw 'class_id is required'

  let userData = await User.findByPk(user.id)

  let currentDate = moment().format('YYYY-MM-DD')
  let start  = moment(currentDate+" 00:00").format('YYYY-MM-DD HH:MM')
  let end    = moment(currentDate+" 23:59").format('YYYY-MM-DD HH:MM')

  let whereCodition = {
    assignment_completion_date:{ [Op.between]: [start, end]}
  }
  if(params.section_id)
    whereCodition.section_id = params.section_id

  if(assignmentState == "past"){
    whereCodition.assignment_completion_date = { [Op.lt]: start }
  }else if(assignmentState == "upcoming"){
    whereCodition.assignment_completion_date = { [Op.gt]: end }
  }
  
  switch (user.role) {
    case 'teacher':
        whereCodition.added_by = user.userVlsId
      break;
    case 'student':
        let student = await Student.findByPk(user.userVlsId)
        if(student.section_id && student.section_id != '') 
          whereCodition.section_id = student.section_id
          
        whereCodition.assignment_class_id = student.class_id
      break;
    case 'branch-admin':
    case 'school-admin':
    case 'principal':
      whereCodition.assignment_class_id = class_id
      break;
  }

  let assignments = await Assignment.findAll({
    where : whereCodition,
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

  let finalAssignment = []
  await Promise.all(
    assignments.map(async assignment => {
        let assingmentData = assignment.toJSON()
        let studentIds = JSON.parse(assignment.student_vls_ids)
        if(Array.isArray(studentIds) &&  studentIds.length > 0){
            let  students =  await Student.findAll({
                  where :{ 
                    student_vls_id :{ 
                      [Op.in]: studentIds }
                    },
                    attributes: ['name','photo']
                })
            assingmentData.students = students
      }

      if(user.role == "student"){
          let studentAssignment = await StudentAssignment.findOne({
            where : {
              assignment_vls_id: assingmentData.assignment_vls_id,
              student_vls_id   : user.userVlsId,
            }
          })
        assingmentData.studentAssignment = studentAssignment
         if(!Array.isArray(studentIds) ||  studentIds.length < 0 ){
          finalAssignment.push(assingmentData)
         }else if(Array.isArray(studentIds) &&  studentIds.length > 0 &&studentIds.includes(user.userVlsId)){
            finalAssignment.push(assingmentData)
         }
      }else{
        finalAssignment.push(assingmentData)
      }

    })
  )
  return { success: true, message: "Assignment list", data: finalAssignment}
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

/**
 * API for submit student assignment
 */
async function createStudentAssignment(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

    let user = req.user
    if(user.role != 'student') throw 'unauthorised user'

    let assignmentData =  req.body
    let userData = await User.findByPk(user.id)

    assignmentData.student_vls_id    = user.userVlsId
    assignmentData.school_vls_id     = userData.school_id
    assignmentData.branch_vls_id     = userData.branch_vls_id
    assignmentData.assignment_status = 'Inprogress'
    
    let assignment     = await StudentAssignment.create(assignmentData)

    if(!assignment) throw 'Assignment status not updated'

    return { success: true, message: "Assignment Inprogress successfully", data:assignment }
};


/**
 * API for create new assignment
 */
async function submitAssignment(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

    let user = req.user
    if(user.role != 'student') throw 'unauthorised user'

    let studentId = user.userVlsId
    let assignmentData =  req.body
    let id = req.params.student_assignment_id

    let assignmentDa  = await StudentAssignment.findByPk(id)
    let submitDate = moment(assignmentDa.submission_date)

    if(submitDate.isBefore(moment().format('YYYY-MM-DD')))
        throw "Assignment can't be submitted after submission date"
    
    assignmentData.assignment_status = 'Submitted'

    if(req.body.uplodedPath){
      assignmentData.url  = req.body.uplodedPath + req.files.file[0].filename;
    }
    let assignment     = await StudentAssignment.update(assignmentData,
                            {
                              where : {
                                        student_assignment_id : id,
                                        student_vls_id:studentId
                                      }
                            })

    if(!assignment[0]) throw 'Assignment not found'

    return { success: true, message: "Assignment updated successfully"}
};


/**
 * API for create new assignment
 */
async function changeAssignmentStatus(params, user, body){
    if(user.role != 'teacher') throw 'unauthorised user'
    if(!body.assignment_status) throw 'assignment_status is required'
    let id = params.student_assignment_id

    let assignmentDa  = await StudentAssignment.findByPk(id)
    let assignmentData = {}
    assignmentData.assignment_status = body.assignment_status

    let assignment     = await StudentAssignment.update(assignmentData,
                            {
                              where : {
                                        student_assignment_id : id
                                      }
                            })

    if(!assignment[0]) throw 'Assignment not found'

    return { success: true, message: "Assignment updated successfully"}
};