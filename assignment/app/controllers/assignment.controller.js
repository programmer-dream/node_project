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
const AssignmentQuestions= db.AssignmentQuestions;
const StudentAssignmentResponse= db.StudentAssignmentResponse;

module.exports = {
  create,
  view,
  update,
  list,
  deleteAssignment,
  assignToStudents,
  createStudentAssignment,
  submitAssignment,
  changeAssignmentStatus,
  createAssignmentQuestion,
  updateQuestion,
  deleteQuestion,
  questionResponse,
  updateMarks,
  releaseAssignment,
  dashboardData
};


/**
 * API for create new assignment
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

    let assignmentData =  req.body
    
    if(req.files.file && req.files.file.length > 0){
        assignmentData.url  = req.body.uplodedPath + req.files.file[0].filename;
    }

    let user = req.user
    assignmentData.added_by  = user.userVlsId
    assignmentData.user_role = user.role
    assignmentData.assignment_date = moment()
    assignmentData.assignment_completion_date = moment(assignmentData.assignment_completion_date).format('YYYY-MM-DD')
    
  	let assignment 		 = await Assignment.create(assignmentData)

  	if(!assignment) throw 'Assignment not created'

  	return { success: true, message: "Assignment created successfully", data:assignment }
};


/**
 * API for assignment view
 */
async function view(params , user){
  let whereCodition = { assignment_vls_id:params.id }

  if(user.role == 'teacher' )
    whereCodition.added_by = user.userVlsId

  if(user.role == 'student' || user.role == 'guardian')
    whereCodition.is_released = 1

  let assignment = await Assignment.findOne({
    where : whereCodition,
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
            },{ 
                model:AssignmentQuestions,
                as:'assignmentQuestion',
                attributes: ['assignment_question_id',
                              'question_type',
                              'question',
                              'assessment',
                              'choice1',
                              'choice2',
                              'choice3',
                              'choice4',
                            ]
            }]
  })

  if(!assignment) throw 'Assignment not found'

    let assingmentData = assignment.toJSON()
    //start add question array 
      let assignmentQuestion = assingmentData.assignmentQuestion
      assignmentQuestion.forEach(function(item, index){
        if(item.question_type != 'form') {
          let optionArr =  [];
          for(let i = 1; i <=4; i++){
            let option = assingmentData.assignmentQuestion[index]['choice'+i]
            if(option)
              optionArr.push(option)
          }
          assingmentData.assignmentQuestion[index]['options'] = optionArr
        }
      })
      //end add question array
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
      if(assingmentData.section_id && assingmentData.section_id > 1)
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
            let include = []
            let isAssignmentInProcess = await StudentAssignment.findOne({
              where : {
                assignment_vls_id: assingmentData.assignment_vls_id,
                student_vls_id   : student.student_vls_id,
                assignment_status : {
                  [Op.ne] : 'Inprogress'
                }
              }
            })

            if(user.role == "student" || isAssignmentInProcess ){
              include = [{ 
                          model:StudentAssignmentResponse,
                          as:'questionResponse',
                          where : { 
                            student_id : {
                              [Op.or]: [student.student_vls_id]
                            }
                          },
                          required:false
                        }]
            }
            student = student.toJSON()
            student.status = "New"
            let studentAssignment = await StudentAssignment.findOne({
              where : {
                assignment_vls_id: assingmentData.assignment_vls_id,
                student_vls_id   : student.student_vls_id
              },
              include: [{ 
                    model:AssignmentQuestions,
                    as:'assignmentQuestionResponse',
                    include: include
                }]
            })

            if(studentAssignment)
              student.status = studentAssignment.assignment_status

            student.studentAssignment = studentAssignment
            assingmentData.students[index] = student
          }
      })
   );

  if( (user.role == 'student' || user.role == 'guardian') && assingmentData.students.length <= 0) throw "You don't have access to this assignment"

  return { success: true, message: "Assignment view", data: assingmentData}
};


/**
 * API for assignment list
 */
