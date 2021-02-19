const express = require('express'); 
const router = express.Router()
const chatController = require("../controllers/chat.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;

//GET 
router.get("/viewChat",viewChat);
router.get("/listUser",listUser);
router.get("/searchFaculty",searchFaculty);
router.get("/searchStudent",searchStudent);
router.get("/unreadCount",unreadCount);

//PUT 
router.put("/update/:id",updateChat);
router.put("/readMessages/",readMessages);

//PUT 
router.delete("/delete/:id",deleteChat);

module.exports = router;

// Function for view chat	
function viewChat(req, res, next) {
    chatController.viewChat(req.query, req.user)
        .then(chat => chat ? res.json(chat) : res.status(400).json({ status: "error", message: 'Error while getting chat' }))
        .catch(err => next(err));
}

// Function for update chat	
function updateChat(req, res, next) {
    chatController.updateChat(req)
        .then(chat => chat ? res.json(chat) : res.status(400).json({ status: "error", message: 'Error while updating chat' }))
        .catch(err => next(err));
}

// Function for delete chat	
function deleteChat(req, res, next) {
    chatController.deleteChat(req.params, req.user)
        .then(chat => chat ? res.json(chat) : res.status(400).json({ status: "error", message: 'Error while updating chat' }))
        .catch(err => next(err));
}

// Function for delete chat	
function listUser(req, res, next) {
    chatController.listUser(req.user)
        .then(chat => chat ? res.json(chat) : res.status(400).json({ status: "error", message: 'Error while updating chat' }))
        .catch(err => next(err));
}
// Function for delete chat 
function searchFaculty(req, res, next) {
    chatController.searchFaculty(req.query)
        .then(chat => chat ? res.json(chat) : res.status(400).json({ status: "error", message: 'Error while updating chat' }))
        .catch(err => next(err));
}

// Function for delete chat 
function searchStudent(req, res, next) {
    chatController.searchStudent(req.query)
        .then(chat => chat ? res.json(chat) : res.status(400).json({ status: "error", message: 'Error while getting list' }))
        .catch(err => next(err));
}

// Function for delete chat 
function readMessages(req, res, next) {
    chatController.readMessages(req.body)
        .then(chat => chat ? res.json(chat) : res.status(400).json({ status: "error", message: 'Error while reading messages' }))
        .catch(err => next(err));
}

// Function for delete chat 
function unreadCount(req, res, next) {
    chatController.unreadCount(req.user)
        .then(chat => chat ? res.json(chat) : res.status(400).json({ status: "error", message: 'Error while unread count' }))
        .catch(err => next(err));
}