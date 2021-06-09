const express = require('express'); 
const router = express.Router()
const passionController = require("../controllers/passion.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;

//POST
router.post("/accept",[
    check('passion_vls_id','passion_vls_id field is required.').not().isEmpty(),
    ],accept);

//GET
router.get("/view/:id",view);
router.get("/list/",list);
router.get("/listTags/",listTags);


module.exports = router;


// Function for view ticket
function view(req, res, next) {
    passionController.view(req.params.id, req.user)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while view passion' }))
        .catch(err => next(err));
}

// Function for view ticket
function list(req, res, next) {
    passionController.list(req.query, req.user)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while list passion' }))
        .catch(err => next(err));
}


// Function for delete ticket
function accept(req, res, next) {
    passionController.acceptBlog(req.body, req.user)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while delete passion' }))
        .catch(err => next(err));
}

// Function for list tags
function listTags(req, res, next) {
    passionController.listTags(req.body, req.user)
        .then(passion => passion ? res.json(passion) : res.status(400).json({ status: "error", message: 'Error while getting passion list' }))
        .catch(err => next(err));
}
