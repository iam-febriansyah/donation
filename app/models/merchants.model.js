module.exports = (sequelize, Sequelize) => {
  const Merchants = sequelize.define(
    "merchants",
    {
      merchant_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      merchant_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      merchant_logo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      merchant_address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      created_by: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "system",
      },
      updated_at: {
        type: "TIMESTAMP",
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  return Merchants;
};
