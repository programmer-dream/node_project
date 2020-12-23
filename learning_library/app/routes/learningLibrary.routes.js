const express = require('express'); 
const router = express.Router()
const libraryController = require("../controllers/library.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;
//Post
router.post("/create",[
    upload.single('file'),
    check('school_vls_id','School_vls_id field is required.').not().isEmpty(),
    check('branch_vls_id','Branch_vls_id field is required.').not().isEmpty(),
    check('subject','Subject field is required.').not().isEmpty(),
    check('topic','Topic field is required.').not().isEmpty(),
    check('description','Description field is required.').not().isEmpty(),
    check('recommended_student_level','Recommended_student_level field is required.').not().isEmpty(),
    check('tags','Tags field is required.').not().isEmpty()
    ],createComment);

//Get 
router.get("/view/:id",viewComment);
router.get("/list",listComment);
//Delete
router.delete("/delete/:id",deleteComment);

//Put
router.put("/update/:id",[
    upload.single('file'),
    check('school_vls_id','School_vls_id field is required.').not().isEmpty(),
    check('branch_vls_id','Branch_vls_id field is required.').not().isEmpty(),
    check('subject','Subject field is required.').not().isEmpty(),
    check('topic','Topic field is required.').not().isEmpty(),
    check('description','Description field is required.').not().isEmpty(),
    check('recommended_student_level','Recommended_student_level field is required.').not().isEmpty(),
    check('tags','Tags field is required.').not().isEmpty()
    ],updateComment);

module.exports = router;

// Function for create query details
function createComment(req, res, next) {
    libraryController.create(req)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Oops, wrong credentials, please try again' }))
        .catch(err => next(err));
}
// Function for list query details
function listComment(req, res, next) {
    libraryController.list(req.query)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Oops, wrong credentials, please try again' }))
        .catch(err => next(err));
}
// Function for update query details
function updateComment(req, res, next) {
    libraryController.update(req)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Oops, wrong credentials, please try again' }))
        .catch(err => next(err));
}
// Function for view query details
function viewComment(req, res, next) {
    libraryController.view(req.params.id)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Oops, wrong credentials, please try again' }))
        .catch(err => next(err));
}
// Function for delete query details
function deleteComment(req, res, next) {
    libraryController.deleteLibrary(req.params.id)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Oops, wrong credentials, please try again' }))
        .catch(err => next(err));
}