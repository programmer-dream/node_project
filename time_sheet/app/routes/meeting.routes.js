const express = require('express'); 
const router = express.Router()
const meetingController = require("../controllers/meeting.controller");
const { check } = require('express-validator');

//Post
router.post("/create",[
    check('attendee_vls_id','attendee_vls_id field is required.').not().isEmpty(),
    check('attendee_type','attendee_type field is required.').not().isEmpty(),
    check('meeting_title','meeting_title field is required.').not().isEmpty(),
    check('meeting_description','meeting_description field is required.').not().isEmpty(),
    check('meeting_mode','meeting_mode field is required.').not().isEmpty(),
    check('meeting_location','meeting_location field is required.').not().isEmpty(),
    check('date','date field is required.').not().isEmpty(),
    check('time','time field is required.').not().isEmpty(),
    check('duration','duration field is required.').not().isEmpty()
    ],create);

//Get 
router.get("/view/:id",view);
router.get("/list/",list);
router.get("/listParent",listParent);

//Put
router.put("/update/:id",[
    check('meeting_title','meeting_title field is required.').not().isEmpty(),
    check('meeting_description','meeting_description field is required.').not().isEmpty(),
    check('meeting_mode','meeting_mode field is required.').not().isEmpty(),
    check('meeting_location','meeting_location field is required.').not().isEmpty(),
    check('date','date field is required.').not().isEmpty(),
    check('time','time field is required.').not().isEmpty(),
    check('duration','duration field is required.').not().isEmpty()
    ],update);
router.put("/attend/:id",attendMeeting)

// DELETE
router.delete("/delete/:id",deleteMeeting);


module.exports = router;

// Function for create metting 
function create(req, res, next) {
    meetingController.create(req)
        .then(metting => metting ? res.json(metting) : res.status(400).json({ status: "error", message: 'Error while creating meeting' }))
        .catch(err => next(err));
}

// Function for metting details
function view(req, res, next) {
    meetingController.view(req.params, req.user)
        .then(metting => metting ? res.json(metting) : res.status(400).json({ status: "error", message: 'Error while viewing meeting' }))
        .catch(err => next(err));
}

// Function for list metting 
function list(req, res, next) {
    meetingController.list(req.user)
        .then(metting => metting ? res.json(metting) : res.status(400).json({ status: "error", message: 'Error while viewing meeting' }))
        .catch(err => next(err));
}

// Function for list parent 
function listParent(req, res, next) {
    meetingController.listParent(req.query, req.user)
        .then(metting => metting ? res.json(metting) : res.status(400).json({ status: "error", message: 'Error while viewing meeting' }))
        .catch(err => next(err));
}

// Function for update metting 
function update(req, res, next) {
    meetingController.update(req)
        .then(metting => metting ? res.json(metting) : res.status(400).json({ status: "error", message: 'Error while updating meeting' }))
        .catch(err => next(err));
}

// Function for delete metting 
function deleteMeeting(req, res, next) {
    meetingController.deleteMeeting(req.params.id, req.user)
        .then(metting => metting ? res.json(metting) : res.status(400).json({ status: "error", message: 'Error while deleting meeting' }))
        .catch(err => next(err));
}

// Function for metting status update
function attendMeeting(req, res, next) {
    meetingController.attendMeeting(req.params.id, req.body, req.user)
        .then(metting => metting ? res.json(metting) : res.status(400).json({ status: "error", message: 'Error while updating meeting' }))
        .catch(err => next(err));
}