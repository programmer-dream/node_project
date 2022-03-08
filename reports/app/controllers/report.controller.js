const { validationResult } = require('express-validator');
const db 	 	 = require("../../../models");
const moment 	 = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const mailer     = require('../../../helpers/nodemailer')
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
const SchoolDetails = db.SchoolDetails;
const Employee 		= db.Employee;
const ExamSchedule  = db.ExamSchedule;
const Branch  		= db.Branch;
const CommunityChat = db.CommunityChat;
const Ticket 		= db.Ticket;


module.exports = {
  list,
  getExamMarks,
  dashboardList,
  sendExamResult,
  sendAttendanceResult,
  subjectPerformance,
  classPerformance,
  overAllPerformance,
  topThreePerformer,
  examDropdown,
  getPerformanceData,
  studentList,
  overAll,
  overAllSubject,
  schoolBranchCount,
  getTopTenStudent
};


/**
 * API for list exams
 */
async function list(params , user){
  let authentication = await Authentication.findByPk(user.id)
  let branchId       = authentication.branch_vls_id

  let whereConditions = {}

  if(branchId) 
  	whereConditions.branch_vls_id = branchId

  if(params.examType) 
  	 whereConditions.test_type = params.examType

  let joinWhere = {}
  if(user.role == 'student'){
  	 let student = await Student.findByPk(user.userVlsId)

  	 joinWhere.class_id            = student.class_id
  	 joinWhere.student_id          = user.userVlsId
  }else{

  	if(!params.class_id) throw 'class_id field is required'
  		joinWhere.class_id    = params.class_id
  	
  	if(params.section_id) 
  		joinWhere.section_id  = params.section_id

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
	
	let avgObj = {}
	let school_id = 0
	let userData = {}
	let student = {}
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
			                attributes: ['test_type','test_id'],
			                include : [{ 
				                model:ExamSchedule,
				                as:'schedule',
				                attributes: ['exam_date','subject_code']
			            	}]
			            }]
  	if(user.role == 'student' || query.student_vls_id){
  		let student_id = user.userVlsId
  		if(query.student_vls_id)
  			student_id = query.student_vls_id

	  	student = await Student.findOne({
	  		where : { student_vls_id : student_id},
	  		include: [{ 
	                	model:Classes,
	                	as:'classes'
	            	},{ 
	                	model:Section,
	                	as:'section'
	            	}]
	  	})

	  	if(!student)
	  		throw 'student not found'

	  	whereConditions.class_id   = student.class_id
	  	whereConditions.student_id = student_id
	  	school_id = student.school_id
  	}else{

  		if(!query.class_id) throw 'class_id is required'	
  			whereConditions.class_id   = query.class_id

  		if(query.section_id) 
  			whereConditions.section_id   = query.section_id

  		if(user.role == 'guardian'){
  			if(!query.student_id) throw 'student_id is required'
  			whereConditions.student_id   = query.student_id

	  		student = await Student.findOne({
		  		where : { student_vls_id : whereConditions.student_id},
		  		include: [{ 
		                	model:Classes,
		                	as:'classes'
		            	},{ 
		                	model:Section,
		                	as:'section'
		            	}]
		  	})
  		}
  		studentInclude = { 
					        model:Student,
					        as:'student',
					        attributes: ['name','photo']
					    }
		includeArray.push(studentInclude)

		if(user.role != 'guardian'){
			 userData = await Employee.findByPk(user.userVlsId)
			 school_id = userData.school_vls_id
		}else{
			 userData = await Guardian.findByPk(user.userVlsId)
			 school_id = userData.school_vls_id
		}	

  	}
  	//return whereConditions
	let subjectMarks = await Marks.findAll({
		where : whereConditions,
		include: includeArray,
	})
	//return subjectMarks
	let classPerformance = {}
  	await Promise.all(
    	subjectMarks.map(async subjectMark => {
    		let testName    = subjectMark.exam.test_type
    		let subjectName = subjectMark.subject.subject_name
    		let schedule 	= subjectMark.exam.schedule
    		let sObj = {}

    		if(schedule.length){
	    		schedule.forEach(function (item){
	    			sObj[item.subject_code] = item.exam_date
	    		})
    		}
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

    	classPerformance[testName][subjectName]['remark'] = subjectMark.remark
    	classPerformance[testName][subjectName]['date'] = sObj[subjectMark.subject_code]
    })
   )

  	let condition = {}
  	let conditionStudent = {}
  	let exam = {}
  	let exam_name = ''
  	let schoolInfo = {}
  	
  	if(user.role == 'guardian' || user.role == 'student'){
  		conditionStudent.student_id = whereConditions.student_id

	  	if(id != 'all'){
	  		condition.exam_id 			= id
	  		conditionStudent.exam_id 	= id

		   	exam = await Exams.findByPk(id)
		   	exam_name = exam.test_type
	  	}

	  	if(whereConditions.section_id)
	  		condition.section_id = whereConditions.section_id

	  	condition.class_id 		= whereConditions.class_id

		avgObj.top_student = await topStudentPerformer(condition)
	   	avgObj.class_avg = await classAvg(condition)
	   	avgObj.student_avg = await studentAvg(conditionStudent)
	   	schoolInfo = await SchoolDetails.findOne({
	   		where : {school_id : school_id },
	   		attributes : ['school_name','address']
	   	})
	   	schoolInfo = schoolInfo.toJSON()
	   	schoolInfo.student_name = student.name
	   	schoolInfo.exam_name = exam_name
	   	schoolInfo.class_name = ''
	   	schoolInfo.section_name = ''
	   	
	   	if(student.classes)
	   		schoolInfo.class_name = student.classes.name

	   	if(student.section)
	   		schoolInfo.section_name = student.section.name
	}

	return { success: true, message: "Exam list", data : {exams:classPerformance, avg: avgObj, schoolInfo: schoolInfo}
	}
}


