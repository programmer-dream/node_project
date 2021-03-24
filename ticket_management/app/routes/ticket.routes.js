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
router.get("/dashboardCount/",dashboardCount);
router.get("/getRating/:id",getRating);
router.get("/export/",exportTickets);

//GET
router.put("/update/:id",[
    upload.fields([{
        name:'file',maxCount:1
    }])
    ],update);
router.put("/changeStatus/:id",changeStatus);

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
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while view ticket' }))
        .catch(err => next(err));
}

// Function for view ticket
function list(req, res, next) {
    ticketController.list(req.query, req.user)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while list tickets' }))
        .catch(err => next(err));
}

// Function for dashboard count
function dashboardCount(req, res, next) {
    ticketController.dashboardCount(req.query, req.user)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while dashboard ticket' }))
        .catch(err => next(err));
}

// Function for udpate ticket
function update(req, res, next) {
    ticketController.update(req)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while update ticket' }))
        .catch(err => next(err));
}

// Function for delete ticket
function deleteTicket(req, res, next) {
    ticketController.deleteTicket(req.params.id)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while delete ticket' }))
        .catch(err => next(err));
}

// Function for get rating
function getRating(req, res, next) {
    ticketController.getRating(req.params.id ,req.user)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while get rating ticket' }))
        .catch(err => next(err));
}

// Function for export excel
function exportTickets(req, res, next) {
    ticketController.exportTickets(req.query)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while export ticket' }))
        .catch(err => next(err));
}

// Function for change status 
function changeStatus(req, res, next) {
    ticketController.changeStatus(req.params.id, req.body, req.user)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while change ticket status' }))
        .catch(err => next(err));
}