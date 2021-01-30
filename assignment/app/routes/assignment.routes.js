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
    check('assignment_class_id','assignment_class_id field is required.').not().isEmpty(),
    check('title','title field is required.').not().isEmpty(),
    check('description','description field is required.').not().isEmpty(),
    check('subject_code','subject_code field is required.').not().isEmpty()
    ],create);

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
router.put("/changeAssignmentStatus/:student_assignment_id",changeAssignmentStatus)
router.put("/updateMarks",updateMarks)

router.put("/releaseAssignment",[
    check('is_released','is_released field is required.').not().isEmpty(),
    check('assignment_id','assignment_id field is required.').not().isEmpty()
    ],releaseAssignment)

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
    assignmentController.list(req.query, req.user)
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

// Function for assign to student 
function changeAssignmentStatus(req, res, next) {
    assignmentController.changeAssignmentStatus(req.params, req.user, req.body)
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
function releaseAssignment(req, res, next) {
    assignmentController.releaseAssignment(req.body)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while release assignment' }))
        .catch(err => next(err));
}

// Function for release assignment 
function dashboardData(req, res, next) {
    assignmentController.dashboardData(req.user, req.query)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while geting current weeek assignment' }))
        .catch(err => next(err));
}