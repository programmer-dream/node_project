const { validationResult } = require('express-validator');
const db = require("../../../models");
const mailer = require('../../../helpers/nodemailer')
const config = require("../../../config/env.js");
const axios  = require('axios').default;
const Authentication = db.Authentication;
const Role = db.Role;
const School = db.SchoolDetails;
const Branch = db.Branch;
const UserSetting = db.UserSetting;
const RecaptchaSettings = db.RecaptchaSettings;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

module.exports = {
  signIn,
  resetPassword,
  getById,
  forgetPassword,
  updatePasswordWithForgetPwd,
  verifyOTP,
  userSettings,
  userStatus,
  crateUpdateRecaptchaSettings,
  getRecapchaSettings,
  uploadImagesGeneral
};


/**
 * API for signIn user's
 */
async function signIn(userDetails) {
  
  if(!userDetails.userName) throw 'UserName is required'
  if(!userDetails.password) throw 'Password is required'

  let where = { user_name: userDetails.userName }
  let mobileUser = (userDetails.mobileUser) ? true : false

  //google captch code
  let captchaSetting = await RecaptchaSettings.findOne()
  if(captchaSetting && captchaSetting.is_enabled){
      if(!userDetails.recaptcha_key) throw 'recaptcha_key is required'

      let secret_key = captchaSetting.secret_key
      let response_key = userDetails.recaptcha_key

      let axiosConfig = {
          method: 'post',
          url: `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`,
          headers: { 
            'Content-Type': 'application/json'
          }
        };

      let recaptchaResponse = await axiosRequest(axiosConfig);
      
      if(!recaptchaResponse.success) return recaptchaResponse
  }
  //google captch code

  let getUser = await Authentication.findOne({ 
                    attributes: [
                        'auth_vls_id',
                        'status'
                    ],
                    where: where ,
                    include: [{ 
                              model:Role,
                              as:'roles',
                              attributes: ['slug']
                            }]
                    })

  if(!getUser) throw "Oops, wrong credentials, please try again"
  if(getUser.status == 0) throw "Oops, user not active yet, please contact administrator"

  let userRole = getUser.roles.slug
  //super admin check  
  if(userRole != 'super-admin'){
    if(!userDetails.school_code) throw 'Institute code is required'
      where.school_code = userDetails.school_code
  }

  if(mobileUser && (userRole == "super-admin" || userRole == "branch-admin" || userRole == "school-admin") ){
    throw 'You are not an authorized user to access the application. Please login through the web portal.'
  }

  let user = await Authentication.findOne({ 
                    attributes: [
                        'auth_vls_id', 
                        'user_name', 
                        'user_vls_id', 
                        'password', 
                        'role_id',
                        'name',
                        'photo',
                        'recovery_email_id', 
                        'branch_vls_id', 
                        'school_id'
                    ],
                    where: where ,
                    include: [{ 
                              model:Role,
                              as:'roles',
                              attributes: ['id','name', 'slug']
                            }]
                    })

  if(!user) throw "Oops, wrong credentials, please try again"
    
  let isActive = await isSchoolBranchActive(user)
  
  if(!isActive)
      return {status: "error", message : 'Your school or branch not active yet' };

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
    let data = getUserWithoutPassword(user)

    if(data.roles.slug == 'school-admin')
      data = await getBranchesAccordingToSchool(data)

    data.userSetting = await getUserSettings(tokenDetails)
    return {status: "success", token, data };

  }

}

/**
 * Get Branches according to school
 */
