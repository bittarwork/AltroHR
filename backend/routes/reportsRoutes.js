const express = require('express');
const router = express.Router();

const ReportsController = require('../controllers/ReportsController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Routes للتقارير العامة - للإداريين فقط

// جلب جميع التقارير مع الفلترة
router.get('/', auth, role(['admin', 'hr']), ReportsController.getAllReports);

// جلب تقرير محدد
router.get('/:id', auth, role(['admin', 'hr']), ReportsController.getReportById);

// إنشاء تقرير الموظفين
router.post('/generate/employees', auth, role(['admin', 'hr']), ReportsController.generateEmployeesReport);

// إنشاء تقرير الحضور
router.post('/generate/attendance', auth, role(['admin', 'hr']), ReportsController.generateAttendanceReport);

// جلب إحصائيات التقارير
router.get('/statistics/overview', auth, role(['admin', 'hr']), ReportsController.getReportsStatistics);

module.exports = router; 