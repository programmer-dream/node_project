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
const Authentication = db.Authentication;


module.exports = {
  list,
  getExamMarks
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
	                attributes: ['id']
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
