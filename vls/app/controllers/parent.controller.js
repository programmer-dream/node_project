const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const bcrypt = require("bcryptjs");
const Parent = db.Parent;
const Authentication = db.Authentication;

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
		 
   		 const parent = await Parent.create(req.body,{ transaction: t });
   		 let password = bcrypt.hashSync(req.body.password, 8);
   		 let auth = {
   		 				userType:"Parent",
   		 				userVlsId:parent.ParentVlsId,
   		 				userId: Date.now(),
   		 				password:password,
   		 				oldPassword1:password
   		 };
   		 await Authentication.create(auth,{ transaction: t });
   		 await t.commit();
   		 res.send({ success: true, message: 'Parent was successfully created.',data: parent});
   	   }
	} catch (error) {
	   await t.rollback();
	   res.status(500).send({ success: false, message: error.message,data:'test' });
	}
};
exports.list = (req, res) => {
  return Parent.findAll()
	  .then(list => {
  	  res.send({ success: true, message: 'Parent listing.',
  	  data:list});
  }).catch(err => {
      res.status(500).send({ success: false, message: err.message });
  });
};
exports.view = async(req, res) => {
  if(!req.params.id){
  	 res.send({ success: false, message: 'Parent was not found' });
  }else{
  	let school = await Parent.findByPk(req.params.id)
  	res.send({ success: true, message: "Parent data" ,data : school});
  }
};
exports.update = (req, res) => {
  if(!req.params.id){
  	 res.send({ success: false, message: 'Parent not found' });
  }else{
  		if(req.file){
			req.body.profilepic = req.file.filename;
	  	}
	   return Parent.update(req.body, {
	    where: { parentVlsId: req.params.id }
	  }).then(async (num) => {
	      if (num >= 1) {
	      	let school = await Parent.findByPk(req.params.id)
	        res.send({
	          success: true,
	          message: "Parent was updated successfully.",
	          data:school
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot update Parent with id=${req.params.id}. Maybe Parent was not found or req.body is empty!`
	        });
	      }
     }).catch(err => {
	      res.status(500).send({ success: false, message: err.message });
     });
  }
};
exports.delete = (req, res) => {
  if(!req.params.id){
  	 res.send({ success: false, message: 'Parent not found' });
  }else{
	  Parent.destroy({
	    where: { parentVlsId: req.params.id }
	  })
	    .then(num => {
	      if (num == 1) {
	        res.send({
	          success: true,
	          message: "Parent was deleted successfully!"
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot delete Parent with id=${id}. Maybe Parent was not found!`
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
  	 res.send({ success: false, message: 'Parent not found' });
  }else{
	  Parent.destroy({
	     where: { parentVlsId: req.body.ids}
	  })
	    .then(num => {
	      if (num >= 1) {
	        res.send({
	          success: true,
	          message: "Selected Parent's was deleted successfully!"
	        });
	      } else {
	        res.send({
	          success: false,
	          message: `Cannot delete Selected Parent's. Maybe Student was not found!`
	        });
	      }
	    })
	    .catch(err => {
	      res.status(500).send({ success: false, message: err.message });
	    });
  }	
};