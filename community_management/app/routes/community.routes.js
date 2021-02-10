const express = require('express'); 
const router = express.Router()
const communityController = require("../controllers/community.controller");
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
router.get("/view/:id",view);
router.get("/list",list);
router.get("/getRatingLikes/:id",getRatingLikes);

//PUT 
router.put("/update/:id",update); 
router.put("/:id/addUsers",addUsers);
router.put("/:id/addAdmins",addAdmins);

//PUT 
router.delete("/delete/:id",deleteCommunity);

module.exports = router;

// Function for create community	
function create(req, res, next) {
    communityController.create(req)
        .then(community => community ? res.json(community) : res.status(400).json({ status: "error", message: 'Error while creating chat' }))
        .catch(err => next(err));
}

// Function for view community	
function view(req, res, next) {
    communityController.view(req.params.id)
        .then(community => community ? res.json(community) : res.status(400).json({ status: "error", message: 'Error while getting chat' }))
        .catch(err => next(err));
}

// Function for list community	
function list(req, res, next) {
    communityController.list(req.query, req.user)
        .then(community => community ? res.json(community) : res.status(400).json({ status: "error", message: 'Error while updating chat' }))
        .catch(err => next(err));
}

// Function for update community 
function update(req, res, next) {
    communityController.update(req)
        .then(community => community ? res.json(community) : res.status(400).json({ status: "error", message: 'Error while updating chat' }))
        .catch(err => next(err));
}

// Function for delete community 
function deleteCommunity(req, res, next) {
    communityController.deleteCommunity(req.params.id)
        .then(community => community ? res.json(community) : res.status(400).json({ status: "error", message: 'Error while updating chat' }))
        .catch(err => next(err));
}
// Function for add user community 
function addUsers(req, res, next) {
    communityController.addUsers(req.params.id, req.body)
        .then(community => community ? res.json(community) : res.status(400).json({ status: "error", message: 'Error while updating chat' }))
        .catch(err => next(err));
}
// Function for add admins user community 
function addAdmins(req, res, next) {
    communityController.addAdmins(req.params.id, req.body)
        .then(community => community ? res.json(community) : res.status(400).json({ status: "error", message: 'Error while updating chat' }))
        .catch(err => next(err));
}

// Function for get rating and likes for query
function getRatingLikes(req, res, next) {
    communityController.getRatingLikes(req.params.id , req.user)
        .then(community => community ? res.json(community) : res.status(400).json({ status: "error", message: 'Error while getting community like & ratting' }))
        .catch(err => next(err));
}