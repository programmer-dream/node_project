const express = require('express'); 
const router = express.Router()
const assignmentController = require("../controllers/assignment.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;

//Post
router.post("/inprogressAssignment",[
    check('assignment_vls_id','assignment_vls_id field is required.').not().isEmpty(),
    check('submission_date','submission_date field is required.').not().isEmpty()
    ],createStudentAssignment);

router.post("/:assignment_vls_id/createQuestion",createAssignmentQuestion);
router.post("/questionResponse",questionResponse)


//Get 
router.get("/view/:id",view);
router.get("/list/",list);
router.get("/dashboardData/",dashboardData);
router.get("/dashboardCount/",dashboardCount);

// //Put
router.put("/updateMarks",updateMarks)

router.put("/updateQuestion/:id",[
    check('question','question field is required.').not().isEmpty(),
    check('assessment','assessment field is required.').not().isEmpty(),
    check('assignment_vls_id','assignment_vls_id field is required.').not().isEmpty(),
    check('question_type','question_type field is required.').not().isEmpty()
    ],updateQuestion)

router.put("/submitAssignment/:student_assignment_id",[
    upload.fields([{
        name:'file',maxCount:1
    }])
    ],submitAssignment);

// DELETE
router.delete("/delete/:id",deleteAssignment);
router.delete("/deleteQuestion/:id",deleteQuestion);


module.exports = router;


// Function for assignment details
function view(req, res, next) {
    assignmentController.view(req.params, req.user)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while viewing assignment' }))
        .catch(err => next(err));
}

// Function for assignment details
function list(req, res, next) {
    assignmentController.list(req.query, req.user)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while listing assignment' }))
        .catch(err => next(err));
}

// Function for delete assignment 
function deleteAssignment(req, res, next) {
    assignmentController.deleteAssignment(req.params.id, req.user)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while deleting assignment' }))
        .catch(err => next(err));
}

// Function for assign to student 
function createStudentAssignment(req, res, next) {
    assignmentController.createStudentAssignment(req)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while deleting assignment' }))
        .catch(err => next(err));
}

// Function for assign to student 
function submitAssignment(req, res, next) {
    assignmentController.submitAssignment(req)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while deleting assignment' }))
        .catch(err => next(err));
}

// Function for create assignment question 
function createAssignmentQuestion(req, res, next) {
    assignmentController.createAssignmentQuestion(req)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while create assignment question' }))
        .catch(err => next(err));
}
// Function for update question assignment  
function updateQuestion(req, res, next) {
    assignmentController.updateQuestion(req)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while update assignment question' }))
        .catch(err => next(err));
}
// Function for delete assignment question 
function deleteQuestion(req, res, next) {
    assignmentController.deleteQuestion(req.params.id)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while update assignment question' }))
        .catch(err => next(err));
}

// Function for assignment question response
function questionResponse(req, res, next) {
    assignmentController.questionResponse(req)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while update assignment question' }))
        .catch(err => next(err));
}

// Function for assignment question response
function updateMarks(req, res, next) {
    assignmentController.updateMarks(req.body, req.user)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while update assignment question' }))
        .catch(err => next(err));
}

// Function for release assignment 
function dashboardData(req, res, next) {
    assignmentController.dashboardData(req.user, req.query)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while geting current weeek assignment' }))
        .catch(err => next(err));
}

// Function for dashboard count 
function dashboardCount(req, res, next) {
    assignmentController.dashboardCount(req.query, req.user)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while dashboard assignment' }))
        .catch(err => next(err));
}