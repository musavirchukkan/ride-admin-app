const { hashPassword } = require('../utils/passwordUtils');
const { ROLES } = require('../utils/constants');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [8, 100],
                },
            },
            fullName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 100],
                },
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            profileImage: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            role: {
                type: DataTypes.ENUM(Object.values(ROLES)),
                defaultValue: ROLES.USER,
                allowNull: false,
            },
            isEmailVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            lastLogin: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            countryCode: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('active', 'inactive', 'blocked'),
                defaultValue: 'inactive',
                allowNull: false,
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
            tableName: 'users',
            underscored: true,
            hooks: {
                // Hash password before saving
                beforeCreate: async (user) => {
                    if (user.password) {
                        user.password = await hashPassword(user.password);
                    }
                },
                beforeUpdate: async (user) => {
                    if (user.changed('password')) {
                        user.password = await hashPassword(user.password);
                    }
                },
            },
        }
    );

    // Define associations
    User.associate = (models) => {
        User.hasOne(models.Driver, {
            foreignKey: 'userId',
            as: 'driver',
        });
        User.hasMany(models.Order, {
            foreignKey: 'clientId',
            as: 'clientOrders',
        });
    };

    // Instance methods
    User.prototype.toJSON = function () {
        const values = { ...this.get() };
        delete values.password;
        return values;
    };

    return User;
};