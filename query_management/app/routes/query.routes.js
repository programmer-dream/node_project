const express = require('express'); 
const router = express.Router()
const queryController = require("../controllers/query.controller");
const { check } = require('express-validator');

//Post
// router.post("/response",queryResponse);

//Get 
router.get("/view/:id",viewQuery);
router.get("/list",queryList);
router.get("/listFaculty/branch/:id",listFaculty);
router.get("/listSubject/",listSubject);
router.get("/listAllSubject/",listAllSubject);
router.get("/getRatingLikes/:id",getRatingLikes);
router.get("/canResponse/:id",canResponse);
router.get("/dashboardCount",dashboardCount);
router.get("/teacherQueryList",teacherQueryList);
//Delete
router.delete("/multipleDelete/",deleteMultipleQuery);

//Put

module.exports = router;

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

// Function for view query details
function viewQuery(req, res, next) {
    queryController.view(req.params.id)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while viewing query' }))
        .catch(err => next(err));
}

// Function for delete multiple query details
function deleteMultipleQuery(req, res, next) {
    queryController.deleteMultipleQuery(req.body, req.user)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while deleting query' }))
        .catch(err => next(err));
}

// Function for list subjects 
function listSubject(req, res, next) {
    queryController.listSubject(req.query, req.user)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while listing subject' }))
        .catch(err => next(err));
}

// Function for list subjects 
function listAllSubject(req, res, next) {
    queryController.listAllSubject(req.query, req.user)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while listing all subject' }))
        .catch(err => next(err));
}

// Function for get rating and likes for query
function getRatingLikes(req, res, next) {
    queryController.getRatingLikes(req.params.id , req.user)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while getting query like & ratting' }))
        .catch(err => next(err));
}

// Function for user can response
function canResponse(req, res, next) {
    queryController.canResponse(req.params.id , req.user)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while checking user can response' }))
        .catch(err => next(err));
}
// Function for query count's
function dashboardCount(req, res, next) {
    queryController.dashboardCount( req.user, req.query )
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while getting query counts' }))
        .catch(err => next(err));
}
// Function for list query for subject teacher
function teacherQueryList(req, res, next) {
    queryController.teacherQueryList( req.user , req.query)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Error while getting list of subject teacher' }))
        .catch(err => next(err));
}
