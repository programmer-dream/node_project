const { validationResult } = require('express-validator');
const {updateRewardsPoints} = require('../../../helpers/update-rewards')
const db = require("../../../models");
const moment = require("moment");
const Op = db.Sequelize.Op;
const Sequelize 			= db.Sequelize;
const sequelize 			= db.sequelize;
const StudentAttendance = db.StudentAttendance;
const Classes 				= db.Classes;
const Section 				= db.Section;
const Student 				= db.Student;
const AcademicYear 		= db.AcademicYear;
const Authentication 	= db.Authentication;
const StudentAbsent 		= db.StudentAbsent;
const Subject 				= db.Subject;
const Guardian 			= db.Guardian;
const SubjectList   		= db.SubjectList;
const Branch   			= db.Branch;
const SchoolDetails   	= db.SchoolDetails;
const TeacherAttendance = db.TeacherAttendance;
const Employee 			= db.Employee;
const Role 					= db.Role;


module.exports = {
  create,
  update,
  classList,
  studentList,
  addLeaveReason,
  listForTeacher,
  listForParent,
  listParentChildren,
  updateLeaveReason,
  teacherClasses,
  dashboardAttendanceCount,
  getBranchAttendance,
  getFullYearAttendance,
  getClassAttendance,
  teacherCreate,
  teacherUpdate,
  teacherList
};


/**
 * API for create new query
 */
async function create(req, user){
	if(user.role =='student' || user.role =='guardian') 
		throw 'Unauthorised User'
	let tokenUser = user
	const errors = validationResult(req);
	if(errors.array().length) throw errors.array()

	user = await Authentication.findOne({
		where:{auth_vls_id: user.id},
		attributes: [
						'auth_vls_id',
	      			   	'school_id',
	      			   	'branch_vls_id',
	      			   	'user_vls_id'
      			   ]})
	
	let isSubjectAttendanceEnable = await isSubjectAttendance(user.branch_vls_id);
	
	if(isSubjectAttendanceEnable && !req.body.subject_code )
		throw 'subject_code is required'
	
	user = user.toJSON()
	user.class_id = req.body.classID
	user.section_id = 0
	if(req.body.sectionID)
		user.section_id = req.body.sectionID

	let presentStudent	= req.body.present
	let absentStudent	= req.body.absent
	let subject_code    = null

	if(req.body.subject_code)
		subject_code    = req.body.subject_code

	let day = 'day_'+moment().format('D')
	let allAttendance = []

  	let presentStudentArray = await mergeStudents(user, day, presentStudent, allAttendance, 'P', subject_code)

  	let finalStudentArray = await mergeStudents(user, day, absentStudent, presentStudentArray, 'A', subject_code)
  	
  	await updateRewardsPoints(tokenUser, 'add_attendance', "increment")
  return { success: true, message: "Student attendance created successfully", data:finalStudentArray};
};


async function mergeStudents(user, day, studentArray, all_attendance, status, subject_code){
	
	await Promise.all(
	  	studentArray.map(async student_vls_id => {
			let pStudent = await Student.findOne({
				where : {student_vls_id : student_vls_id}
			});

			let academicYear = await AcademicYear.findOne({
				where : {
							school_id  : user.school_id,
							is_running : 1,

						}
			});

			let attendanceP = {
				student_id: student_vls_id,
				branch_vls_id: user.branch_vls_id,
				class_id: user.class_id,
				section_id: user.section_id,
				school_id: user.school_id,
				academic_year_id: academicYear.id,
				month: await getDate('month'),
				year: await getDate('year'),
				created_by: user.user_vls_id
			}
			//where condition 
			let whereCondtion = {
		  		student_id:student_vls_id,
		  		month:attendanceP.month,
		  		year:attendanceP.year,
		  	}
		  	//check subject code
			if(subject_code){
				attendanceP.subject_code = subject_code
				whereCondtion.subject_code = subject_code
			}

			attendanceP[day] = status

			let attendance = await StudentAttendance.findOne({
							  	where : whereCondtion
							  })
			
			if(attendance){
				attendance.update(attendanceP)
			}else{
				StudentAttendance.create(attendanceP)
			}
			all_attendance.push(attendanceP)
	  	})
  	);

  	return all_attendance
}


/**
 * API for update new query
 */
async function update(req, user){
	if(user.role =='student' || user.role =='guardian') 
		throw 'Unauthorised User'

	const errors = validationResult(req);
	if(errors.array().length) throw errors.array()
	let userdata = await Authentication.findOne({
		where:{auth_vls_id: user.id},
		attributes: [
						'auth_vls_id',
	      			   	'school_id',
	      			   	'branch_vls_id',
	      			   	'user_vls_id'
      			   ]})
	let isSubjectAttendanceEnable = await isSubjectAttendance(userdata.branch_vls_id);

	if(isSubjectAttendanceEnable && !req.body.subject_code )
		throw 'subject_code is required'

	let studentIDs		= req.body.studentIDs

	let attendance 		= {}
	let day 			= 'day_'+moment(req.body.date).format('D')
	let present         = 'A';
	
	if(req.body.present)  
		present = 'P'

	attendance.month 			= moment(req.body.date).format('MMMM')
	attendance.year 			= moment(req.body.date).format('YYYY')
	attendance[day] 			= present
	attendance.modified_by 		= user.userVlsId

	let whereCondtion = {
			student_id : {[Op.in] : studentIDs },
			month	   : attendance.month,
			year 	   : attendance.year
		}

	if(req.body.subject_code){
		whereCondtion.subject_code  = req.body.subject_code
		attendance.subject_code     = req.body.subject_code
	}
	
			
	let studentAttendance = await StudentAttendance.findAll({
		where : whereCondtion
	})
	
	if(studentAttendance.length < 1) 
		throw "Attendance not found for this date or month"
	
	await StudentAttendance.update(attendance, {
		where : whereCondtion
	})

	let updatedStudent = await StudentAttendance.findAll({
		where : whereCondtion
	})

  	return { success: true, message: "Student attendance updated successfully", data: updatedStudent};
};


/**
 * API for list classes 
 */
