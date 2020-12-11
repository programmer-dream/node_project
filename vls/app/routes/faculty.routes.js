const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const facultyController = require("../controllers/faculty.controller");
const { authJwt } = require("../middleware");
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
    authJwt.verifyToken,
    check('firstName', 'firstName field is required.').not().isEmpty(),
    check('dob', 'dob field is required.').not().isEmpty(),
    check('contact1', 'contact1 field is required.').not().isEmpty(),
    check('fatherName', 'fatherName field is required.').not().isEmpty(),
    check('motherName', 'motherName field is required.').not().isEmpty(),
    check('address', 'Address field is required.').not().isEmpty(),
    check('password', 'password field is reuired.').not().isEmpty()
    ],facultyController.create);

  app.get("/api/facultyView/:id",authJwt.verifyToken,facultyController.view);
  app.get("/api/facultyList/",authJwt.verifyToken,facultyController.list);
  app.put("/api/facultyUpdate/:id",[
    upload.single('profilepic'),
    authJwt.verifyToken,
    check('firstName', 'firstName field is required.').not().isEmpty(),
    check('dob', 'dob field is required.').not().isEmpty(),
    check('contact1', 'contact1 field is required.').not().isEmpty(),
    check('fatherName', 'fatherName field is required.').not().isEmpty(),
    check('motherName', 'motherName field is required.').not().isEmpty(),
    check('address', 'Address field is required.').not().isEmpty(),
    check('password', 'password field is reuired.').not().isEmpty()
    ],facultyController.update);
  app.delete("/api/facultyDelete/:id",authJwt.verifyToken,facultyController.delete);
  app.delete("/api/facultyBulkDelete/",authJwt.verifyToken,facultyController.bulkDelete);
  
  //faculty professional 
  app.post("/api/faculty/Professional",authJwt.verifyToken,facultyController.createProfessional);
  app.get("/api/faculty/Professional/:id",authJwt.verifyToken,facultyController.professionalView);
  app.get("/api/faculty/Professional",authJwt.verifyToken,facultyController.professionalList);
  app.put("/api/faculty/Professional/:id",authJwt.verifyToken,facultyController.professionalUpdate);
  app.delete("/api/faculty/Professional/:id",authJwt.verifyToken,facultyController.professionalDelete);
  app.delete("/api/faculty/Professional/",authJwt.verifyToken,facultyController.professionalBulkDelete);
};