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
router.post("/assignQuery",assignQuery);

//Get 
router.get("/view/:id",viewQuery);
router.get("/list",queryList);
router.get("/listFaculty",listFaculty);
router.get("/listSubject",listSubject);
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

module.exports = router;

// Function for create query details
function createQuery(req, res, next) {
    queryController.create(req)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Oops, wrong credentials, please try again' }))
        .catch(err => next(err));
}
// Function for list query details
function queryList(req, res, next) {
    queryController.list(req.query)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Oops, wrong credentials, please try again' }))
        .catch(err => next(err));
}
// Function for list faculty query details
function listFaculty(req, res, next) {
    queryController.listFaculty(req.query)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Oops, wrong credentials, please try again' }))
        .catch(err => next(err));
}
// Function for update query details
function updateQuery(req, res, next) {
    queryController.update(req)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Oops, wrong credentials, please try again' }))
        .catch(err => next(err));
}
// Function for view query details
function viewQuery(req, res, next) {
    queryController.view(req.params.id)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Oops, wrong credentials, please try again' }))
        .catch(err => next(err));
}
// Function for delete query details
function deleteQuery(req, res, next) {
    queryController.deleteQuery(req.params.id)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Oops, wrong credentials, please try again' }))
        .catch(err => next(err));
}
// Function for assing query
function assignQuery(req, res, next) {
    queryController.assignQuery(req.body)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Oops, wrong credentials, please try again' }))
        .catch(err => next(err));
}
// Function for assing query
function listSubject(req, res, next) {
    queryController.listSubject(req.body)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Oops, wrong credentials, please try again' }))
        .catch(err => next(err));
}

