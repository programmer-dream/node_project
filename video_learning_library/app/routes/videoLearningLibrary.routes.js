const express = require('express'); 
const router = express.Router()
const libraryController = require("../controllers/library.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;
//Post
router.post("/create",[
    upload.fields([{
        name:'file',maxCount:1
    },{
        name:'coverPhoto',maxCount:1
    }]),
    check('subject_code','subject_code field is required.').not().isEmpty(),
    check('topic','Topic field is required.').not().isEmpty(),
    check('description','Description field is required.').not().isEmpty(),
    check('recommended_student_level','Recommended_student_level field is required.').not().isEmpty(),
    ],create);

//Get 
router.get("/view/:id",view);
router.get("/list",list);
router.get("/getRatingLikes/:id",getRatingLikes);
router.get("/counts/",counts);
//Delete
router.delete("/delete/:id",deleteLibrary);
router.delete("/multipleDelete",deleteMultipleQuery);

//Put
router.put("/update/:id",[
    upload.fields([{
        name:'file',maxCount:1
    },{
        name:'coverPhoto',maxCount:1
    }]),
    check('subject_code','subject_code field is required.').optional().notEmpty(),
    check('topic','Topic field is required.').optional().notEmpty(),
    check('description','Description field is required.').optional().notEmpty(),
    check('recommended_student_level','Recommended_student_level field is required.').optional().notEmpty(),
    check('tags','Tags field is required.').optional().notEmpty()
    ],update);

module.exports = router;

// Function for create query details
function create(req, res, next) {
    libraryController.create(req)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while creating video library' }))
        .catch(err => next(err));
}
// Function for list query details
function list(req, res, next) {
    libraryController.list(req.query, req.user)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while listing video library' }))
        .catch(err => next(err));
}
// Function for update query details
function update(req, res, next) {
    libraryController.update(req)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while updating video library' }))
        .catch(err => next(err));
}
// Function for view query details
function view(req, res, next) {
    libraryController.view(req.params.id, req.user)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while viewing video library' }))
        .catch(err => next(err));
}
// Function for delete query details
function deleteLibrary(req, res, next) {
    libraryController.deleteLibrary(req.params.id)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while deleting video library' }))
        .catch(err => next(err));
}
// Function for delete query details
function deleteMultipleQuery(req, res, next) {
    libraryController.deleteMultipleQuery(req.body, req.user)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while deleting video library' }))
        .catch(err => next(err));
}
// Function for assing query
function getRatingLikes(req, res, next) {
    libraryController.getRatingLikes(req.params.id , req.user)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while getting like & ratting' }))
        .catch(err => next(err));
}
// Function for assing query
function counts(req, res, next) {
    libraryController.counts(req.query, req.user)
        .then(videoLibrary => videoLibrary ? res.json(videoLibrary) : res.status(400).json({ status: "error", message: 'Error while getting video Library counts' }))
        .catch(err => next(err));
}
