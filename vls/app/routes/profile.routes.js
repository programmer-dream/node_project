const express = require('express'); 
const router = express.Router()
const profileController = require("../controllers/profile.controller");

// GET
router.get("/dashboard/profile",profile);
router.get("/school/listBranch",listBranch);


module.exports = router;

// Function for authenticate user's details
function profile(req, res, next) {
    profileController.profile(req.user)
        .then(user => user ? res.json(user) : res.status(400).json({ status: "error", message: 'Error while getting profile data' }))
        .catch(err => next(err));
}


// Function for list branch
function listBranch(req, res, next) {
    profileController.listBranch(req.user)
        .then(user => user ? res.json(user) : res.status(400).json({ status: "error", message: 'Erorr while getting branches' }))
        .catch(err => next(err));
}