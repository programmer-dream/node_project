const express = require('express'); 
const router = express.Router()
const schoolController = require("../controllers/school.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;

//school meeting settings
router.post("/vlsVideoServices",vlsVideoServices);
router.get("/listVlsVideoServices",listVlsVideoServices);
router.post("/createVlsMeetingServices",createVlsMeetingServices);


module.exports = router;


// Function school meeting settings
function vlsVideoServices(req, res, next) {
    schoolController.vlsVideoServices(req.body, req.user)
        .then(setting => setting ? res.json(setting) : res.status(400).json({ status: "error", message: 'Error while create video service settings' }))
        .catch(err => next(err));
}

// Function list video service 
function listVlsVideoServices(req, res, next) {
    schoolController.listVlsVideoServices(req.query, req.user)
        .then(listing => listing ? res.json(listing) : res.status(400).json({ status: "error", message: 'Error while list video service settings' }))
        .catch(err => next(err));
}

// Function list video service 
function createVlsMeetingServices(req, res, next) {
    schoolController.createVlsMeetingServices(req.query, req.user)
        .then(meetingService => meetingService ? res.json(meetingService) : res.status(400).json({ status: "error", message: 'Error while create meeting service settings' }))
        .catch(err => next(err));
}
