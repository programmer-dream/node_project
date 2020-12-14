const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const schoolController = require("../controllers/school.controller");
const app = express();
const router = express.Router()
app.use(bodyParser.json());

  router.post("/create",[
  	check('name','Name field is required.').not().isEmpty(),
  	check('description','Description field is required.').not().isEmpty(),
  	check('contact1','Contact1 field is required.').not().isEmpty(),
  	check('emailId1','Enter valid email.').not().isEmpty(),
  	check('address','Address field is required.').not().isEmpty()
  	],create);

  router.get("/view/:id" ,view);
  router.get("/list/" ,list);
  router.put("/update/:id",[
    check('name','Name field is required.').not().isEmpty(),
    check('description','Description field is required.').not().isEmpty(),
    check('contact1','Contact1 field is required.').not().isEmpty(),
    check('emailId1','Enter valid email.').not().isEmpty(),
    check('address','Address field is required.').not().isEmpty()
    ],update);
  router.delete("/delete/:id" ,schoolDelete);
  router.delete("/bulkDelete/" ,bulkDelete);
  
module.exports = router;

function create(req, res, next) {
    schoolController.create(req)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while creating school'}))
        .catch(err => next(err));
}
function view(req, res, next) {
    schoolController.view(req.params.id)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while view school'}))
        .catch(err => next(err));
}
function list(req, res, next) {
    schoolController.list(req)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while list school'}))
        .catch(err => next(err));
}
function update(req, res, next) {
    schoolController.update(req)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while update school'}))
        .catch(err => next(err));
}
function schoolDelete(req, res, next) {
    schoolController.schoolDelete(req.params.id)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while delete school'}))
        .catch(err => next(err));
}
function bulkDelete(req, res, next) {
    schoolController.bulkDelete(req.body.ids)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while delete school'}))
        .catch(err => next(err));
}