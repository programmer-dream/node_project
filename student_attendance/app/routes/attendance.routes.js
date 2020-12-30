const express = require('express'); 
const router = express.Router()
const attendaceController = require("../controllers/attendance.controller");
const { check } = require('express-validator');

//Post
router.post("/create",[
    check('present','present field is required.').not().isEmpty(),
    check('absent','absent field is required.').not().isEmpty(),
    check('classID','classID field is required.').not().isEmpty()
    ],attendanceCreate);

router.post("/updateLeaveReason",[
    check('student_id','student_id field is required.').not().isEmpty(),
    check('reason','reason field is required.').not().isEmpty(),
    ],updateLeaveReason);

//Put
router.put("/update",[
    check('studentIDs','studentIDs field is required.').not().isEmpty(),
    check('present','present field is required.').not().isEmpty(),
    check('date','date field is required.').not().isEmpty()
    ],attendanceUpdate);


//Get
router.get("/classList",classList);
router.get("/studentList",studentList);
router.get("/studentList",studentList);

router.get("/listForTeacher",[
    ],listForTeacher);



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
    attendaceController.classList(req.query,)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while listing classes' }))
        .catch(err => next(err));
}
// Function for list student details
function studentList(req, res, next) {
    attendaceController.studentList(req.query)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while listing classes' }))
        .catch(err => next(err));
}
// update leave reason
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