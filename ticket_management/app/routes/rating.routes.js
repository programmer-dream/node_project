const express = require('express'); 
const router = express.Router()
const ratingsController = require("../controllers/ratings.controller");
const { check } = require('express-validator');

//Post
router.post("/",[
    check('ticket_vls_id','ticket_vls_id field is required.').not().isEmpty(),
    check('ratings','ratings field is required.').not().isEmpty(),
    ],addUpdateRatings);


module.exports = router;

// Function for create query details
function addUpdateRatings(req, res, next) {
    ratingsController.addUpdateRatings(req)
        .then(ticket => ticket ? res.json(ticket) : res.status(400).json({ status: "error", message: 'Issue while rating this ticket' }))
        .catch(err => next(err));
}
