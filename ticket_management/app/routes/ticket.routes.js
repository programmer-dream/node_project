const express = require('express'); 
const router = express.Router()
const ticketController = require("../controllers/ticket.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;


router.post("/createTicket",[
    upload.fields([{
        name:'photo',maxCount:1
    }]),
    check('name','name field is required.').not().isEmpty(),
    check('phone','phone field is required.').not().isEmpty(),
    check('email','email field is required.').not().isEmpty(),
    check('present_address','present_address field is required.').not().isEmpty(),
    check('type','type field is required.').not().isEmpty(),
    check('school_id','school_id field is required.').not().isEmpty(),
    check('password','password field is required.').not().isEmpty()
    ],createTicket);


module.exports = router;

// Function for create ticket
function createTicket(req, res, next) {
    ticketController.create(req)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Error while creating ticket' }))
        .catch(err => next(err));
}
