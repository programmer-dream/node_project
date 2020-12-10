const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const parentController = require("../controllers/parent.controller");
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

  app.post("/api/parentCreate",[
    upload.single('profilepic'),
    authJwt.verifyToken,
    check('firstName', 'firstName field is required.').not().isEmpty(),
    check('dob', 'dob field is required.').not().isEmpty(),
    check('contact1', 'contact1 field is required.').not().isEmpty(),
    check('Address', 'Address field is required.').not().isEmpty(),
    check('password', 'password field is reuired.').not().isEmpty()
    ],parentController.create);

  app.get("/api/parentView/:id",authJwt.verifyToken,parentController.view);
  app.get("/api/parentList/",authJwt.verifyToken,parentController.list);
  app.put("/api/parentUpdate/:id",[
    upload.single('profilepic'),
    authJwt.verifyToken,
    check('firstName', 'firstName field is required.').not().isEmpty(),
    check('dob', 'dob field is required.').not().isEmpty(),
    check('contact1', 'contact1 field is required.').not().isEmpty(),
    check('Address', 'Address field is required.').not().isEmpty(),
    check('password', 'password field is reuired.').not().isEmpty()
    ],parentController.update);
  app.delete("/api/parentlDelete/:id",authJwt.verifyToken,parentController.delete);
  app.delete("/api/parentBulkDelete/",authJwt.verifyToken,parentController.bulkDelete);
  
};