async function classList(params){
	let orderBy = 'desc'
	let limit   = 10
	let offset  = 0
	let whereCondtion = {}
 
	if(params.size)
    	limit = parseInt(params.size)

  	if(params.page)
    	offset = 0 + (parseInt(params.page) - 1) * limit

    if(params.orderBy && params.orderBy == 'asc')
    	orderBy = 'asc'

    if(params.branch_vls_id)
    	whereCondtion.branch_vls_id = params.branch_vls_id

	let classes  = await Classes.findAll({  
					  where:whereCondtion,
	                  limit:limit,
	                  offset:offset,
	                  attributes: ['class_vls_id',
	                  			   'name',
	                  			   'teacher_id',
	                  			   'numeric_name',
	                  			   'status',
	                  			   'branch_vls_id'],
	                  include: [{ 
                              model:Section,
                              as:'sections',
                              attributes: ['id','name']
                            }],
                      order: [
	                          ['class_vls_id', orderBy],
	                          [Section, 'id', 'asc']
	                  ]
	                  });
  
  return { success: true, message: "Class list", data:classes };
};


/**
 * API for list student 
 */
async function studentList(params){
	let orderBy 		= 'desc'
	let limit   		= 100
	let offset  		= 0
	let whereCondtion 	= {}
	let subjectCode 	= params.subject_code
	let start 			= null 
	let end   			= null

	if(!params.class_id) throw 'class_id is required'
    if(!params.branch_vls_id) throw 'branch_vls_id is required'

    let isSubjectAttendanceEnable = await isSubjectAttendance(params.branch_vls_id);

	if(isSubjectAttendanceEnable && !params.subject_code ){
		subjectCode = await getFirstSubject(params.branch_vls_id)
	}
		
	if(params.size)
    	limit = parseInt(params.size)
  	if(params.page)
    	offset = 0 + (parseInt(params.page) - 1) * limit
    if(params.orderBy && params.orderBy == 'asc')
    	orderBy = 'asc'
    if(params.class_id)
       whereCondtion.class_id 	= params.class_id
    if(params.section_id)
       whereCondtion.section_id = params.section_id
    if(params.branch_vls_id)
       whereCondtion.branch_vls_id = params.branch_vls_id

   	if(params.start )
    	start = params.start

    if(params.end )
    	end = params.end

	let students  = await Student.findAll({  
			                  limit:limit,
			                  offset:offset,
			                  where:whereCondtion,
			                  order: [
			                          ['student_vls_id', orderBy]
			                  ],
			                  attributes: [
				                  'student_vls_id',
				                  'branch_vls_id',
				                  'class_id',
				                  'section_id',
				                  'name',
				                  'phone',
				                  'father_name',
				                  'mother_name',
				                  'photo'
			                  ],
			                  include: [{ 
	                              model:Guardian,
	                              as:'parent',
	                              attributes: ['name','photo']
	                            }]
			            });

	let mergeStudentsAttendence = await mergeStudentAttendence(students,subjectCode)

	let year  		  = moment().format('YYYY');
	let month  		  = moment().format('MMMM');
	let totalDays     = moment().format('D');

	if(params.month)
		month = moment(params.month, 'M').format('MMMM')

	if(month != moment().format('MMMM'))
		totalDays = moment(year+"-"+params.month, "YYYY-MM").daysInMonth()

	let finalData = []
	 await Promise.all(
		mergeStudentsAttendence.map(async student => {
			let countPercentage = await studentCount(student.student_vls_id, year, month, totalDays)
			student.attendanceCounts = countPercentage
			student.percentage       = (countPercentage.present *100) /totalDays

			if(start && end){
				if(student.percentage >= start &&  student.percentage <= end){
					finalData.push(student) 
				}
			}else{
				finalData.push(student) 
			}
		})
	)
	
  	return { success: true, message: "Student list", data:finalData };
};


async function mergeStudentAttendence(students, subjectCode){
	let currentDay 	= "day_"+moment().format('D')
	let currentYear	= moment().format('YYYY')
	let currentMonth 	=  moment().format('MMMM')
	let studentAttendanceArray = []

	 await Promise.all(
		students.map(async student => {
			student = student.toJSON()
			let attributes = [currentDay]

			whereCondtion = {
				student_id 		: student.student_vls_id,
				class_id 		: student.class_id,
				branch_vls_id	: student.branch_vls_id,
				year			: currentYear,
				month			: currentMonth
			}

	    	if(subjectCode)
	    		whereCondtion.subject_code = subjectCode

		    //return whereCondtion
			let attendance  = await StudentAttendance.findOne({  
				                  where : whereCondtion,
				                  attributes:attributes
				                  });

			let currentDayAttendance = null
			if(attendance){
				attendance = attendance.toJSON()
				currentDayAttendance = attendance[currentDay]
			}
			student.attendance = currentDayAttendance
			studentAttendanceArray.push(student)
		})
	);
	 
	return studentAttendanceArray
}

function getDate(type) {
	let date ;
	switch(type) {
	  case 'month':
	     date =  moment().format('MMMM')
	    break;
	  case 'year':
	     date =  moment().format('YYYY')
	    break;
	  case 'day':
	     date =  moment().format('DD')
	    break;
	  default:
	    date =  moment()
	}
	return date;
}


/**
 * API for updateLeaveReason 
 */
async function addLeaveReason(req, user){
	if(user.role !='guardian') 
		throw 'Unauthorised User'

	const errors = validationResult(req);
	if(errors.array().length) throw errors.array()
	
	let student = await Student.findOne({
				where : {student_vls_id : req.body.student_id}
			});
	let isSubjectAttendanceEnable = await isSubjectAttendance(student.branch_vls_id);
	
	if(isSubjectAttendanceEnable && !req.body.subject_code )
		throw 'subject_code is required'

	let date_of_absent = moment(req.body.dateOfAbsent).format('YYYY-MM-DD')
	
	let reasonData = {
		student_id : req.body.student_id,
		school_id  : student.school_id,
		branch_id  : student.branch_vls_id,
		created_by : user.userVlsId,
		modified_by: 0,
		parent_id  : user.userVlsId,
		reason     : req.body.reason,
		date_of_absent  : date_of_absent
	}
	if(req.body.subject_code)
		reasonData.subject_code = req.body.subject_code

	let studentAbsent = await StudentAbsent.create(reasonData)
	if(!studentAbsent) throw 'Leave reason not updated'
	await updateRewardsPoints(user, 'add_absence_remarks', "increment")
	return { success: true, message: "Student leave reason added successfully", data:studentAbsent};
};


