const express = require('express'); 
const router = express.Router()
const reportController = require("../controllers/report.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;


router.get("/list/",list);


module.exports = router;



// Function for assignment details
function list(req, res, next) {
    reportController.list(req.query, req.user)
        .then(assignment => assignment ? res.json(assignment) : res.status(400).json({ status: "error", message: 'Error while listing assignment' }))
        .catch(err => next(err));
}
