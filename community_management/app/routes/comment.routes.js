const express = require('express'); 
const router = express.Router()
const communityCommentController = require("../controllers/community_comment.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;

//GET 
router.get("/view/:id",view);
router.get("/list",list);

//PUT 
router.put("/update/:id",[
    upload.fields([{
        name:'file',maxCount:1
    }])
    ],update); 

//PUT 
router.delete("/delete/:id",deleteComment);

module.exports = router;


// Function for view community	
function view(req, res, next) {
    communityCommentController.view(req.params.id)
        .then(community => community ? res.json(community) : res.status(400).json({ status: "error", message: 'Error while getting chat' }))
        .catch(err => next(err));
}

// Function for list community	
function list(req, res, next) {
    communityCommentController.list(req.query, req.user)
        .then(community => community ? res.json(community) : res.status(400).json({ status: "error", message: 'Error while updating chat' }))
        .catch(err => next(err));
}

// Function for update community 
function update(req, res, next) {
    communityCommentController.update(req)
        .then(community => community ? res.json(community) : res.status(400).json({ status: "error", message: 'Error while updating chat' }))
        .catch(err => next(err));
}

// Function for delete community 
function deleteComment(req, res, next) {
    communityCommentController.deleteComment(req.params.id)
        .then(community => community ? res.json(community) : res.status(400).json({ status: "error", message: 'Error while updating chat' }))
        .catch(err => next(err));
}
