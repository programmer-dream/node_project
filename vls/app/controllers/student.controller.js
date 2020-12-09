const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const StudentPersonal = db.StudentPersonal;
const StudentSchoolPersonal = db.StudentSchoolPersonal;
const Authentication = db.Authentication;
const sequelize = db.sequelize;

exports.create = async (req, res) => {
	req.body.profilepic = req.file.filename;
	const t = await sequelize.transaction();
	const errors = validationResult(req);
	try {
	   if(errors.array().length){
   	  	 res.send({ message: errors.array() });
   	   }else{
   		 await StudentPersonal.create(req.body,{ transaction: t });
   		 const student = await StudentSchoolPersonal.create(req.body,{ transaction: t });
   		 let auth = {
   		 				userType:"Student",
   		 				UserId:student.StudentSchoolVlsId
   		 };
   		 await Authentication.create(auth,{ transaction: t });
   		 await t.commit();
   		 res.send({ message: 'Student was successfully created.' });
   	   }
	} catch (error) {
	   await t.rollback();
	   res.status(500).send({ message: error.message });
	}
};
exports.list = (req, res) => {
  return StudentSchoolPersonal.findAll()
	  .then(list => {
  	  res.send({ message: 'Student listing.',
  	  data:list});
  }).catch(err => {
      res.status(500).send({ message: err.message });
  });
};
exports.view = async(req, res) => {
  if(!req.params.id){
  	 res.send({ message: 'Student was not found' });
  }else{
  	let school = await StudentSchoolPersonal.findByPk(req.params.id)
  	res.send({ message: "Student data" ,data : school});
  }
};
exports.update = (req, res) => {
  if(!req.params.id){
  	 res.send({ message: 'Student not found' });
  }else{
	   return StudentSchoolPersonal.update(req.body, {
	    where: { StudentSchoolVlsId: req.params.id }
	  }).then(num => {
	      if (num == 1) {
	        res.send({
	          message: "Student was updated successfully."
	        });
	      } else {
	        res.send({
	          message: `Cannot update Student with id=${id}. Maybe Student was not found or req.body is empty!`
	        });
	      }
     }).catch(err => {
	      res.status(500).send({ message: err.message });
     });
  }
};
exports.delete = (req, res) => {
  if(!req.params.id){
  	 res.send({ message: 'Student not found' });
  }else{
	  StudentSchoolPersonal.destroy({
	    where: { StudentSchoolVlsId: req.params.id }
	  })
	    .then(num => {
	      if (num == 1) {
	        res.send({
	          message: "Student was deleted successfully!"
	        });
	      } else {
	        res.send({
	          message: `Cannot delete Student with id=${id}. Maybe Student was not found!`
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
  	 res.send({ message: 'Student not found' });
  }else{
	  StudentSchoolPersonal.destroy({
	     where: { StudentSchoolVlsId: req.body.ids}
	  })
	    .then(num => {
	      if (num >= 1) {
	        res.send({
	          message: "Selected Student's was deleted successfully!"
	        });
	      } else {
	        res.send({
	          message: `Cannot delete Selected Student's. Maybe Student was not found!`
	        });
	      }
	    })
	    .catch(err => {
	      res.status(500).send({ message: err.message });
	    });
  }	
};