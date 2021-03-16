const express = require('express'); 
const router = express.Router()
const commentController = require("../controllers/comment.controller");
const { check } = require('express-validator');

//Post
router.post("/create",[
    check('school_vls_id','school_vls_id field is required.').not().isEmpty(),
    check('branch_vls_id','branch_vls_id field is required.').not().isEmpty(),
    check('ticket_vls_id','ticket_vls_id field is required.').not().isEmpty(),
    check('comment_body','comment_body field is required.').not().isEmpty()
    ],createComment);

//Get 
router.get("/view/:id",viewComment);
router.get("/list",listComment);
//Delete
router.delete("/delete/:id",deleteComment);

//Put
router.put("/update/:id",[
    check('school_vls_id','school_vls_id field is required.').not().isEmpty(),
    check('branch_vls_id','branch_vls_id field is required.').not().isEmpty(),
    check('ticket_vls_id','ticket_vls_id field is required.').not().isEmpty(),
    check('comment_body','comment_body field is required.').not().isEmpty()
    ],updateComment);

module.exports = router;

// Function for create ticket details
function createComment(req, res, next) {
    commentController.create(req)
        .then(comment => comment ? res.json(comment) : res.status(400).json({ status: "error", message: 'Error while creating comment' }))
        .catch(err => next(err));
}
// Function for list ticket details
function listComment(req, res, next) {
    commentController.list(req.query)
        .then(comment => comment ? res.json(comment) : res.status(400).json({ status: "error", message: 'Error while listing comment' }))
        .catch(err => next(err));
}
// Function for update ticket details
function updateComment(req, res, next) {
    commentController.update(req)
        .then(comment => comment ? res.json(comment) : res.status(400).json({ status: "error", message: 'Error while updating comment' }))
        .catch(err => next(err));
}
// Function for view ticket details
function viewComment(req, res, next) {
    commentController.view(req.params.id)
        .then(comment => comment ? res.json(comment) : res.status(400).json({ status: "error", message: 'Error while viewing comment' }))
        .catch(err => next(err));
}
// Function for delete ticket details
function deleteComment(req, res, next) {
    commentController.deleteComment(req.params.id)
        .then(comment => comment ? res.json(comment) : res.status(400).json({ status: "error", message: 'Error while deleting comment' }))
        .catch(err => next(err));
}
