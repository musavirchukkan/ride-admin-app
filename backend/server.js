require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

// Test database connection
async function assertDatabaseConnection() {
    try {
        await sequelize.authenticate();
        logger.info('Database connection established successfully.');
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

// Start server
async function startServer() {
    await assertDatabaseConnection();

    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

startServer();