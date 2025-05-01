const { AUTH } = require('../utils/constants');

module.exports = (sequelize, DataTypes) => {
    const OtpVerification = sequelize.define(
        'OtpVerification',
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
                validate: {
                    isEmail: true,
                },
            },
            otpCode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            purpose: {
                type: DataTypes.ENUM(Object.values(AUTH.OTP_PURPOSE)),
                allowNull: false,
            },
            expiresAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            isUsed: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
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
            tableName: 'otp_verifications',
            underscored: true,
            indexes: [
                {
                    unique: true,
                    fields: ['email', 'otp_code', 'purpose'],
                },
            ],
        }
    );

    // Define associations
    OtpVerification.associate = (models) => {
        // No direct associations needed
    };

    // Instance methods
    OtpVerification.prototype.isExpired = function () {
        return new Date() > this.expiresAt;
    };

    return OtpVerification;
};