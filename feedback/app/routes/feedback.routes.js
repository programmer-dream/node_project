const express = require('express'); 
const router = express.Router()
const feedbackController = require("../controllers/feedback.controller");
const { check } = require('express-validator');

//Post
router.post("/create",[
    check('title','title field is required.').not().isEmpty(),
    check('description','description field is required.').not().isEmpty(),
    check('feedback_type','feedback_type field is required.').not().isEmpty(),
    check('open_to_comment','open_to_comment field is required.').not().isEmpty(),
    check('branch_vls_id','branch_vls_id field is required.').not().isEmpty(),
    check('school_vls_id','school_vls_id field is required.').not().isEmpty()
    ],create);

//Get 
router.get("/view/:id",view);
router.get("/list/",list);

//Put
router.put("/update/:id",update);
router.put("/close/:id",closeFeedback);
router.put("/setMeeting/:id",setMeeting);

// DELETE
router.delete("/delete/:id",deleteFeedback);
router.delete("/deleteMultiFeedback",deleteMultiFeedback);


module.exports = router;

// Function for create feedback 
function create(req, res, next) {
    feedbackController.create(req)
        .then(feedback => feedback ? res.json(feedback) : res.status(400).json({ status: "error", message: 'Error while creating feedback' }))
        .catch(err => next(err));
}

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

// Function for update feedback 
function update(req, res, next) {
    feedbackController.update(req)
        .then(feedback => feedback ? res.json(feedback) : res.status(400).json({ status: "error", message: 'Error while updating feedback' }))
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