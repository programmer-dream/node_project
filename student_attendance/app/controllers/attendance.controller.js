const { validationResult } = require('express-validator');
const db = require("../models");
const moment = require("moment");
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const StudentAttendance = db.StudentAttendance;
const Classes = db.Classes;
const Section = db.Section;
const Student = db.Student;
const AcademicYear = db.AcademicYear;
const Authentication = db.Authentication;
const StudentAbsent = db.StudentAbsent;
const Subject 		= db.Subject;
const Guardian 		= db.Guardian;


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
  dashboardAttendanceCount
};


/**
 * API for create new query
 */
async function create(req, user){
	if(user.role =='student' || user.role =='guardian') 
		throw 'Unauthorised User'

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
	user.class_id = req.body.classID
	user.section_id = 0
	if(req.body.sectionID)
		user.section_id = req.body.sectionID

	let presentStudent	= req.body.present
	let absentStudent	= req.body.absent

	let day = 'day_'+moment().format('D')
	let allAttendance = []

  	let presentStudentArray = await mergeStudents(user, day, presentStudent, allAttendance, 'P')

  	let finalStudentArray = await mergeStudents(user, day, absentStudent, presentStudentArray, 'A')
  	
  return { success: true, message: "Student attendance created successfully", data:finalStudentArray};
};


