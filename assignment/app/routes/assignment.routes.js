const express = require('express'); 
const router = express.Router()
const assignmentController = require("../controllers/assignment.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;
//Post
router.post("/create",[
    upload.fields([{
        name:'file',maxCount:1
    }]),
    check('assignment_completion_date','assignment_completion_date field is required.').not().isEmpty(),
    check('assignment_type','assignment_type field is required.').not().isEmpty(),
    check('assignment_level','assignment_level field is required.').not().isEmpty(),
    check('total_marks','total_marks field is required.').not().isEmpty()
    ],create);

//Get 
router.get("/view/:id",view);

//Put
router.put("/update/:id",[
    upload.fields([{
        name:'file',maxCount:1
    }]),
    check('assignment_completion_date','assignment_completion_date field is required.').not().isEmpty(),
    check('assignment_type','assignment_type field is required.').not().isEmpty(),
    check('assignment_level','assignment_level field is required.').not().isEmpty(),
    check('total_marks','total_marks field is required.').not().isEmpty()
    ],update);
//router.put("/attend/:id",attendMeeting)

// DELETE
router.delete("/delete/:id",deleteAssignment);


module.exports = router;

// Function for create metting 
function create(req, res, next) {
    assignmentController.create(req)
        .then(metting => metting ? res.json(metting) : res.status(400).json({ status: "error", message: 'Error while creating assignment' }))
        .catch(err => next(err));
}

// Function for metting details
function view(req, res, next) {
    assignmentController.view(req.params, req.user)
        .then(metting => metting ? res.json(metting) : res.status(400).json({ status: "error", message: 'Error while viewing assignment' }))
        .catch(err => next(err));
}

// Function for update metting 
function update(req, res, next) {
    assignmentController.update(req)
        .then(metting => metting ? res.json(metting) : res.status(400).json({ status: "error", message: 'Error while updating assignment' }))
        .catch(err => next(err));
}

// Function for delete metting 
function deleteAssignment(req, res, next) {
    assignmentController.deleteAssignment(req.params.id, req.user)
        .then(metting => metting ? res.json(metting) : res.status(400).json({ status: "error", message: 'Error while deleting assignment' }))
        .catch(err => next(err));
}