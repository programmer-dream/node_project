const express = require('express'); 
const router = express.Router()
const communityController = require("../controllers/community.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;


//GET 
router.get("/view/:id",view);
router.get("/list",list);
router.get("/getRatingLikes/:id",getRatingLikes);
router.get("/adminsList/",adminsList);

router.delete("/delete/:id",deleteCommunity);

module.exports = router;


// Function for view community	
function view(req, res, next) {
    communityController.view(req.params.id, req.user)
        .then(community => community ? res.json(community) : res.status(400).json({ status: "error", message: 'Error while getting chat' }))
        .catch(err => next(err));
}

// Function for list community	
function list(req, res, next) {
    communityController.list(req.query, req.user)
        .then(community => community ? res.json(community) : res.status(400).json({ status: "error", message: 'Error while updating chat' }))
        .catch(err => next(err));
}

// Function for delete community 
function deleteCommunity(req, res, next) {
    communityController.deleteCommunity(req.params.id)
        .then(community => community ? res.json(community) : res.status(400).json({ status: "error", message: 'Error while updating chat' }))
        .catch(err => next(err));
}

// Function for get rating and likes for query
function getRatingLikes(req, res, next) {
    communityController.getRatingLikes(req.params.id , req.user)
        .then(community => community ? res.json(community) : res.status(400).json({ status: "error", message: 'Error while getting community like & ratting' }))
        .catch(err => next(err));
}
// Function for get rating and likes for query
function adminsList(req, res, next) {
    communityController.adminsList(req.user)
        .then(community => community ? res.json(community) : res.status(400).json({ status: "error", message: 'Error while getting community admin list' }))
        .catch(err => next(err));
}