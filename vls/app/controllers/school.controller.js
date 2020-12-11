const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const SchoolDetails = db.SchoolDetails;

exports.schoolCreate = (req, res) => {
   const errors = validationResult(req);
   if(errors.array().length){
   	  res.send({ success: false, message: errors.array() });
   }else{
   	  SchoolDetails.create(req.body)
   	  .then(SchoolDetails => {
	  	  res.send({ success: true,message: 'School was successfully created.', data: SchoolDetails });
	  }).catch(err => {
	      res.status(500).send({ success: false, message: err.message });
	  });
   }
};


exports.schoolList = (req, res) => {
  return SchoolDetails.findAll()
	  .then(list => {
  	  res.send({ success: true ,message: 'School listing.',
  	  data:list});
  }).catch(err => {
      res.status(500).send({ success: false, message: err.message });
  });
};


exports.schoolView = async(req, res) => {
  if(!req.params.id){
  	 res.send({ success: false, message: 'School was not found' });
  }else{
  	let school = await SchoolDetails.findByPk(req.params.id)
  	res.send({ success: true, message: "School data" ,data : school});
  }
};


exports.schoolUpdate = (req, res) => {
  if(!req.params.id){
  	 res.send({ success: false, message: 'School not found' });
  }else{
	   return SchoolDetails.update(req.body, {
	    where: { schoolVlsId: req.params.id }
	  }).then(async (num) => {
	  	 let school = await SchoolDetails.findByPk(req.params.id)
	      if (num == 1) {
	        res.send({
	          success: true,
	          message: "School was updated successfully.",
	          data:school
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot update School with id=${id}. Maybe School was not found or req.body is empty!`
	        });
	      }
     }).catch(err => {
	      res.status(500).send({ success: false,message: err.message });
     });
  }
};


exports.schoolDelete = (req, res) => {
  if(!req.params.id){
  	 res.send({ success: false, message: 'School not found' });
  }else{
	  SchoolDetails.destroy({
	    where: { schoolVlsId: req.params.id }
	  })
	    .then(num => {
	      if (num == 1) {
	        res.send({
	          success: true,
	          message: "School was deleted successfully!"
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot delete School with id=${id}. Maybe School was not found!`
	        });
	      }
	    })
	    .catch(err => {
	      res.status(500).send({ success: false, message: err.message });
	    });
  }	
};


exports.schoolBulkDelete = (req, res) => {
  if(!req.body.ids){
  	 res.send({ success: false, message: 'School not found' });
  }else{
  	  if(!Array.isArray(req.body.ids)){
  	  	res.send({ success: false,message: 'ids index must be an array.' });
  	  }
	  SchoolDetails.destroy({
	     where: { schoolVlsId: req.body.ids}
	  })
	    .then(num => {
	      if (num == 1) {
	        res.send({
	          success: true,
	          message: "Selected school's was deleted successfully!"
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot delete Selected school's. Maybe School was not found!`
	        });
	      }
	    })
	    .catch(err => {
	      res.status(500).send({ success: false, message: err.message });
	    });
  }	
};