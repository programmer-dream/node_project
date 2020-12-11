const express = require('express'); 
const router = express.Router()
const authController = require("../controllers/auth.controller");

// POST
router.post("/signup",register);
router.post("/signin",authenticate);
router.get("/userId",getNewUserId);
router.post("/resetPassword",resetPassword);

module.exports = router;

// Function for authenticate user's details
function authenticate(req, res, next) {
    authController.signIn(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ status: "error", message: 'Oops, wrong credentials, please try again' }))
        .catch(err => next(err));
}

// Function for register user's details
function register(req, res, next) {
    authController.signUp(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ status: "error", message: 'Error while registring user' }))
        .catch(err => next(err));
}

// Function for get new user's ID
function getNewUserId(req, res, next) {
    authController.getNewUserId(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ status: "error", message: 'Error while registring user' }))
        .catch(err => next(err));
}

// Function for reset password
function resetPassword(req, res, next) {
      authController.resetPassword(req.body, req.user.id)
          .then(user => user ? res.json(user) : res.status(400).json({ status: "error", message: 'Email not found' }))
          .catch(err => next(err));

}
