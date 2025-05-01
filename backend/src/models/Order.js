const { ORDER_STATUS, CAR_COMFORT } = require('../utils/constants');

module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define(
        'Order',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            driverId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'drivers',
                    key: 'id',
                },
            },
            clientId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            carComfort: {
                type: DataTypes.ENUM(Object.values(CAR_COMFORT)),
                allowNull: false,
                defaultValue: CAR_COMFORT.STANDARD,
            },
            orderedTime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            startLocation: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            finishLocation: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            income: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: DataTypes.ENUM(Object.values(ORDER_STATUS)),
                allowNull: false,
                defaultValue: ORDER_STATUS.PENDING,
            },
            distance: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            duration: {
                type: DataTypes.INTEGER, // in minutes
                allowNull: true,
            },
            rating: {
                type: DataTypes.FLOAT,
                allowNull: true,
                validate: {
                    min: 0,
                    max: 5,
                },
            },
            clientComment: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        },
        {
            tableName: 'orders',
            underscored: true,
        }
    );

    // Define associations
    Order.associate = (models) => {
        Order.belongsTo(models.Driver, {
            foreignKey: 'driverId',
            as: 'driver',
        });
        Order.belongsTo(models.User, {
            foreignKey: 'clientId',
            as: 'client',
        });
    };

    return Order;
};