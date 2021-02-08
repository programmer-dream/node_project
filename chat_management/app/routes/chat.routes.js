const express = require('express'); 
const router = express.Router()
const chatController = require("../controllers/chat.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;

//POST 
router.post("/create",[
	upload.fields([{
        name:'file',maxCount:1
    }])
	],create);

//GET 
router.get("/viewChat",viewChat);
router.get("/listUser",listUser);
router.get("/searchFaculty",searchFaculty);

//PUT 
router.put("/update/:id",updateChat);

//PUT 
router.delete("/delete/:id",deleteChat);

module.exports = router;

// Function for create chat	
function create(req, res, next) {
    chatController.create(req)
        .then(chat => chat ? res.json(chat) : res.status(400).json({ status: "error", message: 'Error while creating chat' }))
        .catch(err => next(err));
}

// Function for view chat	
function viewChat(req, res, next) {
    chatController.viewChat(req)
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