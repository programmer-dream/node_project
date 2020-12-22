const express = require('express'); 
const router = express.Router()
const authController = require("../controllers/auth.controller");

// GET
router.get("/userSettings",userSettings);

// POST
router.post("/signin",authenticate);
router.post("/resetPassword",resetPassword);
router.post("/forgetPassword",forgetPassword);
router.post("/updatePassword",updatePasswordWithForgetPwd);
router.post("/verifyOTP",verifyOTP);
router.post("/userStatus",userStatus);

module.exports = router;

// Function for authenticate user's details
function authenticate(req, res, next) {
    authController.signIn(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ status: "error", message: 'Oops, wrong credentials, please try again' }))
        .catch(err => next(err));
}

// Function for reset password
function resetPassword(req, res, next) {
      authController.resetPassword(req.body, req.user.id)
          .then(user => user ? res.json(user) : res.status(400).json({ status: "error", message: 'Email not found' }))
          .catch(err => next(err));

}

// Function for forgot password
function forgetPassword(req, res, next) {
      authController.forgetPassword(req.body)
          .then(user => user ? res.json(user) : res.status(400).json({ status: "error", message: 'Mail not sent' }))
          .catch(err => next(err));

}

// update password if forgot token match
function updatePasswordWithForgetPwd(req, res, next) {
      authController.updatePasswordWithForgetPwd(req.body)
          .then(user => user ? res.json(user) : res.status(400).json({ status: "error", message: 'Link has been expired' }))
          .catch(err => next(err));

}

// update password if forgot token match
function verifyOTP(req, res, next) {
      authController.verifyOTP(req.body)
          .then(user => user ? res.json(user) : res.status(400).json({ status: "error", message: 'OTP has been expired' }))
          .catch(err => next(err));

}

// Get users permissions
function userSettings(req, res, next) {
      authController.userSettings(req.user)
          .then(user => user ? res.json(user) : res.status(400).json({ status: "error", message: 'No permissions found' }))
          .catch(err => next(err));

}

// Get users permissions
function userStatus(req, res, next) {
      authController.userSettings(req.user, req.body)
          .then(user => user ? res.json(user) : res.status(400).json({ status: "error", message: 'Error while updating user status' }))
          .catch(err => next(err));

}
