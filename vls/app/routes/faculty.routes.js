const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const facultyController = require("../controllers/faculty.controller");
const helper = require("../helper");
const upload  = helper.upload;
const router = express.Router()
const app = express();
app.use(bodyParser.json());

//Post routes
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

//Get routes
router.get("/view/:id" ,view);
router.get("/list/" ,list);

//Put routes
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
//Delete routes
router.delete("/delete/:id",facultyDelete);
router.delete("/BulkDelete/",bulkDelete);

module.exports = router;

function create(req, res, next) {
    facultyController.create(req)
        .then(faculty => faculty ? res.json(faculty) : res.status(400).json({ status: "error", message: 'Error while creating faculty'}))
        .catch(err => next(err));
}
function view(req, res, next) {
    facultyController.view(req.params.id)
        .then(faculty => faculty ? res.json(faculty) : res.status(400).json({ status: "error", message: 'Error while view faculty'}))
        .catch(err => next(err));
}
function list(req, res, next) {
    facultyController.list(req)
        .then(faculty => faculty ? res.json(faculty) : res.status(400).json({ status: "error", message: 'Error while list faculty'}))
        .catch(err => next(err));
}
function update(req, res, next) {
    facultyController.update(req)
        .then(faculty => faculty ? res.json(faculty) : res.status(400).json({ status: "error", message: 'Error while update faculty'}))
        .catch(err => next(err));
}
function facultyDelete(req, res, next) {
    facultyController.facultyDelete(req.params.id)
        .then(faculty => faculty ? res.json(faculty) : res.status(400).json({ status: "error", message: 'Error while delete faculty'}))
        .catch(err => next(err));
}
function bulkDelete(req, res, next) {
    facultyController.bulkDelete(req.body)
        .then(faculty => faculty ? res.json(faculty) : res.status(400).json({ status: "error", message: 'Error while delete faculty'}))
        .catch(err => next(err));
}
