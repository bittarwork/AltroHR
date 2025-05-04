describe('🏢 Departments', () => {
    let adminToken;
    let depId;

    beforeAll(async () => {
        const res = await request(app).post('/api/users/login')
            .send({ email: 'admin@example.com', password: '123456' });
        adminToken = res.body.token;
    });

    it('should create a department', async () => {
        const res = await request(app)
            .post('/api/departments')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Marketing', description: 'Marketing Team' });

        expect(res.statusCode).toBe(201);
        depId = res.body._id;
    });

    it('should fetch all departments', async () => {
        const res = await request(app)
            .get('/api/departments')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
    });

    it('should update a department', async () => {
        const res = await request(app)
            .put(`/api/departments/${depId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ description: 'Updated' });

        expect(res.statusCode).toBe(200);
    });
});
