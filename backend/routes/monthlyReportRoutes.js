const express = require('express');
const router = express.Router();

const MonthlyReportController = require('../controllers/MonthlyReportController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

// ==============================
// HR / Admin فقط
// ==============================

// توليد تقرير لموظف معين
router.post('/generate/user', auth, role(['admin', 'hr']), MonthlyReportController.generateReportForUser);

// توليد تقارير لكل الموظفين
router.post('/generate/all', auth, role(['admin', 'hr']), MonthlyReportController.generateReportsForAll);

// جلب تقرير حسب ID
router.get('/:id', auth, role(['admin', 'hr']), validateObjectId, MonthlyReportController.getReportById);

// جلب كل تقارير موظف معيّن
router.get('/user/:id', auth, role(['admin', 'hr']), validateObjectId, MonthlyReportController.getReportsByUser);

// جلب جميع التقارير
router.get('/', auth, role(['admin', 'hr']), MonthlyReportController.getAllReports);

module.exports = router;
