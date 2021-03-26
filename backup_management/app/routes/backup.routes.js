const express = require('express'); 
const router = express.Router()
const backupController = require("../controllers/backup.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;


//Get 
router.get("/academicYears/",academicYears);
router.get("/listDirectories/",listDirectories);
router.get("/exportData/",exportData);
router.get("/importData/",importData);

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
        .then(backup => backup ? res.json(backup) : res.status(400).json({ status: "error", message: 'Error while export school data' }))
        .catch(err => next(err));
}

// Function for import data
function importData(req, res, next) {
    backupController.importData(req.query, req.user)
        .then(backup => backup ? res.json(backup) : res.status(400).json({ status: "error", message: 'Error while import school data' }))
        .catch(err => next(err));
}

// Function for list Directories data
function listDirectories(req, res, next) {
    backupController.listDirectories(req.query, req.user)
        .then(backup => backup ? res.json(backup) : res.status(400).json({ status: "error", message: 'Error while list Directories data' }))
        .catch(err => next(err));
}