async function mergeStudents(user, day, studentArray, all_attendance, status){
	
	await Promise.all(
	  	studentArray.map(async student_vls_id => {
			let pStudent = await Student.findOne({
				where : {student_vls_id : student_vls_id}
			});

			let academicYear = await AcademicYear.findOne({
				where : {
							school_id  : user.school_id,
							is_running : 1
						}
			});

			let attendanceP = {
				student_id: student_vls_id,
				branch_vls_id: user.branch_vls_id,
				class_id: user.class_id,
				section_id: user.section_id,
				school_id: user.school_id,
				academic_year_id: academicYear.id,
				month: getDate('month'),
				year: getDate('year'),
				created_by: user.user_vls_id
			}
			attendanceP[day] = status

			let attendance = await StudentAttendance.findOne({
							  	where : {
							  		student_id:student_vls_id,
							  		month:attendanceP.month,
							  		year:attendanceP.year
							  	}
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

	let studentAttendance = await StudentAttendance.findAll({
		where : {
			student_id : {[Op.in] : studentIDs },
			month	   : attendance.month,
			year 	   : attendance.year
		}
	})

	if(studentAttendance.length < 1) 
		throw "Attendance not found for this date or month"

	await StudentAttendance.update(attendance, {
		where : {
			student_id : {[Op.in] : studentIDs },
			month	   : attendance.month,
			year 	   : attendance.year
		}
	})

	let updatedStudent = await StudentAttendance.findAll({
		where : {
			student_id : {[Op.in] : studentIDs },
			month	   : attendance.month,
			year 	   : attendance.year
		}
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

	if(params.size)
    	limit = parseInt(params.size)
  	if(params.page)
    	offset = 0 + (parseInt(params.page) - 1) * limit
    if(params.orderBy && params.orderBy == 'asc')
    	orderBy = 'asc'
	let classes  = await Classes.findAll({  
	                  limit:limit,
	                  offset:offset,
	                  order: [
	                          ['class_vls_id', orderBy]
	                  ],
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
                            }]
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

	if(!params.class_id) throw 'class_id is required'
    if(!params.branch_vls_id) throw 'branch_vls_id is required'

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

	let classes  = await Student.findAll({  
			                  limit:limit,
			                  offset:offset,
			                  where:whereCondtion,
			                  order: [
			                          ['student_vls_id', orderBy]
			                  ],
			                  attributes: [
				                  'student_vls_id',
				                  'class_id',
				                  'section_id',
				                  'name',
				                  'phone',
				                  'photo'
			                  ],
			                  include: [{ 
	                              model:Guardian,
	                              as:'parent',
	                              attributes: ['name','photo']
	                            }]
			            });
  return { success: true, message: "Student list", data:classes };
};

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
	//return req.body
	let student = await Student.findOne({
				where : {student_vls_id : req.body.student_id}
			});
	let date_of_absent = moment(req.body.dateOfAbsent).format('YYYY-MM-DD')
	//return student
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

	let studentAbsent = await StudentAbsent.create(reasonData)
	if(!studentAbsent) throw 'Leave reason not updated'

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
	
	if(!params.class_id) throw 'Class_id is required'
    	whereCondtion.class_id = params.class_id

    if(!params.school_id) throw 'School_id is required'
    	whereCondtion.school_id = params.school_id

    if(!params.branch_id) throw 'Branch_id is required'
    	whereCondtion.branch_vls_id = params.branch_id

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

  	return { success: true, message: "attendance list", data: attendanceArray.student }
};


async function daysArray(attendance, checkForParentStudent = false, checkCondition){
	let studentFinal = []
	let presentCount = 0
	let absentCount  = 0
	let currentDay = moment().format('D')
	await Promise.all(
		attendance.map(async student => {
			let studentdata = []
			student = student.toJSON()

			for(var i = 1; i<=31; i++){
				if(student.hasOwnProperty('day_'+i) ){
					(checkCondition) ? if(i <= currentDay){ : ""
						let status = student['day_'+i]
						let reason = null

						if(student['day_'+i] == 'A'){
							absentCount +=1

							let absent_date = student.year +"-"+moment().month(student.month).format("M")+"-"+i

							let absent = await StudentAbsent.findOne({
											where:{
												student_id:student.student_id,
												date_of_absent:{ 
								                  [Op.between]: [absent_date, absent_date]
								                }
											},
											attributes:['id', 'reason', 'date_of_absent']
										})
							if(absent)
								reason = absent.toJSON()

						}else if(student['day_'+i] == 'P'){
							presentCount += 1
						}
						 	
						let dayData = {
							day: i,
							status:status,
							reason: reason
							
						}

						studentdata.push(dayData)

					(checkCondition) ? } : ""
					
					delete student['day_'+i]
				}
			}

			(studentdata.length > 1) ? student.days = studentdata : student.days = studentdata[0]

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

    if(!params.branch_id) throw 'Branch_id is required'
    	whereCondtion.branch_vls_id = params.branch_id

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
	
	if(!params.branch_id) throw 'branch_id is required'
    	whereCondtion.branch_vls_id = params.branch_id

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
								'class_id'
							]
					});
    return { success: true, message: "List children", data:students }
};


/**
 * API for update leave reason
 */
async function updateLeaveReason(req, user){
	if(user.role !='guardian') 
		throw 'Unauthorised User'
	let id       = req.params.id
	const errors = validationResult(req);
	if(errors.array().length) throw errors.array()

	let date_of_absent = moment(req.body.dateOfAbsent).format('YYYY-MM-DD')
	//return student
	let reasonData = {
		student_id : req.body.student_id,
		modified_by: user.userVlsId,
		parent_id  : user.userVlsId,
		reason     : req.body.reason,
		date_of_absent  : date_of_absent
	}

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

      let allClasses = []
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
async function dashboardAttendanceCount(user){
	// if(user.role !='teacher') 
	// 	throw 'Unauthorised User'
	let allAttendance = []
	let presentCount  = 0
	let absentCount   = 0
	let sections   = await Section.findAll({
                     where:{
                            teacher_id   : user.userVlsId
                           },
                      attributes: ['id','class_id']   
                  });

	//return sections
	if(sections.length){
		await Promise.all(
		sections.map(async section => {
				let attendances  = await StudentAttendance.findAll({
					where: {
						class_id   : section.class_id,
						section_id : section.id
					}
				})
			 	if(attendances.length){
			 		attendances.map(async attendance => {
				 		for(var i = 1; i<=31; i++){
				 			if(attendance['day_'+i] =='P'){
				 				presentCount++
				 			}else if(attendance['day_'+i] =='A'){
				 				absentCount++
				 			}
				 		}
			 		})
				}
			}
		  )
		)
	}else{
		let classes   = await Classes.findAll({
                     	where:{
                            teacher_id   : user.userVlsId
                           },
                      attributes: ['class_vls_id']   
                  });
		//return classes
		await Promise.all(
			classes.map(async singleClass => {
				let attendances  = await StudentAttendance.findAll({
					where: {
						class_id   : singleClass.class_vls_id,
					}
				})
			 	if(attendances.length){
			 		attendances.map(async attendance => {
				 		for(var i = 1; i<=31; i++){
				 			if(attendance['day_'+i] =='P'){
				 				presentCount++
				 			}else if(attendance['day_'+i] =='A'){
				 				absentCount++
				 			}
				 		}
			 		})
				}
			}
		  )
		)
	}
	let data = {present : presentCount, absent : absentCount }
	return { success: true, message: "present & absent count" ,data : data};
};