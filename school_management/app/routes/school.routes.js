const express = require('express'); 
const router = express.Router()
const schoolController = require("../controllers/school.controller");
const { check } = require('express-validator');

//Post
router.post("/create",[
    check('school_name','school_name field is required.').not().isEmpty(),
    check('description','description field is required.').not().isEmpty(),
    check('address','address field is required.').not().isEmpty(),
    check('phone','phone field is required.').not().isEmpty(),
    check('email','email field is required.').not().isEmpty(),
    ],createSchool);
//Post
router.post("/branch/create",[
    check('branch_name','branch_name field is required.').not().isEmpty(),
    check('address','address field is required.').not().isEmpty(),
    check('contact1','contact1 field is required.').not().isEmpty(),
    check('emailId1','emailId1 field is required.').not().isEmpty(),
    check('school_id','school_id field is required.').not().isEmpty(),
    ],createBranch);

router.post("/createUser",[
    check('name','name field is required.').not().isEmpty(),
    check('phone','phone field is required.').not().isEmpty(),
    check('email','email field is required.').not().isEmpty(),
    check('present_address','present_address field is required.').not().isEmpty(),
    check('type','type field is required.').not().isEmpty(),
    check('school_id','school_id field is required.').not().isEmpty(),
    check('password','password field is required.').not().isEmpty(),
    check('branch_vls_id','branch_vls_id field is required.').not().isEmpty()
    ],createUser);

//Post
router.get("/view/:id",viewSchool);
router.get("/branch/view/:id",viewBranch);
router.get("/list/",listSchool);
router.get("/:id/branchList/",listBranch);

//put
router.put("/update/:id",updateSchool);
router.put("/branch/update/:id",updateBranch);
router.put("/:id/updateSettings/",updateSchoolSettings);
router.put("/branch/:id/updateSettings/",updateBranchSettings);

//Post
router.delete("/delete/:id",deleteSchool);
router.delete("/branch/delete/:id",deleteBranch);

module.exports = router;

// Function for create school
function createSchool(req, res, next) {
    schoolController.create(req)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while creating school' }))
        .catch(err => next(err));
}

// Function for view school
function viewSchool(req, res, next) {
    schoolController.view(req.params.id)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while viewing school' }))
        .catch(err => next(err));
}

// Function for view branch
function viewBranch(req, res, next) {
    schoolController.viewBranch(req.params.id)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while viewing branch' }))
        .catch(err => next(err));
}

// Function for list school
function listSchool(req, res, next) {
    schoolController.list(req.query , req.user)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while viewing school' }))
        .catch(err => next(err));
}

// Function for list branch
function listBranch(req, res, next) {
    schoolController.listBranch(req.params.id, req.user, req.query)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while viewing branch' }))
        .catch(err => next(err));
}

// Function for update school
function updateSchool(req, res, next) {
    schoolController.update(req , req.params.id)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while updating school' }))
        .catch(err => next(err));
}

// Function for update branch
function updateBranch(req, res, next) {
    schoolController.updateBranch(req , req.params.id)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while updating branch' }))
        .catch(err => next(err));
}

// Function for delete school
function deleteSchool(req, res, next) {
    schoolController.deleteSchool(req.params.id)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while deleting school' }))
        .catch(err => next(err));
}

// Function for delete branch
function deleteBranch(req, res, next) {
    schoolController.deleteBranch(req.params.id)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while deleting school' }))
        .catch(err => next(err));
}

// Function for setting school
function updateSchoolSettings(req, res, next) {
    schoolController.schoolSettingUpdate(req.params.id, req.body)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while updating school settings' }))
        .catch(err => next(err));
}

// Function for setting branch
function updateBranchSettings(req, res, next) {
    schoolController.updateBranchSettings(req.params.id, req.body)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while updating school settings' }))
        .catch(err => next(err));
}

// Function for create school
function createBranch(req, res, next) {
    schoolController.createBranch(req)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while creating branch' }))
        .catch(err => next(err));
}

// Function for create user
function createUser(req, res, next) {
    schoolController.createUser(req)
        .then(user => user ? res.json(user) : res.status(400).json({ status: "error", message: 'Error while creating user' }))
        .catch(err => next(err));
}
