const express = require('express'); 
const router = express.Router()
const ratingsController = require("../controllers/ratings.controller");
const { check } = require('express-validator');

//Post
router.post("/",[
    check('learning_library_vls_id','Learning_library_vls_id field is required.').not().isEmpty(),
    check('ratings','Ratings field is required.').not().isEmpty(),
    ],addUpdateRatings);


module.exports = router;

// Function for create query details
function addUpdateRatings(req, res, next) {
    ratingsController.addUpdateRatings(req)
        .then(query => query ? res.json(query) : res.status(400).json({ status: "error", message: 'Issue while rating this query' }))
        .catch(err => next(err));
}