/**
 * API for list attendance for teacher
 */
async function listForTeacher(params, user){
	let orderBy 	= 'desc'
	let limit   	= 10
	let offset  	= 0
	let whereCondtion 	= {}
	let start 		= null 
	let end   		= null

	whereCondtion.subject_code = null
	if(!params.class_id) throw 'Class_id is required'
    	whereCondtion.class_id = params.class_id

    if(!params.school_id) throw 'School_id is required'
    	whereCondtion.school_id = params.school_id

    if(!params.branch_vls_id) throw 'branch_vls_id is required'
    	whereCondtion.branch_vls_id = params.branch_vls_id

    let isSubjectAttendanceEnable = await isSubjectAttendance(params.branch_vls_id);
	
	if(isSubjectAttendanceEnable && !params.subject_code )
		throw 'subject_code is required'

    if(params.subject_code)
    	whereCondtion.subject_code = params.subject_code

	if(params.size)
    	limit = parseInt(params.size)
  	if(params.page)
    	offset = 0 + (parseInt(params.page) - 1) * limit
    if(params.orderBy && params.orderBy == 'asc')
    	orderBy = 'asc'

    if(params.section_id )
    	whereCondtion.section_id = params.section_id
    if(params.student_id)
    	whereCondtion.student_id = params.student_id
    if(params.month){
    	whereCondtion.month = moment(params.month, 'M').format('MMMM')
    }else{
    	let currentMonth 	=  moment().format('MMMM');
    	whereCondtion.month = currentMonth
    }

    if(params.year){
    	whereCondtion.year 	= params.year
    }else{
    	let currentYear		= moment().format('YYYY');
    	whereCondtion.year 	= currentYear
    }

    if(params.start )
    	start = params.start

    if(params.end )
    	end = params.end

    let attendenceQuery = {  
	                  limit : limit,
	                  offset: offset,
	                  where : whereCondtion,
	                  order : [
	                          ['attendance_vls_id', orderBy]
	                  ],
	                  include: [{ 
                              model:Student,
                              as:'student',
                              attributes: ['name','photo']
                            }]
	                }
    if(params.day){
    	let attributes = ['attendance_vls_id', 'branch_vls_id', 'student_id','academic_year_id','class_id','section_id','school_id','month','year','created_by','modified_by']
    	attributes.push('day_'+params.day)

    	attendenceQuery = {  
	                  limit : limit,
	                  offset: offset,
	                  where : whereCondtion,
	                  order : [
	                          ['attendance_vls_id', orderBy]
	                  ],
	                  attributes:attributes,
	                  include: [{ 
                              model:Student,
                              as:'student',
                              attributes: ['name','photo']
                            }]
	                  }
    }
    
    //return whereCondtion
	let attendance  = await StudentAttendance.findAll(attendenceQuery);

	// return attendance
	let checkForParentStudent = false
	let checkCondition = false
	if(moment(params.month, 'M').format('MMMM') == moment().format('MMMM')){
		checkCondition = true
	}

	let attendanceArray = await daysArray(attendance, checkForParentStudent, checkCondition)

	if(params.student_id || params.day)
		return { 
					success: true, 
					message: "attendance list", 
					presentCount: attendanceArray.presentCount, 
					absentCount: attendanceArray.absentCount,
					data: attendanceArray.student 
				}
	let allStudent = attendanceArray.student
	//return allStudent
	let filterArr  = []
	await Promise.all(
		allStudent.map(async student => {
			if(start && end){
				if(student.percent >= start &&  student.percent <= end){
					filterArr.push(student) 
				}
			}else{
				filterArr.push(student) 
			}
		})
	)
	attendanceArray.student = filterArr
  	return { success: true, message: "attendance list", data: attendanceArray.student}
};


async function daysArray(attendance, checkForParentStudent = false, checkCondition){
	let studentFinal = []
	let presentCount = 0
	let absentCount  = 0
	let currentDay = moment().format('D')
	await Promise.all(
		attendance.map(async student => {
			let studentPresent = 0
			let studentAbsent  = 0
			let studentdata = []
			student = student.toJSON()
			let year     = student.year+'-'+student.month
			let monthNum = moment().month(student.month).format("M")
			let totalDays = moment(year+"-"+monthNum, "YYYY-MM").daysInMonth()

			for(var i = 1; i<=totalDays; i++){
				if(student.hasOwnProperty('day_'+i) ){
					currentDay = (checkCondition) ?  currentDay : 31
					if(i <= currentDay){
						let status = student['day_'+i]
						let reason = null

						if(student['day_'+i] == 'A'){
							absentCount +=1
							studentAbsent++
							let absent_date = student.year +"-"+moment().month(student.month).format("M")+"-"+i

							let absent = await StudentAbsent.findOne({
											where:{
												student_id:student.student_id,
												date_of_absent:{ 
								                  [Op.between]: [absent_date, absent_date]
								                },
								                subject_code:student.subject_code
											},
											attributes:['id', 'reason', 'date_of_absent']
										})
							if(absent)
								reason = absent.toJSON()

						}else if(student['day_'+i] == 'P'){
							presentCount += 1
							studentPresent++
						}
						 	
						let dayData = {
							day: i,
							status:status,
							reason: reason
							
						}

						studentdata.push(dayData)
					}
					delete student['day_'+i]
				}
			}

			if(studentdata.length > 1){ 
				student.days = studentdata 
				student.counts = { studentPresent , studentAbsent}
				student.percent =  (studentPresent * 100)/ totalDays
			}else {
				student.days = studentdata[0]
			}
			studentFinal.push(student)
		})
	)
	
	if(checkForParentStudent && studentFinal.length > 0 && studentFinal.length < 2) studentFinal = studentFinal[0]

	return { student:studentFinal, presentCount, absentCount }
}


/**
 * API for list attendance for parent and Student
 */
