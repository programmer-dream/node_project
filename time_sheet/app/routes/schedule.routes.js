const express = require('express'); 
const router = express.Router()
const scheduleController = require("../controllers/schedule.controller");
const { check } = require('express-validator');


//Get 
router.get("/timeline",currentSchedule);

module.exports = router;

// Function for list metting 
function currentSchedule(req, res, next) {
    scheduleController.currentSchedule(req.user, req.query)
        .then(schedule => schedule ? res.json(schedule) : res.status(400).json({ status: "error", message: 'Error while listing schedule' }))
        .catch(err => next(err));
}

