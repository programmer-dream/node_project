const { authJwt } = require("../middleware");
const authCntroller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/signup",authCntroller.signup);
  app.post("/api/auth/signin",authCntroller.signin);
  // app.get("/api/test",[authJwt.verifyToken],authCntroller.test);
  app.post("/api/resetPassword",[authJwt.verifyToken],authCntroller.resetPassword);
};