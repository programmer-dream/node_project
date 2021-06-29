const express = require('express'); 
const router = express.Router()
const schoolController = require("../controllers/school.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;


router.post("/vlsVideoServices",vlsVideoServices);
router.post("/createVlsMeetingServices",createVlsMeetingServices);
router.post("/createSchoolMeetingSettings",createSchoolMeetingSettings);


router.get("/listVlsVideoServices",listVlsVideoServices);
router.get("/listSchoolMeetingSettings",listSchoolMeetingSettings);
router.get("/viewSchoolMeetingSettings/:meeting_setting_id",viewSchoolMeetingSettings);


router.put("/updateSchoolMeetingSettings/:meeting_setting_id",updateSchoolMeetingSettings);


router.delete("/deleteSchoolMeetingSettings/:meeting_setting_id",deleteSchoolMeetingSettings);


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
function listSchoolMeetingSettings(req, res, next) {
    schoolController.listSchoolMeetingSettings(req.query, req.user)
        .then(listing => listing ? res.json(listing) : res.status(400).json({ status: "error", message: 'Error while list video service settings' }))
        .catch(err => next(err));
}

// Function list video service 
function createVlsMeetingServices(req, res, next) {
    schoolController.createVlsMeetingServices(req.body, req.user)
        .then(meetingService => meetingService ? res.json(meetingService) : res.status(400).json({ status: "error", message: 'Error while create meeting service settings' }))
        .catch(err => next(err));
}

// Create school meeting settings
function createSchoolMeetingSettings(req, res, next) {
    schoolController.createSchoolMeetingSettings(req.body, req.user)
        .then(setting => setting ? res.json(setting) : res.status(400).json({ status: "error", message: 'Error while school meeting settings' }))
        .catch(err => next(err));
}

// view school meeting settings
function viewSchoolMeetingSettings(req, res, next) {
    schoolController.viewSchoolMeetingSettings(req.params, req.user)
        .then(setting => setting ? res.json(setting) : res.status(400).json({ status: "error", message: 'Error while school meeting settings' }))
        .catch(err => next(err));
}
// update school meeting settings
function updateSchoolMeetingSettings(req, res, next) {
    schoolController.updateSchoolMeetingSettings(req.params, req.body)
        .then(setting => setting ? res.json(setting) : res.status(400).json({ status: "error", message: 'Error while school meeting settings' }))
        .catch(err => next(err));
}

// delete school meeting settings
function deleteSchoolMeetingSettings(req, res, next) {
    schoolController.deleteSchoolMeetingSettings(req.params, req.user)
        .then(setting => setting ? res.json(setting) : res.status(400).json({ status: "error", message: 'Error while school meeting settings' }))
        .catch(err => next(err));
}
