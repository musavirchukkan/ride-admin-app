'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('drivers', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            license_number: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            license_expiry_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            rating: {
                type: Sequelize.FLOAT,
                defaultValue: 0,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            total_trips: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            total_earnings: {
                type: Sequelize.DECIMAL(10, 2),
                defaultValue: 0,
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

        // Add index for user_id
        await queryInterface.addIndex('drivers', ['user_id'], {
            name: 'drivers_user_id_idx',
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('drivers');
    },
};