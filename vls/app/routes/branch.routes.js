const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const branchController = require("../controllers/branch.controller");
const app = express();
const router = express.Router()
app.use(bodyParser.json());

//Post
router.post("/create",[
    check('branchName','BranchName field is required.').not().isEmpty(),
    check('contact1','Contact1 field is required.').not().isEmpty(),
    check('emailId1','Enter valid email.').not().isEmpty(),
    check('address','Address field is required.').not().isEmpty(),
    check('schoolId','SchoolId field is required.').not().isEmpty()
    ],branchCreate);
//Get
router.get("/view/:id",branchView);
router.get("/list",branchList);
// //put
router.put("/update/:id",[
    check('branchName','BranchName field is required.').not().isEmpty(),
    check('contact1','Contact1 field is required.').not().isEmpty(),
    check('emailId1','Enter valid email.').not().isEmpty(),
    check('address','Address field is required.').not().isEmpty(),
    check('schoolId','SchoolId field is required.').not().isEmpty()
    ],branchUpdate);
// //delete
router.delete("/delete/:id",branchDelete);
router.delete("/bulkDelete",bulkDelete);

module.exports = router;

function branchCreate(req, res, next) {
    branchController.branchCreate(req)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while creating branch'}))
        .catch(err => next(err));
}
function branchList(req, res, next) {
    branchController.branchList()
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while fetching branch'}))
        .catch(err => next(err));
}
function branchView(req, res, next) {
    branchController.branchView(req.params)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while fetching branch'}))
        .catch(err => next(err));
}
function branchUpdate(req, res, next) {
    branchController.branchUpdate(req)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while updating branch details'}))
        .catch(err => next(err));
}
function branchDelete(req, res, next) {
    branchController.branchDelete(req.params)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while updating branch details'}))
        .catch(err => next(err));
}
function bulkDelete(req, res, next) {
    branchController.bulkDelete(req.body)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while updating branch details'}))
        .catch(err => next(err));
}