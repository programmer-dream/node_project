const express = require('express'); 
const router = express.Router()
const likesController = require("../controllers/likes.controller");
const { check } = require('express-validator');

//Post
router.post("/",[
    check('learning_library_vls_id','Learning_library_vls_id field is required.').not().isEmpty()
    ],addUpdateLikes);


module.exports = router;

// Function for create query details
function addUpdateLikes(req, res, next) {
    likesController.addUpdateLikes(req)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Issue while like this query' }))
        .catch(err => next(err));
}