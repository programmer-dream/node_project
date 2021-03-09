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
router.get("/view/:id",viewSchool);
router.get("/list/",listSchool);

//put
router.put("/update/:id",updateSchool);
router.put("/:id/updateSettings/",updateSchoolSettings);

//Post
router.delete("/delete/:id",deleteSchool);

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

// Function for list school
function listSchool(req, res, next) {
    schoolController.list(req.user)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while viewing school' }))
        .catch(err => next(err));
}

// Function for update school
function updateSchool(req, res, next) {
    schoolController.update(req , req.params.id)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while updating school' }))
        .catch(err => next(err));
}

// Function for delete school
function deleteSchool(req, res, next) {
    schoolController.deleteSchool(req.params.id)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while deleting school' }))
        .catch(err => next(err));
}

// Function for setting school
function updateSchoolSettings(req, res, next) {
    schoolController.schoolSettingUpdate(req.params.id, req.body)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while updating school settings' }))
        .catch(err => next(err));
}
