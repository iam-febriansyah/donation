const auth = require("../app/controllers/auth.controller");
const qr = require("../app/controllers/qr.controller");
const { verifyTokenJWT, verifyTokenJWTView } = require("../middleware/jwt");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept, Authorization"
    );
    next();
  });

  app.get("/", auth.getSignIn);
  app.post("/signin", auth.postSignIn);
  app.post("/signup", auth.postSignUp);

  app.get("/qr", [verifyTokenJWTView], qr.getQr);
  app.post("/createOrder", [verifyTokenJWTView], qr.createOrder);
};
