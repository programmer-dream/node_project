const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const studentController = require("../controllers/student.controller");

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
    upload.single('img'),
    check('firstName', 'firstName field is invalid, etc etc').not().isEmpty(),
    check('dob', 'dob field is invalid, etc etc').not().isEmpty(),
    check('contact1', 'contact1 field is invalid, etc etc').not().isEmpty(),
    check('fatherName', 'fatherName field is invalid, etc etc').not().isEmpty(),
    check('motherName', 'motherName field is invalid, etc etc').not().isEmpty(),
    check('Address', 'Address field is invalid, etc etc').not().isEmpty(),
    ],studentController.create);

  app.get("/api/studentView/:id",studentController.view);
  app.get("/api/studentList/",studentController.list);
  app.put("/api/studentUpdate/:id",studentController.update);
  app.delete("/api/studentlDelete/:id",studentController.delete);
  app.delete("/api/studentBulkDelete/",studentController.bulkDelete);
  
};