/**
 * API for list exams
 */
async function dashboardList(params , user){
  
  if(user.role != 'student' && user.role != 'guardian'){
  	return response = await internalClassPerformance(params, user)
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
  //auth user
  let authentication = await Authentication.findByPk(user.id)
  let branchId       = authentication.branch_vls_id

  if(user.role =='school-admin'){
  	if(!params.branch_vls_id) throw 'branch_vls_id field is required'

  	branchId = params.branch_vls_id
  }

  if(!params.student_vls_id) throw 'student_vls_id field is required'

  let orderBy 		 = 'asc' 
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

  if(params.examType) 
	  whereConditions.test_type = params.examType

  let joinWhere = {}
  let schoolInfo = {}

  if(params.student_vls_id){
  	 let student = await Student.findOne({
  	 	where : { student_vls_id : params.student_vls_id},
  	 	include: [{ 
                	model:Classes,
                	as:'classes'
            	},{ 
                	model:Section,
                	as:'section'
            	},{ 
                	model:SchoolDetails,
                	as:'school'
            	}]
  	 })
  	 
  	 joinWhere.class_id            = student.class_id
  	 joinWhere.student_id          = student.student_vls_id
  	 joinWhere.academic_year_id    = academicYear.id

  	 if(student.section_id && student.section_id > 0)
  	 	joinWhere.section_id       = student.section_id 

  	 if(params.subject_code) 
  	 	joinWhere.subject_code     = params.subject_code 
  	 
   	schoolInfo.school_name = student.school.school_name
   	schoolInfo.address 	   = student.school.address
   	schoolInfo.student     = student.name
   	schoolInfo.class_name  = student.classes.name
   	schoolInfo.section_name= student.section.name
   }
	let allSubject = await SubjectList.findAll({
		attributes : ['subject_name','code'],
		include: [{ 
	            model:Marks,
	            as:'test',
	          	where : joinWhere,
	            attributes:['id','exam_id','exam_total_mark','obtain_total_mark','subject_code'],
	            include: [{ 
			                model:Exams,
			                as:'exam',
			                where : whereConditions,
			                attributes:['test_type','title']
			            }]
	            }]
	})

	//code for avg and percentage
	let maxMark = 0
  	await Promise.all(
    	allSubject.map(async subject => {
    		subject = subject.toJSON()
    		let tests = subject.test
    		if(tests.length){
	    		tests.map(async test => {
	    			if(maxMark < test.obtain_total_mark)
	    				maxMark = test.obtain_total_mark
	    		})
    		}
    	})
    )

	let examIds  = await Exams.findAll({
		where : whereConditions,
		attributes:['test_id']
	}).then(exams => exams.map(exams => exams.test_id))

	let studentCondition = { 
								student_id :  params.student_vls_id,
								exam_id : { [Op.in]: examIds }
							}

	let avgPercentage = await Marks.findOne({
		where : studentCondition,
		attributes:[
                    [ Sequelize.fn('SUM', Sequelize.col('exam_total_mark')), 'exam_total_mark' ],
                    [ Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'obtain_total_mark' ],
                    [ Sequelize.fn('AVG', Sequelize.col('obtain_total_mark')), 'avg_total_mark' ]
                  ]
	})
	avgPercentage = avgPercentage.toJSON()
	let percent =  (avgPercentage.obtain_total_mark * 100 ) / avgPercentage.exam_total_mark
	let avg = avgPercentage.avg_total_mark
	//end code for avg and percentage 
	let exam_data = { percent , avg , maxMark}
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
   	
  	return { success: true, message: "Exam performance", data : exams, schoolInfo: schoolInfo, subjects : allSubject, exam_data}
}

/**
 * API for get overall performance of class wise 
 */
async function internalClassPerformance(params, user){
	//Auth user
	let authentication = await Authentication.findByPk(user.id)
	//branch
	let branchId       = authentication.branch_vls_id
	if(params.branch_vls_id){
		branchId = params.branch_vls_id
	}

	//acadminc year
	let academicYear  = await AcademicYear.findOne({
	                where:{ school_id : authentication.school_id },
	                order : [
			             		['id', 'desc']
			            	]
	              	})
	let academincId = academicYear.id
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
	
	let exam_id = ''
	if(letestExam.test_id)
		exam_id   =  "AND `marks`.`exam_id` = "+letestExam.test_id
	
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
	let branchCondition = 'And `exams`.`branch_vls_id` = '+branchId
	//latest exam
	if(params.subject_code)
		subjectFilter = 'AND `marks`.`subject_code` = '+params.subject_code

	let classData = await sequelize.query("SELECT `classes`.`class_vls_id`, `classes`.`name`, SUM(`exam_total_mark`) AS `total_marks`, SUM(`obtain_total_mark`) AS `obtain_marks`, `marks->subject`.`id` AS `marks.subject.id`, `marks->subject`.`subject_name` AS `subject_name`, `exams`.`test_type` as title FROM `classes` AS `classes` INNER JOIN `marks` AS `marks` ON `classes`.`class_vls_id` = `marks`.`class_id` "+exam_id+" "+section+" "+studentFilter+" "+subjectFilter+" LEFT OUTER JOIN `subject_list` AS `marks->subject` ON `marks`.`subject_code` = `marks->subject`.`code` LEFT OUTER JOIN `exams` ON `marks`.`exam_id` = `exams`.`test_id` WHERE `classes`.`school_id` = "+school_id+" "+branchCondition+" "+classFilter+" GROUP BY `class_id`, `subject_code`, `marks.subject.id`", { type: Sequelize.QueryTypes.SELECT });

	//return classData
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
						   title        : classObj.title,
						   class_avg    : classObj.class_avg,
						   test_type    : classObj.test_type
						 }

			classPerformance[classObj.name].push(subObj)

    	})
    )
    
	return { success: true, message: "class performance", data : classPerformance}
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
	let academincId = academicYear.id

	let examFilter = ''
	if(params.test_id)
	 	examFilter   =  "AND `marks`.`exam_id` = "+params.test_id

	let examType = ''
	if(params.examType)
	 	examType   =  "AND `exams`.`test_type` = '"+params.examType+"'"
	
	let school_id = authentication.school_id 
	
	let studentFilter = ''
	if(params.student_id)
		studentFilter = "AND `marks`.`student_id` = "+params.student_id

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

	let classData = await sequelize.query("SELECT `classes`.`class_vls_id`, `classes`.`name`, `exams`.`test_type`, SUM(`exam_total_mark`) AS `total_marks`, SUM(`obtain_total_mark`) AS `obtain_marks` , AVG(`obtain_total_mark`) AS `class_avg` FROM `classes` AS `classes` INNER JOIN `marks` AS `marks` ON `classes`.`class_vls_id` = `marks`.`class_id` "+section+" "+studentFilter+" "+subjectFilter+" LEFT OUTER JOIN `subject_list` AS `marks->subject` ON `marks`.`subject_code` = `marks->subject`.`code` LEFT OUTER JOIN `exams` ON `marks`.`exam_id` = `exams`.`test_id` WHERE `classes`.`school_id` = "+school_id+" "+classFilter+" "+examFilter+" "+examType+" GROUP BY `class_id` ,`test_type`", { type: Sequelize.QueryTypes.SELECT });

	//return classData
	let classPerformance = {}

	let class_id 	= params.class_id
	let section_id 	= params.section_id
	let test_id 	= params.test_id
	

	if(classData.length > 0){

		let classObj = classData[0]
		let subjData = await getSubjectData(class_id, section_id, test_id, examType)
	 	let total_marks  = parseInt(classObj.total_marks)
		let obtain_marks = parseInt(classObj.obtain_marks)
		let percentage   = parseFloat(obtain_marks * 100 / total_marks).toFixed(2)

		let testId = '' 
		if(params.test_id)
			testId = "AND `exams`.`test_id` = "+params.test_id

		examType = "AND `exams`.`test_type` = '"+classObj.test_type+"' "
		examType += testId
		
		let topPercentageData   = await topPercentage(
			classObj.class_vls_id, 
			examType,
			subjectFilter
		)
		
		let subObj = { 
					   total_marks  : classObj.total_marks ,
					   obtain_marks : classObj.obtain_marks ,
					   percentage   : percentage,
					   class_avg    : classObj.class_avg,
					   top_avg      : topPercentageData[0].percent,
					   top_mark     : topPercentageData[0].obtain,
					   test_type    : classObj.test_type,
					   subject_data : subjData
					 }


		classPerformance = subObj
	}

	return { success: true, message: "class performance", data : classPerformance}
}


