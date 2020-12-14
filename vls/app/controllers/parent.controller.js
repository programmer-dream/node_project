const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const bcrypt = require("bcryptjs");
const Parent = db.Parent;
const Authentication = db.Authentication;

module.exports = {
  create,
  view,
  list,
  update,
  parentDelete,
  bulkDelete
};

async function create(req){
	const t = await sequelize.transaction();
	const errors = validationResult(req);
	try {
	   if(errors.array().length)
   	  	 return { success: false, message: errors.array() };
   	   
   	   	 if(req.file){
    			req.body.profilepic = req.file.filename;
    		 }
   		 const parent = await Parent.create(req.body,{ transaction: t });
   		 let password = bcrypt.hashSync(req.body.password, 8);
   		 let user_id  = Date.now()
   		 let auth = {
   		 				userType:"Parent",
   		 				userVlsId:parent.ParentVlsId,
   		 				userId: user_id,
   		 				password:password,
   		 				oldPassword1:password
   		 };
   		 created_parent = parent.toJSON()
   		 created_parent.userId = user_id
   		 await Authentication.create(auth,{ transaction: t });
   		 await t.commit();
   		 return { success: true, message: 'Parent was successfully created.',data: created_parent};
   	   
	} catch (error) {
	   await t.rollback();
	   return { success: false, message: error.message };
	}
};
async function list(req, res){
  let list = await Parent.findAll()
  return { success: true, message: 'Parent listing.',
  data:list};
};
async function view(id){
  	let parent = await Parent.findByPk(id)
  	return { success: true, message: "Parent data" ,data : parent};
};
async function update(req){
  	const errors = validationResult(req);
	if(req.file){
		req.body.profilepic = req.file.filename;
	}
	let num = await Parent.update(req.body, {
		where: { parentVlsId: req.params.id }
	})
	if(num != 1) throw 'parent not updated'
	let parent = await Parent.findByPk(req.params.id)
	return {success: true,
	        message: "Parent updated successfully",
	        data:parent
	       }
};
async function parentDelete(id){
  let num = await Parent.destroy({
    where: { parentVlsId: id }
  })
  if(num != 1) throw 'parent not deleted'    
  return {success: true,message: "Parent deleted successfully"}     	
};
async function bulkDelete(ids){
	if(!Array.isArray(ids)){
	  	return { success: false,message: 'ids index must be an array.'};
	}
	let num = await Parent.destroy({
	    where: { parentVlsId: ids }
	})
	if(num != 1) throw 'parent not deleted'    
	return {success: true,message: "Parent deleted successfully"}
};