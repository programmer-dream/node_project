const express = require('express'); 
const router = express.Router()
const reportController = require("../controllers/meeting.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;


//Post
router.post("/create",create);


module.exports = router;



// Function for assignment details
function create(req, res, next) {
    reportController.list(req.boyd, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while listing exam' }))
        .catch(err => next(err));
}



