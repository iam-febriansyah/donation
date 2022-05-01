const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const socket = require("socket.io");
const config = require("./config/config");
const session = require("express-session");

TZ = "Asia/Jakarta";

const app = express();
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.set("views", path.join(__dirname, "app/views"));
app.set("view engine", "ejs");

//SESSION
app.use(session({ secret: config.SESSION, resave: true, saveUninitialized: true }));

//bootstrap location
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use("/js", express.static(path.join(__dirname, "node_modules/jquery/dist")));
app.use(express.static("assets"));

const db = require("./app/models");
db.sequelize.sync();

process.env.TZ = "Asia/Jakarta";

const PORT = process.env.PORT || config.PORT;
const URL = config.URL;
var privateKey = fs.readFileSync(config.PATHKEY, "utf8");
var certificate = fs.readFileSync(config.PATHCERT, "utf8");
var credentials = {
  key: privateKey,
  cert: certificate,
};
var httpsServer = https.createServer(credentials, app);
var httpServer = http.createServer(app);

const io = socket(httpsServer, {
  cors: {
    origin: [config.Origin],
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true,
});
global.io = io;
io.on("connection", function (socket) {
  console.log("Made socket connection");
});

// require("./routes/web.route")(app, io);
require("./routes/web.route")(app);

// if (!config.PRODUCTION) {
httpServer.listen(9002);
// } else {
httpsServer.setTimeout(30000);
httpsServer.listen(PORT, () => {
  console.log(`Server is running on ${URL}`);
});
// }
