const express = require('express'); 
const router = express.Router()
const profileController = require("../controllers/profile.controller");

// GET
router.get("/profile",profile);


module.exports = router;

// Function for authenticate user's details
function profile(req, res, next) {
    profileController.profile(req.user)
        .then(user => user ? res.json(user) : res.status(400).json({ status: "error", message: 'Oops, wrong credentials, please try again' }))
        .catch(err => next(err));
}