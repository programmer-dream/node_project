const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const schoolController = require("../controllers/school.controller");
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

  app.post("/api/schoolCreate",[
  	check('name','Name field is required.').not().isEmpty(),
  	check('description','Description field is required.').not().isEmpty(),
  	check('contact1','Contact1 field is required.').not().isEmpty(),
  	check('emailId1','Enter valid email.').not().isEmpty(),
  	check('address','Address field is required.').not().isEmpty()
  	],schoolController.schoolCreate);

  app.get("/api/schoolView/:id" ,schoolController.schoolView);
  app.get("/api/schoolList/" ,schoolController.schoolList);
  app.put("/api/schoolUpdate/:id",[
    check('name','Name field is required.').not().isEmpty(),
    check('description','Description field is required.').not().isEmpty(),
    check('contact1','Contact1 field is required.').not().isEmpty(),
    check('emailId1','Enter valid email.').not().isEmpty(),
    check('address','Address field is required.').not().isEmpty()
    ],schoolController.schoolUpdate);
  app.delete("/api/schoolDelete/:id" ,schoolController.schoolDelete);
  app.delete("/api/schoolBulkDelete/" ,schoolController.schoolBulkDelete);
  
};