module.exports = (sequelize, Sequelize) => {
    const TransactionLogs = sequelize.define("transaction_logs", {
        order_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        json_request: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        json_response: {
            type: Sequelize.TEXT,
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
    }, {
        timestamps: false
    });

    return TransactionLogs;
};