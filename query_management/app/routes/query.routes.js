const express = require('express'); 
const router = express.Router()
const queryController = require("../controllers/query.controller");
const { check } = require('express-validator');

//Post
router.post("/create",[
    check('subject','Subject field is required.').not().isEmpty(),
    check('topic','Topic field is required.').not().isEmpty(),
    check('description','Description field is required.').not().isEmpty(),
    check('branch_vls_id','Branch_vls_id field is required.').not().isEmpty(),
    check('student_vls_id','Student_vls_id field is required.').not().isEmpty(),
    check('school_vls_id','School_vls_id field is required.').not().isEmpty(),
    check('faculty_vls_id','Faculty_vls_id field is required.').not().isEmpty()
    ],createQuery);
router.post("/response",queryResponse);

//Get 
router.get("/view/:id",viewQuery);
router.get("/list",queryList);
router.get("/listFaculty/branch/:id",listFaculty);
router.get("/listSubject/branch/:id",listSubject);
router.get("/getRatingLikes/:id",getRatingLikes);
//Delete
router.delete("/delete/:id",deleteQuery);

//Put
router.put("/update/:id",[
    check('subject','Subject field is required.').not().isEmpty(),
    check('topic','Topic field is required.').not().isEmpty(),
    check('description','Description field is required.').not().isEmpty(),
    check('branch_vls_id','Branch_vls_id field is required.').not().isEmpty(),
    check('student_vls_id','Student_vls_id field is required.').not().isEmpty(),
    check('school_vls_id','School_vls_id field is required.').not().isEmpty(),
    check('faculty_vls_id','Faculty_vls_id field is required.').not().isEmpty()
    ],updateQuery);
router.put("/statusUpdate/:id",statusUpdate);

module.exports = router;

// Function for create query details
function createQuery(req, res, next) {
    queryController.create(req)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while creating query' }))
        .catch(err => next(err));
}
// Function for list query details
function queryList(req, res, next) {
    queryController.list(req.query, req.user)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while listing query' }))
        .catch(err => next(err));
}
// Function for list faculty query details
function listFaculty(req, res, next) {
    queryController.listFaculty(req.params)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while list faculty' }))
        .catch(err => next(err));
}
// Function for update query details
function updateQuery(req, res, next) {
    queryController.update(req)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while update query' }))
        .catch(err => next(err));
}
// Function for view query details
function viewQuery(req, res, next) {
    queryController.view(req.params.id)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while viewing query' }))
        .catch(err => next(err));
}
// Function for delete query details
function deleteQuery(req, res, next) {
    queryController.deleteQuery(req.params.id)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while deleting query' }))
        .catch(err => next(err));
}
// Function for assing query
function listSubject(req, res, next) {
    queryController.listSubject(req.params)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while listing subject' }))
        .catch(err => next(err));
}
// Function for assing query
function queryResponse(req, res, next) {
    queryController.queryResponse(req.body, req.user)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while updating query response' }))
        .catch(err => next(err));
}
// Function for assing query
function getRatingLikes(req, res, next) {
    queryController.getRatingLikes(req.params.id , req.user)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while getting query like & ratting' }))
        .catch(err => next(err));
}
// Function for assing query
function statusUpdate(req, res, next) {
    queryController.statusUpdate(req.params.id , req.user)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while getting query like & ratting' }))
        .catch(err => next(err));
}
