const db = require("../models");
const mailer = require('../helper/nodemailer')
const config = require("../../../config/env.js");
const Authentication = db.Authentication;
const Role = db.Role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

module.exports = {
  signIn,
  resetPassword,
  getById,
  forgetPassword,
  updatePasswordWithForgetPwd,
  verifyOTP
};


/**
 * API for signIn user's
 */
async function signIn(userDetails) {
  if(!userDetails.userName) throw 'UserName is required'
  if(!userDetails.password) throw 'Password is required'

  let user = await Authentication.findOne({ 
                    attributes: ['auth_vls_id', 'user_name', 'user_vls_id', 'password', 'role_id'],
                    where: { user_name: userDetails.userName },
                    include: [{ 
                              model:Role,
                              as:'roles',
                              attributes: ['id','name', 'slug']
                            }]
                    })
  if(user  && bcrypt.compareSync(userDetails.password, user.password) ){
    // expire token with time
    // let token = jwt.sign({id: Authentication.authVlsId,}, config.secret, {expiresIn: 86400});  // 24 hours

    let tokenDetails = {
            id:      user.auth_vls_id,
            userId:     user.user_name, 
            role:       user.roles.slug,
            userVlsId:  user.user_vls_id
    }

    // create token
    let token = jwt.sign(tokenDetails, config.secret, {expiresIn: 86400});
    // Remove password object from user's object
    let userWithoutPassword = getUserWithoutPassword(user)

    return {status: "success", token, userWithoutPassword };

  }

}

/**
 * Remove password form user's object
 */
function getUserWithoutPassword(user){
  let userObj = user.toJSON();
  delete userObj.password

  return userObj;
}

/**
 * API for get user details by userID
 */
async function getById(id) {
  let user = await Authentication.findOne({ where: { user_name: id } });

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
    body.oldPassword,
    auth.password
  );

  if(!passwordIsValid) throw 'Old password should be matched'
  //get all passwords 
  let allPwd  = JSON.parse(auth.old_passwords)
  //loop on old passwords
  allPwd.forEach(function (item, index){
      isTrue = bcrypt.compareSync(body.password, item)
      if(isTrue) throw 'Your password should not be your last three passwords'
  });

  let updatedPassword = bcrypt.hashSync(body.password, 8);

  if(allPwd.length < 3 ){
    allPwd.push(updatedPassword)
  }else{
    allPwd.shift()
    allPwd.push(updatedPassword)
  }

  Authentication.update({ 
    password:updatedPassword,
    old_passwords:JSON.stringify(allPwd)
    },{
    where: { auth_vls_id:  userId}
  })
    return { status: "success",message: 'password updated successfully' }
}

/**
 * API for verify otp for user's
 */
async function verifyOTP(body){

  if(!body.otp) throw 'OTP not found'

  let user = await Authentication.findOne({
                      where:{ forget_pwd_token: body.token }
                    });

  if(!user) throw 'Token has been expired';

  if(user.forget_pwd_otp == body.otp){
    if(user.recovery_email_id =='' || user.recovery_email_id == null  ) throw 'No email is associated with this account. Please contact VLS'
    
    user.update({
        forget_pwd_token:null,
        forget_pwd_otp:null,
        password_reset_type:null
      })

    await sendForgotPasswordEmail(user)

    return {status: "success", message:'Mail sent successfully' };
  }else{
    throw 'Invalid OTP';
  }
}

/**
 * API for forgot password for user's
 */
async function forgetPassword(body) {
  user_name = body.userName
  if(!user_name) throw 'userName is required'
  let user = await Authentication.findOne({
                      where:{ user_name: user_name },
                      include: [{ 
                              model:Role,
                              as:'roles',
                              attributes: ['id','slug']
                            }]
                    });
  if(!user) throw 'user not found'

  let userRole = user.roles.slug
  if(userRole == 'student'){
    if(user.recovery_email_id =='' || user.recovery_email_id == null  ) throw 'No email is associated with this account. Please contact VLS'
    
    await sendForgotPasswordEmail(user)

    return {status: "success", type:'email', message:'Mail sent successfully' };
  }else{
    if(user.recovery_contact_no =='' || user.recovery_contact_no == null  ) throw 'No phone is associated with this account. Please contact VLS'
    
    return await sendOtpToUser(user)
  }
  
}


/**
 * generate otp for user
 */
async function sendOtpToUser(user) {

    let genOTP = generateOTP();
    //genrate token
    let forget_pwd_token = forgetToken(30)
    const client = require('twilio')(config.twillioAccountSid, config.twillioauthToken);

    return await client.messages.create({
        body: 'Here is the OTP :'+genOTP,
        to: user.recovery_contact_no,  // Text this number
        from: config.twillioNumber // From a valid Twilio number
    })
    .then((messages) => {
      user.update({
        forget_pwd_token:forget_pwd_token,
        forget_pwd_otp:genOTP,
        password_reset_type:'OTP'
      })

      return {token:forget_pwd_token, type:'otp', message:"OTP sent successfully"}
    })
    .catch((error)=>{
      console.log(error);
      throw 'OPT send failed, Please try again later.';
    });
}

/**
 * generate otp for user
 */
function generateOTP() {

    // Declare a string variable
    // which stores all string
    var string = '0123456789';
    let OTP = '';

    // Find the length of string
    var len = 10;
    for (let i = 0; i < 6; i++ ) {
        OTP += string[Math.floor(Math.random() * len)];
    }
    return OTP;
}


/**
 * Send Email to user
 */
async function sendForgotPasswordEmail(user){
  //genrate token
  let forget_pwd_token = forgetToken(30)
  //update token
  user.update({
    forget_pwd_token:forget_pwd_token,
    password_reset_type:'PasswordResetLink'
  })
  let email   = user.recovery_email_id 
  let link    = config.forgotLink +'?token='+ forget_pwd_token
  let subject = 'Reset your account password'
  let html_body    ='<p>Click <a href="' + link + '">here</a> to reset your password</p>';
  await mailer(email,subject, html_body) //send mail to the user

}
/**
 * API for forget token 
 */
function forgetToken(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result + Date.now();
}

/**
 * API for udate user password with link
 */
async function updatePasswordWithForgetPwd(body) {
  let token = body.token
  let newPassword = body.newPassword
  let isTrue;
  let user = await Authentication.findOne({
                      where:{ forget_pwd_token: token }
                    });

  if(!user) throw 'link has been expired'
  let allPwd  = JSON.parse(user.old_passwords)
  //encrypt new password
  let updatedPassword = bcrypt.hashSync(newPassword, 8)

  allPwd.forEach(function (item, index){
      isTrue = bcrypt.compareSync(newPassword, item)
      if(isTrue) throw 'Your password should not be your last three passwords'
  });
  if(allPwd.length < 3 ){
    allPwd.push(updatedPassword)
  }else{
    allPwd.shift()
    allPwd.push(updatedPassword)
  }
  let num = await user.update({
              password:updatedPassword,
              forget_pwd_token:null,
              password_reset_type:null,
              old_passwords:JSON.stringify(allPwd)
            })

   return {status: "success", message:'Password updated successfully' };
}
