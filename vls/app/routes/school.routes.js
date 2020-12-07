const express = require('express');
const bodyParser = require('body-parser');
const { body } = require('express-validator');
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
  	body('Name').isLength({ min: 1 }).withMessage('Name field is required.'),
  	body('Description').isLength({ min: 1 }).withMessage('Description field is required.'),
  	body('Contact1').isLength({ min: 1 }).withMessage('Contact1 field is required.'),
  	body('EmailId1').isEmail().withMessage('Enter valid email.'),
  	body('Address').isLength({ min: 1 }).withMessage('Address field is required.')
  	],schoolController.schoolCreate);

  app.get("/api/schoolView/:id",schoolController.schoolView);
  app.put("/api/schoolUpdate/:id",schoolController.schoolUpdate);
  app.delete("/api/schoolDelete/:id",schoolController.schoolDelete);
  app.delete("/api/schoolBulkDelete/",schoolController.schoolBulkDelete);
  
};