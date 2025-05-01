// Load environment variables for testing
require('dotenv').config({ path: '.env.test' });

// Set environment variables for testing if not already set
process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT || 3001;
process.env.DB_NAME = process.env.DB_NAME || 'ride_admin_db_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';