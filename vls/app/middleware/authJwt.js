const jwt = require("jsonwebtoken");
const config = require("../../../config/env.js");
const db = require("../models");
const Authentication = db.Authentication;

verifyToken = (req, res, next) => {
  let token = req.headers["token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken: verifyToken
};
module.exports = authJwt;