async function listForParent(params, user){
	let orderBy 	= 'desc'
	let limit   	= 10
	let offset  	= 0
	let whereCondtion 	= {}

	whereCondtion.subject_code = null
	if(user.role == 'student'){
		let student = await Student.findByPk(user.userVlsId)
		whereCondtion.class_id = student.class_id
		whereCondtion.student_id = student.student_vls_id
	}else{
		if(!params.class_id)   throw 'Class_id is required'
		if(!params.student_id) throw 'Student_id is required'

		whereCondtion.class_id     = params.class_id
		whereCondtion.student_id   = params.student_id
	}

    if(!params.school_id) throw 'School_id is required'
    	whereCondtion.school_id = params.school_id

    if(!params.branch_vls_id) throw 'branch_vls_id is required'
    	whereCondtion.branch_vls_id = params.branch_vls_id

    let isSubjectAttendanceEnable = await isSubjectAttendance(params.branch_vls_id);
	
	if(isSubjectAttendanceEnable && !params.subject_code )
		throw 'subject_code is required'

    if(params.subject_code)
    	whereCondtion.subject_code = params.subject_code

	if(params.size)
    	limit = parseInt(params.size)
  	if(params.page)
    	offset = 0 + (parseInt(params.page) - 1) * limit
    if(params.orderBy && params.orderBy == 'asc')
    	orderBy = 'asc'

    if(params.section_id )
    	whereCondtion.section_id = params.section_id
    
    if(params.month){
    	whereCondtion.month = moment(params.month, 'M').format('MMMM')
    }else{
    	let currentMonth 	=  moment().format('MMMM');
    	whereCondtion.month = currentMonth
    }

    if(params.year){
    	whereCondtion.year 	= params.year
    }else{
    	let currentYear		= moment().format('YYYY');
    	whereCondtion.year 	= currentYear
    }

    //return whereCondtion
    let attendenceQuery = {  
	                  limit : limit,
	                  offset: offset,
	                  where : whereCondtion,
	                  order : [
	                          ['attendance_vls_id', orderBy]
	                  ],
	                  include: [{ 
                              model:Student,
                              as:'student',
                              attributes: ['name','photo']
                            }]
	                }
    if(params.day){
    	let attributes = ['attendance_vls_id', 'branch_vls_id', 'student_id','academic_year_id','class_id','section_id','school_id','month','year','created_by','modified_by']
    	attributes.push('day_'+params.day)

    	attendenceQuery = {  
	                  limit : limit,
	                  offset: offset,
	                  where : whereCondtion,
	                  order : [
	                          ['attendance_vls_id', orderBy]
	                  ],
	                  attributes:attributes,
	                  include: [{ 
                              model:Student,
                              as:'student',
                              attributes: ['name','photo']
                            }]
	                  }
    }
    
    //return whereCondtion
	let attendance  = await StudentAttendance.findAll(attendenceQuery);
	//return attendance
	let checkForParentStudent = true
	let checkCondition = false
	if(moment(params.month, 'M').format('MMMM') == moment().format('MMMM')){
		checkCondition = true
	}

	let attendanceArray = await daysArray(attendance, checkForParentStudent, checkCondition)
	
  	return { 
				success: true, 
				message: "attendance list", 
				presentCount: attendanceArray.presentCount, 
				absentCount: attendanceArray.absentCount,
				data: attendanceArray.student 
			}
};


/**
 * API for list parent children
 */
async function listParentChildren(params, user){
	if(user.role !='guardian') 
		throw 'Unauthorised User'

	let whereCondtion = {}
	
	if(!params.branch_vls_id) throw 'branch_vls_id is required'
    	whereCondtion.branch_vls_id = params.branch_vls_id

    if(!params.school_id) throw 'school_id is required'
    	whereCondtion.school_id = params.school_id

    	whereCondtion.parent_vls_id = user.userVlsId

    let students = await Student.findAll({
						where : whereCondtion,
						attributes:[
								'student_vls_id',
								'name',
								'father_name',
								'mother_name',
								'class_id',
								'section_id'
							]
					});
    return { success: true, message: "List children", data:students }
};


/**
 * API for update leave reason
 */
async function updateLeaveReason(req, user){
	const errors = validationResult(req);
	if(errors.array().length) throw errors.array()

	if(user.role !='guardian') throw 'Unauthorised User'

	let id       = req.params.id
	let userdata = await Authentication.findOne({
		where:{auth_vls_id: user.id},
		attributes: ['branch_vls_id']
	})
	let isSubjectAttendanceEnable = await isSubjectAttendance(userdata.branch_vls_id);
	
	if(isSubjectAttendanceEnable && !req.body.subject_code )
		throw 'subject_code is required'

	let date_of_absent = moment(req.body.dateOfAbsent).format('YYYY-MM-DD')
	//return student
	let reasonData = {
		student_id : req.body.student_id,
		modified_by: user.userVlsId,
		parent_id  : user.userVlsId,
		reason     : req.body.reason,
		date_of_absent  : date_of_absent
	}
	if(req.body.subject_code)
		reasonData.subject_code = req.body.subject_code

	let studentAbsent = await StudentAbsent.findOne({
		where:{id:id}
	})

	if(!studentAbsent) throw 'Leave reason record not found'
		studentAbsent.update(reasonData)

	return { success: true, message: "Student leave reason updated successfully", data:studentAbsent};
};


/**
 * API for list teacher Classes
 */
async function teacherClasses(user){
	if(user.role !='teacher') 
		throw 'Unauthorised User'
	let allClasses = []
	let classes = await Classes.findAll({
                         where:{
                                teacher_id   : user.userVlsId
                               },
                          attributes: ['class_vls_id']   
                      });
    let sections = await Section.findAll({
                     where:{
                            teacher_id   : user.userVlsId
                           },
                      attributes: ['class_id']   
                  });
   
    if(classes.length > 0 || sections.length > 0){
        let subjectClasses = await Subject.findAll({
                             where:{
                                    teacher_id   : user.userVlsId
                                   },
                              attributes: ['class_id']   
                          });

        classes.map(singleClass => {
          allClasses.push(singleClass.class_vls_id)
        })

       sections.map(section => {
          allClasses.push(section.class_id)
        })

       subjectClasses.map(subjectClass => {
          allClasses.push(subjectClass.class_id)
        })

      allClasses = allClasses.filter(function(elem, pos) {
                return allClasses.indexOf(elem) == pos;
            })
      await Promise.all(allClasses);
  	}else{
  		let sectionClass = await Subject.findAll({
                             where:{
                                    teacher_id   : user.userVlsId
                                   },
                              attributes: ['class_id']   
                          })

      	await Promise.all(
	        sectionClass.map( async subject => {
	          allClasses.push(subject.class_id)
	        })
      	)
  	}

  	let classSecton = await Classes.findAll({
  		where:{
  			class_vls_id : { [Op.in] : allClasses }
  		},
  		include: [{ 
                  model:Section,
                  as:'sections',
                  attributes: ['id','name']
                }]
  	})
  	
	return { success: true, message: "List classes & sections" ,data:classSecton};
};


