const express = require('express'); 
const router = express.Router()
const backupController = require("../controllers/backup.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;


//Get 
router.get("/academicYears/",academicYears);
router.get("/exportData/",exportData);

module.exports = router;

// Function for academic details
function academicYears(req, res, next) {
    backupController.academicYears(req.query, req.user)
        .then(academic => academic ? res.json(academic) : res.status(400).json({ status: "error", message: 'Error while listing academic year' }))
        .catch(err => next(err));
}

// Function for export data
function exportData(req, res, next) {
    backupController.exportData(req.query, req.user)
        .then(academic => academic ? res.json(academic) : res.status(400).json({ status: "error", message: 'Error while listing academic year' }))
        .catch(err => next(err));
}

