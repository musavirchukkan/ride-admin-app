const request = require('supertest');
const app = require('../../app');
const { sequelize, User } = require('../../models');
const { hashPassword } = require('../../utils/passwordUtils');

describe('Auth Controller', () => {
    let testUser;

    // Before all tests, set up the database
    beforeAll(async () => {
        // Sync database
        await sequelize.sync({ force: true });

        // Create a test user
        const password = await hashPassword('Test1234!');
        testUser = await User.create({
            email: 'testuser@example.com',
            password,
            fullName: 'Test User',
            phoneNumber: '+1234567890',
            role: 'user',
            isEmailVerified: true,
            status: 'active',
            countryCode: 'US',
            country: 'United States',
        });
    });

    // After all tests, clean up
    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'Test1234!',
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual('success');
            expect(res.body.data).toHaveProperty('tokens');
            expect(res.body.data).toHaveProperty('user');
            expect(res.body.data.user.email).toEqual('testuser@example.com');
        });

        it('should return 401 with invalid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'WrongPassword123!',
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.status).toEqual('error');
        });
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            // Mock the IP geolocation service to prevent actual API calls during tests
            jest.mock('../../services/geoLocationService', () => ({
                getIpFromRequest: jest.fn().mockReturnValue('127.0.0.1'),
                checkIfIpIsRestricted: jest.fn().mockResolvedValue({
                    countryCode: 'US',
                    country: 'United States'
                }),
            }));

            // Mock email service to prevent actual emails during tests
            jest.mock('../../services/emailService', () => ({
                sendOtpEmail: jest.fn().mockResolvedValue(true),
            }));

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'newuser@example.com',
                    password: 'NewUser1234!',
                    confirmPassword: 'NewUser1234!',
                    fullName: 'New User',
                    phoneNumber: '+1987654321',
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.status).toEqual('success');
            expect(res.body.data).toHaveProperty('user');
            expect(res.body.data.user.email).toEqual('newuser@example.com');
        });

        it('should return 409 if email already exists', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'testuser@example.com', // Existing email
                    password: 'Test1234!',
                    confirmPassword: 'Test1234!',
                    fullName: 'Test User',
                    phoneNumber: '+1234567890',
                });

            expect(res.statusCode).toEqual(409);
            expect(res.body.status).toEqual('error');
        });
    });

    describe('GET /api/auth/me', () => {
        it('should get current user profile with valid token', async () => {
            // First login to get a token
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'Test1234!',
                });

            const token = loginRes.body.data.tokens.access.token;

            // Now use the token to get user profile
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual('success');
            expect(res.body.data).toHaveProperty('user');
            expect(res.body.data.user.email).toEqual('testuser@example.com');
        });

        it('should return 401 with invalid token', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalidtoken');

            expect(res.statusCode).toEqual(401);
            expect(res.body.status).toEqual('error');
        });
    });
});