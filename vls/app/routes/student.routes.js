const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const studentController = require("../controllers/student.controller");
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

  app.post("/api/studentCreate",[
    upload.single('profilepic'),
    authJwt.verifyToken,
    check('firstName', 'firstName field is required.').not().isEmpty(),
    check('dob', 'dob field is required.').not().isEmpty(),
    check('contact1', 'contact1 field is required.').not().isEmpty(),
    check('fatherName', 'fatherName field is required.').not().isEmpty(),
    check('motherName', 'motherName field is required.').not().isEmpty(),
    check('address', 'Address field is required.').not().isEmpty(),
    check('password', 'password field is reuired.').not().isEmpty()
    ],studentController.create);

  app.get("/api/studentView/:id",authJwt.verifyToken,studentController.view);
  app.get("/api/studentList/",authJwt.verifyToken,studentController.list);
  app.put("/api/studentUpdate/:id",[
    upload.single('profilepic'),
    authJwt.verifyToken,
    check('firstName', 'firstName field is required.').not().isEmpty(),
    check('dob', 'dob field is required.').not().isEmpty(),
    check('contact1', 'contact1 field is required.').not().isEmpty(),
    check('fatherName', 'fatherName field is required.').not().isEmpty(),
    check('motherName', 'motherName field is required.').not().isEmpty(),
    check('address', 'Address field is required.').not().isEmpty(),
    check('password', 'password field is reuired.').not().isEmpty()
    ],studentController.update);
  app.delete("/api/studentlDelete/:id",authJwt.verifyToken,studentController.delete);
  app.delete("/api/studentBulkDelete/",authJwt.verifyToken,studentController.bulkDelete);
  
};
