const express = require('express'); 
const router = express.Router()
const feeController = require("../controllers/fee.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;

 
router.get("/list",list); 
router.get("/view/:id",view); 
 

module.exports = router;


// Function list fee
function list(req, res, next) {
    feeController.list(req.query, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while listing fee' }))
        .catch(err => next(err));
}


// Function view fee
function view(req, res, next) {
    feeController.view(req.params, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while view fee' }))
        .catch(err => next(err));
}

