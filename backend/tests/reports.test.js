describe('📊 Monthly Reports', () => {
    let token;

    beforeAll(async () => {
        const res = await request(app).post('/api/users/login')
            .send({ email: 'admin@example.com', password: '123456' });
        token = res.body.token;
    });

    it('should generate report for user', async () => {
        const res = await request(app)
            .post('/api/reports/generate/user')
            .set('Authorization', `Bearer ${token}`)
            .send({ userId: 'EMPLOYEE_ID_HERE', month: '2025-05' });

        expect(res.statusCode).toBe(201);
    });

    it('should get all reports', async () => {
        const res = await request(app)
            .get('/api/reports')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });
});
