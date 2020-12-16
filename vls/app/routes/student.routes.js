const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const studentController = require("../controllers/student.controller");

const helper = require("../helper");
const upload  = helper.upload;
const router = express.Router()
const app = express();
app.use(bodyParser.json());

//Get route
router.get("/view/:id" ,view);

  
module.exports = router;

function view(req, res, next) {
    studentController.view(req.params.id)
        .then(student => student ? res.json(student) : res.status(400).json({ status: "error", message: 'Error while view student'}))
        .catch(err => next(err));
}
