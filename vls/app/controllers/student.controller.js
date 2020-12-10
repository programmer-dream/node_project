const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const StudentPersonal = db.StudentPersonal;
const StudentSchoolPersonal = db.StudentSchoolPersonal;
const Authentication = db.Authentication;
const sequelize = db.sequelize;
const bcrypt = require("bcryptjs");

exports.create = async (req, res) => {
	const t = await sequelize.transaction();
	const errors = validationResult(req);

	try {
	   if(errors.array().length){
   	  	 res.send({ success: false, message: errors.array() });
   	   }else{
	   	   	 if(req.file){
				req.body.profilepic = req.file.filename;
			 }

			await StudentPersonal.create(req.body,{ transaction: t });
			const student = await StudentSchoolPersonal.create(req.body,{ transaction: t });
			let password = bcrypt.hashSync(req.body.password, 8);
			let auth = {
				userType:"Student",
				userVlsId:student.StudentSchoolVlsId,
				userId: req.body.userName,
				password:password,
				oldPassword1:password
			};
			await Authentication.create(auth,{ transaction: t });
			await t.commit();
			res.send({ success: true , message: 'Student was successfully created.',data: student});

   	   }
	} catch (error) {
	   await t.rollback();
	   res.status(500).send({ 
	   						success: false,
	   						message: error.message 
	   					});
	}
};

exports.list = (req, res) => {
  return StudentSchoolPersonal.findAll()
	  .then(list => {
  	  res.send({ success: true,
  	  			 message: 'Student listing.',
  	  			 data:list});
  }).catch(err => {
      res.status(500).send({ success: false,
      						 message: err.message 
      					});
  });
};

exports.view = async(req, res) => {
  if(!req.params.id){
  	 res.send({ success: false,
  	 			message: 'Student was not found' 
  	 		});
  }else{
  	let school = await StudentSchoolPersonal.findByPk(req.params.id)
  	res.send({ success: true, 
  			   message: "Student data" ,
  			   data : school});
  }
};

exports.update = async (req, res) => {
  if(!req.params.id){
  	 res.send({ success: false,
  	 			message: 'Student not found' 
  	 		});
  }else{
  	   if(req.file){
		  req.body.profilepic = req.file.filename;
	   }
	   return StudentSchoolPersonal.update(req.body, {
	    where: { studentSchoolVlsId: req.params.id }
	  }).then(async (num) => {
	      if (num == 1) {
	      	let student  = await StudentSchoolPersonal.findByPk(req.params.id)
	        res.send({
	          success: true,
	          message: "Student was updated successfully.",
	          data:student
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot update Student with id=${req.params.id}. Maybe Student was not found or req.body is empty!`
	        });
	      }
     }).catch(err => {
	      res.status(500).send({
	      	success: false, 
	      	message: err.message 
	      });
     });
  }
};
exports.delete = (req, res) => {
  if(!req.params.id){
  	 res.send({ success: false, message: 'Student not found' });
  }else{
	  StudentSchoolPersonal.destroy({
	    where: { studentSchoolVlsId: req.params.id }
	  })
	    .then(num => {
	      if (num == 1) {
	        res.send({
	          success: true,
	          message: "Student was deleted successfully!"
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot delete Student with id=${req.params.id}. Maybe Student was not found!`
	        });
	      }
	    })
	    .catch(err => {
	      res.status(500).send({ success: false,
	      						 message: err.message 
	      					});
	    });
  }	
};
exports.bulkDelete = (req, res) => {
  if(!req.body.ids){
  	 res.send({ success: false,message: 'Student not found' });
  }else{
	  StudentSchoolPersonal.destroy({
	     where: { studentSchoolVlsId: req.body.ids}
	  })
	    .then(num => {
	      if (num >= 1) {
	        res.send({
	          success: true,
	          message: "Selected Student's was deleted successfully!"
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot delete Selected Student's. Maybe Student was not found!`
	        });
	      }
	    })
	    .catch(err => {
	      res.status(500).send({ success: false,message: err.message });
	    });
  }	
};