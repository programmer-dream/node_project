const express = require('express'); 
const router = express.Router()
const attendaceController = require("../controllers/attendance.controller");
const { check } = require('express-validator');

//Post
router.post("/create",[
    check('present','present field is required.').not(),
    check('absent','absent field is required.').not(),
    check('classID','classID field is required.').not().isEmpty()
    ],attendanceCreate);

router.post("/addLeaveReason",[
    check('student_id','student_id field is required.').not().isEmpty(),
    check('reason','reason field is required.').not().isEmpty(),
    check('dateOfAbsent','dateOfAbsent field is required.').not().isEmpty()
    ],addLeaveReason);

//Put
router.put("/update",[
    check('studentIDs','studentIDs field is required.').not().isEmpty(),
    check('present','present field is required.').not().isEmpty(),
    check('date','date field is required.').not().isEmpty()
    ],attendanceUpdate);

router.put("/updateLeaveReason/:id",[
    check('student_id','student_id field is required.').not().isEmpty(),
    check('reason','reason field is required.').not().isEmpty(),
    check('dateOfAbsent','dateOfAbsent field is required.').not().isEmpty()
    ],updateLeaveReason);

//Get
router.get("/classList",classList);
router.get("/studentList",studentList);
router.get("/listForTeacher",listForTeacher);
router.get("/listAttendance",listForParent);
router.get("/listParentChildren",listParentChildren);
router.get("/teacherClasses",teacherClasses);
router.get("/dashboardAttendanceCount",dashboardAttendanceCount);
router.get("/getBranchAttendance",getBranchAttendance);
router.get("/getFullYearAttendance",getFullYearAttendance);
router.get("/getClassAttendance",getClassAttendance);



module.exports = router;

// Function for create attendance details
function attendanceCreate(req, res, next) {
    attendaceController.create(req, req.user)
        .then(attendance => attendance ? res.json(attendance) : res.status(400).json({ status: "error", message: 'Issue while creating attendance' }))
        .catch(err => next(err));
}

// Function for update attendance details
function attendanceUpdate(req, res, next) {
    attendaceController.update(req, req.user)
        .then(attendance => attendance ? res.json(attendance) : res.status(400).json({ status: "error", message: 'Issue while creating attendance' }))
        .catch(err => next(err));
}
// Function for list classes details
function classList(req, res, next) {
    attendaceController.classList(req.query,req.user)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while listing classes' }))
        .catch(err => next(err));
}
// Function for list student details
function studentList(req, res, next) {
    attendaceController.studentList(req.query)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while listing classes' }))
        .catch(err => next(err));
}
// add leave reason
function addLeaveReason(req, res, next) {
    attendaceController.addLeaveReason(req , req.user)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while listing classes' }))
        .catch(err => next(err));
}
// add leave reason
function updateLeaveReason(req, res, next) {
    attendaceController.updateLeaveReason(req , req.user)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while listing classes' }))
        .catch(err => next(err));
}
// update list attendance for teacher
function listForTeacher(req, res, next) {
    attendaceController.listForTeacher(req.query , req.user)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while listing classes' }))
        .catch(err => next(err));
}
// update list attendance for parnet & student
function listForParent(req, res, next) {
    attendaceController.listForParent(req.query , req.user)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while listing classes' }))
        .catch(err => next(err));
}
// update list attendance for parnet & student
function listParentChildren(req, res, next) {
    attendaceController.listParentChildren(req.query , req.user)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while listing classes' }))
        .catch(err => next(err));
}

// list teacher classes
function teacherClasses(req, res, next) {
    attendaceController.teacherClasses(req.user)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while listing classes' }))
        .catch(err => next(err));
}
// list teacher classes
function dashboardAttendanceCount(req, res, next) {
    attendaceController.dashboardAttendanceCount(req.user, req.query)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while listing classes' }))
        .catch(err => next(err));
}

// Branch percentage classes
function getBranchAttendance(req, res, next) {
    attendaceController.getBranchAttendance(req.query, req.user)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while branch attendance' }))
        .catch(err => next(err));
}
// get full year percentage
function getFullYearAttendance(req, res, next) {
    attendaceController.getFullYearAttendance(req.query, req.user)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while full year attendance' }))
        .catch(err => next(err));
}

// get full year percentage
function getClassAttendance(req, res, next) {
    attendaceController.getClassAttendance(req.query, req.user)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while class attendance' }))
        .catch(err => next(err));
}