async function getBranchesAccordingToSchool(data){

  let branches = await Branch.findAll({ 
                            where : {school_vls_id :  data.school_id },
                            attributes: ['branch_vls_id', 'branch_name']
                          })
  data.branches = branches

  return data
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
async function resetPassword(body, user) {
  
  if (!body.oldPassword) throw 'Enter old password'
  if (!body.password) throw 'Enter password'
  if (!body.confirmPassword) throw 'Enter confirm password'

  if (body.password !== body.confirmPassword) 
    throw "Password and confirm password does not matched"

  let auth = await Authentication.findByPk(user.id);
  let response = await checkPasswordCriteria(body.password, user.role, auth.name)
  if(response.isError) throw response.error.join(',')
  
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
    },
    {
      where: { auth_vls_id:  user.id }
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
    if(user.recovery_email_id =='' || user.recovery_email_id == null  ) 
      throw 'No email is associated with this account. Please contact VLS'
    
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
  if(!body.userName) throw 'userName is required'

  let where = { user_name:  body.userName}

  let getUser = await Authentication.findOne({ 
                    attributes: [
                        'auth_vls_id'
                    ],
                    where: where ,
                    include: [{ 
                              model:Role,
                              as:'roles',
                              attributes: ['slug']
                            }]
                    })
  if(!getUser) throw "Oops, wrong credentials, please try again"

  //super admin check  
  if(getUser.roles.slug != 'super-admin'){
    if(!body.school_code) throw 'school_code is required'
      where.school_code = body.school_code
  }
  
  let user = await Authentication.findOne({
                      where:where,
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
                      where:{ forget_pwd_token: token },
                      include: [{ 
                              model:Role,
                              as:'roles',
                              attributes: ['id','name', 'slug']
                            }]
                    });

  if(!user) throw 'link has been expired'
    
  let allPwd  = []
  if(user.old_passwords){
    let allPwd  = JSON.parse(user.old_passwords)
  }
    
  //encrypt new password
  let updatedPassword = bcrypt.hashSync(newPassword, 8)

  let response = await checkPasswordCriteria(newPassword, user.roles.slug, user.name)
  if(response.isError) throw response.error.join(',')

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


/**
 * API for udate user password with link
 */
async function userSettings(user) {
    let userDetails = await Authentication.findOne({
                    attributes: ['auth_vls_id', 'user_name', 'user_vls_id', 'password', 'role_id'],
                    where: { auth_vls_id: user.id },
                    include: [{ 
                              model:Branch,
                              as:'branch',
                            },{ 
                              model:School,
                              as:'school',
                            },{ 
                              model:UserSetting,
                              as:'userSetting',
                            }]
                    })

    if(!userDetails) throw 'User not found'

    if(user.role == 'school-admin' && !userDetails.school){
      return {}
    }else if(user.role == 'super-admin'){
      return {}
    }else if(user.role != 'school-admin'){
      if(!userDetails.school) throw 'School is not associated with this user'
      if(!userDetails.branch) throw 'Branch is not associated with this user'
    }

    let userSettings = {}

    if(user.role == 'school-admin'){
      userSettings = await manageUserSettingsSchool(userDetails)
    }else{
      userSettings = await manageUserSettings(userDetails)
    }

    
   return {status: "success", userSettings };
}

/**
 * function for getting user settings.
 */
async function getUserSettings(user) {
    let userDetails = await Authentication.findOne({
                    attributes: ['auth_vls_id', 'user_name', 'user_vls_id', 'password', 'role_id'],
                    where: { auth_vls_id: user.id },
                    include: [{ 
                              model:Branch,
                              as:'branch',
                            },{ 
                              model:School,
                              as:'school',
                            },{ 
                              model:UserSetting,
                              as:'userSetting',
                            }]
                    })


    if(user.role == 'school-admin' && !userDetails.school){
      return {}
    }else if(user.role != 'school-admin'){
      if(!userDetails.school) return {}
      if(!userDetails.branch) return {}
    }

    let userSettings = {}

    if(user.role == 'school-admin'){
      userSettings = await manageUserSettingsSchool(userDetails)
    }else{
      userSettings = await manageUserSettings(userDetails)
    }

   return userSettings
}


/**
 * API for manage user settings
 */
async function manageUserSettings(userDetails) {

  userDetails = userDetails.toJSON()
  let permissionArray = config.permissionsArray.split(',')

  let userSettings = userDetails.userSetting

  if(!userSettings){
    userSettings = {}
  }else{
    delete userSettings.user_settings_vls_id
    delete userSettings.created_at
    delete userSettings.updated_at
  }

  await Promise.all(
    permissionArray.map( item => {

        if( userDetails.school[item] == null || userDetails.school[item].toLowerCase() == 'no' ){
          userSettings[item] = 'no'
        }else if( userDetails.school[item].toLowerCase() == 'yes' ){
          userSettings[item] = 'yes'
        }

        if( userSettings[item] == 'yes' ){
          if( userDetails.branch[item] == null || userDetails.branch[item].toLowerCase() == 'no' ){
            userSettings[item] = 'no'
          }else if( userDetails.branch[item].toLowerCase() == 'yes' ){
            userSettings[item] = 'yes'
          }
        }

      })
    );

    Object.keys(userSettings).forEach(function(key) {
        if(userSettings[key] == null) {
            userSettings[key] = 'no';
        }
    })

    return userSettings
}



/**
 * API for manage user settings
 */
async function manageUserSettingsSchool(userDetails) {

  userDetails = userDetails.toJSON()
  let permissionArray = config.permissionsArray.split(',')

  let userSettings = userDetails.userSetting
  
  if(!userSettings){
    userSettings = {}
  }else{
    delete userSettings.user_settings_vls_id
    delete userSettings.created_at
    delete userSettings.updated_at
  }

  await Promise.all(
    permissionArray.map( item => {
        
        if( userDetails.school[item] == null || userDetails.school[item].toLowerCase() == 'no' ){
          userSettings[item] = 'no'
        }else if( userDetails.school[item].toLowerCase() == 'yes' ){
          userSettings[item] = 'yes'
        }

      })
    );

    Object.keys(userSettings).forEach(function(key) {
        if(userSettings[key] == null) {
            userSettings[key] = 'no';
        }
    })

    return userSettings
}


/**
 * API for udate user status
 */
async function userStatus(user, body) {

  if(!body.status || body.status == "") throw 'Status is required'

  let users = await Authentication.findOne({
                      where:{ user_name: user.userId }
                    });

  if(!users) throw 'User not found'

  let num = await users.update({
              status:body.status
            })

   return {status: "success", message:'Status updated successfully' };
}

/**
 * API for check for password
 */
async function checkPasswordCriteria(password, role, name) {
    let finalErr = []
    let isError = false
    if(password.length < 8)
        finalErr.push('password should be at least 8 characters')
      let isNum = /[0-9]/;
      let err = /[0-9]/.test(password)
          if(!err)
            finalErr.push('password should be at least 1 number') 

      err = /[A-Z]/.test(password)
        if(!err)
          finalErr.push('password should be at least 1 upper case characters') 

      err = /[a-z]/.test(password)
        if(!err)
          finalErr.push('password should be at least 1 lower case characters')

      if(role != 'student') {
        err = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.\/?]/.test(password)
          if(!err)
            finalErr.push('password should be at least 1 special characters') 
        err = password.includes('student')
        if(err)
            finalErr.push('password should not contain name')
      }
      
      if(finalErr.length)
        isError = true

    return {isError : isError, error: finalErr, message: "Password criteria not matches"}
}


/**
 * API for check school branch active 
 */
async function isSchoolBranchActive(user) {
  let isActive = true
  //school check
  let isSchoolDeleted = await School.findOne({ 
                          where : { 
                            school_id : user.school_id,
                            is_deleted : 1 
                          } 
                        })
  //branch check
  let isBranchDeleted = await Branch.findOne({ 
    where : { 
      branch_vls_id : user.branch_vls_id,
      is_deleted : 1 
     } 
  })
  
  if(isSchoolDeleted || isBranchDeleted )
      isActive = false

   return isActive
}

/**
 * API for axios request
 */
async function axiosRequest(config){

  return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                resolve(response.data)
            })
            .catch(function (error) {
                reject(error)
            });
    })
}



