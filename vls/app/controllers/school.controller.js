const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const SchoolDetails = db.SchoolDetails;

module.exports = {
  create,
  view,
  list,
  update,
  schoolDelete,
  bulkDelete
};
async function create(req){
   const errors = validationResult(req);
   if(errors.array().length){
   	  return { success: false, message: errors.array() };
   }
   let schoolDetails = await SchoolDetails.create(req.body);
   if(schoolDetails)
   	return { success: true,message: 'School created successfully', data: schoolDetails };

};


async function list(req, res){
  let list =  await SchoolDetails.findAll()
  return { success: true, message: 'Branch listing', data: list };
};


async function view(id){
	let school = await SchoolDetails.findByPk(id)
	return { success: true, message: "School data" ,data : school};
};


async function update(req){
   const errors = validationResult(req);
   if(errors.array().length){
   	  return { success: false, message: errors.array() };
   }
   let num = await SchoolDetails.update(req.body, {
			    where: { schoolVlsId: req.params.id }
			  });
   if(num != 1) throw 'school not updated'
   let school = await SchoolDetails.findByPk(req.params.id)
	return { success: true, message: "School data" ,data : school};
};


async function schoolDelete(id){
	let num = await SchoolDetails.destroy({
		where: { schoolVlsId: id }
	})
	if(num !=1) throw "School not deleted"
	return { success: true,
		message: "School deleted successfully!"
	}
};


async function bulkDelete(ids){
	if(!Array.isArray(ids)){
		return { success: false,message: 'ids index must be an array' };
	}
	let num = await SchoolDetails.destroy({
		where: { schoolVlsId: ids}
	})
	if(num !=1) throw 'school not deleted'

	return { success: true,
		 message: "School deleted successfully!"
	}
};