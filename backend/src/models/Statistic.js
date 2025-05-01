module.exports = (sequelize, DataTypes) => {
    const Statistic = sequelize.define(
        'Statistic',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            month: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 12,
                },
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            averageGrade: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            examsCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            totalOrders: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            totalEarnings: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            totalProfit: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
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
            tableName: 'statistics',
            underscored: true,
            indexes: [
                {
                    unique: true,
                    fields: ['month', 'year'],
                },
            ],
        }
    );

    // No associations needed for Statistics
    Statistic.associate = () => { };

    return Statistic;
};