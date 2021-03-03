const { validationResult } = require('express-validator');
const db 	 	 = require("../models");
const moment 	 = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const mailer     = require('../helper/nodemailer')
const Op 	 	 = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const sequelize  = db.sequelize;
const Exams      = db.Exams;
const Marks      = db.Marks;
const Student    = db.Student;
const Subject    = db.Subject;
const Section    = db.Section;
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
  classPerformance,
  overAllPerformance
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

	if(id == 'all')
		whereConditions = {}

	let includeArray = [{ 
			                model:SubjectList,
			                as:'subject',
			                attributes: ['subject_name'],
			                
			            },{ 
			                model:Exams,
			                as:'exam',
			                attributes: ['test_type','test_id']
			            }]
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
		include: includeArray,
	})

	let classPerformance = {}
  	await Promise.all(
    	subjectMarks.map(async subjectMark => {
    		let testName = subjectMark.exam.test_type
    		let subjectName = subjectMark.subject.subject_name

    		if(!classPerformance[testName])
    			classPerformance[testName] = {}

    		if(!classPerformance[testName][subjectName])
    			classPerformance[testName][subjectName] = {}

    if(!classPerformance[testName][subjectName]['exam_total_mark'])
    	classPerformance[testName][subjectName]['exam_total_mark'] = 0 

    	classPerformance[testName][subjectName]['exam_total_mark'] += subjectMark.exam_total_mark

    if(!classPerformance[testName][subjectName]['obtain_total_mark'])
    	classPerformance[testName][subjectName]['obtain_total_mark'] = 0 

    	classPerformance[testName][subjectName]['obtain_total_mark'] += subjectMark.obtain_total_mark
    })
   )
	
	return { success: true, message: "Exam list", data : classPerformance
	}
}


/**
 * API for list exams
 */
