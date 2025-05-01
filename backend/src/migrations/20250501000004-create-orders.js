'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('orders', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            driver_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'drivers',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            client_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            car_comfort: {
                type: Sequelize.ENUM('basic', 'standard', 'premium', 'luxury'),
                allowNull: false,
                defaultValue: 'standard',
            },
            ordered_time: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            start_location: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            finish_location: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            income: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: Sequelize.ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled'),
                allowNull: false,
                defaultValue: 'pending',
            },
            distance: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            duration: {
                type: Sequelize.INTEGER, // in minutes
                allowNull: true,
            },
            rating: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            client_comment: {
                type: Sequelize.TEXT,
                allowNull: true,
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

        // Add indices
        await queryInterface.addIndex('orders', ['driver_id'], {
            name: 'orders_driver_id_idx',
        });
        await queryInterface.addIndex('orders', ['client_id'], {
            name: 'orders_client_id_idx',
        });
        await queryInterface.addIndex('orders', ['status'], {
            name: 'orders_status_idx',
        });
        await queryInterface.addIndex('orders', ['ordered_time'], {
            name: 'orders_ordered_time_idx',
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('orders');
    },
};