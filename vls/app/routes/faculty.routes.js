const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const facultyController = require("../controllers/faculty.controller");

const helper = require("../helper");
const upload  = helper.upload;

const app = express();
app.use(bodyParser.json());

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/facultyCreate",[
    upload.single('profilepic'),
    check('firstName', 'firstName field is invalid, etc etc').not().isEmpty(),
    check('dob', 'dob field is invalid, etc etc').not().isEmpty(),
    check('contact1', 'contact1 field is invalid, etc etc').not().isEmpty(),
    check('fatherName', 'fatherName field is invalid, etc etc').not().isEmpty(),
    check('motherName', 'motherName field is invalid, etc etc').not().isEmpty(),
    check('Address', 'Address field is invalid, etc etc').not().isEmpty(),
    ],facultyController.create);

  app.get("/api/facultyView/:id",facultyController.view);
  app.get("/api/facultyList/",facultyController.list);
  app.put("/api/facultyUpdate/:id",upload.single('profilepic'),facultyController.update);
  app.delete("/api/facultylDelete/:id",facultyController.delete);
  app.delete("/api/facultyBulkDelete/",facultyController.bulkDelete);
  
  //faculty professional 
  app.post("/api/faculty/Professional",facultyController.createProfessional);
  app.get("/api/faculty/Professional/:id",facultyController.professionalView);
  app.get("/api/faculty/Professional",facultyController.professionalList);
  app.put("/api/faculty/Professional/:id",facultyController.professionalUpdate);
  app.delete("/api/faculty/Professional/:id",facultyController.professionalDelete);
  app.delete("/api/faculty/Professional/",facultyController.professionalBulkDelete);
};