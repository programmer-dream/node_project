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


module.exports = {
  create,
  update,
  classList,
  studentList
};


/**
 * API for create new query
 */
async function create(req, user){
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

  studentAttendance =  await StudentAttendance.bulkCreate(finalStudentArray)
  return { success: true, message: "Student attendance created successfully", data:studentAttendance};
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

			all_attendance.push(attendanceP)
	  	})
  	);

  	return all_attendance
}

/**
 * API for update new query
 */
async function update(req, user){
	const errors = validationResult(req);
	if(errors.array().length) throw errors.array()

	let student_vls_id	= req.body.student_vls_id
	let attendance 		= {}
	let day 			= 'day_'+moment(req.body.date).format('D')
	let present         = 'A';
	let student = await Student.findOne({
		where : {student_vls_id : student_vls_id}
	})
	if(!student) throw 'Student not found'

	if(req.body.present)  
			present = 'P'

	attendance.student_id 		= student.student_vls_id
	attendance.branch_vls_id 	= student.branch_vls_id
	attendance.class_id 		= student.class_id
	attendance.section_id 		= student.section_id
	attendance.school_id 		= student.school_id
	let academicYear = await AcademicYear.findOne({
		where : {
					school_id  : student.school_id,
					is_running : 1
				}
	})
	attendance.academic_year_id 	   = academicYear.id
	attendance.month 			  	   = getDate('month')
	attendance.year 			  	   = getDate('year')
	attendance[day] 				   = present
	attendance.modified_by 		   	   = user.userVlsId
	let studentAttendance = await StudentAttendance.findOne({
		where : {student_id : student_vls_id}
	})

	num =  await StudentAttendance.update(attendance,{
		where:{student_id : student_vls_id}
	})
	if(num)
	   studentAttendance =  await StudentAttendance.findOne({
	   	where:{student_id : student_vls_id}
	   })
  
  return { success: true, message: "Student attendance updated successfully", data : studentAttendance };
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
 * API for list classes 
 */
async function studentList(params){
	let orderBy 		= 'desc'
	let limit   		= 10
	let offset  		= 0
	let whereCondtion 	= {}

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
				                  'mother_name',
				                  'mother_name'
			                  ]
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