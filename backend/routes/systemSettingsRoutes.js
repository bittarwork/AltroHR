const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const SystemSettingsController = require('../controllers/SystemSettingsController');

// جميع routes تتطلب admin فقط
const adminOnly = [auth, role(['admin'])];

// GET /api/system-settings - جلب الإعدادات الحالية
router.get('/', adminOnly, SystemSettingsController.getSettings);

// PUT /api/system-settings - تحديث الإعدادات
router.put('/', adminOnly, SystemSettingsController.updateSettings);

// POST /api/system-settings/reset - إعادة تعيين الإعدادات
router.post('/reset', adminOnly, SystemSettingsController.resetSettings);

// GET /api/system-settings/export - تصدير الإعدادات
router.get('/export', adminOnly, SystemSettingsController.exportSettings);

// POST /api/system-settings/import - استيراد الإعدادات
router.post('/import', adminOnly, SystemSettingsController.importSettings);

// GET /api/system-settings/features - جلب حالة الميزات
router.get('/features', adminOnly, SystemSettingsController.getFeaturesStatus);

module.exports = router; 