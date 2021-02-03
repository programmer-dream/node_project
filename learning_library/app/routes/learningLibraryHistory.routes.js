const express = require('express'); 
const router = express.Router()
const historyController = require("../controllers/history.controller");
const { check } = require('express-validator');

//Post
router.post("/",addHistory);

//GET
router.get("/view",viewHistory);


module.exports = router;

// Function for create query details
function addHistory(req, res, next) {
    historyController.addHistory(req.body, req.user)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Issue while rating this query' }))
        .catch(err => next(err));
}

// Function for view query details
function viewHistory(req, res, next) {
    historyController.viewHistory(req.query, req.user)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Issue while rating this query' }))
        .catch(err => next(err));
}
