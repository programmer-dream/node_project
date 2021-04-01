const express = require('express'); 
const router = express.Router()
const passionController = require("../controllers/passion.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;

//POSt
router.post("/accept",[
    check('passion_vls_id','passion_vls_id field is required.').not().isEmpty(),
    ],accept);
//GET
router.get("/view/:id",view);
router.get("/list/",list);

//PUT
router.put("/update/:id",update);

//GET
router.delete("/delete/:id",deletePassion);

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

// Function for udpate ticket
function update(req, res, next) {
    passionController.update(req)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while update passion' }))
        .catch(err => next(err));
}

// Function for delete ticket
function deletePassion(req, res, next) {
    passionController.deletePassion(req.params.id)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while delete passion' }))
        .catch(err => next(err));
}

// Function for delete ticket
function accept(req, res, next) {
    passionController.acceptBlog(req.body, req.user)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while delete passion' }))
        .catch(err => next(err));
}
