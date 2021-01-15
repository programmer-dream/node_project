const express = require('express'); 
const router = express.Router()
const timeSheetController = require("../controllers/timeSheet.controller");
const { check } = require('express-validator');

//Post
router.post("/create",[
    check('class_id','class_id field is required.').not().isEmpty(),
    check('day','day field is required.').not().isEmpty(),
    check('timetable','timetable field is required.').not().isEmpty()
    ],create);

//Get 
router.get("/teacher/view",teacherView);
router.get("/parent/view",parentView);

//Put
router.put("/update/:id",[
    check('class_id','class_id field is required.').not().isEmpty(),
    check('day','day field is required.').not().isEmpty(),
    check('subject_code','subject_code field is required.').not().isEmpty(),
    check('room_no','room_no field is required.').not().isEmpty(),
    check('start_time','start_time field is required.').not().isEmpty(),
    check('end_time','end_time field is required.').not().isEmpty(),
    ],update);

// DELETE
router.delete("/delete/:id",deleteTimetable);

module.exports = router;

// Function for create timesheet details
function create(req, res, next) {
    timeSheetController.create(req)
        .then(timesheet => timesheet ? res.json(timesheet) : res.status(400).json({ status: "error", message: 'Error while creating timesheet' }))
        .catch(err => next(err));
}

// Function for teacher timesheet details
function teacherView(req, res, next) {
    timeSheetController.teacherView(req.query, req.user)
        .then(timesheet => timesheet ? res.json(timesheet) : res.status(400).json({ status: "error", message: 'Error while listing timesheet' }))
        .catch(err => next(err));
}

// Function for parent timesheet details
function parentView(req, res, next) {
    timeSheetController.parentView(req.query, req.user)
        .then(timesheet => timesheet ? res.json(timesheet) : res.status(400).json({ status: "error", message: 'Error while listing timesheet' }))
        .catch(err => next(err));
}

// Function for update timesheet details
function update(req, res, next) {
    timeSheetController.update(req)
        .then(timesheet => timesheet ? res.json(timesheet) : res.status(400).json({ status: "error", message: 'Error while updating timesheet' }))
        .catch(err => next(err));
}

// Function for update timesheet details
function deleteTimetable(req, res, next) {
    timeSheetController.deleteTimetable(req.params.id, req.user)
        .then(timesheet => timesheet ? res.json(timesheet) : res.status(400).json({ status: "error", message: 'Error while deleting timesheet' }))
        .catch(err => next(err));
}
