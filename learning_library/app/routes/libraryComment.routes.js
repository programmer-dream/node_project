const express = require('express'); 
const router = express.Router()
const commentController = require("../controllers/LibraryComment.controller");
const { check } = require('express-validator');

//Post
router.post("/create",[
    check('school_vls_id','School_vls_id field is required.').not().isEmpty(),
    check('branch_vls_id','Branch_vls_id field is required.').not().isEmpty(),
    check('learning_library_vls_id','Learning_library_vls_id field is required.').not().isEmpty(),
    check('comment_body','Comment_body field is required.').not().isEmpty()
    ],createComment);

//Get 
router.get("/view/:id",viewComment);
router.get("/list",listComment);
//Delete
router.delete("/delete/:id",deleteComment);

//Put
router.put("/update/:id",[
    check('school_vls_id','School_vls_id field is required.').not().isEmpty(),
    check('branch_vls_id','Branch_vls_id field is required.').not().isEmpty(),
    check('learning_library_vls_id','Learning_library_vls_id field is required.').not().isEmpty(),
    check('comment_body','Comment_body field is required.').not().isEmpty()
    ],updateComment);

module.exports = router;

// Function for create query details
function createComment(req, res, next) {
    commentController.create(req)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while creating library comment' }))
        .catch(err => next(err));
}
// Function for list query details
function listComment(req, res, next) {
    commentController.list(req.query)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while listing library comment' }))
        .catch(err => next(err));
}
// Function for update query details
function updateComment(req, res, next) {
    commentController.update(req)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while updating library comment' }))
        .catch(err => next(err));
}
// Function for view query details
function viewComment(req, res, next) {
    commentController.view(req.params.id)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while view library comment' }))
        .catch(err => next(err));
}
// Function for delete query details
function deleteComment(req, res, next) {
    commentController.deleteComment(req.params.id)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while deleting library comment' }))
        .catch(err => next(err));
}
