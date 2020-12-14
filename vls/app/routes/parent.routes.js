const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const parentController = require("../controllers/parent.controller");
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
  check('address', 'Address field is required.').not().isEmpty(),
  check('password', 'password field is reuired.').not().isEmpty()
  ],create);

  router.get("/view/:id" ,view);
  router.get("/list/" ,list);
  router.put("/update/:id",[
  upload.single('profilepic'),
  check('firstName', 'firstName field is required.').not().isEmpty(),
  check('dob', 'dob field is required.').not().isEmpty(),
  check('contact1', 'contact1 field is required.').not().isEmpty(),
  check('address', 'Address field is required.').not().isEmpty(),
  check('password', 'password field is reuired.').not().isEmpty()
  ],update);
  router.delete("/delete/:id" ,parentDelete);
  router.delete("/bulkDelete/" ,bulkDelete);
  
module.exports = router;

function create(req, res, next) {
    parentController.create(req)
        .then(parent => parent ? res.json(parent) : res.status(400).json({ status: "error", message: 'Error while creating parent'}))
        .catch(err => next(err));
}
function view(req, res, next) {
    parentController.view(req.params.id)
        .then(parent => parent ? res.json(parent) : res.status(400).json({ status: "error", message: 'Error while view parent'}))
        .catch(err => next(err));
}
function list(req, res, next) {
    parentController.list(req)
        .then(parent => parent ? res.json(parent) : res.status(400).json({ status: "error", message: 'Error while list parent'}))
        .catch(err => next(err));
}
function update(req, res, next) {
    parentController.update(req)
        .then(parent => parent ? res.json(parent) : res.status(400).json({ status: "error", message: 'Error while update parent'}))
        .catch(err => next(err));
}
function parentDelete(req, res, next) {
    parentController.parentDelete(req.params.id)
        .then(parent => parent ? res.json(parent) : res.status(400).json({ status: "error", message: 'Error while delete parent'}))
        .catch(err => next(err));
}
function bulkDelete(req, res, next) {
    parentController.bulkDelete(req.body.ids)
        .then(parent => parent ? res.json(parent) : res.status(400).json({ status: "error", message: 'Error while delete parent'}))
        .catch(err => next(err));
}