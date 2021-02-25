const express = require('express'); 
const router = express.Router()
const notificationController = require("../controllers/notification.controller");
const { check } = require('express-validator');

//post
router.post("/readNotifications/",readNotifications);

//Get 
router.get("/list/",list);
router.get("/customList/",customList);

//put

//delete
router.delete("/delete/:id",deleteNotification);

module.exports = router;

// Function for list notification
function list(req, res, next) {
    notificationController.list(req.query, req.user)
        .then(notification => notification ? res.json(notification) : res.status(400).json({ status: "error", message: 'Error while listing notification' }))
        .catch(err => next(err));
}

// Function for list custom notification
function customList(req, res, next) {
    notificationController.customList(req.query, req.user)
        .then(notification => notification ? res.json(notification) : res.status(400).json({ status: "error", message: 'Error while listing notification' }))
        .catch(err => next(err));
}

// Function for read notification 
function readNotifications(req, res, next) {
    notificationController.readNotifications(req.body, req.user)
        .then(notification => notification ? res.json(notification) : res.status(400).json({ status: "error", message: 'Error while read notification' }))
        .catch(err => next(err));
}


// Function for delete notification
function deleteNotification(req, res, next) {
    notificationController.deleteNotification(req.params.id)
        .then(notification => notification ? res.json(notification) : res.status(400).json({ status: "error", message: 'Error while update notification' }))
        .catch(err => next(err));
}