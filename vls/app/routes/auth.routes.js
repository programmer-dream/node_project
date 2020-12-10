const { authJwt } = require("../middleware");
const authController = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/signup",authController.signup);
  app.post("/api/auth/signin",authController.signin);
  app.get("/api/userName",authController.userName);
  app.post("/api/resetPassword",[authJwt.verifyToken],authController.resetPassword);
};