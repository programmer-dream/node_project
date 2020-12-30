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

//Put
router.put("/update",[
    check('student_vls_id','student_id field is required.').not().isEmpty(),
    check('present','present field is required.').not().isEmpty(),
    check('date','date field is required.').not().isEmpty()
    ],attendanceUpdate);
//Get
router.get("/classList",classList);
router.get("/studentList",studentList);


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
// Function for list classes details
function studentList(req, res, next) {
    attendaceController.studentList(req.query)
        .then(list => list ? res.json(list) : res.status(400).json({ status: "error", message: 'Issue while listing classes' }))
        .catch(err => next(err));
}