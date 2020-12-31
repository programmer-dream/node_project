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
router.get("/list",list);

//Put
router.put("/update",[
    check('class_id','class_id field is required.').not().isEmpty(),
    check('day','day field is required.').not().isEmpty(),
    check('timetable','timetable field is required.').not().isEmpty()
    ],update);

module.exports = router;

// Function for create query details
function create(req, res, next) {
    timeSheetController.create(req)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while creating comment' }))
        .catch(err => next(err));
}
// Function for list query details
function list(req, res, next) {
    timeSheetController.list(req.query)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while listing comment' }))
        .catch(err => next(err));
}
// Function for update query details
function update(req, res, next) {
    timeSheetController.update(req)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while updating comment' }))
        .catch(err => next(err));
}
