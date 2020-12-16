const db = require("../models");
const config = require("../../../config/env.js");
const Authentication = db.Authentication;
const Role = db.Role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
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
async function getNewUserId() {
  let userID = Date.now();
  return {userID}
}


/**
 * API for register new Admin user's
 */
 async function signUp(userDetails) {
  if(!userDetails.userId || !userDetails.password){
      throw 'userId and Password are required'
  }

  let password = bcrypt.hashSync(userDetails.password, 8)
  let newUserDetails = {
    userId: userDetails.userId,
    password: password,
    userType: 'Admin',
    oldPassword1: password
  }

  // Save to Database
  let authUser = await Authentication.create(newUserDetails);
  if(authUser && authUser.authVlsId)
    return { message: "User registered successfully!" };

}


/**
 * API for signIn user's
 */
async function signIn(userDetails) {

  let user = await Authentication.findOne({ where: { user_name: userDetails.userId },include: 'roles' })
  if(user  && bcrypt.compareSync(userDetails.password, user.password) ){
    // expire token with time
    // let token = jwt.sign({id: Authentication.authVlsId,}, config.secret, {expiresIn: 86400});  // 24 hours

    let tokenDetails = {
            id:         user.auth_vls_id,
            userId:     user.user_name, 
            type:       user.role_id,
            userVlsId:  user.user_vls_id
    }

    // create token
    let token = jwt.sign(tokenDetails, config.secret, {expiresIn: 86400});

    return {status: "success", user, token };

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
