const db = require("../models");
const config = require("../../../config/env.js");
const Authentication = db.Authentication;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  if(!req.body.userName || !req.body.password){
      res.status(200).send({ message: "empty inputs" });
  }
  // Save to Database
  Authentication.create({
    UserId: req.body.userName,
    password: bcrypt.hashSync(req.body.password, 8),
    userType: 'Admin'
  }).then(Authentication => {
      res.send({ message: "User was registered successfully!" });
  }).catch(err => {
      res.status(500).send({ message: err.message });
  });
};

exports.signin = (req, res) => {
  Authentication.findOne({
    where: {
      UserId: req.body.userName
    }
  })
    .then(Authentication => {
      if (!Authentication) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        Authentication.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: Authentication.AuthVlsId }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        authVlsId: Authentication.AuthVlsId,
        userName: Authentication.UserId,
        userType: Authentication.userType,
        recoveryEmailId: Authentication.RecoveryEmailId,
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// exports.test = (req, res) => {
//   let token = req.headers["x-access-token"];
//   const decoded = jwt.verify(token, config.secret);
//   res.send({ message: "token",data: decoded.id});
// };

exports.resetPassword = async (req, res) => {
  let token = req.headers["x-access-token"];
  if(!req.body.old_password){
      res.status(200).send({ message: "can't empty old_password." });
  }
  if(!req.body.new_password){
      res.status(200).send({ message: "can't empty inputs new_password." });
  }
  const decoded = jwt.verify(token, config.secret);
  let Auth = await Authentication.findByPk(decoded.id);

  if(!Auth){
      res.status(200).send({ message: "user not found" });
  }
  let passwordIsValid = bcrypt.compareSync(
    req.body.old_password,
    Auth.password
  );
  if(!passwordIsValid){
      res.status(200).send({ message: "Old password should be matched." });
  }else{
    Authentication.update({
      password:bcrypt.hashSync(req.body.new_password, 8)
    },{
      where: { AuthVlsId: decoded.id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "password updated successfully."
          });
        } else {
          res.send({
            message: `sorry! password not updated`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating password with id=" + id
        });
      });
  }
};