const express = require('express'); 
const router = express.Router()
const rewardsController = require("../controllers/rewards.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;

//POST
router.post("/create",create)

router.get("/view",view)

module.exports = router;


//create or update rewards 
function create(req, res, next) {
    rewardsController.createOrUpdate(req.body, req.user)
        .then(rewards => rewards ? res.json(rewards) : res.status(400).json({ status: "error", message: 'Error while creating reward' }))
        .catch(err => next(err));
}


//view rewards 
function view(req, res, next) {
    rewardsController.view(req.query, req.user)
        .then(rewards => rewards ? res.json(rewards) : res.status(400).json({ status: "error", message: 'Error while creating reward' }))
        .catch(err => next(err));
}


