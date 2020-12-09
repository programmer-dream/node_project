const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;

const facultyPersonal = db.facultyPersonal;
const Authentication = db.Authentication;
const sequelize = db.sequelize;

exports.create = async (req, res) => {
	const t = await sequelize.transaction();
	const errors = validationResult(req);
	req.body.profilepic = req.file.filename;
	try {
	   if(errors.array().length){
   	  	 res.send({ message: errors.array() });
   	   }else{
   		 const faculty = await facultyPersonal.create(req.body,{ transaction: t });
   		 let auth = {
   		 				userType:"Faculty",
   		 				UserId:faculty.facultyVlsId
   		 };
   		 await Authentication.create(auth,{ transaction: t });
   		 await t.commit();
   		 res.send({ message: 'Faculty was successfully created.' });
   	   }
	} catch (error) {
	   await t.rollback();
	   res.status(500).send({ message: error.message });
	}
};
exports.list = (req, res) => {
  return facultyPersonal.findAll()
	  .then(list => {
  	  res.send({ message: 'Faculty listing.',
  	  data:list});
  }).catch(err => {
      res.status(500).send({ message: err.message });
  });
};
exports.view = async(req, res) => {
  if(!req.params.id){
  	 res.send({ message: 'Faculty was not found' });
  }else{
  	let school = await facultyPersonal.findByPk(req.params.id)
  	res.send({ message: "Faculty data" ,data : school});
  }
};
exports.update = (req, res) => {
  if(!req.params.id){
  	 res.send({ message: 'Faculty not found' });
  }else{
	   return facultyPersonal.update(req.body, {
	    where: { facultyVlsId: req.params.id }
	  }).then(num => {
	      if (num == 1) {
	        res.send({
	          message: "Faculty was updated successfully."
	        });
	      } else {
	        res.send({
	          message: `Cannot update Faculty with id=${req.params.id}. Maybe Faculty was not found or req.body is empty!`
	        });
	      }
     }).catch(err => {
	      res.status(500).send({ message: err.message });
     });
  }
};
exports.delete = (req, res) => {
  if(!req.params.id){
  	 res.send({ message: 'Faculty not found' });
  }else{
	  facultyPersonal.destroy({
	    where: { facultyVlsId: req.params.id }
	  })
	    .then(num => {
	      if (num == 1) {
	        res.send({
	          message: "Faculty was deleted successfully!"
	        });
	      } else {
	        res.send({
	          message: `Cannot delete Faculty with id=${req.params.id}. Maybe Faculty was not found!`
	        });
	      }
	    })
	    .catch(err => {
	      res.status(500).send({ message: err.message });
	    });
  }	
};
exports.bulkDelete = (req, res) => {
  if(!req.body.ids){
  	 res.send({ message: 'Faculty not found' });
  }else{
	  facultyPersonal.destroy({
	     where: { facultyVlsId: req.body.ids}
	  })
	    .then(num => {
	      if (num >= 1) {
	        res.send({
	          message: "Selected Faculty's was deleted successfully!"
	        });
	      } else {
	        res.send({
	          message: `Cannot delete Faculty's. Maybe Faculty was not found!`
	        });
	      }
	    })
	    .catch(err => {
	      res.status(500).send({ message: err.message });
	    });
  }	
};