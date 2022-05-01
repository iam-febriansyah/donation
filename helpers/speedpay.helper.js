const speedpay = require("../config/speedpay");
const request = require("request");

const createOrder = async function (dataToPayment) {
  const options = {
    method: "POST",
    url: speedpay.URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: speedpay.KEY,
    },
    body: dataToPayment,
    json: true,
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, data) => {
      if (!error && response.statusCode == 200) {
        status = true;
        remarks = "Successfully";
        data = response.body;
        statusCode = 200;
      } else {
        status = false;
        remarks = error;
        data = null;
        statusCode = 500;
      }
      response = {
        status: status,
        remarks: remarks,
        data: data,
        statusCode: statusCode,
      };
      if (status) {
        if (!data.status_json) {
          response = {
            status: false,
            remarks: data.errors,
            data: null,
            statusCode: 500,
          };
        }
      }
      resolve(response);
    });
  });
};

module.exports = {
  createOrder,
};