/**
 * API for create update recaptcha settings
 */
async function crateUpdateRecaptchaSettings(body, user){
  
  if(user.role != 'super-admin') throw 'Unauthorised user'

  let settings = await RecaptchaSettings.findOne()
  if(!settings){
      if(!body.site_key ) throw 'site_key is required'
      if(!body.secret_key ) throw 'secret_key is required'

      settings = await RecaptchaSettings.create(body)
  }else{
      settings = await settings.update(body)
  }
  settings = settings.toJSON()
  delete settings.secret_key
  return {status: "success", message:'Settings updated successfully', data: settings};
}

/**
 * API for get recaptcha settings
 */
async function getRecapchaSettings(body,user){
  
  let settings = await RecaptchaSettings.findOne({
                            attributes: ['is_enabled']
                          })
  
  let isEnabled = {is_enabled: 0}
  if(!settings) 
      return {status: "success", message:'Recaptcha settings', data: isEnabled}

  return {status: "success", message:'Recaptcha settings', data: settings};
}



/**
 * API for uploading general setting images
 */
async function uploadImagesGeneral(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()
  
  let getUploadedPath = ""
  if(req.files.file && req.files.file.length > 0){
      getUploadedPath = req.body.uplodedPath + req.files.file[0].filename;
  }

  return { success: true, message: "image uploaded successfully", data : getUploadedPath.replace('./uploads', '')}

};
