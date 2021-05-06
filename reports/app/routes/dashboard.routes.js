const express = require('express'); 
const router = express.Router()
const reportController = require("../controllers/report.controller");
const { check } = require('express-validator');


router.get("/schoolBranchCount",schoolBranchCount);

module.exports = router;



// Function for get dashboard count 
function schoolBranchCount(req, res, next) {
    reportController.schoolBranchCount(req.query, req.user)
        .then(dashboard => dashboard ? res.json(dashboard) : res.status(400).json({ status: "error", message: 'Error while getting counts' }))
        .catch(err => next(err));
}
