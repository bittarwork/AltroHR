const express = require('express');
const router = express.Router();

const DepartmentController = require('../controllers/DepartmentController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

// ✅ جلب إحصائيات الأقسام
router.get('/stats', auth, role(['admin', 'hr']), DepartmentController.getDepartmentStats);

// ✅ إنشاء قسم جديد
router.post('/', auth, role(['admin', 'hr']), DepartmentController.createDepartment);

// ✅ تعديل قسم
router.put('/:id', auth, role(['admin', 'hr']), validateObjectId, DepartmentController.updateDepartment);

// ✅ حذف قسم
router.delete('/:id', auth, role(['admin']), validateObjectId, DepartmentController.deleteDepartment);

// ✅ جلب كل الأقسام
router.get('/', auth, DepartmentController.getAllDepartments);

// ✅ جلب قسم معيّن
router.get('/:id', auth, validateObjectId, DepartmentController.getDepartmentById);

// ✅ جلب المستخدمين في قسم معيّن
router.get('/:id/users', auth, role(['admin', 'hr']), validateObjectId, DepartmentController.getDepartmentUsers);

module.exports = router;
