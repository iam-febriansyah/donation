const config = require("../../config/config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: 0,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

/* USERS MODELS */
db.users = require("../../app/models/users.model")(sequelize, Sequelize);
db.merchants = require("../../app/models/merchants.model")(
  sequelize,
  Sequelize
);

/* TRANSACTIONS MODEL */
db.transactions = require("../../app/models/transactions.model")(
  sequelize,
  Sequelize
);
db.transaction_logs = require("../../app/models/transaction_logs.model")(
  sequelize,
  Sequelize
);

/* RELATIONSHIP */
// db.users.hasMany(db.merchants, {
//   sourceKey: "merchant_id",
//   foreignKey: "merchant_id",
// });

// db.transactions.hasMany(db.merchants, {
//   sourceKey: "merchant_id",
//   foreignKey: "merchant_id",
// });

// db.transaction_logs.hasMany(db.transactions, {
//   sourceKey: "order_id",
//   foreignKey: "order_id",
// });

module.exports = db;
