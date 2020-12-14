const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");
const facultyPersonal = db.facultyPersonal;
const facultyProfessional = db.facultyProfessional;
const Authentication = db.Authentication;
const sequelize = db.sequelize;

module.exports = {
  create,
  view,
  list,
  update,
  facultyDelete,
  bulkDelete
};

async function create(req, res){
	const t = await sequelize.transaction();
	const errors = validationResult(req);
	try {
	   if(errors.array().length)
   	  	 return { success: false, message: errors.array() };

   	   	 if(req.file){
			req.body.profilepic = req.file.filename;
		  }
   		 const faculty = await facultyPersonal.create(req.body,{ transaction: t });
   		 let password = bcrypt.hashSync(req.body.password, 8);
   		 let user_id = Date.now()
   		 let auth = {
   		 				userType:"Faculty",
   		 				userVlsId:faculty.facultyVlsId,
   		 				userId: user_id,
   		 				password:password,
   		 				oldPassword1:password
   		 };
   		 let created_faculty = faculty.toJSON()
   		 created_faculty.userId = user_id;
   		 await Authentication.create(auth,{ transaction: t });
   		 await t.commit();
   		 return { success: true, message: 'Faculty was successfully created.',data: created_faculty};
   	  
	} catch (error) {
	   await t.rollback();
	   return { success: false, message: error.message };
	}
};


async function list(){
	let list =  await facultyPersonal.findAll()
  	return { success: true,message: 'Faculty listing',data:list};
};


async function view(id){
  	let faculty = await facultyPersonal.findByPk(id)
  	return { success: true, message: "Faculty data", data : faculty};
};


async function update(req){
	const errors = validationResult(req);
	if(req.file){
		req.body.profilepic = req.file.filename;
	}
   	let num = await facultyPersonal.update(req.body, {
    	where: { facultyVlsId: req.params.id }
  	})
  	if(num != 1 ) throw 'faculty not updated'
  	let faculty = await facultyPersonal.findByPk(req.params.id)
  	return { success: true, message: "Faculty data", data : faculty};	
};


async function facultyDelete(id){
	let num = await facultyPersonal.destroy({
    	where: { facultyVlsId: id }
    })
	 if(num != 1) throw 'Faculty not deleted'
	 return {success:true,message:'Faculty deleted successfully'}
};


async function bulkDelete(body){
  if(!Array.isArray(body.ids)) throw 'ids index must be an array'
  let num = await facultyPersonal.destroy({
    where: { facultyVlsId: body.ids }
  })
  if(num != 1) throw 'Faculty not deleted'
  return {success:true,message:'Faculty deleted successfully'}

};
