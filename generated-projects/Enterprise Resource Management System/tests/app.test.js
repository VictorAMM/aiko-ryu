const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');

describe('Enterprise Resource Management System', () => {
    let authToken;

    beforeAll(async () => {
        // Setup test database
        await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('Authentication', () => {
        test('should register a new user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('email', 'test@example.com');
        });

        test('should login existing user', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            authToken = response.body.token;
        });
    });

    describe('Data Processing', () => {
        test('should process analytics data', async () => {
            const response = await request(app)
                .get('/api/data/analytics')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('metrics');
            expect(response.body).toHaveProperty('insights');
        });

        test('should process real-time data', async () => {
            const response = await request(app)
                .post('/api/data/process')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    data: [{ id: 1, value: 'test' }],
                    operation: 'transform'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('result');
        });
    });

    describe('User Management', () => {
        test('should get user profile', async () => {
            const response = await request(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('email');
        });
    });

    describe('Health Check', () => {
        test('should return health status', async () => {
            const response = await request(app).get('/health');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'healthy');
        });
    });
});