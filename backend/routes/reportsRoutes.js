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

// إنشاء تقرير الإجازات
router.post('/generate/leaves', auth, role(['admin', 'hr']), ReportsController.generateLeavesReport);

// إنشاء تقرير الأقسام
router.post('/generate/departments', auth, role(['admin', 'hr']), ReportsController.generateDepartmentsReport);

// جلب إحصائيات التقارير
router.get('/statistics/overview', auth, role(['admin', 'hr']), ReportsController.getReportsStatistics);

// تحميل التقارير بصيغة CSV
router.get('/download/employees/csv', auth, role(['admin', 'hr']), ReportsController.downloadEmployeesReportCSV);
router.get('/download/attendance/csv', auth, role(['admin', 'hr']), ReportsController.downloadAttendanceReportCSV);
router.get('/download/leaves/csv', auth, role(['admin', 'hr']), ReportsController.downloadLeavesReportCSV);
router.get('/download/departments/csv', auth, role(['admin', 'hr']), ReportsController.downloadDepartmentsReportCSV);

// تحميل تقرير محدد بصيغة CSV
router.get('/:id/download/csv', auth, role(['admin', 'hr']), ReportsController.downloadReportCSV);

module.exports = router; 