const express = require('express');
const router = express.Router();

const SalaryController = require('../controllers/SalaryController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

// ==============================
// 🛠️ HR / Admin - إدارة الرواتب
// ==============================

// توليد راتب لموظف معين
router.post('/generate/user', auth, role(['admin', 'hr']), SalaryController.generateSalaryForUser);

// توليد رواتب لكل الموظفين
router.post('/generate/all', auth, role(['admin', 'hr']), SalaryController.generateSalaryForAll);

// تعديل يدوي (خصم / مكافأة)
router.put('/:id/manual-update', auth, role(['admin', 'hr']), validateObjectId, SalaryController.updateSalaryManually);

// تحديد الراتب كمدفوع
router.patch('/:id/mark-paid', auth, role(['admin', 'hr']), validateObjectId, SalaryController.markSalaryAsPaid);

// جلب كل الرواتب لموظف معيّن
router.get('/user/:id', auth, role(['admin', 'hr']), validateObjectId, SalaryController.getSalariesByUser);

// جلب تفاصيل راتب محدد
router.get('/:id', auth, role(['admin', 'hr']), validateObjectId, SalaryController.getSalaryById);

module.exports = router;