/**
 * API for get overall performance  
 */
async function overAllPerformance(query, user){

	if(!query.school_id) throw 'school_id field is required'

	if(!query.branch_vls_id) throw 'branch_vls_id field is required'

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

	if(query.branch_vls_id)
		whereConditions.branch_vls_id = query.branch_vls_id
	

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


/**
 * API for top Three Perfromer data 
 */
async function topThreePerformer(params, user){
	if(!params.school_vls_id) throw 'school_vls_id is required'
	if(!params.branch_vls_id) throw 'branch_vls_id is required'

	let school_vls_id = params.school_vls_id
	let branch_vls_id = params.branch_vls_id
	// if(user.role == 'teacher'){

	// }
	//current academin year
	let academicYear  = await AcademicYear.findOne({
		                where:{ school_id : school_vls_id },
		                order : [
				             		['id', 'desc']
				            	],
				        attributes:['id','session_year']
		              	})
	if(!academicYear)
		 return { success: false, message: "No academinc year found",data : []}

	//latest exam
	let letestExam = await Exams.findOne({
		where : { school_id : school_vls_id ,
				  academic_year_id : academicYear.id
				},
		order : [
             		['test_id', 'desc']
            	],
        attributes : ['test_id']    	
	})

	if(!letestExam)
		 return { success: false, message: "No exam found", data : []}

	let allClasses = await Classes.findAll({
		where : { branch_vls_id : branch_vls_id },
		attributes:['class_vls_id','name']
	})

	//where condition
	let whereConditions = { 
		exam_id   : letestExam.test_id,
		school_id : school_vls_id
	}

	let classesPerformance = []
	await Promise.all(
    	allClasses.map(async getClass => {
    		getClass = getClass.toJSON()
    		//modify condition
    		whereConditions.class_id =  getClass.class_vls_id
    		let studentData = await topClassPerformer(whereConditions)

    		if(studentData.length){
    			getClass.students = studentData
    			classesPerformance.push(getClass)
    		}
    	})
    )

	return { success: true, message: "Top three performance", data : classesPerformance}
}

/**
 * API for top Three Perfromer data 
 */
async function topClassPerformer(whereConditions){

	let allMarks = await Marks.findAll({
		where : whereConditions,
		attributes:[
                    [ Sequelize.fn('SUM', Sequelize.col('exam_total_mark')), 'exam_total_mark' ],
                    [ Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'obtain_total_mark' ],
                    'student_id'
                  ],
        include: [{ 
	                model:Student,
	                as:'student',
	                attributes:['name','photo']
	            }],
		group:['student_id'],
		order : [
	             	[Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'desc']
	            ],
	    limit : 3
	})

	return allMarks
}


/**
 * API for top student Perfromer data 
 */
async function topStudentPerformer(whereCondition){
	let allMarks = await Marks.findAll({
		where : whereCondition,
		attributes:[
                    [ Sequelize.fn('SUM', Sequelize.col('exam_total_mark')), 'exam_total_mark' ],
                    [ Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'obtain_total_mark' ],
                    [ Sequelize.fn('AVG', Sequelize.col('obtain_total_mark')), 'avg_total_mark' ]
                  ],
		group:['student_id'],
		order : [
	             	[Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'desc']
	            ],
	    limit : 1
	})

	return ( allMarks.length > 0 ) ? allMarks[0] : ""
}



/**
 * API for get overall performance  
 */
async function classAvg(whereCondition){

	let allMarks = await Marks.findAll({
		where : whereCondition,
		attributes:[
                    [ Sequelize.fn('SUM', Sequelize.col('exam_total_mark')), 'exam_total_mark' ],
                    [ Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'obtain_total_mark' ],
                    [ Sequelize.fn('AVG', Sequelize.col('obtain_total_mark')), 'avg_total_mark' ]
                  ],
		group:['marks.class_id']
	})
	return (allMarks.length > 0) ? allMarks[0] : ""
}


/**
 * API for get overall performance  
 */
async function studentAvg(conditionStudent){

	let allMarks = await Marks.findAll({
		where : conditionStudent,
		attributes:[
                    [ Sequelize.fn('SUM', Sequelize.col('exam_total_mark')), 'exam_total_mark' ],
                    [ Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'obtain_total_mark' ],
                    [ Sequelize.fn('AVG', Sequelize.col('obtain_total_mark')), 'avg_total_mark' ]
                  ],
		group:['student_id']
	})
	return (allMarks.length > 0) ? allMarks[0] : ""
}


/**
 * API for get exam type drop down  
 */
async function examDropdown(){
	let examType = await Exams.findAll({
		attributes: [
			[Sequelize.fn('DISTINCT', Sequelize.col('test_type')) ,'test_type'],
		]
	}).then(types => types.map(types => types.test_type));

	return { success: true, message: "Exam types", data : examType}
}


/**
 * API for get exam type drop down  
 */
async function getPerformanceData(query, user){ 
	
	let examType = ''
	let subject  = ''
	let student_vls_id = 0

	if(user.role == 'student'){
		student_vls_id = user.userVlsId

	}else{

		if(!query.student_id) throw 'student_id is required'
			student_vls_id = query.student_id
	}

	if(query.examType) 
		examType = "AND `exams`.`test_type` = '"+query.examType+"'"

	if(query.subject_code) 
		subject = "AND `marks`.`subject_code` = '"+query.subject_code+"'"


	let student = await Student.findOne({
		where : { student_vls_id : student_vls_id },
		attributes : ['class_id','student_vls_id']
	})
	
	let studentId = student.student_vls_id
	let classId   = student.class_id

	let percentData      = []
	
	let selfPercentageData  = await selfPercentage(studentId, examType,subject)
	percentData.push(selfPercentageData)

	let classPercentageData = await classPercentage(classId, examType, subject)
	percentData.push(classPercentageData)

	let topPercentageData   = await topPercentage(classId, examType,subject)
	percentData.push(topPercentageData)

	let sortedPercentData = {}

	await Promise.all(
    	percentData.map(async pData => {
    		pData.forEach(function(item ){
				if(!sortedPercentData[item.test_type])
					sortedPercentData[item.test_type] = []

				sortedPercentData[item.test_type].push(item)
			})
    	})
    )

	return { success: true, message: "Exam data", data : sortedPercentData}
}


/**
 * API for get self percentage  
 */
async function selfPercentage(studentId, examCondition, subjectCondition){
	
	let rawData = await sequelize.query("SELECT `exams`.`test_type`, SUM(`exam_total_mark`) AS `exam_total_mark`, SUM(`obtain_total_mark`) AS `obtain_total_mark` FROM `exams` AS `exams` INNER JOIN `marks` AS `marks` ON `exams`.`test_id` = `marks`.`exam_id` AND `marks`.`student_id` = "+studentId+" "+examCondition+" "+subjectCondition+" GROUP BY `test_type`", { type: Sequelize.QueryTypes.SELECT });

	let finalArr = []
	await Promise.all(
    	rawData.map(async exam => {
    		let obtain  = parseFloat(exam.obtain_total_mark)
    		let total   = parseFloat(exam.exam_total_mark)
    		let percent = (obtain * 100) / total
    		exam.percent= percent
    		exam.type= 'My Average'
    		finalArr.push(exam)
    	})
    )
	return finalArr
}


/**
 * API for get class percentage  
 */
async function classPercentage(classId, examCondition, subjectCondition){
	
	let rawData = await sequelize.query("SELECT `exams`.`test_type`, SUM(`exam_total_mark`) AS `exam_total_mark`, SUM(`obtain_total_mark`) AS `obtain_total_mark` FROM `exams` AS `exams` INNER JOIN `marks` AS `marks` ON `exams`.`test_id` = `marks`.`exam_id` AND `marks`.`class_id` = "+classId+" "+examCondition+" "+subjectCondition+" GROUP BY `test_type`", { type: Sequelize.QueryTypes.SELECT });

	let finalArr = []
	await Promise.all(
    	rawData.map(async exam => {
    		let obtain  = parseFloat(exam.obtain_total_mark)
    		let total   = parseFloat(exam.exam_total_mark)
    		let percent = (obtain * 100) / total
    		exam.percent= percent
    		exam.type= 'Class Average'
    		finalArr.push(exam)
    	})
    )
	return finalArr
}

/**
 * API for top student Perfromer data 
 */
async function topPercentage(classId, examCondition, subjectCondition){
	let limit = 3
	if(examCondition != '')
		limit = 1

	let rawData = await sequelize.query("SELECT `exams`.`test_type`, SUM(`exam_total_mark`) AS `exam_total_mark`, SUM(`obtain_total_mark`) AS `obtain_total_mark` FROM `exams` AS `exams` INNER JOIN `marks` AS `marks` ON `exams`.`test_id` = `marks`.`exam_id` AND `marks`.`class_id` = "+classId+" "+examCondition+" "+subjectCondition+" GROUP BY `test_type`,`student_id` ORDER BY SUM(`obtain_total_mark`) DESC LIMIT "+limit+"", { type: Sequelize.QueryTypes.SELECT });

	let finalArr = []
	await Promise.all(
    	rawData.map(async exam => {
    		let obtain  = parseFloat(exam.obtain_total_mark)
    		let total   = parseFloat(exam.exam_total_mark)
    		let percent = (obtain * 100) / total
    		exam.percent= percent
    		exam.obtain = obtain
    		exam.type= 'Top performer Average'
    		finalArr.push(exam)
    	})
    )

	return finalArr
}

/**
 * API for top student Perfromer data 
 */
async function getSubjectData(class_id, section_id, exam_id, examType=null){
	let examFilter = ''
	if(exam_id)
		examFilter = "and exam_id = "+exam_id

	let typeFilter = ''
	if(examType)
		typeFilter = examType
	
	let rawQuery = await sequelize.query("SELECT AVG(obtain_total_mark) AS avg_total, SUM(obtain_total_mark) AS obtain_total, SUM(exam_total_mark) AS exam_total_mark, MAX(obtain_total_mark) AS max_mark, MAX(exam_total_mark) AS subject_mark, subject_code ,subject_list.subject_name FROM `marks` left join subject_list on marks.subject_code = subject_list.code LEFT JOIN `exams` ON `marks`.`exam_id` = `exams`.`test_id` where class_id = "+class_id+" and section_id = "+section_id+" "+examFilter+" "+typeFilter+" group by marks.subject_code, subject_name", { type: Sequelize.QueryTypes.SELECT })

	let subjectArr = []
	await Promise.all(
    	rawQuery.map(async subject => {
    		let percent = (subject.max_mark * 100) / subject.subject_mark
    		subject.subject_percentage = percent
    		subjectArr.push(subject)
    	})
    )
	return subjectArr
}


/**
 * API for top student list data 
 */
async function studentList(query, user){
	let whereConditions = {}

	if(query.class_id)
		whereConditions.class_id = query.class_id

	let innerWhere = {}
	if(query.test_id)
		innerWhere. test_id = query.test_id

	let studentMarks = await Marks.findAll({
		where : whereConditions,
		attributes : ['student_id','exam_total_mark','obtain_total_mark','subject_code'],
		include: [{ 
	                model:Student,
	                as:'student',
	                attributes:['name']
	            },{ 
	                model:SubjectList,
	                as:'subject',
	                attributes:['subject_name']
	            },{ 
	                model:Exams,
	                as:'exam',
	                where : innerWhere,
	                attributes:['test_type','title']
	            }]
	})
	let finalArr   = []
	let studentArr = []
	let studnetObj = {}
	await Promise.all(
    	studentMarks.map(async exam => {
    		if(!studnetObj[exam.student_id])
    			studnetObj[exam.student_id] = []

    		studnetObj[exam.student_id].push(exam.toJSON())
    		if(!studentArr.includes(exam.student_id))
    			studentArr.push(exam.student_id)
    	})
    )

	studentArr.forEach(function(item){
		let studentSubject = studnetObj[item]
		let finalObj ={}
		let obtain = 0
		let total  = 0
		studentSubject.forEach(function(obj){
			console.log(obj.obtain_total_mark)
			finalObj.name = obj.student.name
			obtain += obj.obtain_total_mark
			total += obj.exam_total_mark
			finalObj[obj.subject.subject_name] = obj.obtain_total_mark
		})
		finalObj['total_obtain'] = parseFloat(obtain)
		finalObj['total_marks'] = parseFloat(total)
		finalObj['total_percentage'] = parseFloat(obtain) * 100 / parseFloat(total)
		if(query.start && query.end){
			
			if(finalObj['total_percentage'] >= query.start && finalObj['total_percentage'] <= query.end){
				finalArr.push(finalObj)
			}
		}else{
			finalArr.push(finalObj)
		}
	})
 	return { success: true, message: "Exam data", data : finalArr}
}


/**
 * API for top over all data 
 */
async function overAll(query, user){
	let authentication = await Authentication.findByPk(user.id)
  	let school_id      = authentication.school_id

	if(!query.examType) throw 'examType is required'

	let type = query.examType
	
	let whereConditions = { school_id : school_id }

	let examWhere = { 
						test_type : type 
					}
	if(query.branch_vls_id)
		examWhere.branch_vls_id = query.branch_vls_id

	let examIds = await Exams.findAll({
		where: examWhere,
		attributes : ['test_id']
	}).then(exams => exams.map(exam => exam.test_id));

	if(!examIds.length) 
		return { success: true, message: "No exam found", data : []}

	let marks = await Marks.findOne({
		where : { exam_id : {[Op.in] : examIds }},
		attributes : [
			[ Sequelize.fn('SUM', Sequelize.col('exam_total_mark')), 'exam_total_mark' ],
            [ Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'obtain_total_mark' ]
		]
	})

	let maxMarks = await Marks.findOne({
		where : { exam_id : {[Op.in] : examIds }},
		attributes : [
			[ Sequelize.fn('SUM', Sequelize.col('exam_total_mark')), 'exam_total_mark' ],
            [ Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'obtain_total_mark' ],
            'student_id'
		],
		include: [{ 
	                model:Student,
	                as:'student',
	                attributes:['name','photo']
	            }],
		order : [
	             	[Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'desc']
	            ],
		group : ['student_id'],
		limit : 1
	})
	let topStudnet  = maxMarks.student
	let totalPercentage = parseFloat(marks.obtain_total_mark) * 100 / parseFloat(marks.exam_total_mark)

	let maxMarkPercentage = parseFloat(maxMarks.obtain_total_mark) * 100 / parseFloat(maxMarks.exam_total_mark)

	let finalObj = {
		total_percentage : totalPercentage,
		max_percentage : maxMarkPercentage,
		top_student : topStudnet
	}

	let maxClass = await Marks.findAll({
		where : { exam_id : {[Op.in] : examIds }},
		attributes : [
			[ Sequelize.fn('SUM', Sequelize.col('exam_total_mark')), 'exam_total_mark' ],
            [ Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'obtain_total_mark' ],
            [ Sequelize.fn('MAX', Sequelize.col('exam_total_mark')), 'total_mark' ],
            'class_id',
            'section_id'
		],
		include: [{ 
                	model:Classes,
                	as:'classes',
                	attributes:['name']
            	},{ 
                	model:Section,
                	as:'section',
                	attributes:['name']
            	}],
		group : ['class_id','section_id']
	})
	
	let classData = {}
  	await Promise.all(
    	maxClass.map(async classSection => {
    		classSection =  classSection.toJSON()
    		let className   = classSection.classes.name
    		let sectionName = classSection.section.name

    		let percentage 	= parseFloat(classSection.obtain_total_mark) * 100 / parseFloat(classSection.exam_total_mark)
    		
    		let class_toper = await classToper(
    								examIds, 
    								classSection.class_id, 
    								classSection.section_id )
    	
    		let maxObj		= {
    							 max_avg    : percentage,
    							 total_mark : classSection.total_mark,
    							 topper     : class_toper
    						  }

    		if(!classData[className+" ("+sectionName+")"])
    			classData[className+" ("+sectionName+")"] = maxObj
    	})
    )
    finalObj.class_data = classData

	return { success: true, message: "Exam data", data : finalObj}
}

/**
 * API for top student Perfromer data 
 */
async function classToper(examIds, class_id, section_id ){
	let whereCondition = {
		exam_id : { [Op.in] : examIds },
		class_id : class_id,
		section_id : section_id
	}

	let threeToper = await Marks.findAll({
		where : whereCondition,
		attributes:[
                    [ Sequelize.fn('SUM', Sequelize.col('exam_total_mark')), 'exam_total_mark' ],
                    [ Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'obtain_total_mark' ]
                  ],
		group:['student_id'],
		include: [{ 
	                model:Student,
	                as:'student',
	                attributes:['name']
	            }],
		order : [
	             	[Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'desc']
	            ],
	    limit : 3
	})

	let topStudent = []
  	await Promise.all(
    	threeToper.map(async toper => {
    		let percentage 	= parseFloat(toper.obtain_total_mark) * 100 / parseFloat(toper.exam_total_mark)

    		let obj = {name : toper.student.name,
    				   avg : percentage
    				  }
    		topStudent.push(obj)
    	})
    )
	return topStudent
}


/**
 * API for top over all subject data 
 */
async function overAllSubject(query, user){
	let authentication = await Authentication.findByPk(user.id)
  	let school_id      = authentication.school_id

	if(!query.examType) throw 'examType is required'

	let type = query.examType
	
	let whereConditions = { school_id : school_id }

	let examWhere = { 
						test_type : type 
					}
	if(query.branch_vls_id)
		examWhere.branch_vls_id = query.branch_vls_id

	let examIds = await Exams.findAll({
		where: examWhere,
		attributes : ['test_id']
	}).then(exams => exams.map(exam => exam.test_id));

	if(!examIds.length)
		return { success: true, message: "No exam found", data : []}

	let marksCondition = {
		 exam_id : {[Op.in] : examIds} 
	}

	if(query.subject_code)
		marksCondition.subject_code = query.subject_code

	let allSubject = await Marks.findAll({
		where : marksCondition,
		attributes : [
			[ Sequelize.fn('SUM', Sequelize.col('exam_total_mark')), 'exam_total_mark' ],
            [ Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'obtain_total_mark' ],
            'subject_code'
		],
		include: [{ 
	                model:SubjectList,
	                as:'subject',
	                attributes:['subject_name']
	            }],
		group : ['subject_code','subject.id','subject.subject_name']
	})

	let subjectArr = []
  	await Promise.all(
    	allSubject.map(async subject => {
    		let subjectName = subject.subject.subject_name

    		let percentage 	= parseFloat(subject.obtain_total_mark) * 100 / parseFloat(subject.exam_total_mark)

    		let maxPercent = await subjectToper(examIds, subject.subject_code );

    		let subjectObj  = {
    			subject_name: subjectName,
    			avg_percentage : percentage,
    			max_percentage : maxPercent
    		} 	
    		subjectArr.push(subjectObj)

    	})
    )

    let maxClass = await Marks.findAll({
		where : marksCondition,
		attributes : [
			[ Sequelize.fn('SUM', Sequelize.col('exam_total_mark')), 'exam_total_mark' ],
            [ Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'obtain_total_mark' ],
            [ Sequelize.fn('MAX', Sequelize.col('exam_total_mark')), 'total_mark' ],
            'class_id',
            'section_id',
            'subject_code'
		],
		include: [{ 
                	model:Classes,
                	as:'classes',
                	attributes:['name']
            	},{ 
                	model:Section,
                	as:'section',
                	attributes:['name']
            	},{ 
                	model:SubjectList,
                	as:'subject',
                	attributes:['subject_name']
            	}],
		group : ['class_id','section_id','subject.id','subject_code']
	})
	//return maxClass
    let classData = {}
  	await Promise.all(
    	maxClass.map(async classSection => {
    		classSection    = classSection.toJSON()
    		let className   = classSection.classes.name
    		let sectionName = classSection.section.name
    		let subjectName = classSection.subject.subject_name

    		let percentage 	= parseFloat(classSection.obtain_total_mark) * 100 / parseFloat(classSection.exam_total_mark)

      		let maxObj	= {
      						subject_name: subjectName,
    						max_avg : percentage,
    						total_mark:classSection.total_mark
    					  }

    		if(!classData[className+" ("+sectionName+")"])
    			classData[className+" ("+sectionName+")"] = []

    			classData[className+" ("+sectionName+")"].push(maxObj)
    	})
    )

  	finalObj = { tiles_data : subjectArr ,class_data : classData}
	return { success: true, message: "Exam data", data : finalObj}
}


/**
 * API for top student Perfromer data 
 */
async function subjectToper(examIds, subjectCode ){
	let whereCondition = {
		exam_id : { [Op.in] : examIds },
		subject_code : subjectCode
	}

	let toper = await Marks.findOne({
		where : whereCondition,
		attributes:[
                    [ Sequelize.fn('SUM', Sequelize.col('exam_total_mark')), 'exam_total_mark' ],
                    [ Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'obtain_total_mark' ],
                    'student_id',
                    'subject_code'
                  ],
		group:['student_id','subject_code'],
		order : [
	             	[Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'desc']
	            ],
	    limit : 1
	})

    let maxPercent 	= parseFloat(toper.obtain_total_mark) * 100 / parseFloat(toper.exam_total_mark)

	return maxPercent
}

/**
 * API for get school branch counts 
 */
async function schoolBranchCount(query, user){
	let totalSchoolsCount  = await SchoolDetails.count();
	let totalBranchesCount = await Branch.count();
	let totalUsersCount    = await Authentication.count();
	let totalRaisedTickets = await Ticket.count()
	let totalClosedTickets = await Ticket.count({
									 where : { status : 'resolved'}
								   });
	
	let schools = await SchoolDetails.findAll({
		attributes : ['school_id','school_name'],
  	 	include: [{ 
                	model:Branch,
                	as:'branch',
                	attributes : ['branch_vls_id','branch_name'],
                	include: [{ 
	                	model:Authentication,
	                	as:'users',
	                	attributes : ['auth_vls_id']
	            	}]
            	}]
  	 })
	let schoolUsers = []
	await Promise.all(
    	schools.map(async (school)=> {
    		school       = school.toJSON()
    		let branches = school.branch
    		if(branches.length){
    			let sCount = 0
	    		branches.map(async (branch ,bIndex)=> {
	    			let count = branch.users.length
	    			delete school['branch'][bIndex]['users']
	    			school['branch'][bIndex]['usersCount'] = count;
	    			sCount += count
	    		})
	    		school['usersCount'] = sCount;
    		}
    		//acitve community 
			let activeCommunitiesCount  = await CommunityChat.count({
				where : { 
							community_status : 'Active',
							school_vls_id    : school.school_id
						}
			});
			school['activeCommunitiesCount'] = activeCommunitiesCount;
    		//tickets
    		let raisedSchoolCount = await Ticket.count({
					where : { status : 'resolved',
							  school_vls_id : school.school_id
							}
			});
    		let closedSchoolCount = await Ticket.count({
					where : {
							  school_vls_id : school.school_id
							}
			});
			school['raisedSchoolCount'] = raisedSchoolCount;
			school['closedSchoolCount'] = closedSchoolCount;
    		schoolUsers.push(school)

    	})
    )
    
    let finalData   = { totalSchoolsCount , 
    					totalBranchesCount, 
    					totalUsersCount, 
    					totalRaisedTickets, 
    					totalClosedTickets,
    					schoolUsers
    				}
	return { success: true, message: "Dashboard counts", data : finalData} 
}

/**
 * API for get top 10 student counts 
 */
async function getTopTenStudent(params, user){
	if(!params.school_vls_id) throw 'school_vls_id is required'

	let school_vls_id = params.school_vls_id
	//current academin year
	let academicYear  = await AcademicYear.findOne({
		                order : [
				             		['id', 'desc']
				            	],
				        attributes:['id','session_year']
		              	})

	let branchFilter = { 
						 school_id : school_vls_id ,
						 academic_year_id : academicYear.id
					   }

	if(params.branch_vls_id) 
		branchFilter.branch_vls_id = params.branch_vls_id

	if(params.examType) 
		branchFilter.test_type = params.examType

	if(params.exam_id) 
		branchFilter.test_id = params.exam_id
	
	//latest exam
	let letestExam = await Exams.findOne({
		where : branchFilter,
		order : [
             		['test_id', 'desc']
            	],
        attributes : ['test_id']    	
	})

	if(!letestExam) throw 'Exams not found'
	
	let whereConditions = { 
		exam_id   : letestExam.test_id,
		school_id : school_vls_id
	}

	if(params.subject_code) 
		whereConditions.subject_code = params.subject_code

	if(params.class_id) 
		whereConditions.class_id = params.class_id
	if(params.section_id) 
		whereConditions.section_id = params.section_id
	
	let studentData = await topTenPerformer(whereConditions)

	return { success: true, message: "Top ten performance", data : studentData}

}


/**
 * API for top Ten Perfromer data 
 */
async function topTenPerformer(whereConditions){
	let allMarks = await Marks.findAll({
		where : whereConditions,
		attributes:[
                    [ Sequelize.fn('SUM', Sequelize.col('exam_total_mark')), 'exam_total_mark' ],
                    [ Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'obtain_total_mark' ],
                    'student_id'
                  ],
        include: [{ 
	                model:Student,
	                as:'student',
	                attributes:['name','photo'],
	                include: [{ 
		                model:Section,
		                as:'section',
		                attributes:['name']
		            },{ 
		                model:Classes,
		                as:'classes',
		                attributes:['name']
		            },{ 
		                model:Branch,
		                as:'branchDetailsStudent',
		                attributes:['branch_name']
		            }]
	            }],
		group:['student_id'],
		order : [
	             	[Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'desc']
	            ],
	    limit : 10
	})
	let addedPercentage = []
	await Promise.all(
		allMarks.map(async (student)=> {
			student = student.toJSON()
			let percent = (student.obtain_total_mark * 100) /  student.exam_total_mark
			student.percentage = percent
			addedPercentage.push(student)
		})
	)
	return addedPercentage
}