/**
 * API for count dashboard attendance 
 */
async function dashboardAttendanceCount(user, query){

	let currentYear   = moment().format('YYYY');
	let currentMonth  = moment().format('MMMM');
	let currentDay    = moment().format('D');
	
	let student       = {}
	let newData       = []
	let attendances   = {}

	if(query.student_vls_id){
		newData	= await studentCount(query.student_vls_id, currentYear, currentMonth, currentDay)
		return { success: true, message: "present & absent count" ,data : newData};
	}
	
	if(user.role =='teacher'){
		let classList = await teacherClasses(user)
			classList = classList.data

		newData	= await teacherCount(classList, currentYear, currentMonth, currentDay)
	}else if(user.role =='student'){
    	
		newData	= await studentCount(user.userVlsId, currentYear, currentMonth, currentDay)
		
	}else if( user.role == 'guardian' ){
		let studentDetails = await Student.findAll({
									where: { parent_vls_id: user.userVlsId },
									attributes: ['student_vls_id', 'name', 'email']
								})
		// return studentIds
		await Promise.all(
			studentDetails.map(async studentDetail => {
				let studentData	= await studentCount(studentDetail.student_vls_id, currentYear, currentMonth, currentDay)
				studentData.student_vls_id = studentDetail.student_vls_id
				studentData.name = studentDetail.name
				studentData.email = studentDetail.email
				newData.push(studentData)
			})
		);


	}else if(user.role =='branch-admin' || user.role =='principal' ){

		newData	= await classAttendanceCount(user, currentYear, currentMonth, currentDay, true )
	}

	return { success: true, message: "present & absent count" ,data : newData};
};


async function sectionWiseAttendance(class_id, section_id, currentYear, currentMonth, currentDay){
	let attributes = ['subject_code']
	let subjectAttendance = {}
	attributes.push('day_'+currentDay)

	let attendances  = await StudentAttendance.findAll({
					where: {
						class_id   : class_id,
						section_id : section_id,
						year : currentYear,
						month : currentMonth
					},
					attributes:attributes
				})
	
	if(attendances.length){
		await Promise.all(
			attendances.map(async attendance => {
				let subName = 'total'
				if(attendance.subject_code){
					subName = await SubjectList.findOne({
									where: {
										code : attendance.subject_code
									}
								})
					subName =  subName.subject_name
				}
				if(!subjectAttendance[subName]){
				  	subjectAttendance[subName] = {}
				  	subjectAttendance[subName]['present'] = 0
				  	subjectAttendance[subName]['absent'] = 0
				}

	 			if(attendance['day_'+currentDay] =='P'){
	 				console.log('present')
	 				subjectAttendance[subName]['present'] += 1
	 			}else if(attendance['day_'+currentDay] =='A'){
	 				console.log('absent')
	 				subjectAttendance[subName]['absent'] += 1
	 			}
	 		})
		)
	}
	return subjectAttendance
}


async function classWiseAttendance(class_id, currentYear, currentMonth, currentDay){
	let presentCount = 0
	let absentCount  = 0
	let attributes   = ['subject_code']
	let subjectAttendance = {}
	attributes.push('day_'+currentDay)
	let attendances  = await StudentAttendance.findAll({
				where: {
					class_id   : class_id,
					year : currentYear,
					month : currentMonth
				},
				attributes:attributes
			})
	if(attendances.length){
		await Promise.all(
			attendances.map(async attendance => {
				let subName = 'total'
				if(attendance.subject_code){
					subName = await SubjectList.findOne({
									where: {
										code : attendance.subject_code
									}
								})
					subName =  subName.subject_name
				}
				if(!subjectAttendance[subName]){
				  subjectAttendance[subName] = {}
				  subjectAttendance[subName]['present'] = 0;
				  subjectAttendance[subName]['absent'] = 0
				}
	 			if(attendance['day_'+currentDay] =='P'){
	 				subjectAttendance[subName]['present'] += 1
	 			}else if(attendance['day_'+currentDay] =='A'){
	 				subjectAttendance[subName]['absent'] += 1
	 			}
	 		})	
		)
	}
	return subjectAttendance
}


/**
 * API for teacher count dashboard attendance 
 */
async function teacherCount(classList, currentYear, currentMonth, currentDay){
	let newData = []
	
	await Promise.all(
			classList.map(async singleClass => {
				singleClass = singleClass.toJSON()
				if(singleClass.sections.length){
					let sections = singleClass.sections
					await Promise.all(
						sections.map(async (section , index) => {
							let data = await sectionWiseAttendance(singleClass.class_vls_id, section.id,currentYear, currentMonth, currentDay)
							singleClass.sections[index].attendance = data
						})
					)
					newData.push(singleClass)
				}else{
					let data = await classWiseAttendance(singleClass.class_vls_id, currentYear, currentMonth, currentDay)
					singleClass.attendance = data
					newData.push(singleClass)
				}
			})
		)
	return newData
}


/**
 * API for studentcount dashboard attendance 
 */
