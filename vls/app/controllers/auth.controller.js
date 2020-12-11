const db = require("../models");
const config = require("../../../config/env.js");
const Authentication = db.Authentication;

const Op = db.Sequelize.Op;

var jwt = require("express-jwt");
var bcrypt = require("bcryptjs");

module.exports = {
  signIn,
  signUp,
  resetPassword,
  getNewUserId,
  getById
};


/**
 * API for get new user's ID
 */
function getNewUserId() {
  let userID = Date.now();
  return userID
}


/**
 * API for register new Admin user's
 */
 function signUp(userDetails) {
  if(!req.body.userId || !req.body.password){
      throw 'userId and Password are required'
  }

  let password = bcrypt.hashSync(req.body.password, 8)
  let newUserDetails = {
    userId: req.body.userId,
    password: password,
    userType: 'Admin',
    oldPassword1: password
  }

  // Save to Database
  Authentication.create(newUserDetails).then(Authentication => {
      return { message: "User was registered successfully!" }
  }).catch(err => {
      throw err.message
  });

}


/**
 * API for signIn user's
 */
async function signIn(userDetails) {
  let user = await Authentication.findOne({ where: { userId: userDetails.userId } })
  if(user  && bcrypt.compareSync(userDetails.password, user.password) ){
    // expire token with time
    // let token = jwt.sign({id: Authentication.authVlsId,}, config.secret, {expiresIn: 86400});  // 24 hours

    let tokenDetails = {
            id: Authentication.authVlsId,
            userId:Authentication.userId, 
            type:Authentication.userType,
            userVlsId:Authentication.userVlsId
    }

    // create token
    let token = jwt.sign(tokenDetails, config.secret);

    return {status: "success", ...user, token };

  }

}

/**
 * API for get user details by userID
 */
async function getById(id) {
  let user = await Authentication.findOne({ where: { userId: id } });

  return user
}

/**
 * API for reset password for login user's
 */
async function resetPassword(body, userId) {

  if (!body.oldPassword) throw 'Enter old password'
  if (!body.password) throw 'Enter password'
  if (!body.confirmPassword) throw 'Enter confirm password'


  if (body.password !== body.confirmPassword) return { status: "error", message: "Password and confirm password does not matched." }

  let auth = await Authentication.findByPk(userId);

  if(!auth) throw 'User not found'

  // Match old password
  let passwordIsValid = bcrypt.compareSync(
    body.old_password,
    auth.password
  );

  if(!passwordIsValid) throw 'Old password should be matched'

    Authentication.update({ password:bcrypt.hashSync(req.body.new_password, 8)},{
      where: { authVlsId: decoded.id }
    }).then(num => {
        return (num == 1) ?  { message: 'password updated successfully' } : { message: 'sorry! password not updated' }
    }).catch(err => {
        throw err.message
      });

}
