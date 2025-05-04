const express = require('express');
const router = express.Router();

const LeaveRequestController = require('../controllers/LeaveRequestController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

// ============================
// 👤 الموظف
// ============================

// تقديم طلب إجازة
router.post('/', auth, role(['employee']), LeaveRequestController.createLeaveRequest);

// إلغاء طلب إجازة (pending فقط)
router.delete('/:id', auth, role(['employee']), validateObjectId, LeaveRequestController.cancelLeaveRequest);

// عرض جميع الطلبات الخاصة بالمستخدم الحالي
router.get('/my', auth, role(['employee']), LeaveRequestController.getMyLeaveRequests);

// عرض تفاصيل طلب محدد (بشرط أن يكون من نفس المستخدم)
router.get('/:id', auth, validateObjectId, LeaveRequestController.getLeaveRequestById);

// ============================
// 🛠️ HR / Admin
// ============================

// عرض كل الطلبات في النظام
router.get('/', auth, role(['admin', 'hr']), LeaveRequestController.getAllLeaveRequests);

// عرض طلبات موظف معيّن
router.get('/user/:id', auth, role(['admin', 'hr']), validateObjectId, LeaveRequestController.getLeaveRequestsByUser);

// مراجعة الطلب (موافقة أو رفض)
router.put('/:id/review', auth, role(['admin', 'hr']), validateObjectId, LeaveRequestController.reviewLeaveRequest);

module.exports = router;
