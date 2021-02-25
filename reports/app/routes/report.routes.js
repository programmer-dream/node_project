const express = require('express'); 
const router = express.Router()
const reportController = require("../controllers/report.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;


router.get("/list/",list);
router.get("/dashboardList/",dashboardList);
router.get("/:id/getExamMarks",getExamMarks);
router.get("/subjectPerformance",subjectPerformance);
router.get("/classPerformance",classPerformance);

//Post
router.post("/sendExamResult",sendExamResult);
router.post("/sendAttendanceResult",sendAttendanceResult);


module.exports = router;



// Function for assignment details
function list(req, res, next) {
    reportController.list(req.query, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while listing exam' }))
        .catch(err => next(err));
}

// Function for assignment details
function dashboardList(req, res, next) {
    reportController.dashboardList(req.query, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while listing exam' }))
        .catch(err => next(err));
}

// Function for assignment details
function getExamMarks(req, res, next) {
    reportController.getExamMarks(req.params, req.user, req.query)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while getting exam marks' }))
        .catch(err => next(err));
}

// Function for assignment details
function sendExamResult(req, res, next) {
    reportController.sendExamResult(req.body, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while getting send exam marks' }))
        .catch(err => next(err));
}

// Function for assignment details
function sendAttendanceResult(req, res, next) {
    reportController.sendAttendanceResult(req.body, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while getting send attenance marks' }))
        .catch(err => next(err));
}

// Function for assignment details
function subjectPerformance(req, res, next) {
    reportController.subjectPerformance(req.query, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while getting send attenance marks' }))
        .catch(err => next(err));
}
// Function for assignment details
function classPerformance(req, res, next) {
    reportController.classPerformance(req.query, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while getting send attenance marks' }))
        .catch(err => next(err));
}