async function studentCount(userId, currentYear, currentMonth, currentDay){
	let presentCount = 0
	let absentCount  = 0
	let isSubjectEnable = false
	

	student = await Student.findOne({
					where : {student_vls_id:userId},
					attributes :['class_id','student_vls_id','branch_vls_id']
			  })
	if(!student)
		throw 'student not found'

	let whereCondtion = {
				class_id   : student.class_id,
				year 	   : currentYear,
				month      : currentMonth,
				student_id : student.student_vls_id
			}

	if(student){
		isSubjectEnable = await isSubjectAttendance(student.branch_vls_id)
		
		if(isSubjectEnable)
			whereCondtion.subject_code  = { [Op.not]: null }
	}
	
	attendances  = await StudentAttendance.findAll({
			where: whereCondtion,
			include: [{ 
                  model:SubjectList,
                  as:'subject',
                  attributes: ['subject_name']
                }]
		})
	
	if(!isSubjectEnable){
		if(attendances.length){
			await Promise.all(
				attendances.map(async attendance => {
			 		for(var i = 1; i<=currentDay; i++){
			 			if(attendance['day_'+i] =='P'){
			 				presentCount++
			 			}else if(attendance['day_'+i] =='A'){
			 				absentCount++
			 			}
			 		}
		 		})	
			)
		}
		return {present : presentCount, absent : absentCount}
	}else{
		let subjectWistAttendance = {}
		if(attendances.length){
			await Promise.all(
				attendances.map(async attendance => {
					let subject = attendance.subject.subject_name
					presentCount = 0
					absentCount  = 0
			 		for(var i = 1; i<=currentDay; i++){
			 			if(attendance['day_'+i] =='P'){
			 				presentCount++
			 			}else if(attendance['day_'+i] =='A'){
			 				absentCount++
			 			}
			 		}
			 		if(!subjectWistAttendance['subjects'])
			 			subjectWistAttendance['subjects'] = {}

			 		subjectWistAttendance['subjects'][subject] = {present : presentCount, absent : absentCount}
		 		})	
			)
		}else{
			if(!subjectWistAttendance['subjects'])
			 subjectWistAttendance['subjects'] = {}
		}
		return subjectWistAttendance
	}
}


/**
 * API for principal count dashboard attendance 
 */
async function classAttendanceCount(user,currentYear, currentMonth, currentDay, branchId = null){
	let newData = []
		   user = await Authentication.findOne({
					where:{auth_vls_id: user.id},
					attributes: ['school_id', 'branch_vls_id']
				})
	let whereCondtion = { school_id : user.school_id }

	if(branchId)
		whereCondtion.branch_vls_id = user.branch_vls_id

	let classSecton = await Classes.findAll({
  		where:whereCondtion,
  		include: [{ 
                  model:Section,
                  as:'sections',
                  attributes: ['id','name']
                }]
  	})
  	//return classSecton
  	await Promise.all(
			classSecton.map(async singleClass => {
				singleClass = singleClass.toJSON()
				if(singleClass.sections.length){
					let sections = singleClass.sections
					await Promise.all(
						sections.map(async (section , index) => {
							let data = await sectionWiseAttendance(singleClass.class_vls_id, section.id,currentYear, currentMonth, currentDay)
							singleClass.sections[index].attendance = data
						})
					)
					newData.push(singleClass)
				}else{
					delete singleClass.sections
					let data = await classWiseAttendance(singleClass.class_vls_id, currentYear, currentMonth, currentDay)
					singleClass.attendance = data
					newData.push(singleClass)
				}
			})
		)
	return newData
}


/**
 * API for check is subject attendance enable
 */
async function isSubjectAttendance(branchVlsId){

  let branch = await Branch.findOne({
          where : {
            branch_vls_id : branchVlsId
          },
          attributes: ['attendance_subject_wise'],
          include: [{ 
                      model:SchoolDetails,
                      as:'school',
                      attributes: ['attendance_subject_wise']
                    }]
        })

  if(branch.school.attendance_subject_wise == 'yes' && branch.attendance_subject_wise == 'yes')
  		return true
  		
  return false
}

/**
 * API for check is subject attendance enable
 */
async function getFirstSubject(branchVlsId){
	let subject  = await SubjectList.findOne({
	                        where:{
	                        	branch_vls_id : branchVlsId
	                        },
	                        attributes: ['id','subject_name','code']
	                      });
	return subject.code
}


/**
 * API for branch attendance 
 */
async function getBranchAttendance(query, user){
	let totalDays    = moment().format('D')
	let holidayCount = 0
	let presentCount = 0
	let absentCount  = 0
	let month     	 = moment().format('MMMM');
	let year  	  	 = moment().format('YYYY');
	
	let branchVlsId  = query.branch_vls_id
	if(!branchVlsId) throw 'branchVlsId is required'

	if(query.month)
		month     	 = query.month

	if(query.year)
		year     	 = query.year

	let whereCondtion = {
				branch_vls_id : branchVlsId,
				month 		  : month,
				year          : year
			}

	if(query.class_vls_id)
		whereCondtion.class_id     = query.class_vls_id

	if(query.section_id)
		whereCondtion.section_id   = query.section_id

	let monthNum  = moment().month(month).format("M");
	if(month != moment().format('MMMM'))
		totalDays = moment(year+"-"+monthNum, "YYYY-MM").daysInMonth()
	
	let count  = await StudentAttendance.count({
		where : whereCondtion
	})

	if(!count){
		return { success: true, message: "present & absent percentage" ,data : { present_percent:0, absent_percent:0 }};
	}

	for(let i = 1; i <=totalDays; i++){
		let attributes	= []
		let group	    = []
		attributes.push('day_'+i)
		attributes.push([ Sequelize.fn('COUNT', Sequelize.col('day_'+i)), 'count' ])
		group.push('day_'+i)

		let attendance  = await StudentAttendance.findAll({
			where : whereCondtion,
			attributes:attributes,
			group:group
		})
		let weekday = moment(year+'-'+month+'-'+i).format('dddd');

		if(weekday == 'Sunday'){
			holidayCount++;
		}
		attendance.forEach(function(attend){
			attend = attend.toJSON()
			
			if(attend['day_'+i] == 'P' && weekday != 'Sunday'){
				presentCount += attend['count'] 
			}

			if(attend['day_'+i] == 'A' && weekday != 'Sunday'){
				absentCount += attend['count'] 
			}
		})

	}

	let workDay 		= totalDays - holidayCount
	let totalDay 		= count * workDay
	let present_percent = (presentCount * 100 / totalDay).toFixed(2)
	let absent_percent  = (absentCount * 100 / totalDay).toFixed(2)

	return { success: true, message: "present & absent percentage" ,data : { present_percent, absent_percent }};
}


