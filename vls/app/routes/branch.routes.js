const express = require('express');
const bodyParser = require('body-parser');
const { body } = require('express-validator');
const branchController = require("../controllers/branch.controller");

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

  app.post("/api/branchCreate",[
  	body('BranchName').isLength({ min: 1 }).withMessage('BranchName field is required.'),
  	body('Contact1').isLength({ min: 1 }).withMessage('Contact1 field is required.'),
  	body('EmailId1').isEmail().withMessage('Enter valid email.'),
  	body('Address').isLength({ min: 1 }).withMessage('Address field is required.'),
  	body('SchoolId').isLength({ min: 1 }).withMessage('SchoolId field is required.')
  	],branchController.branchCreate);

  app.get("/api/branchView/:id",branchController.branchView);
  app.put("/api/branchUpdate/:id",branchController.branchUpdate);
  app.delete("/api/branchDelete/:id",branchController.branchDelete);
};