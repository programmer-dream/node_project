const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const BranchDetails = db.BranchDetails;


exports.branchCreate = (req, res) => {
   const errors = validationResult(req);
   if(errors.array().length){
   	  res.send({ success: false, message: errors.array() });
   }else{
   	  BranchDetails.create(req.body)
   	  .then(BranchDetails => {
	  	  res.send({ success: true , message: 'Branch was successfully created.',data: BranchDetails});
	  }).catch(err => {
	      res.status(500).send({ success: false, message: err.message });
	  });
   }
};


exports.branchList = (req, res) => {
  return BranchDetails.findAll()
	  .then(list => {
  	  res.send({ success: true ,message: 'Branch listing.',
  	  data:list});
  }).catch(err => {
      res.status(500).send({ success: false, message: err.message });
  });
};


exports.branchView = async(req, res) => {
  if(!req.params.id){
  	 res.send({ success: false, message: 'Branch was not found' });
  }else{
  	let branch = await BranchDetails.findByPk(req.params.id)
  	res.send({ success: true, message: "Branch data" ,data : branch});
  }
};


exports.branchUpdate = (req, res) => {
  if(!req.params.id){
  	 res.send({ success: false, message: 'Branch not found' });
  }else{
	   return BranchDetails.update(req.body, {
	    where: { branchVlsId: req.params.id }
	  }).then(async (num) => {
	      if (num == 1) {
	      	let branch = await BranchDetails.findByPk(req.params.id);
	        res.send({
	          success: true,
	          message: "Branch was updated successfully.",
	          data:branch
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot update Branch with id=${req.params.id}. Maybe Branch was not found or req.body is empty!`
	        });
	      }
     }).catch(err => {
	      res.status(500).send({ success: false, message: err.message });
     });
  }
};

exports.branchDelete = (req, res) => {
  if(!req.params.id){
  	 res.send({ success: false, message: 'Branch not found' });
  }else{
	  BranchDetails.destroy({
	    where: { branchVlsId: req.params.id }
	  })
	    .then(num => {
	      if (num == 1) {
	        res.send({
	          success: true,
	          message: "Branch was deleted successfully!"
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot delete Branch with id=${req.params.id}. Maybe School was not found!`
	        });
	      }
	    })
	    .catch(err => {
	      res.status(500).send({ success: false, message: err.message });
	    });
  }	
};
exports.bulkDelete = (req, res) => {
  if(!req.body.ids){
  	 res.send({ success: false,message: 'Branch not found' });
  }else{
  	  if(!Array.isArray(req.body.ids)){
  	  	res.send({ success: false,message: 'ids index must be an array.' });
  	  }
	  BranchDetails.destroy({
	     where: { branchVlsId: req.body.ids}
	  })
	    .then(num => {
	      if (num >= 1) {
	        res.send({
	          success: true,
	          message: "Branch Student's was deleted successfully!"
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot delete Selected Branch's. Maybe Branch was not found!`
	        });
	      }
	    })
	    .catch(err => {
	      res.status(500).send({ success: false,message: err.message });
	    });
  }	
};