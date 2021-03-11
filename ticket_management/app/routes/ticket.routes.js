const express = require('express'); 
const router = express.Router()
const ticketController = require("../controllers/ticket.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;

//POST 
router.post("/create",[
    upload.fields([{
        name:'file',maxCount:1
    }])
    ],createTicket);

//GET
router.get("/view/:id",view);
router.get("/list/",list);

//GET
router.put("/update/:id",[
    upload.fields([{
        name:'file',maxCount:1
    }])
    ],update);

//GET
router.delete("/delete/:id",deleteTicket);

module.exports = router;

// Function for create ticket
function createTicket(req, res, next) {
    ticketController.create(req)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while creating ticket' }))
        .catch(err => next(err));
}

// Function for view ticket
function view(req, res, next) {
    ticketController.view(req.params.id)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while creating ticket' }))
        .catch(err => next(err));
}

// Function for view ticket
function list(req, res, next) {
    ticketController.list(req.query, req.user)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while creating ticket' }))
        .catch(err => next(err));
}

// Function for udpate ticket
function update(req, res, next) {
    ticketController.update(req)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while creating ticket' }))
        .catch(err => next(err));
}

// Function for delete ticket
function deleteTicket(req, res, next) {
    ticketController.deleteTicket(req.params.id)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while creating ticket' }))
        .catch(err => next(err));
}