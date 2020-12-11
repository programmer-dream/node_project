const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
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
  	check('branchName','BranchName field is required.').not().isEmpty(),
  	check('contact1','Contact1 field is required.').not().isEmpty(),
  	check('emailId1','Enter valid email.').not().isEmpty(),
  	check('address','Address field is required.').not().isEmpty(),
  	check('schoolId','SchoolId field is required.').not().isEmpty()
  	],branchController.branchCreate);

  app.get("/api/branchView/:id",branchController.branchView);
  app.get("/api/branchList",branchController.branchList);
  app.put("/api/branchUpdate/:id",[
    check('branchName','BranchName field is required.').not().isEmpty(),
    check('contact1','Contact1 field is required.').not().isEmpty(),
    check('emailId1','Enter valid email.').not().isEmpty(),
    check('address','Address field is required.').not().isEmpty(),
    check('schoolId','SchoolId field is required.').not().isEmpty()
    ],branchController.branchUpdate);
  app.delete("/api/branchDelete/:id",branchController.branchDelete);
  app.delete("/api/branchBulkDelete",branchController.bulkDelete);
};