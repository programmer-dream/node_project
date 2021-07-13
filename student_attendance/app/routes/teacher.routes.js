const express = require('express'); 
const router = express.Router()
const attendaceController = require("../controllers/attendance.controller");
const { check } = require('express-validator');

//Post
router.post("/create",[
    check('present','present field is required.').not(),
    check('absent','absent field is required.').not()
    ],attendanceCreate);

router.post("/addLeaveReason",[
    check('teacher_id','teacher_id field is required.').not().isEmpty(),
    check('reason','reason field is required.').not().isEmpty(),
    check('dateOfAbsent','dateOfAbsent field is required.').not().isEmpty()
    ],addLeaveReason);

//Put
router.put("/update",[
    check('teacherIDs','teacherIDs field is required.').not().isEmpty(),
    check('present','present field is required.').not().isEmpty(),
    check('date','date field is required.').not().isEmpty()
    ],attendanceUpdate);

router.put("/updateLeaveReason/:id",[
    check('teacher_id','teacher_id field is required.').not().isEmpty(),
    check('reason','reason field is required.').not().isEmpty(),
    check('dateOfAbsent','dateOfAbsent field is required.').not().isEmpty()
    ],updateLeaveReason);

//Get
router.get("/teacherList",teacherList);
router.get("/listTeacherAttendance",listTeacherAttendance);
router.get("/getMonthWiseAttendance",getMonthWiseAttendance);
router.get("/teacherDashboardAttendanceCount",teacherDashboardAttendanceCount);

module.exports = router;

// Function for create attendance details
function attendanceCreate(req, res, next) {
    attendaceController.teacherCreate(req, req.user)
        .then(attendance => attendance ? res.json(attendance) : res.status(400).json({ status: "error", message: 'Issue while creating attendance' }))
        .catch(err => next(err));
}

// Function for update attendance details
function attendanceUpdate(req, res, next) {
    attendaceController.teacherUpdate(req, req.user)
        .then(attendance => attendance ? res.json(attendance) : res.status(400).json({ status: "error", message: 'Issue while updating attendance' }))
        .catch(err => next(err));
}

// Function for list teacher 
function teacherList(req, res, next) {
    attendaceController.teacherList(req.query)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while listing classes' }))
        .catch(err => next(err));
}

// add leave reason
function addLeaveReason(req, res, next) {
    attendaceController.addLeaveReasonForTeacher(req , req.user)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while listing classes' }))
        .catch(err => next(err));
}

// add leave reason
function updateLeaveReason(req, res, next) {
    attendaceController.updateLeaveReasonForTeacher(req , req.user)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while listing classes' }))
        .catch(err => next(err));
}

// Function for list teacher 
function listTeacherAttendance(req, res, next) {
    attendaceController.listTeacherAttendance(req.query, req.user)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while listing teacher attendance' }))
        .catch(err => next(err));
}

// Function for get month wise teacher attendance 
function getMonthWiseAttendance(req, res, next) {
    attendaceController.getMonthWiseAttendance(req.query, req.user)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while getting month wise teacher attendance' }))
        .catch(err => next(err));
}

// Function for dashboard teacher attendance 
function teacherDashboardAttendanceCount(req, res, next) {
    attendaceController.teacherDashboardAttendanceCount(req.query, req.user)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while getting month wise teacher attendance' }))
        .catch(err => next(err));
}