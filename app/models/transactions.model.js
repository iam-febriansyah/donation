module.exports = (sequelize, Sequelize) => {
    const Transactions = sequelize.define("transactions", {
        order_id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        merchant_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        transaction_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        channel: {
            type: Sequelize.STRING,
            allowNull: false
        },
        va_qr: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        price: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        expired_time: {
            type: 'TIMESTAMP',
            allowNull: false
        },
        success_time: {
            type: 'TIMESTAMP',
            allowNull: true
        },
        created_at: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        created_by: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "system"
        },
        updated_at: {
            type: 'TIMESTAMP',
            allowNull: true
        },
        updated_by: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        timestamps: false
    });

    return Transactions;
};