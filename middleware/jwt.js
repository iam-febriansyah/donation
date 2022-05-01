const authjwt = require("jsonwebtoken");
const auth = require("../config/auth.js");
const sess = require("../helpers/session.helper");
const { machineIdSync } = require("node-machine-id");
var deviceId = machineIdSync({ original: true });

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
  let token = sessionDeviceId.data.token ? sessionDeviceId.data.token : false;
  if (!token) {
    console.log("No token provided!");
    return res.status(200).send({
      status: false,
      statusCode: 200,
      message: "No token provided!",
    });
  }
  authjwt.verify(token, auth.secretLogin, (err, decoded) => {
    if (err) {
      console.log("Unauthorized!");
      return res.status(200).send({
        status: false,
        statusCode: 200,
        message: "Unauthorized!",
      });
    }
    next();
  });
};

const jwt = {
  verifyTokenJWT: verifyTokenJWT,
  verifyTokenJWTView: verifyTokenJWTView,
};
module.exports = jwt;
