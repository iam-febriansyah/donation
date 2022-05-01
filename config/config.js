module.exports = {
  HOST: "139.255.83.138",
  USER: "spuser",
  PASSWORD: "speedlab81",
  DB: "donation",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  PORT: 9001,
  Origin: "http://localhost:9001",
  URL: "http://localhost:9001",
  URLCLIENT: "speedlab.eazynotif.com",
  PATHSESSION: "./sessions",
  SESSION: "donation-session",
  PATHCERT: "/Users/febriansyahdev/Documents/Project/Node Js/donation/cert.pem", // /etc/letsencrypt/live/eazynotif.id/cert.pem
  PATHKEY: "/Users/febriansyahdev/Documents/Project/Node Js/donation/key.pem", // /etc/letsencrypt/live/eazynotif.id/privkey.pem
};