/**
 * API for branch full Year month wise attendance 
 */
async function getFullYearAttendance(query, user){
	let year  	  	 = moment().format('YYYY');
	let monthNum  	 = 3;
	let branchVlsId  = query.branch_vls_id
	if(!branchVlsId) throw 'branchVlsId is required'

	if(query.year)
		year     	 = query.year

	let monthWiseData 	= {}
	let dateStart 		= moment(year+'-'+monthNum);
	let nextYear  		= parseInt(year) + 1 
	let lastMonth  		= monthNum - 1 
	let dateEnd   		= moment(nextYear+'-'+lastMonth);
	let monthName 		= [];

	let condition = {
		branch_vls_id : branchVlsId
	}

	while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
	   condition.year  = dateStart.format('YYYY')
	   condition.month = dateStart.format('MMMM')
	   
	   let api = await getBranchAttendance(condition, user)
	   monthWiseData[condition.month] = api.data
	   dateStart.add(1,'month');
	}
	return { success: true, message: "present & absent percentage" ,data : monthWiseData}; 
}


/**
 * API for class wise attendance 
 */
async function getClassAttendance(params, user){
	let whereCondtion = {}
	let orderBy       = 'asc'
	let monthFilter   = false
	let sectionInclude = { 
                          model:Section,
                          as:'sections',
                          attributes: ['id','name']
                         }
	if(!params.branch_vls_id) throw 'branch_vls_id is required'
    	
    	whereCondtion.branch_vls_id = params.branch_vls_id

    if(params.class_vls_id)
    	whereCondtion.class_vls_id = params.class_vls_id

    let sectionFilter = {}
    if(params.section_id){
    	sectionInclude.where = { id: params.section_id}
    }

    if(params.month)
    	monthFilter = moment(params.month, 'M').format('MMMM')

	let classes  = await Classes.findAll({  
					  where:whereCondtion,
	                  attributes: ['class_vls_id',
	                  			   'name'
	                  			   ],
	                  include: [sectionInclude],
                      order: [
	                          ['class_vls_id', orderBy],
	                          [Section, 'id', 'asc']
	                  ]
	                  });

	let year  	  	 	= moment().format('YYYY');
	let monthNum  	 	= 3;
	let monthWiseData 	= {}
	let dateStart 		= moment(year+'-'+monthNum);
	let nextYear  		= parseInt(year) + 1 
	let lastMonth  		= monthNum - 1 
	let dateEnd   		= moment(nextYear+'-'+lastMonth);
	let monthName 		= [];

	let condition = {
		branch_vls_id : params.branch_vls_id
	}
	if(!monthFilter){
		while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
		   
		   monthName.push(dateStart.format('MMMM'))
		   dateStart.add(1,'month');
		}
	}else{
		monthName.push(monthFilter)
	}

	classData = []
	await Promise.all(
		classes.map(async sClass => {
			sClass = sClass.toJSON()
			let sections = sClass.sections
			if(sections.length){
				await getClassSectionAttendance(sections, sClass, condition, user,classData,monthName)
			}else{
				await getClassSectionAttendance([], sClass, condition, user,classData,monthName)				
			}
		})
	)
	return { success: true, message: "Class wise data" ,data : classData}; 
}

/**
 * API for class wise attendance 
 */
async function getClassSectionAttendance(sections, sClass, condition, user,classData,monthName){
	let classObj = {}
	if(sections.length){
		await Promise.all(
			sections.map(async cSection => {
				condition.class_id     = sClass.class_vls_id
				condition.section_id   = cSection.id

				let response = await getYearAttendance(monthName,condition,user,classData)
				response.classes = {
					className   : sClass.name,
					class_vls_id: sClass.class_vls_id,
					sectionName : cSection.name,
					section_id  : cSection.id
				}
				classData.push(response)
			})
		)
	}else{
		condition.class_id     = sClass.class_vls_id
		classObj.classes = {
							className   : sClass.name,
							class_vls_id: sClass.class_vls_id,
						}		
		let response = await getYearAttendance(monthName,condition,user,classData)
		response.classes = {
					className   : sClass.name,
					class_vls_id: sClass.class_vls_id
				}
		classData.push(response)
	}
}

async function getYearAttendance(monthName,condition,user,classData){
	let allMonths = {}
	await Promise.all(
		monthName.map(async function(item){
			condition.month = item
			let api = await getBranchAttendance(condition, user)
			allMonths[item] = api.data
		})
	)
	return allMonths
}


/**
 * Teacher attendance section create
 * create teacher attendance
 */
async function teacherCreate(req, user){
	if(user.role =='student' || user.role =='guardian') 
		throw 'Unauthorised User'
	let tokenUser = user
	const errors = validationResult(req);
	if(errors.array().length) throw errors.array()

	user = await Authentication.findOne({
		where:{auth_vls_id: user.id},
		attributes: [
						'auth_vls_id',
	      			   	'school_id',
	      			   	'branch_vls_id',
	      			   	'user_vls_id'
      			   ]})
	
	user = user.toJSON()

	let presentTeacher= req.body.present
	let absentTeacher	= req.body.absent

	let day = 'day_'+moment().format('D')
	let allAttendance = []

  	let presentTeacherArray = await mergeTeachers(user, day, presentTeacher, allAttendance, 'P')

  	let finalTeacherArray = await mergeTeachers(user, day, absentTeacher, presentTeacherArray, 'A')
  	
  return { success: true, message: "Teacher attendance created successfully", data:finalTeacherArray};
};

async function mergeTeachers(user, day, teacherArray, all_attendance, status){
	
	await Promise.all(
	  	teacherArray.map(async teacher_id => {

			let academicYear = await AcademicYear.findOne({
				where : {
							school_id  : user.school_id,
							is_running : 1,
						  }
			});

			let attendanceP = {
				teacher_id   		: teacher_id,
				branch_vls_id		: user.branch_vls_id,
				school_vls_id		: user.school_id,
				academic_year_id	: academicYear.id,
				month 				: await getDate('month'),
				year 					: await getDate('year'),
				created_by			: user.user_vls_id
			}

			//where condition 
			let whereCondtion = {
		  		teacher_id 	: teacher_id,
		  		month 		: attendanceP.month,
		  		year 			: attendanceP.year,
		  	}

			attendanceP[day] = status

			let attendance = await TeacherAttendance.findOne({
							  		where : whereCondtion
							  	  })
			
			if(attendance){
				attendance.update(attendanceP)
			}else{
				TeacherAttendance.create(attendanceP)
			}
			all_attendance.push(attendanceP)
	  	})
  	);

  	return all_attendance
}


