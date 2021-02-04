const express = require('express'); 
const router = express.Router()
const chatController = require("../controllers/chat.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;

//Get 
router.get("/inbox/",inbox);

module.exports = router;

// Function for release assignment 
function inbox(req, res, next) {
    chatController.inbox(req.user)
        .then(chat => chat ? res.json(chat) : res.status(400).json({ status: "error", message: 'Error while geting chat' }))
        .catch(err => next(err));
}