module.exports = (sequelize, DataTypes) => {
    const Driver = sequelize.define(
        'Driver',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            licenseNumber: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            licenseExpiryDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            rating: {
                type: DataTypes.FLOAT,
                defaultValue: 0,
                validate: {
                    min: 0,
                    max: 5,
                },
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            totalTrips: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            totalEarnings: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0,
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
            tableName: 'drivers',
            underscored: true,
        }
    );

    // Define associations
    Driver.associate = (models) => {
        Driver.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
        Driver.hasMany(models.Order, {
            foreignKey: 'driverId',
            as: 'orders',
        });
    };

    return Driver;
};