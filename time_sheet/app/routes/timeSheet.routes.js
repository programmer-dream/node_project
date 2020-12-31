const express = require('express'); 
const router = express.Router()
const timeSheetController = require("../controllers/timeSheet.controller");
const { check } = require('express-validator');
//const helper = require("../helper");
//const upload  = helper.upload;
//Post
router.post("/create",[
    check('school_vls_id','School_vls_id field is required.').not().isEmpty(),
    check('branch_vls_id','Branch_vls_id field is required.').not().isEmpty(),
    check('class_id','class_id field is required.').not().isEmpty(),
    check('start_time','start_time field is required.').not().isEmpty(),
    check('end_time','end_time field is required.').not().isEmpty(),  
    check('room_no','room_no field is required.').not().isEmpty(),
    check('subject_id','subject_id field is required.').not().isEmpty()
    ],create);

//Get 
router.get("/view/:id",view);
router.get("/list",list);
router.get("/getRatingLikes/:id",getRatingLikes);
//Delete
router.delete("/delete/:id",deleteLibrary);

//Put
router.put("/update/:id",[
    check('school_vls_id','School_vls_id field is required.').not().isEmpty(),
    check('branch_vls_id','Branch_vls_id field is required.').not().isEmpty(),
    check('subject','Subject field is required.').not().isEmpty(),
    check('topic','Topic field is required.').not().isEmpty(),
    check('description','Description field is required.').not().isEmpty(),
    check('recommended_student_level','Recommended_student_level field is required.').not().isEmpty(),
    check('tags','Tags field is required.').not().isEmpty()
    ],update);

module.exports = router;

// Function for create query details
function create(req, res, next) {
    timeSheetController.create(req)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while creating comment' }))
        .catch(err => next(err));
}
// Function for list query details
function list(req, res, next) {
    timeSheetController.list(req.query)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while listing comment' }))
        .catch(err => next(err));
}
// Function for update query details
function update(req, res, next) {
    timeSheetController.update(req)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while updating comment' }))
        .catch(err => next(err));
}
// Function for view query details
function view(req, res, next) {
    timeSheetController.view(req.params.id)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while viewing comment' }))
        .catch(err => next(err));
}
// Function for delete query details
function deleteLibrary(req, res, next) {
    timeSheetController.deleteLibrary(req.params.id)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while deleting comment' }))
        .catch(err => next(err));
}
// Function for assing query
function getRatingLikes(req, res, next) {
    timeSheetController.getRatingLikes(req.params.id , req.user)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while getting like & ratting' }))
        .catch(err => next(err));
}
