const config = require("../config/config");
const fs = require("fs");

const createSession = function (id, token, data) {
  const SESSION_FILE_PATH = config.PATHSESSION + `/${id}.json`;
  if (fs.existsSync(SESSION_FILE_PATH)) {
    fs.unlinkSync(SESSION_FILE_PATH);
  }
  var dataSession = {
    token: token,
    user: data.user,
    merchant: data.merchant,
  };
  fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(dataSession, null, "\t"));
};

const getSession = function (id) {
  const SESSIONS_FILE = config.PATHSESSION + `/${id}.json`;
  if (fs.existsSync(SESSIONS_FILE)) {
    result = {
      status: true,
      remarks: "Successfully",
      data: JSON.parse(fs.readFileSync(SESSIONS_FILE)),
    };
  } else {
    result = {
      status: false,
      remarks: "Session doesn't exist",
      data: null,
    };
  }
  return result;
};

module.exports = {
  createSession,
  getSession,
};
