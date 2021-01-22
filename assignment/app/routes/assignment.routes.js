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
    check('total_marks','total_marks field is required.').not().isEmpty(),
    check('title','title field is required.').not().isEmpty(),
    check('description','description field is required.').not().isEmpty(),
    check('subject_code','subject_code field is required.').not().isEmpty()
    ],create);

//Get 
router.get("/view/:id",view);
router.get("/list/",list);

//Put
router.put("/update/:id",[
    upload.fields([{
        name:'file',maxCount:1
    }]),
    check('assignment_completion_date','assignment_completion_date field is required.').not().isEmpty(),
    check('assignment_type','assignment_type field is required.').not().isEmpty(),
    check('assignment_level','assignment_level field is required.').not().isEmpty(),
    check('total_marks','total_marks field is required.').not().isEmpty(),
    check('title','title field is required.').not().isEmpty(),
    check('description','description field is required.').not().isEmpty(),
    check('subject_code','subject_code field is required.').not().isEmpty()
    ],update);
router.put("/assignToStudents/:id",assignToStudents)

// DELETE
router.delete("/delete/:id",deleteAssignment);


module.exports = router;

// Function for create assignment 
function create(req, res, next) {
    assignmentController.create(req)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while creating assignment' }))
        .catch(err => next(err));
}

// Function for assignment details
function view(req, res, next) {
    assignmentController.view(req.params, req.user)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while viewing assignment' }))
        .catch(err => next(err));
}

// Function for assignment details
function list(req, res, next) {
    assignmentController.list(req.params, req.user)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while listing assignment' }))
        .catch(err => next(err));
}

// Function for update assignment 
function update(req, res, next) {
    assignmentController.update(req)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while updating assignment' }))
        .catch(err => next(err));
}

// Function for delete assignment 
function deleteAssignment(req, res, next) {
    assignmentController.deleteAssignment(req.params.id, req.user)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while deleting assignment' }))
        .catch(err => next(err));
}

// Function for assign to student 
function assignToStudents(req, res, next) {
    assignmentController.assignToStudents(req)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while deleting assignment' }))
        .catch(err => next(err));
}