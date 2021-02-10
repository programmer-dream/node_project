const { validationResult } = require('express-validator');
const db 	 	 = require("../models");
const moment 	 = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const Op 	 	 = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const Exams      = db.Exams;
const Marks      = db.Marks;
const Student    = db.Student;
const SubjectList    = db.SubjectList;


module.exports = {
  list,
  getExamMarks
};


/**
 * API for list exams
 */
async function list(params , user){
  let whereConditions = {}
  let joinWhere = {}
  if(user.role == 'student'){
  	 let student = await Student.findByPk(user.userVlsId)

  	 whereConditions.branch_vls_id = student.branch_vls_id
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
	                attributes: ['id']
	            }]
			  	
  	})

  return { success: true, message: "Exam list", data : exams}	    
};

/**
 * API for get marks
 */
async function getExamMarks(params , user){
	let id = params.id
	let whereConditions = { exam_id : id}

  	if(user.role == 'student'){
	  	let student = await Student.findByPk(user.userVlsId)
	  	
	  	whereConditions.class_id   = student.class_id
	  	whereConditions.student_id = user.userVlsId
  	}

	let subjectMarks = await Marks.findAll({
		where : whereConditions,
		include: [{ 
	                model:SubjectList,
	                as:'subject',
	                attributes: ['subject_name']
	            }]
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
