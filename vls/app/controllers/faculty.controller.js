const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");
const facultyPersonal = db.facultyPersonal;
const facultyProfessional = db.facultyProfessional;
const Authentication = db.Authentication;
const sequelize = db.sequelize;

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

   		 const faculty = await facultyPersonal.create(req.body,{ transaction: t });
   		 let password = bcrypt.hashSync(req.body.password, 8);
   		 let auth = {
   		 				userType:"Faculty",
   		 				userVlsId:faculty.facultyVlsId,
   		 				UserId: req.body.userName,
   		 				password:password,
   		 				oldPassword1:password
   		 };
   		 await Authentication.create(auth,{ transaction: t });
   		 await t.commit();
   		 res.send({ success: true, message: 'Faculty was successfully created.',data: faculty});
   	   }
	} catch (error) {
	   await t.rollback();
	   res.status(500).send({ success: false, message: error.message });
	}
};


exports.list = (req, res) => {
  return facultyPersonal.findAll()
	  .then(list => {
  	  res.send({ success: true, message: 'Faculty listing.',
  	  data:list});
  }).catch(err => {
      res.status(500).send({ success: false, message: err.message });
  });
};


exports.view = async(req, res) => {
  if(!req.params.id){
  	 res.send({ success: false, message: 'Faculty was not found' });
  }else{
  	let faculty = await facultyPersonal.findByPk(req.params.id)
  	res.send({ success: true, message: "Faculty data" ,data : faculty});
  }
};


exports.update = (req, res) => {
  if(!req.params.id){
  	 res.send({ success: false, message: 'Faculty not found' });
  }else{
  		if(req.file){
			req.body.profilepic = req.file.filename;
		}
	   return facultyPersonal.update(req.body, {
	    where: { facultyVlsId: req.params.id }
	  }).then(async (num) => {
	      if (num == 1) {
	      	let faculty = await facultyPersonal.findByPk(req.params.id)
	        res.send({
	          success: true,
	          message: "Faculty was updated successfully.",
	          data:faculty
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot update Faculty with id=${req.params.id}. Maybe Faculty was not found or req.body is empty!`
	        });
	      }
     }).catch(err => {
	      res.status(500).send({ success: false, message: err.message });
     });
  }
};


exports.delete = (req, res) => {
  if(!req.params.id){
  	 res.send({ success: false, message: 'Faculty not found' });
  }else{
	  facultyPersonal.destroy({
	    where: { facultyVlsId: req.params.id }
	  })
	    .then(num => {
	      if (num == 1) {
	        res.send({
	          success: true,
	          message: "Faculty was deleted successfully!"
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot delete Faculty with id=${req.params.id}. Maybe Faculty was not found!`
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
  	 res.send({ success: false, message: 'Faculty not found' });
  }else{
	  facultyPersonal.destroy({
	     where: { facultyVlsId: req.body.ids}
	  })
	    .then(num => {
	      if (num >= 1) {
	        res.send({
	          success: true,
	          message: "Selected Faculty's was deleted successfully!"
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot delete Faculty's. Maybe Faculty was not found!`
	        });
	      }
	    })
	    .catch(err => {
	      res.status(500).send({ success: false, message: err.message });
	    });
  }	
};
// fuculty professional
exports.createProfessional = async (req, res) => {
	const t = await sequelize.transaction();
	const errors = validationResult(req);
	try {
	   if(errors.array().length){
   	  	 res.send({ success: false, message: errors.array() });
   	   }else{
   		 let facultyPro = await facultyProfessional.create(req.body,{ transaction: t });
   		 await t.commit();
   		 res.send({ success: true, message: 'Faculty professional was successfully created.',data:facultyPro });
   	   }
	} catch (error) {
	   await t.rollback();
	   res.status(500).send({ success: false, message: error.message });
	}
};
exports.professionalList = (req, res) => {
  return facultyProfessional.findAll()
	  .then(list => {
  	  res.send({ success: true, message: 'Faculty listing.',
  	  data:list});
  }).catch(err => {
      res.status(500).send({ success: false, message: err.message });
  });
};
exports.professionalView = async(req, res) => {
  if(!req.params.id){
  	 res.send({ success: false, message: 'Faculty was not found' });
  }else{
  	let facultyPro = await facultyProfessional.findByPk(req.params.id)
  	res.send({ success: true, message: "Faculty data" ,data : facultyPro});
  }
};
exports.professionalUpdate = (req, res) => {
  if(!req.params.id){
  	 res.send({ success: false, message: 'Faculty not found' });
  }else{
	   return facultyProfessional.update(req.body, {
	    where: { facultyProfessionalId: req.params.id }
	  }).then(async (num) => {
	      if (num == 1) {
	      	let facultyPro = await facultyProfessional.findByPk(req.params.id)
	        res.send({
	          success: true,
	          message: "Faculty was updated successfully.",
	          data:facultyPro
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot update Faculty with id=${req.params.id}. Maybe Faculty was not found or req.body is empty!`
	        });
	      }
     }).catch(err => {
	      res.status(500).send({ success: false, message: err.message });
     });
  }
};
exports.professionalDelete = (req, res) => {
  if(!req.params.id){
  	 res.send({ success: false, message: 'Faculty not found' });
  }else{
	  facultyProfessional.destroy({
	    where: { facultyProfessionalId: req.params.id }
	  })
	    .then(num => {
	      if (num == 1) {
	        res.send({
	          success: true,
	          message: "Faculty was deleted successfully!"
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot delete Faculty with id=${req.params.id}. Maybe Faculty was not found!`
	        });
	      }
	    })
	    .catch(err => {
	      res.status(500).send({ success: false, message: err.message });
	    });
  }	
};
exports.professionalBulkDelete = (req, res) => {
  if(!req.body.ids){
  	 res.send({ success: false, message: 'Faculty not found' });
  }else{
	  facultyProfessional.destroy({
	     where: { facultyProfessionalId: req.body.ids}
	  })
	    .then(num => {
	      if (num >= 1) {
	        res.send({
	          success: true,
	          message: "Selected Faculty's was deleted successfully!"
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot delete Faculty's. Maybe Faculty was not found!`
	        });
	      }
	    })
	    .catch(err => {
	      res.status(500).send({ success: false, message: err.message });
	    });
  }	
};