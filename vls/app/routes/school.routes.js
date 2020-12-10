const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const schoolController = require("../controllers/school.controller");
const { authJwt } = require("../middleware");
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
    authJwt.verifyToken,
  	check('Name','Name field is required.').not().isEmpty(),
  	check('Description','Description field is required.').not().isEmpty(),
  	check('Contact1','Contact1 field is required.').not().isEmpty(),
  	check('EmailId1','Enter valid email.').not().isEmpty(),
  	check('Address','Address field is required.').not().isEmpty()
  	],schoolController.schoolCreate);

  app.get("/api/schoolView/:id",authJwt.verifyToken,schoolController.schoolView);
  app.get("/api/schoolList/",authJwt.verifyToken,schoolController.schoolList);
  app.put("/api/schoolUpdate/:id",authJwt.verifyToken,schoolController.schoolUpdate);
  app.delete("/api/schoolDelete/:id",authJwt.verifyToken,schoolController.schoolDelete);
  app.delete("/api/schoolBulkDelete/",authJwt.verifyToken,schoolController.schoolBulkDelete);
  
};