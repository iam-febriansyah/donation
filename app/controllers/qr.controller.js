const db = require("../models");
const date = require("../../helpers/date.helper");
const speedpay = require("../../helpers/speedpay.helper");
const Users = db.users;
const Merchants = db.merchants;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const { v1: uuidv1 } = require("uuid");
const sess = require("../../helpers/session.helper");
const { machineIdSync } = require("node-machine-id");
var deviceId = machineIdSync({ original: true });
var getIP = require("ipware")().get_ip;
var QRCode = require("qrcode");

exports.getQr = async (req, res) => {
  res.render("qr");
};

exports.createOrder = async (req, res) => {
  try {
    var sessionDeviceId = sess.getSession(deviceId);
    var data = sessionDeviceId.data;

    var request = req.body;
    var order_id = uuidv1();
    var price = request.price;
    var name = data.merchant.merchant_name;
    var email = data.user.email;
    var merchant_name = data.merchant.merchant_name;
    var merchant_phone = data.user.phone;
    var order_bank = request.order_bank;

    var transaction_details = new Array();
    transaction_details[0] = {};
    transaction_details[0]["price"] = price;
    transaction_details[0]["quantity"] = 1;
    transaction_details[0]["name"] = name;
    var transactions = {
      bank: order_bank,
      order_id: order_id,
      gross_amount: price,
      customer_email: email,
      customer_name: merchant_name,
      customer_phone: merchant_phone,
      expired: 2,
    };
    var dataToSpeedpay = {
      transactions: transactions,
      transaction_details: transaction_details,
    };
    var resPayment = await speedpay.createOrder(dataToSpeedpay);
    // console.log(resPayment);
    if (resPayment.status) {
      if (resPayment.data.payment) {
        var data = resPayment.data.payment;
        var qr = await generateQR(data.image_qris);
        var response = {
          status: true,
          message: "Successfully",
          content: data.bank == "QRIS" ? qr : data.va,
          transaction_id: data.transaction_id,
        };
      } else {
        var response = {
          status: true,
          message: "Payment is not exist",
        };
      }
    } else {
      var response = {
        status: true,
        message: "Payment is failed",
      };
    }
    res.status(200).send(response);
  } catch (e) {
    res.status(200).send({ status: false, message: e.message });
  }
};

const generateQR = async (text) => {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    return console.error(err);
  }
};