async function list(params , user){
  let assignmentState  = params.assignmentState
  let class_id         = params.class_id
  let studentID        = user.userVlsId
  let search           = ""

  if(user.role == 'guardian')
    studentID = params.student_id

  if((user.role == 'branch-admin' || user.role == 'school-admin' || user.role == 'principal') && !class_id) 
    throw 'class_id is required'

  if(user.role == 'guardian' && !studentID) 
    throw 'student_id is required'


  let userData = await User.findByPk(user.id)

  let currentDate = moment().format('YYYY-MM-DD')

  let whereCodition = {
    [Op.eq]: sequelize.where(sequelize.fn('date', sequelize.col('assignment_completion_date')), '=', currentDate)  
  }
  
  if(assignmentState == "past"){
    whereCodition = {
      [Op.lt]: sequelize.where(sequelize.fn('date', sequelize.col('assignment_completion_date')), '<', currentDate)
    }
  }else if(assignmentState == "upcoming"){
    whereCodition = {
      [Op.gt]: sequelize.where(sequelize.fn('date', sequelize.col('assignment_completion_date')), '>', currentDate)
    }
  }

  if(params.section_id)
    whereCodition.section_id = params.section_id

  if(params.subject_code)
    whereCodition.subject_code = params.subject_code

  if(params.serach)
    search = params.search

  whereCodition[Op.or] = { 
                  description: { 
                    [Op.like]: `%`+search+`%`
                  },
                  title : { 
                    [Op.like]: `%`+search+`%` 
                  }
                }

  let student = {}
  switch (user.role) {
    case 'teacher':
        whereCodition.added_by = user.userVlsId
      break;
    case 'student':
    case 'guardian':
        student = await Student.findByPk(studentID)
        whereCodition.assignment_class_id = student.class_id
        whereCodition.is_released = 1
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
            },{ 
                model:AssignmentQuestions,
                as:'assignmentQuestion',
                attributes: ['assignment_question_id',
                              'question_type',
                              'question',
                              'assessment',
                              'choice1',
                              'choice2',
                              'choice3',
                              'choice4',
                            ]
            }]
  })

  let finalAssignment = []
  await Promise.all(
    assignments.map(async assignment => {
        let assingmentData = assignment.toJSON()
        let studentIds = JSON.parse(assignment.student_vls_ids)
        //start add question array 
        let assignmentQuestion = assingmentData.assignmentQuestion
        assignmentQuestion.forEach(function(item, index){
          if(item.question_type != 'form') {
            let optionArr =  [];
            for(let i = 1; i <=4; i++){
              let option = assingmentData.assignmentQuestion[index]['choice'+i]
              if(option)
                optionArr.push(option)
            }
            assingmentData.assignmentQuestion[index]['options'] = optionArr
          }
        })
        //end add question array 
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

      if(user.role == "student" || user.role == "guardian"){
          if(!assignment.section_id || (assignment.section_id && assignment.section_id == student.section_id) ){
              let studentAssignment = await StudentAssignment.findOne({
                where : {
                  assignment_vls_id: assingmentData.assignment_vls_id,
                  student_vls_id   : student.student_vls_id,
                }
              })
            assingmentData.studentAssignment = studentAssignment
             if(!Array.isArray(studentIds) ||  studentIds.length < 0 ){
              finalAssignment.push(assingmentData)
             }else if(Array.isArray(studentIds) &&  studentIds.length > 0 && studentIds.includes(user.userVlsId)){
                finalAssignment.push(assingmentData)
             }
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

    let assignmentCheck = await StudentAssignment.findOne({
                            where:{
                              student_vls_id    : user.userVlsId,
                              assignment_vls_id : assignmentData.assignment_vls_id
                            }
                          })

    if(assignmentCheck && assignmentCheck.assignment_vls_id) throw "Assignment already Inprogress"

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
    let statusArray = ['ValidationInprogress','Approved','Rejected','Closed']

    if(!statusArray.includes(body.assignment_status))
      throw "assignment_status should be only ValidationInprogress, Approved, Rejected or Closed "

    let assignmentDa  = await StudentAssignment.findByPk(id)
    let assignmentData = {}
    assignmentData = body

    let assignment     = await StudentAssignment.update(assignmentData,
                            {
                              where : {
                                        student_assignment_id : id
                                      }
                            })

    if(!assignment[0]) throw 'Assignment not found'

    return { success: true, message: "Assignment updated successfully"}
};


/**
 * API for create assignment questions
 */
async function createAssignmentQuestion(req){
  let allQuestion  =  req.body
  let assingmentId = req.params.assignment_vls_id

  await Promise.all(
    allQuestion.map(async (question, qIndex) => {
        allQuestion[qIndex]['assignment_vls_id'] = assingmentId

        if(!question.question)
            throw 'Question field is required'

        if(!question.question_type)
            throw 'question_type field is required'

        if(!question.assessment)
            throw 'Question assessment field is required'

        if(question.question_type !='form' ){
            let allChoice = question.choices
            delete allQuestion[qIndex]['choices']

            if(allChoice.length < 2)
                throw 'Atleast two Question choices are required'
            if(allChoice.length > 4)
                throw 'Maximum four Question choices are required'

            let count = 1
            allChoice.forEach(function (item, index){
                allQuestion[qIndex]['choice'+count] = item
                count++
            })
        }
    })
  )
  
  let AssignQuest = await AssignmentQuestions.bulkCreate(allQuestion)

  if(!AssignQuest) throw 'Assignment Question not created'

  return { success: true, message: "Assignment Question created successfully", data:AssignQuest }
};


/**
 * API for update question 
 */
async function updateQuestion(req){
    const errors = validationResult(req);
  if(errors.array().length) throw errors.array()
    
   let questionData   = req.body

   if(questionData.question_type !='form' ){
        let allChoice = questionData.choices
        if(!Array.isArray(allChoice))
            throw 'Question choices are must be an array'
          
        delete questionData['choices']
        if(allChoice.length < 2)
            throw 'Atleast two Question choices are required'
        if(allChoice.length > 4)
            throw 'Maximum four Question choices are required'
        let count = 1
          allChoice.forEach(function (item, index){
              questionData['choice'+count] = item
              count++
          })
        
    }
   let question       = await AssignmentQuestions.update(questionData,
                            {
                            where : 
                                { assignment_question_id:req.params.id }
                            })
   
    if(!question[0]) throw 'Assignment question not updated'
       question  = await AssignmentQuestions.findByPk(req.params.id)

    return { success: true, message: "Assignment Question updated successfully", data:question }
};


/**
 * API for delete question 
 */
async function deleteQuestion(questionId){

  let question  = await AssignmentQuestions.destroy({
            where: { assignment_question_id: questionId }
          })

  if(!question) throw 'Question Not found'
  return { success: true, message: "Question deleted successfully" }
}


/**
 * API for assignment question response 
 */
async function questionResponse(req){
    const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  let studentId    = req.user.userVlsId
  let allQuestion  =  req.body
  let role         = req.user.role
  if(role != 'student') throw 'unauthorised user'

  if(allQuestion.length <= 0 ) throw 'Question body must be an array'

  await Promise.all(
    allQuestion.map(async (question, qIndex) => {
        let response = question.response
        if(!question.question_id)
            throw 'question_id field is required'

        if(!question.question_type)
            throw 'question_type field is required'

        if(!question.response)
            throw 'response field is required'

        if(!question.assignment_vls_id)
            throw 'assignment_vls_id field is required'

        if(question.question_type !='form' ){
            if(Array.isArray(response)){
              response = JSON.stringify(response)
              console.log(response)
            }
        }
        allQuestion[qIndex].response   = response
        allQuestion[qIndex].student_id = studentId
    })
  )

  let deleted  = await StudentAssignmentResponse.destroy({
            where: { 
                assignment_vls_id :  allQuestion[0].assignment_vls_id,
                student_id : studentId
            }
          })
  
  let questionResponse = await StudentAssignmentResponse.bulkCreate(allQuestion)

  if(!questionResponse) throw 'Assignment Question response created'

  return { success: true, message: "Assignment Question response created successfully", data:questionResponse }
};


/**
 * API for update marks
 */
async function updateMarks(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

    let user          = req.user
    if(user.role != 'teacher') throw 'unauthorised user'

    let allAssessment = req.body
    let totalMarks    = 0
    let assignmentId  = 0
    let student_id  = 0
    await Promise.all(
      allAssessment.map(async assessment => { 
          if(!assessment.assignment_id)
            throw 'assignment_id field is required'
          if(!assessment.question_id)
            throw 'question_id field is required'
          if(!assessment.marks)
            throw 'marks field is required'
          if(!assessment.student_vls_id)
            throw 'student_vls_id field is required'

          assignmentId = assessment.assignment_id
          student_id   = assessment.student_vls_id
          totalMarks  += parseInt(assessment.marks)
          let marks    = { assessment : assessment.marks}
          
          await StudentAssignmentResponse.update(marks,{
            where : {
                  assignment_vls_id : assignmentId,
                  question_id       : assessment.question_id,
                  student_id        : student_id
            }
          })
      })
    )
    let studentAssessment = { assessment : totalMarks }
    
    await StudentAssignment.update(studentAssessment, {
        where : {
            student_vls_id : student_id,
            assignment_vls_id : assignmentId
        }
    })
    return { success: true, message: "marks updated successfully"}
};


/**
 * API for release assignment
 */
async function releaseAssignment(body){
    let assignmentData = { is_released : body.is_released }
    let assignment = await Assignment.findByPk(body.assignment_id)
    if(!assignment) throw 'Assignment not found'

    await assignment.update(assignmentData);

    return { success: true, message: "Assignment updated successfully"}
}


/**
 * API for current Week assignment
 */
async function dashboardData(user , params){
  if(!params.branch_vls_id ) throw 'branch_vls_id is required'
  let currentDate = moment().format('YYYY-MM-DD')
  let afterSevenDays = moment().add(7, 'days').format('YYYY-MM-DD');
  
  let whereCodition = {
      [Op.and]: [
                sequelize.where(sequelize.fn('date', sequelize.col('assignment_completion_date')), '>=', currentDate),
                sequelize.where(sequelize.fn('date', sequelize.col('assignment_completion_date')), '<=', afterSevenDays),
            ]
  }
  whereCodition.is_released = 1
  switch (user.role) {
    case 'teacher':
        whereCodition.added_by = user.userVlsId
      break;
    case 'guardian':
        let students = await Student.findAll({
          where : { parent_vls_id : user.userVlsId,
                    branch_vls_id : params.branch_vls_id
                  },
          attributes: ['class_id']

        }).then(students => students.map( student => student.class_id));
        whereCodition.assignment_class_id = { [Op.in] : students }
      break;
    case 'student':
        student = await Student.findByPk(user.userVlsId)
        whereCodition.assignment_class_id = student.class_id
      break;
    case 'branch-admin':
    case 'school-admin':
    case 'principal':
      return await getAssignmentCount(params)
      break;
  }
  
  let assignments = await Assignment.findAll({
    where : whereCodition,
    limit: 5,
    include: [{ 
                model:SubjectList,
                as:'subjectList',
                attributes: ['subject_name']
            },{ 
                model:Classes,
                as:'class',
                attributes: ['name']
            }]
  })

  return { success: true, message: "Assignment dashboard data current week", data: assignments} 
}

/**
 * API for current Week assignment
 */
async function getAssignmentCount(params){
  let branchId = params.branch_vls_id

  let startMonth = moment().startOf('month').format('YYYY-MM-DD');
  let endMonth   = moment().endOf('month').format('YYYY-MM-DD');
  
  let whereCodition = {
      [Op.and]: [
                sequelize.where(sequelize.fn('date', sequelize.col('assignment_date')), '>=', startMonth),
                sequelize.where(sequelize.fn('date', sequelize.col('assignment_date')), '<=', endMonth),
            ]
  }
  whereCodition.branch_vls_id = branchId
  let created = await Assignment.count({
    where : whereCodition
  })

  whereCodition.is_released = 1
  let released = await Assignment.count({
    where : whereCodition
  })
  let data = { created , released }
  return { success: true, message: "Assignment dashboard data current month", data }
}