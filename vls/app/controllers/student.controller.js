const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const StudentPersonal = db.StudentPersonal;
const StudentSchoolPersonal = db.StudentSchoolPersonal;
const Authentication = db.Authentication;
const sequelize = db.sequelize;
const bcrypt = require("bcryptjs");

module.exports = {
  create,
  view,
  list,
  update,
  studentDelete,
  bulkDelete
};

async function create(req){
	const t = await sequelize.transaction();
	const errors = validationResult(req);

	try {
	   if(errors.array().length){
   	  	 throw { success: false, message: errors.array() };
   	   }else{
	   	   	 if(req.file){
				req.body.profilepic = req.file.filename;
			 }

			
			const student = await StudentSchoolPersonal.create(req.body,{ transaction: t });

			let studentId = student.studentSchoolVlsId
			req.body.studentVlsId = studentId
			let password = bcrypt.hashSync(req.body.password, 8);
			let user_id = Date.now()
			let auth = {
				userType:"Student",
				userVlsId:studentId,
				userId: user_id,
				password:password,
				oldPassword1:password
			};
			let created_student = student.toJSON()
			created_student.userId = user_id;
			await StudentPersonal.create(req.body,{ transaction: t });
			await Authentication.create(auth,{ transaction: t });

			await t.commit();
			return { success: true , message: 'Student was successfully created.',data: created_student};

   	   }
	} catch (error) {
	   await t.rollback();
	   return { 
	   						success: false,
	   						message: error.message 
	   					};
	}
};

async function list(){
  let list =  await StudentSchoolPersonal.findAll()
  	  return { success: true,message: 'Student listing',data:list};
};

async function view(id){
  if(!id) throw { success: false,message: 'Student was not found' };
  	let school = await StudentSchoolPersonal.findByPk(id)
  	return { success: true, message: "Student data", data : school};
};

async function update(req){
   if(req.file){
	  req.body.profilepic = req.file.filename;
   }
   let num = await StudentSchoolPersonal.update(req.body, {
    where: { studentSchoolVlsId: req.params.id }
  })
   if(num != 1) throw 'Cannot update Student'
   let student  = await StudentSchoolPersonal.findByPk(req.params.id)
    return {
      success: true,
      message: "Student was updated successfully.",
      data:student
    }
};
async function studentDelete(id){
  let num = await StudentSchoolPersonal.destroy({
    where: { studentSchoolVlsId: id }
  })
	 if(num != 1) throw 'Student not deleted'
	 return {success:true,message:'Student deleted successfully'}
};
async function bulkDelete(body){
  if(!Array.isArray(body.ids)) throw 'ids index must be an array'

  let num = await StudentSchoolPersonal.destroy({
    where: { studentSchoolVlsId: body.ids }
  })
	 if(num != 1) throw 'Student not deleted'
	 return {success:true,message:'Student deleted successfully'}
};