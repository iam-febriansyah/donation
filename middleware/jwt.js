const authjwt = require("jsonwebtoken");
const auth = require("../config/auth.js");
const sess = require("../helpers/session.helper");
const { machineIdSync } = require("node-machine-id");
var deviceId = machineIdSync({ original: true });
var swal = require("sweetalert");

verifyTokenJWT = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(200).send({
      status: false,
      statusCode: 200,
      message: "No token provided!",
    });
  }

  authjwt.verify(token, auth.secretLogin, (err, decoded) => {
    if (err) {
      return res.status(200).send({
        status: false,
        statusCode: 200,
        message: "Unauthorized!",
      });
    }
    req.user_id = decoded.id;
    next();
  });
};

verifyTokenJWTView = (req, res, next) => {
  var sessionDeviceId = sess.getSession(deviceId);
  let token = sessionDeviceId.data ? sessionDeviceId.data.token : false;
  if (!token) {
    // popup.alert({
    //   title: "I am an",
    //   content: "No token provided!",
    // });
    swal("Hello world!");

    return res.redirect("/");
  }
  authjwt.verify(token, auth.secretLogin, (err, decoded) => {
    if (err) {
      // popup.alert({
      //   title: "I am an",
      //   content: "Unauthorized!",
      // });
      swal("Hello world!");

      return res.redirect("/");
    }
    next();
  });
};

const jwt = {
  verifyTokenJWT: verifyTokenJWT,
  verifyTokenJWTView: verifyTokenJWTView,
};
module.exports = jwt;
