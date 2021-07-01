const express = require('express'); 
const router = express.Router()
const meetingController = require("../controllers/meeting.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;


//Post
router.post("/create",create); 

router.get("/list",list); 
router.get("/view/:metting_id",view); 

router.put("/update/:metting_id",update); 

router.delete("/deleteMeeting/:metting_id",deleteMeeting); 


module.exports = router;


// Function create meeting
function create(req, res, next) {
    meetingController.create(req.body, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while listing exam' }))
        .catch(err => next(err));
}

// Function list meeting
function list(req, res, next) {
    meetingController.list(req.query, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while listing exam' }))
        .catch(err => next(err));
}

// Function view meeting
function view(req, res, next) {
    meetingController.view(req.params, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while listing exam' }))
        .catch(err => next(err));
}

// Function update meeting
function update(req, res, next) {
    meetingController.update(req.params, req.body, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while listing exam' }))
        .catch(err => next(err));
}

// Function delete meeting
function deleteMeeting(req, res, next) {
    meetingController.deleteMeeting(req.params, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while listing exam' }))
        .catch(err => next(err));
}