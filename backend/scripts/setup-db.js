#!/usr/bin/env node
/**
 * Script to set up the database, run migrations, and seed data
 */
require('dotenv').config();
const { execSync } = require('child_process');
const { Client } = require('pg');
const logger = require('../src/utils/logger');

const dbName = process.env.DB_NAME || 'ride_admin_db';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;

async function createDatabase() {
    // Connect to postgres database to create our application database
    const client = new Client({
        user: dbUser,
        password: dbPassword,
        host: dbHost,
        port: dbPort,
        database: 'postgres',
    });

    try {
        await client.connect();

        // Check if database already exists
        const checkResult = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbName]
        );

        if (checkResult.rows.length === 0) {
            logger.info(`Creating database: ${dbName}`);
            await client.query(`CREATE DATABASE ${dbName}`);
            logger.info(`Database ${dbName} created successfully`);
        } else {
            logger.info(`Database ${dbName} already exists`);
        }

        await client.end();
        return true;
    } catch (error) {
        logger.error('Error creating database:', error);
        await client.end();
        return false;
    }
}

function runMigrations() {
    try {
        logger.info('Running database migrations...');
        execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
        logger.info('Migrations completed successfully');
        return true;
    } catch (error) {
        logger.error('Error running migrations:', error);
        return false;
    }
}

function seedData() {
    try {
        logger.info('Seeding database with initial data...');
        execSync('npx sequelize-cli db:seed:all', { stdio: 'inherit' });
        logger.info('Database seeded successfully');
        return true;
    } catch (error) {
        logger.error('Error seeding database:', error);
        return false;
    }
}

async function setup() {
    logger.info('Starting database setup...');

    const dbCreated = await createDatabase();
    if (!dbCreated) {
        logger.error('Database creation failed. Exiting.');
        process.exit(1);
    }

    const migrationsRun = runMigrations();
    if (!migrationsRun) {
        logger.error('Migrations failed. Exiting.');
        process.exit(1);
    }

    const dataSeed = seedData();
    if (!dataSeed) {
        logger.error('Data seeding failed. Exiting.');
        process.exit(1);
    }

    logger.info('Database setup completed successfully!');
    process.exit(0);
}

// Run the setup
setup();