const express = require('express'); 
const router = express.Router()
const notificationController = require("../controllers/notification.controller");
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

// DELETE
router.delete("/delete/:id",deleteNotification);


module.exports = router;

// Function for create feedback 
function create(req, res, next) {
    notificationController.create(req)
        .then(feedback => feedback ? res.json(feedback) : res.status(400).json({ status: "error", message: 'Error while creating feedback' }))
        .catch(err => next(err));
}

// Function for feedback details
function view(req, res, next) {
    notificationController.view(req.params, req.user)
        .then(feedback => feedback ? res.json(feedback) : res.status(400).json({ status: "error", message: 'Error while viewing feedback' }))
        .catch(err => next(err));
}

// Function for feedback details
function list(req, res, next) {
    notificationController.list(req.query, req.user)
        .then(feedback => feedback ? res.json(feedback) : res.status(400).json({ status: "error", message: 'Error while listing feedback' }))
        .catch(err => next(err));
}

// Function for update feedback 
function update(req, res, next) {
    notificationController.update(req)
        .then(feedback => feedback ? res.json(feedback) : res.status(400).json({ status: "error", message: 'Error while updating feedback' }))
        .catch(err => next(err));
}

// Function for delete feedback 
function deleteNotification(req, res, next) {
    notificationController.deleteNotification(req.params.id, req.user)
        .then(feedback => feedback ? res.json(feedback) : res.status(400).json({ status: "error", message: 'Error while deleting feedback' }))
        .catch(err => next(err));
}