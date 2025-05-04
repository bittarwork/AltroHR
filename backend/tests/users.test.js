const request = require('supertest');
const app = require('../src/app');

describe('🔐 User Authentication', () => {
    it('should login successfully with valid credentials', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'admin@example.com', password: '123456' });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it('should fail login with invalid credentials', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'wrong@example.com', password: 'wrong' });

        expect(res.statusCode).toBe(401);
    });
});
