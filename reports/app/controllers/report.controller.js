const { validationResult } = require('express-validator');
const db 	 	 = require("../models");
const moment 	 = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const mailer     = require('../helper/nodemailer')
const Op 	 	 = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const Exams      = db.Exams;
const Marks      = db.Marks;
const Student    = db.Student;
const Subject    = db.Subject;
const SubjectList    = db.SubjectList;
const Authentication = db.Authentication;
const AcademicYear   = db.AcademicYear;
const Guardian   	 = db.Guardian;
const Classes   	 = db.Classes;
const StudentAttendance = db.StudentAttendance;


module.exports = {
  list,
  getExamMarks,
  dashboardList,
  sendExamResult,
  sendAttendanceResult,
  subjectPerformance,
  classPerformance
};


/**
 * API for list exams
 */
async function list(params , user){
  let authentication = await Authentication.findByPk(user.id)
  let branchId       = authentication.branch_vls_id

  let whereConditions = {
  	branch_vls_id : branchId
  }

  let joinWhere = {}
  if(user.role == 'student'){
  	 let student = await Student.findByPk(user.userVlsId)

  	 joinWhere.class_id            = student.class_id
  	 joinWhere.student_id          = user.userVlsId
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

  let exams = await Exams.findAll({
			  	limit  : limit,
			    offset : offset,
			    where : whereConditions,
			    order : [
			             ['test_id', orderBy]
			            ],
			    include: [{ 
	                model:Marks,
	                as:'marks',
	                where : joinWhere,
	                attributes:['id']
	            }]
			  	
  	})

  return { success: true, message: "Exam list", data : exams}	    
};

/**
 * API for get marks
 */
async function getExamMarks(params , user , query){
	let id = params.id
	let whereConditions = { exam_id : id}
	let includeArray = [{ 
			                model:SubjectList,
			                as:'subject',
			                attributes: ['subject_name'],
			                
			              }
	            	    ]
  	if(user.role == 'student'){
	  	let student = await Student.findByPk(user.userVlsId)
	  	
	  	whereConditions.class_id   = student.class_id
	  	whereConditions.student_id = user.userVlsId
  	}else{

  		if(!query.class_id) throw 'class_id is required'	
  			whereConditions.class_id   = query.class_id

  		if(query.section_id) 
  			whereConditions.section_id   = query.section_id

  		if(query.student_id) 
  			whereConditions.student_id   = query.student_id

  		studentInclude = { 
					        model:Student,
					        as:'student',
					        attributes: ['name','photo']
					    }
		includeArray.push(studentInclude)
  	}

	let subjectMarks = await Marks.findAll({
		where : whereConditions,
		include: includeArray
	})

	let overallMarks = await Marks.findOne({
		where : whereConditions,
		 attributes: [
		 	[ Sequelize.fn('SUM', Sequelize.col('exam_total_mark')), 'total_marks' ],
		 	[ Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'obtain_marks' ]
		 ]
	})
	
	let marks = overallMarks.toJSON()

	let total_marks  = parseInt(marks.total_marks)
	let obtain_marks = parseInt(marks.obtain_marks)
	let percentage   = parseFloat(obtain_marks * 100 / total_marks).toFixed(2)

	let final_marks = {
		total_marks : marks.total_marks,
		obtain_marks : marks.obtain_marks,
		percentage : percentage
	}
	
	return { success: true, message: "Exam list", data : {final_marks,subjectMarks}
	}
}


/**
 * API for list exams
 */
async function dashboardList(params , user){

  if(user.role != 'student'){
  	return response = await classPerformance(params, user)
  }

  let authentication = await Authentication.findByPk(user.id)
  let branchId       = authentication.branch_vls_id

  //acadminc year
  let academicYear  = await AcademicYear.findOne({
	                where:{school_id:authentication.school_id},
	                order : [
			             ['id', 'desc']
			            ]
	              })
	//latest exam
	let letestExam = await Exams.findOne({
		where : { school_id : authentication.school_id ,
				  academic_year_id : academicYear.id
				},
		order : [
		     		['test_id', 'desc']
		    	],
		attributes : ['test_id']    	
	})
	//latest exam

  let whereConditions = {
  	branch_vls_id : branchId,
  	academic_year_id : academicYear.id,
  	test_id : letestExam.test_id
  }

  //return academicYear
  let limit   = 10
  let offset  = 0
  let search  = '';
  let orderBy = 'desc';

  //return user
  let joinWhere = {}
  if(user.role == 'student'){
  	 let student = await Student.findByPk(user.userVlsId)

  	 joinWhere.class_id            = student.class_id
  	 joinWhere.student_id          = user.userVlsId
  	 joinWhere.academic_year_id    = academicYear.id
  	 limit 						   = 1 
  }

  if(params.size)
     limit = parseInt(params.size)

  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit

  if(params.search) 
    search = params.search

  // if(params.orderBy)
  //    orderBy = params.orderBy

  let exams = await Exams.findAll({
			  	limit  : limit,
			    offset : offset,
			    where : whereConditions,
			    order : [
			             ['test_id', orderBy]
			            ],
			    include: [{ 
	                model:Marks,
	                as:'marks',
	                where : joinWhere,
	                include: [{ 
			                model:SubjectList,
			                as:'subject',
			                attributes:['subject_name']
			            }]
	            }]
			  	
  	})

  return { success: true, message: "Exam list", data : exams}	    
};


/**
 * API for send exam Report
 */
async function sendExamResult(body, user){
	if(user.role !='branch-admin') throw 'Unauthorised user'
	if(!body.test_id) throw 'test_id field is required'
  	//Auth user
	let authentication = await Authentication.findByPk(user.id)
  	//branch
	let branchId       = authentication.branch_vls_id
  	//acadminc year
	let academicYear  = await AcademicYear.findOne({
	                	where:{ school_id : authentication.school_id },
		                	order : [
				             	['id', 'desc']
				            ]
	              		})
	let whereConditions = {
		branch_vls_id : branchId
	}

   	let students = await Student.findAll({
   		where : whereConditions,
   		include: [{ 	
	                model:Guardian,
	                as:'guardian',
	                attributes:['email']
	            },{ 	
	                model:Marks,
	                as:'marks',
	                include: [{ 	
		                model:Exams,
		                as:'exam',
		                where : { test_id : body.test_id}
		            },{ 	
		                model:SubjectList,
		                as:'subject'
		            }]
	            }
	            ]
   	})
	    
	return { success: true, message: "Exam list", data : students}
}

/**
 * API for send exam Report
 */
async function sendAttendanceResult(body, user){
	if(user.role !='branch-admin') throw 'Unauthorised user'
  	//Auth user
	let authentication = await Authentication.findByPk(user.id)
  	//branch
	let branchId       = authentication.branch_vls_id

	let whereConditions = {
		branch_vls_id : branchId
	}
	let students = await Student.findAll({
   		where : whereConditions,
   		include: [{ 	
	                model:Guardian,
	                as:'guardian',
	                attributes:['email']
	            },{ 	
	                model:StudentAttendance,
	                as:'attendance',
	                include: [{ 	
		                model:SubjectList,
		                as:'subject'
		            }]
	            }]
   	})

   	return { success: true, message: "Attendance list", data : students}
}


/**
 * API for get overall performance of subject 
 */
async function subjectPerformance(params, user){
  if(!params.student_vls_id) throw 'student_vls_id field is required'
  //Auth user
  let authentication = await Authentication.findByPk(user.id)
  //branch
  let branchId       = authentication.branch_vls_id
  let orderBy 		 = 'desc' 
  //acadminc year
  let academicYear  = await AcademicYear.findOne({
	                where:{school_id:authentication.school_id},
	                order : [
			             ['id', 'desc']
			            ]
	              })
   
  let whereConditions = {
  	branch_vls_id : branchId,
  	academic_year_id : academicYear.id
  }
	
  let joinWhere = {}
  if(params.student_vls_id){
  	 let student = await Student.findByPk(params.student_vls_id)
  	 joinWhere.class_id            = student.class_id
  	 joinWhere.student_id          = student.student_vls_id
  	 joinWhere.academic_year_id    = academicYear.id

  	 if(params.subject_code) 
  	 	joinWhere.subject_code     = params.subject_code  
   }
   
   let exams = await Exams.findAll({
			    where : whereConditions,
			    order : [
			             ['test_id', orderBy]
			            ],
			    include: [{ 
	                model:Marks,
	                as:'marks',
	                where : joinWhere,
	                include: [{ 
			                model:SubjectList,
			                as:'subject',
			                attributes:['subject_name']
			            }]
	            }]
			  	
  	})
  	return { success: true, message: "Exam performance", data : exams}
}

/**
 * API for get overall performance of class wise 
 */
async function classPerformance(params, user){
	//Auth user
	let authentication = await Authentication.findByPk(user.id)
	//branch
	let branchId       = authentication.branch_vls_id
	//acadminc year
	let academicYear  = await AcademicYear.findOne({
	                where:{ school_id : authentication.school_id },
	                order : [
			             		['id', 'desc']
			            	]
	              	})
	//latest exam
	let letestExam = await Exams.findOne({
		where : { school_id : authentication.school_id ,
				  academic_year_id : academicYear.id
				},
		order : [
             		['test_id', 'desc']
            	],
        attributes : ['test_id']    	
	})
	let marksFilter = { exam_id : letestExam.test_id }
	let classFilter =  { school_id : authentication.school_id }
	if(params.test_id)
		marksFilter.exam_id = params.test_id

	if(params.test_id == 'all')
		marksFilter = {}

	if(params.section_id)
		marksFilter.section_id = params.section_id

	if(params.class_id)
		classFilter.class_vls_id = params.class_id

	//latest exam
	if(params.subject_code)
		marksFilter.subject_code = params.subject_code

	let classData = await Classes.findAll({
		where : classFilter,
		attributes : ['name'],
		group : ['class_id','subject_code'],
		include: [{ 
	                model:Marks,
	                as:'marks',
	                where : marksFilter,
	                attributes: [
					 	[ Sequelize.fn('SUM', Sequelize.col('exam_total_mark')), 'total_marks' ],
					 	[ Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'obtain_marks' ]
					 ],
	                include: [{ 
		                model:SubjectList,
		                as:'subject',
		                attributes : ['subject_name']
	             	}],
	             }]

	})
	let classPerformance = {}
  	await Promise.all(
    	classData.map(async classObj => {
    		 classObj = classObj.toJSON()
    		 marks  = classObj.marks
    		 marks.forEach(function (markObj){
    		 	let total_marks  = parseInt(markObj.total_marks)
				let obtain_marks = parseInt(markObj.obtain_marks)
				let percentage   = parseFloat(obtain_marks * 100 / total_marks).toFixed(2)
				if(!classPerformance[classObj.name]) 
					classPerformance[classObj.name] = []

				let subObj = { 
							   subject_name : markObj.subject.subject_name ,
							   percentage   : percentage
							 }
				classPerformance[classObj.name].push(subObj)
				//console.log(percentage)
    		 }) 
    	})
    )
    
	return { success: true, message: "class performance", data : classPerformance}
}