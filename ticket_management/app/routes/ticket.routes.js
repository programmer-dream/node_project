const express = require('express'); 
const router = express.Router()
const ticketController = require("../controllers/ticket.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;


router.post("/create",[
    upload.fields([{
        name:'photo',maxCount:1
    }])
    
    ],createTicket);


module.exports = router;

// Function for create ticket
function createTicket(req, res, next) {
    ticketController.create(req)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while creating ticket' }))
        .catch(err => next(err));
}
