const express = require('express'); 
const router = express.Router()
const feeController = require("../controllers/fee.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;

 
router.get("/list",list); 
router.get("/view/:id",view); 
router.get("/transactionList",transactionList); 
router.get("/transactionView/:id",transactionView); 

// POST request
router.post("/postFeeRequest/:branch_id",postFeeRequest); 
router.post("/vendorCreate/:branch_id",vendorCreate);
router.post("/otpLink",otpLink);
router.post("/tansactionCheck",tansactionCheck);

//put request
router.put("/vendorUpdate/:branch_id",vendorUpdate); 
  

module.exports = router;


// Function list fee
function list(req, res, next) {
    feeController.list(req.query, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while listing fee' }))
        .catch(err => next(err));
}


// Function view fee
function view(req, res, next) {
    feeController.view(req.params, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while view fee' }))
        .catch(err => next(err));
}

// Function postFeeRequest fee
function postFeeRequest(req, res, next) {
    feeController.postFeeRequest(req.body, req.params, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while making payments' }))
        .catch(err => next(err));
}

// Function vendor create fee
function vendorCreate(req, res, next) {
    feeController.vendorCreate(req.body, req.params)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while creating vendor' }))
        .catch(err => next(err));
}

// Function vendor create fee
function vendorUpdate(req, res, next) {
    feeController.vendorUpdate(req.body, req.params)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while creating vendor' }))
        .catch(err => next(err));
}

// Function otp link
function otpLink(req, res, next) {
    feeController.cardDetailsGetLink(req.body, req.params)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while getting otp link' }))
        .catch(err => next(err));
}

// Function list fee
function transactionList(req, res, next) {
    feeController.listTransaction(req.query, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while listing transaction' }))
        .catch(err => next(err));
}

// Function view fee
function transactionView(req, res, next) {
    feeController.transactionView(req.params, req.user)
        .then(exam => exam ? res.json(exam) : res.status(400).json({ status: "error", message: 'Error while transaction view' }))
        .catch(err => next(err));
}

// Function list fee
function tansactionCheck(req, res, next) {
    feeController.tansactionCheck(req.body)
        .then(exam => exam ? res.redirect(exam.redirectUrl) : res.status(400).json({ status: "error", message: 'Error while listing transaction' }))
        .catch(err => next(err));
}