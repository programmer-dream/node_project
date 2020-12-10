const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const BranchDetails = db.BranchDetails;


exports.branchCreate = (req, res) => {
   const errors = validationResult(req);
   if(errors.array().length){
   	  res.send({ message: errors.array() });
   }else{
   	  BranchDetails.create(req.body)
   	  .then(BranchDetails => {
	  	  res.send({ message: 'Branch was successfully created.' });
	  }).catch(err => {
	      res.status(500).send({ message: err.message });
	  });
   }
};


exports.branchList = (req, res) => {
  return BranchDetails.findAll()
	  .then(list => {
  	  res.send({ message: 'Branch listing.',
  	  data:list});
  }).catch(err => {
      res.status(500).send({ message: err.message });
  });
};


exports.branchView = async(req, res) => {
  if(!req.params.id){
  	 res.send({ message: 'Branch was not found' });
  }else{
  	let school = await BranchDetails.findByPk(req.params.id)
  	res.send({ message: "Branch data" ,data : school});
  }
};


exports.branchUpdate = (req, res) => {
  if(!req.params.id){
  	 res.send({ message: 'Branch not found' });
  }else{
	   return BranchDetails.update(req.body, {
	    where: { BranchVlsId: req.params.id }
	  }).then(num => {
	      if (num == 1) {
	        res.send({
	          message: "Branch was updated successfully."
	        });
	      } else {
	        res.send({
	          message: `Cannot update Branch with id=${id}. Maybe Branch was not found or req.body is empty!`
	        });
	      }
     }).catch(err => {
	      res.status(500).send({ message: err.message });
     });
  }
};


exports.branchDelete = (req, res) => {
  if(!req.params.id){
  	 res.send({ message: 'Branch not found' });
  }else{
	  BranchDetails.destroy({
	    where: { BranchVlsId: req.params.id }
	  })
	    .then(num => {
	      if (num == 1) {
	        res.send({
	          message: "Branch was deleted successfully!"
	        });
	      } else {
	        res.send({
	          message: `Cannot delete Branch with id=${id}. Maybe School was not found!`
	        });
	      }
	    })
	    .catch(err => {
	      res.status(500).send({ message: err.message });
	    });
  }	
};