const express = require('express'); 
const router = express.Router()
const feedbackController = require("../controllers/feedback.controller");
const { check } = require('express-validator');

//Post

//Get 
router.get("/view/:id",view);
router.get("/list/",list);

//Put
router.put("/close/:id",closeFeedback);
router.put("/setMeeting/:id",setMeeting);

// DELETE
router.delete("/delete/:id",deleteFeedback);
router.delete("/deleteMultiFeedback",deleteMultiFeedback);


module.exports = router;

// Function for create feedback 

// Function for feedback details
function view(req, res, next) {
    feedbackController.view(req.params, req.user)
        .then(feedback => feedback ? res.json(feedback) : res.status(400).json({ status: "error", message: 'Error while viewing feedback' }))
        .catch(err => next(err));
}

// Function for feedback details
function list(req, res, next) {
    feedbackController.list(req.query, req.user)
        .then(feedback => feedback ? res.json(feedback) : res.status(400).json({ status: "error", message: 'Error while listing feedback' }))
        .catch(err => next(err));
}

// Function for delete feedback 
function deleteFeedback(req, res, next) {
    feedbackController.deleteFeedback(req.params.id, req.user)
        .then(feedback => feedback ? res.json(feedback) : res.status(400).json({ status: "error", message: 'Error while deleting feedback' }))
        .catch(err => next(err));
}

// Function for delete feedback 
function deleteMultiFeedback(req, res, next) {
    feedbackController.deleteMultiFeedback(req.body)
        .then(feedback => feedback ? res.json(feedback) : res.status(400).json({ status: "error", message: 'Error while deleting feedback' }))
        .catch(err => next(err));
}

// Function for delete feedback 
function closeFeedback(req, res, next) {
    feedbackController.closeFeedback(req.params.id, req.body, req.user)
        .then(feedback => feedback ? res.json(feedback) : res.status(400).json({ status: "error", message: 'Error while closed feedback' }))
        .catch(err => next(err));
}

// Function for delete feedback 
function setMeeting(req, res, next) {
    feedbackController.setMeeting(req.params.id, req.body)
        .then(feedback => feedback ? res.json(feedback) : res.status(400).json({ status: "error", message: 'Error while set meeting feedback' }))
        .catch(err => next(err));
}