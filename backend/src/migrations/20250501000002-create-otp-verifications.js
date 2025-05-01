'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('otp_verifications', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            otp_code: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            purpose: {
                type: Sequelize.ENUM('registration', 'password_reset'),
                allowNull: false,
            },
            expires_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            is_used: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });

        // Add unique index for email, otp_code, and purpose
        await queryInterface.addIndex('otp_verifications', ['email', 'otp_code', 'purpose'], {
            unique: true,
            name: 'otp_verifications_unique_idx',
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('otp_verifications');
    },
};