'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('statistics', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            month: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            year: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            average_grade: {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            exams_count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            total_orders: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            total_earnings: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            total_profit: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
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

        // Add unique index for month and year
        await queryInterface.addIndex('statistics', ['month', 'year'], {
            unique: true,
            name: 'statistics_month_year_unique_idx',
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('statistics');
    },
};