async function dashboardList(params , user){
  
  if(user.role != 'student' && user.role != 'guardian'){
  	return response = await classPerformance(params, user)
  }

  if(user.role == 'guardian'){
  	if(!params.student_vls_id) throw 'student_vls_id field is required'
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
  
  if(params.student_vls_id){
	let student = await Student.findByPk(params.student_vls_id)

	 joinWhere.class_id            = student.class_id
	 joinWhere.student_id          = student.student_vls_id
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
	let exam_id   =  "AND `marks`.`exam_id` = "+letestExam.test_id

	let school_id = authentication.school_id 
	
	let studentFilter = ''
	if(params.student_id)
		studentFilter = "AND `marks`.`student_id` = "+params.student_id

	
	if(params.test_id)
		exam_id = "AND `marks`.`exam_id` = "+params.test_id

	if(params.test_id == 'all')
		exam_id = ''

	let section = ''
	if(params.section_id)
		section = 'AND `marks`.`section_id` = '+params.section_id

	let classFilter = ''
	if(params.class_id)
		classFilter = 'AND `classes`.`class_vls_id` = '+params.class_id

	if(params.student_id){
  	 let student = await Student.findByPk(params.student_id)
	  	 classFilter = 'AND `classes`.`class_vls_id` = '+student.class_id
	}
	let subjectFilter = ''
	//latest exam
	if(params.subject_code)
		subjectFilter = 'AND `marks`.`subject_code` = '+params.subject_code

	let classData = await sequelize.query("SELECT `classes`.`class_vls_id`, `classes`.`name`, SUM(`exam_total_mark`) AS `total_marks`, SUM(`obtain_total_mark`) AS `obtain_marks`, `marks->subject`.`id` AS `marks.subject.id`, `marks->subject`.`subject_name` AS `subject_name`, `exams`.`test_type` as title FROM `classes` AS `classes` INNER JOIN `marks` AS `marks` ON `classes`.`class_vls_id` = `marks`.`class_id` "+exam_id+" "+section+" "+studentFilter+" "+subjectFilter+" LEFT OUTER JOIN `subject_list` AS `marks->subject` ON `marks`.`subject_code` = `marks->subject`.`code` LEFT OUTER JOIN `exams` ON `marks`.`exam_id` = `exams`.`test_id` WHERE `classes`.`school_id` = "+school_id+" "+classFilter+" GROUP BY `class_id`, `subject_code`, `marks.subject.id`", { type: Sequelize.QueryTypes.SELECT });
	
	let classPerformance = {}
  	await Promise.all(
    	classData.map(async classObj => {
		 	let total_marks  = parseInt(classObj.total_marks)
			let obtain_marks = parseInt(classObj.obtain_marks)
			let percentage   = parseFloat(obtain_marks * 100 / total_marks).toFixed(2)
			if(!classPerformance[classObj.name]) 
				classPerformance[classObj.name] = []

			let subObj = { 
						   subject_name : classObj.subject_name ,
						   percentage   : percentage,
						   title : classObj.title
						 }
			classPerformance[classObj.name].push(subObj)

    	})
    )
    
	return { success: true, message: "class performance", data : classPerformance}
}


/**
 * API for get overall performance  
 */
async function overAllPerformance(query, user){

	if(!query.school_id) throw 'school_id field is required'

	if(!query.branch_id) throw 'branch_id field is required'

	let testId      	= 'all'
	let subjectCode 	= null
	let sectionId   	= null
	let whereConditions = {}
	let innerWhere      = {}
	let includeArray    = []
	let sectionObj		= { 
				            model:Section,
				            as:'section',
				            attributes:['id','name']
					       }
	if(query.test_id)
		testId = query.test_id

	if(query.subject_code)
		subjectCode = query.subject_code

	if(query.class_vls_id)
		whereConditions.class_vls_id = query.class_vls_id

	if(query.section_id){
		sectionObj.where = { id : query.section_id }
	}

	if(query.school_id)
		whereConditions.school_id = query.school_id

	if(query.branch_id)
		whereConditions.branch_vls_id = query.branch_id
	

	includeArray.push(sectionObj)

	let allClasses = await Classes.findAll({
		where      : whereConditions,
		attributes : ['class_vls_id','name'],
		include    : includeArray
	})
	
	let overAllPerformance = {}
  	await Promise.all(
    	allClasses.map(async (classObj, classIndex)=> {
    		classObj = classObj.toJSON()
    		let className  = classObj.name
    		let sectionArr = classObj.section
    		if(!overAllPerformance[className])
    			overAllPerformance[className] = {}

    		if(sectionArr.length){
    			await Promise.all(
	    			sectionArr.map(async (section, index)=> {
		    			let data = await getExamData(testId,classObj.class_vls_id, section.id , subjectCode)
			    		  if(!overAllPerformance[className][section.name])
			    		   overAllPerformance[className][section.name] = data
		    		})
	    		)
	    		if(!overAllPerformance[className]['sections'])
	    			overAllPerformance[className]['sections'] = true
	    	}else{
				let data = await getExamData(testId,classObj.class_vls_id, null , subjectCode)
	    		overAllPerformance[className] = data

	    		if(!overAllPerformance[className]['sections'])
	    			overAllPerformance[className]['sections'] = false
	    	}
    	})
    )
    //return overAllPerformance
	return { success: true, message: "overall performance", data : overAllPerformance} 
}

/**
 * API for get data 
 */
async function getExamData(testId , classId , sectionId = null , subjectCode = null ){
	let whereConditions = { exam_id : testId}

	if(testId == 'all')
		whereConditions = {}

	let includeArray = [{ 
			                model:SubjectList,
			                as:'subject',
			                attributes: ['subject_name'],
			                
			            },{ 
			                model:Exams,
			                as:'exam',
			                attributes: ['test_type','test_id']
			            }]
  	
	whereConditions.class_id   = classId

	if(sectionId)
		whereConditions.section_id = sectionId

	if(subjectCode) 
		whereConditions.subject_code = subjectCode
	//console.log(whereConditions , 'whereConditions', subjectCode)
	let subjectMarks = await Marks.findAll({
		where : whereConditions,
		include: includeArray,
	})

	let classPerformance = {}
  	await Promise.all(
    	subjectMarks.map(async subjectMark => {
    		let testName = subjectMark.exam.test_type
    		let subjectName = subjectMark.subject.subject_name

    		if(!classPerformance[testName])
    			classPerformance[testName] = {}

    		if(!classPerformance[testName][subjectName])
    			classPerformance[testName][subjectName] = {}

    if(!classPerformance[testName][subjectName]['exam_total_mark'])
    	classPerformance[testName][subjectName]['exam_total_mark'] = 0 

    	classPerformance[testName][subjectName]['exam_total_mark'] += subjectMark.exam_total_mark

    if(!classPerformance[testName][subjectName]['obtain_total_mark'])
    	classPerformance[testName][subjectName]['obtain_total_mark'] = 0 

    	classPerformance[testName][subjectName]['obtain_total_mark'] += subjectMark.obtain_total_mark
    })
   )
	
	return classPerformance;
}