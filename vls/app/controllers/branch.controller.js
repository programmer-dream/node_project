const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const BranchDetails = db.BranchDetails;

module.exports = {
  branchCreate,
  branchList,
  branchView,
  branchUpdate,
  branchDelete,
  bulkDelete
};

async function branchCreate (req) {
	const errors = validationResult(req);
	if(errors.array().length){
		  return { success: false, message: errors.array() }
	}

	let branch = await BranchDetails.create(req.body);
	branch = branch.toJSON();
	if(branch && branch.branchVlsId){
		return { 
				success: true, 
				message: 'Branch created successfully',
				data: branch
			};
	}

};


async function branchList (){
	let branch =  await BranchDetails.findAll()
	return { success: true, message: 'Branch listing', data: branch };
};


async function branchView(params) {

	let branchID = params.id
  	let branchDetails = await BranchDetails.findByPk(branchID)
	if(!branchDetails) throw 'Branch not found';

	let branch = await BranchDetails.findByPk(branchID)
	return { success:true, message:"Branch data", data : branch};

};


async function branchUpdate (req) {

	const errors = validationResult(req);
	if(errors.array().length){
		  return { success:false, message: errors.array() }
	}

	let branchID = req.params.id;
	let branchBody = req.body;
  	let branchDetails = await BranchDetails.findByPk(branchID)
	if(!branchDetails) throw 'Branch not found';

   let branch = await BranchDetails.update(branchBody, {
	    where: { branchVlsId: branchID }
	  })

   if (branch >= 1) {
   		let branchDetails = await BranchDetails.findByPk(branchID)
   		return {
          success: true,
          message: "Branch was updated successfully.",
          data:branchDetails
        };
    }

};

async function branchDelete (params) {
	let branchID = params.id
  	let branchDetails = await BranchDetails.findByPk(branchID)
	if(!branchDetails) throw 'Branch not found';

	let branch = await BranchDetails.destroy({
	    where: { branchVlsId: branchID }
	  })
	return { success:true, message:"Branch deleted successfully!"};
	
};
async function bulkDelete (body) {
	let ids = body.ids
	if(!ids) throw 'Branch not found';
	if(!Array.isArray(ids)) throw 'ids must be an array';
	let branch = await BranchDetails.destroy({
	    where: { branchVlsId: ids }
	  })
	return { success:true, message:"Branch deleted successfully!"};
	
};
