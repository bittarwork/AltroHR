describe('🕒 Attendance', () => {
    let token;

    beforeAll(async () => {
        const res = await request(app).post('/api/users/login')
            .send({ email: 'employee1@example.com', password: '123456' });
        token = res.body.token;
    });

    it('should clock in', async () => {
        const res = await request(app)
            .post('/api/attendance/clock-in')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.attendance.clockIn).toBeDefined();
    });

    it('should clock out', async () => {
        const res = await request(app)
            .post('/api/attendance/clock-out')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.attendance.clockOut).toBeDefined();
    });

    it('should get my attendance records', async () => {
        const res = await request(app)
            .get('/api/attendance/my')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