/**
 * API for update new query
 */
async function teacherUpdate(req, user){
	if(user.role =='student' || user.role =='guardian') 
		throw 'Unauthorised User'

	const errors = validationResult(req);
	if(errors.array().length) throw errors.array()

	let userdata = await Authentication.findOne({
		where:{auth_vls_id: user.id},
		attributes: [
						'auth_vls_id',
   			   	'school_id',
   			   	'branch_vls_id',
   			   	'user_vls_id'
      			   ]})

	let teacherIDs		= req.body.teacherIDs

	let attendance 		= {}
	let day 					= 'day_'+moment(req.body.date).format('D')
	let present         	= 'A';
	
	if(req.body.present)
		present = 'P'

	attendance.month 			= moment(req.body.date).format('MMMM')
	attendance.year 			= moment(req.body.date).format('YYYY')
	attendance[day] 			= present
	attendance.modified_by 	= user.userVlsId

	let whereCondtion = {
		teacher_id 	: {[Op.in] : teacherIDs },
		month	   	: attendance.month,
		year 	   	: attendance.year
	}
		
	let studentAttendance = await TeacherAttendance.findAll({
		where : whereCondtion
	})
	
	if(studentAttendance.length < 1) 
		throw "Attendance not found for this date or month"
	
	await TeacherAttendance.update(attendance, {
		where : whereCondtion
	})

	let updatedTeacher = await TeacherAttendance.findAll({
		where : whereCondtion
	})

  	return { success: true, message: "Teacher attendance updated successfully", data: updatedTeacher};
};


/**
 * API for list teacher 
 */
async function teacherList(params){
	let orderBy 		= 'desc'
	let limit   		= 100
	let offset  		= 0
	let whereCondtion = {}
	let start 			= null 
	let end   			= null

   if(!params.branch_vls_id) throw 'branch_vls_id is required'
	
	if(params.size)
    	limit = parseInt(params.size)

  	if(params.page)
    	offset = 0 + (parseInt(params.page) - 1) * limit

   if(params.orderBy && params.orderBy == 'asc')
    	orderBy = 'asc'

   if(params.branch_vls_id)
       whereCondtion.branch_vls_id = params.branch_vls_id

	if(params.start )
 		start = params.start

   if(params.end )
    	end = params.end

   whereCondtion.isTeacher = 1 
	let teachers  = await Employee.findAll({  
			                  limit:limit,
			                  offset:offset,
			                  where:whereCondtion,
			                  order: [
			                          ['faculty_vls_id', orderBy]
			                  ],
			                  attributes: [
				                  'faculty_vls_id',
				                  'branch_vls_id',
				                  'name',
				                  'phone',
				                  'father_name',
				                  'mother_name',
				                  'photo'
			                  ]
			            });

	let mergeTeachersAttendence = await mergeTeacherAttendence(teachers)

	let year  		  = moment().format('YYYY');
	let month  		  = moment().format('MMMM');
	let totalDays    = moment().format('D');

	if(params.month)
		month = moment(params.month, 'M').format('MMMM')

	if(month != moment().format('MMMM'))
		totalDays = moment(year+"-"+params.month, "YYYY-MM").daysInMonth()
	
	let finalData = []
	 await Promise.all(
		mergeTeachersAttendence.map(async teacher => {
			let countPercentage = await teacherCount(teacher.faculty_vls_id, year, month, totalDays)
			teacher.attendanceCounts = countPercentage
			teacher.percentage       = (countPercentage.present *100) /totalDays

			if(start && end){
				if(teacher.percentage >= start &&  teacher.percentage <= end){
					finalData.push(teacher) 
				}
			}else{
				finalData.push(teacher) 
			}
		})
	)
	
  	return { success: true, message: "Teacher list", data:finalData };
};


async function mergeTeacherAttendence(teachers){
	let currentDay 				= "day_"+moment().format('D')
	let currentYear				= moment().format('YYYY')
	let currentMonth 				=  moment().format('MMMM')
	let teacherAttendanceArray = []

	 await Promise.all(
		teachers.map(async teacher => {
			teacher = teacher.toJSON()
			let attributes = [currentDay]

			whereCondtion = {
				teacher_id 		: teacher.faculty_vls_id,
				branch_vls_id	: teacher.branch_vls_id,
				year				: currentYear,
				month				: currentMonth
			}
			
		    //return whereCondtion
			let attendance  = await TeacherAttendance.findOne({  
				                  where : whereCondtion,
				                  attributes:attributes
				                  });

			let currentDayAttendance = null
			if(attendance){
				attendance = attendance.toJSON()
				currentDayAttendance = attendance[currentDay]
			}
			teacher.attendance = currentDayAttendance
			teacherAttendanceArray.push(teacher)
		})
	);
	 
	return teacherAttendanceArray
}


/**
 * API for studentcount dashboard attendance 
 */
async function teacherCount(userId, currentYear, currentMonth, currentDay){
	let presentCount 		= 0
	let absentCount  		= 0
	let isSubjectEnable 	= false
	
	teacher = await Employee.findOne({
					where : {faculty_vls_id:userId},
					attributes :['faculty_vls_id','branch_vls_id']
			  })
	if(!teacher)
		throw 'teacher not found'

	let whereCondtion = {
		year 	     : currentYear,
		month      : currentMonth,
		teacher_id : teacher.faculty_vls_id
	}
	
	attendances  = await TeacherAttendance.findAll({
			where: whereCondtion
		})
	
	if(attendances.length){
		await Promise.all(
			attendances.map(async attendance => {
		 		for(var i = 1; i<=currentDay; i++){
		 			if(attendance['day_'+i] =='P'){
		 				presentCount++
		 			}else if(attendance['day_'+i] =='A'){
		 				absentCount++
		 			}
		 		}
	 		})	
		)
	}
	return {present : presentCount, absent : absentCount}
}