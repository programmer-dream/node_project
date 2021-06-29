const express = require('express'); 
const router = express.Router()
const schoolController = require("../controllers/school.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;

//school meeting settings
router.post("/vlsVideoServices",vlsVideoServices);


module.exports = router;


// Function school meeting settings
function vlsVideoServices(req, res, next) {
    schoolController.vlsVideoServices(req.body, req.user)
        .then(setting => setting ? res.json(setting) : res.status(400).json({ status: "error", message: 'Error while school meeting settings' }))
        .catch(err => next(err));
}
