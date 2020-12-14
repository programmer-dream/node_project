const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const studentController = require("../controllers/student.controller");

const helper = require("../helper");
const upload  = helper.upload;
const router = express.Router()
const app = express();
app.use(bodyParser.json());

  router.post("/create",[
    upload.single('profilepic'),
    check('firstName', 'firstName field is required.').not().isEmpty(),
    check('dob', 'dob field is required.').not().isEmpty(),
    check('contact1', 'contact1 field is required.').not().isEmpty(),
    check('fatherName', 'fatherName field is required.').not().isEmpty(),
    check('motherName', 'motherName field is required.').not().isEmpty(),
    check('address', 'Address field is required.').not().isEmpty(),
    check('password', 'password field is reuired.').not().isEmpty()
    ],create);

  router.get("/view/:id" ,view);
  router.get("/list" ,list);
  router.put("/update/:id",[
    upload.single('profilepic'),
    check('firstName', 'firstName field is required.').not().isEmpty(),
    check('dob', 'dob field is required.').not().isEmpty(),
    check('contact1', 'contact1 field is required.').not().isEmpty(),
    check('fatherName', 'fatherName field is required.').not().isEmpty(),
    check('motherName', 'motherName field is required.').not().isEmpty(),
    check('address', 'Address field is required.').not().isEmpty(),
    check('password', 'password field is reuired.').not().isEmpty()
    ],update);
  router.delete("/delete/:id" ,studentDelete);
  router.delete("/bulkDelete/" ,bulkDelete);
  
module.exports = router;

function create(req, res, next) {
    studentController.create(req)
        .then(student => student ? res.json(student) : res.status(400).json({ status: "error", message: 'Error while creating student'}))
        .catch(err => next(err));
}
function view(req, res, next) {
    studentController.view(req.params.id)
        .then(student => student ? res.json(student) : res.status(400).json({ status: "error", message: 'Error while view student'}))
        .catch(err => next(err));
}
function list(req, res, next) {
    studentController.list(req)
        .then(student => student ? res.json(student) : res.status(400).json({ status: "error", message: 'Error while list student'}))
        .catch(err => next(err));
}
function update(req, res, next) {
    studentController.update(req)
        .then(student => student ? res.json(student) : res.status(400).json({ status: "error", message: 'Error while update student'}))
        .catch(err => next(err));
}
function studentDelete(req, res, next) {
    studentController.studentDelete(req.params.id)
        .then(student => student ? res.json(student) : res.status(400).json({ status: "error", message: 'Error while delete student'}))
        .catch(err => next(err));
}
function bulkDelete(req, res, next) {
    studentController.bulkDelete(req.body)
        .then(student => student ? res.json(student) : res.status(400).json({ status: "error", message: 'Error while delete student'}))
        .catch(err => next(err));
}
