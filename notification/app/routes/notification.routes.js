const express = require('express'); 
const router = express.Router()
const notificationController = require("../controllers/notification.controller");

router.post("/readNotifications/",readNotifications);

//Get 
router.get("/list/",list);

module.exports = router;

// Function for list notification
function list(req, res, next) {
    notificationController.list(req.query, req.user)
        .then(notification => notification ? res.json(notification) : res.status(400).json({ status: "error", message: 'Error while listing notification' }))
        .catch(err => next(err));
}

// Function for read notification 
function readNotifications(req, res, next) {
    notificationController.readNotifications(req.body, req.user)
        .then(notification => notification ? res.json(notification) : res.status(400).json({ status: "error", message: 'Error while read notification' }))
        .catch(err => next(err));
}