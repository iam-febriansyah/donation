var dateFormat = require("dateformat");

const dateNowYmdHis = function () {
  var result = dateFormat(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
    "yyyy-mm-dd hh:MM:ss"
  );
  console.log(result);
  return result;
};
const dateNowYmd = function () {
  process.env.TZ = "Asia/Jakarta";
  return (dateNow = dateFormat(new Date(), "yyyy-mm-dd"));
};
const dateNowHis = function () {
  process.env.TZ = "Asia/Jakarta";
  return (dateNow = dateFormat(new Date(), "hh:MM:ss"));
};

module.exports = {
  dateNowYmdHis,
  dateNowYmd,
  dateNowHis,
};
