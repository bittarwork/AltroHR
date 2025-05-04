describe('📆 Leave Requests', () => {
    let token;
    let leaveId;

    beforeAll(async () => {
        const res = await request(app).post('/api/users/login')
            .send({ email: 'employee1@example.com', password: '123456' });
        token = res.body.token;
    });

    it('should create a leave request', async () => {
        const res = await request(app)
            .post('/api/leaves')
            .set('Authorization', `Bearer ${token}`)
            .send({
                leaveType: 'annual',
                startDate: '2025-05-10',
                endDate: '2025-05-15',
                reason: 'vacation'
            });

        expect(res.statusCode).toBe(201);
        leaveId = res.body.leave._id;
    });

    it('should get my leave requests', async () => {
        const res = await request(app)
            .get('/api/leaves/my')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });

    it('should cancel a leave request', async () => {
        const res = await request(app)
            .delete(`/api/leaves/${leaveId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });
});
