const express = require('express'); 
const router = express.Router()
const feedbackController = require("../controllers/feedback.controller");
const { check } = require('express-validator');

//Post
router.post("/create",create);

//Get 
router.get("/view/:id",view);
router.get("/list/",list);


//Put
router.put("/update/:id",update);


// DELETE
router.delete("/delete/:id",deleteAssignment);


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
function deleteAssignment(req, res, next) {
    feedbackController.deleteFeedback(req.params.id, req.user)
        .then(feedback => feedback ? res.json(feedback) : res.status(400).json({ status: "error", message: 'Error while deleting feedback' }))
        .catch(err => next(err));
}