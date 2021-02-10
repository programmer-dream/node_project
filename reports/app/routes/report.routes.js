const express = require('express'); 
const router = express.Router()
const reportController = require("../controllers/report.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;


router.get("/list/",list);
router.get("/:id/getExamMarks",getExamMarks);


module.exports = router;



// Function for assignment details
function list(req, res, next) {
    reportController.list(req.query, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while listing exam' }))
        .catch(err => next(err));
}

// Function for assignment details
function getExamMarks(req, res, next) {
    reportController.getExamMarks(req.params, req.user, req.query)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while getting exam marks' }))
        .catch(err => next(err));
}
