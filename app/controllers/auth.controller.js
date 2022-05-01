const jwt = require("jsonwebtoken");
const config = require("../../config/config");
const auth = require("../../config/auth");
const db = require("../models");
const sess = require("../../helpers/session.helper");
const date = require("../../helpers/date.helper");
const Users = db.users;
const Merchants = db.merchants;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const { machineIdSync } = require("node-machine-id");
var bcrypt = require("bcryptjs");
var getIP = require("ipware")().get_ip;
var deviceId = machineIdSync({ original: true });

exports.getSignIn = async (req, res) => {
  var sessionDeviceId = sess.getSession(deviceId);
  console.log(sessionDeviceId);
  // if (sessionDeviceId) {
  //   res.redirect("/qr");
  // }
  res.render("signin");
};

exports.getSignUp = async (req, res) => {
  res.render("./app/views/signup.view");
};

exports.postSignIn = async (req, res) => {
  var response = new Array();
  var responseTemp = new Array();
  try {
    var phone = req.body.phone;
    var password = req.body.password;
    if (phone.length == 0) {
      throw new Error("Mohon masukkan phone");
    }
    if (password.length == 0) {
      throw new Error("Mohon masukkan Password");
    }
    var users = await Users.findOne({
      where: {
        phone: phone,
      },
    })
      .then(async (result) => {
        if (!result) {
          responseTemp = {
            status: false,
            message: "User Not found",
          };
        } else {
          var passwordIsValid = bcrypt.compareSync(password, result.password);

          if (!passwordIsValid) {
            responseTemp = {
              status: false,
              message: "Invalid Password!",
            };
          } else {
            var token = jwt.sign(
              {
                id: result.user_id,
              },
              auth.secretLogin,
              { expiresIn: "365d" }
            );
            updateLastLogin(result.user_id);
            var merchant = await Merchants.findOne({
              where: { merchant_id: result.merchant_id },
            }).then((resultmerchant) => {
              return resultmerchant;
            });

            responseTemp = {
              status: true,
              message: "Successfully",
              accessToken: token,
              user: result,
              merchant: merchant,
            };
          }
        }
        return responseTemp;
      })
      .catch((err) => {
        responseTemp = {
          status: false,
          message: err.message,
        };
        return responseTemp;
      });

    if (users.status) {
      sess.createSession(deviceId, users.accessToken, users);
    }
    response = {
      status: users.status,
      message: users.message,
      data: users.data ? users.data : null,
    };
    res.status(200).send(response);
  } catch (e) {
    res.status(200).send({ status: false, message: e.message });
  }
};

exports.postSignUp = async (req, res) => {
  var response = new Array();
  var responseTemp = new Array();
  try {
    var email = req.body.email;
    var phone = req.body.phone;
    var password = req.body.password;
    var merchant_name = req.body.merchant_name;
    if (email.length == 0) {
      throw new Error("Mohon masukkan Email");
    }
    if (phone.length == 0) {
      throw new Error("Mohon masukkan nomor handphone");
    }
    if (merchant_name.length == 0) {
      throw new Error("Mohon masukkan Nama Bisnis");
    }
    if (password.length == 0) {
      throw new Error("Mohon masukkan Password");
    }
    var resUsers = await Users.findOne({
      where: {
        email: email,
      },
    })
      .then(async (result) => {
        if (result) {
          responseTemp = {
            status: false,
            message: "Email sudah terdaftar, silakan gunakan email lainnya",
          };
        } else {
          var resultCreateMerchant = await createMerchant(req);
          if (resultCreateMerchant) {
            var resultCreateUser = await createUser(req, resultCreateMerchant);
            responseTemp = {
              status: resultCreateUser.status,
              message: resultCreateUser.message,
            };
          } else {
            responseTemp = {
              status: false,
              message: resultCreateMerchant.message,
            };
          }
        }
        return responseTemp;
      })
      .catch((err) => {
        responseTemp = {
          status: false,
          message: err.message,
        };
        return responseTemp;
      });
    response = {
      status: resUsers.status ? true : false,
      message: resUsers.message,
    };
    res.status(200).send(response);
  } catch (e) {
    res.status(200).send({ status: false, message: e.message });
  }
};

async function createMerchant(req) {
  var ipInfo = getIP(req);
  var merchant_name = req.body.merchant_name;
  var merchant_address = req.body.merchant_address;
  var merchant_id = uuidv1();
  var createMerchant = await Merchants.create({
    merchant_id: merchant_id,
    merchant_name: merchant_name,
    merchant_address: merchant_address,
    created_by: JSON.stringify(ipInfo),
  })
    .then((resultCreateMerchant) => {
      return {
        status: resultCreateMerchant,
        message: resultCreateMerchant ? "Successfully" : "Failed",
        merchant_id: merchant_id,
      };
    })
    .catch((err) => {
      return {
        status: false,
        message: err.message,
        merchant_id: null,
      };
    });
  return createMerchant;
}

async function createUser(req, resultCreateMerchant) {
  var ipInfo = getIP(req);
  var email = req.body.email;
  var phone = req.body.phone;
  var password = req.body.password;
  var user_id = uuidv4();
  var createUser = await Users.create({
    user_id: user_id,
    merchant_id: resultCreateMerchant.merchant_id,
    email: email,
    phone: phone,
    password: bcrypt.hashSync(password, 8),
    created_by: JSON.stringify(ipInfo),
  })
    .then(async (resultcreateUser) => {
      return {
        status: resultcreateUser,
        message: resultcreateUser ? "Successfully" : "Failed",
        data: resultcreateUser,
      };
    })
    .catch((err) => {
      return {
        status: false,
        message: err.message,
        data: null,
      };
    });
  return createUser;
}

async function updateLastLogin(user_id) {
  var values = {
    last_login: date.dateNowYmdHis(),
  };
  var result = await Users.update(values, {
    where: { user_id: user_id },
  });
  return result;
}
