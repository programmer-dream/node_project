const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const branchController = require("../controllers/branch.controller");
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

  app.post("/api/branchCreate",[
    authJwt.verifyToken,
  	check('BranchName','BranchName field is required.').not().isEmpty(),
  	check('Contact1','Contact1 field is required.').not().isEmpty(),
  	check('EmailId1','Enter valid email.').not().isEmpty(),
  	check('Address','Address field is required.').not().isEmpty(),
  	check('SchoolId','SchoolId field is required.').not().isEmpty()
  	],branchController.branchCreate);

  app.get("/api/branchView/:id",authJwt.verifyToken,branchController.branchView);
  app.get("/api/branchList",authJwt.verifyToken,branchController.branchList);
  app.put("/api/branchUpdate/:id",authJwt.verifyToken,branchController.branchUpdate);
  app.delete("/api/branchDelete/:id",authJwt.verifyToken,branchController.branchDelete);
};