const express = require('express');
const router = express.Router();

const AttendanceController = require('../controllers/AttendanceController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

// =========================
// 🎯 موظف - تسجيل الحضور والانصراف
// =========================
router.post('/clock-in', auth, AttendanceController.clockIn);
router.post('/clock-out', auth, AttendanceController.clockOut);
router.get('/my', auth, AttendanceController.getMyAttendance);
router.get('/today-status', auth, AttendanceController.getTodayStatus);

// =========================
// 🎯 موظف - إحصائيات شخصية
// =========================
router.get('/my/stats', auth, AttendanceController.getMyStats);
router.get('/my/monthly/:year/:month', auth, AttendanceController.getMyMonthlyReport);
router.get('/my/weekly', auth, AttendanceController.getMyWeeklyReport);

// =========================
// 🎯 HR/Admin - إدارة الحضور
// =========================
router.get('/user/:id', auth, role(['admin', 'hr']), validateObjectId, AttendanceController.getUserAttendance);
router.get('/', auth, role(['admin', 'hr']), AttendanceController.getAllAttendance);
router.get('/by-date', auth, role(['admin', 'hr']), AttendanceController.getAttendanceByDate);
router.get('/reports/summary', auth, role(['admin', 'hr']), AttendanceController.getAttendanceSummary);
router.get('/reports/analytics', auth, role(['admin', 'hr']), AttendanceController.getAttendanceAnalytics);

module.exports = router;
