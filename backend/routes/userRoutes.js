const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');
const { uploadProfileImage, handleMulterError } = require('../middleware/uploadMiddleware');

// ==============================
// 🔐 Auth Routes
// ==============================

// تسجيل الدخول
router.post('/login', UserController.login);

// جلب بيانات الحساب الحالي (مطلوب توكن)
router.get('/me', auth, UserController.getProfile);

// جلب الإحصائيات السريعة للموظف (جديد)
router.get('/me/quick-stats', auth, UserController.getEmployeeQuickStats);

// تحديث الملف الشخصي (جديد)
router.put('/me/profile', auth, UserController.updateProfile);

// تغيير كلمة المرور
router.put('/change-password', auth, UserController.changePassword);

// رفع الصورة الشخصية (جديد)
router.post('/me/upload-image', auth, (req, res, next) => {
    console.log('=== Upload Image Route Called ===');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Content-Type:', req.headers['content-type']);

    uploadProfileImage(req, res, (err) => {
        console.log('=== After Multer Middleware ===');
        console.log('Error:', err);
        console.log('File:', req.file);

        if (err) {
            return handleMulterError(err, req, res, next);
        }
        next();
    });
}, UserController.uploadProfileImage);

// حذف الصورة الشخصية (جديد)
router.delete('/me/delete-image', auth, UserController.deleteProfileImage);

// ==============================
// 🧾 User CRUD (Admin only)
// ==============================

// إنشاء حساب موظف جديد (من المسؤولين)
router.post('/create-employee', auth, role(['admin', 'hr']), UserController.createEmployee);

router.post('/', auth, role(['admin', 'hr']), UserController.createUser);

router.put('/:id', auth, role(['admin', 'hr']), validateObjectId, UserController.updateUser);

router.delete('/:id', auth, role(['admin']), validateObjectId, UserController.deleteUser);

router.get('/', auth, role(['admin', 'hr']), UserController.getAllUsers);

router.get('/:id', auth, role(['admin', 'hr']), validateObjectId, UserController.getUserById);

router.patch('/:id/toggle', auth, role(['admin']), validateObjectId, UserController.toggleUserActive);

// ==============================
// 📅 Data Related to User
// ==============================

router.get('/:id/attendance', auth, role(['admin', 'hr']), validateObjectId, UserController.getUserAttendance);

router.get('/:id/leaves', auth, role(['admin', 'hr']), validateObjectId, UserController.getUserLeaves);

router.get('/:id/performance-notes', auth, role(['admin', 'hr']), validateObjectId, UserController.getUserPerformanceNotes);

router.get('/:id/monthly-reports', auth, role(['admin', 'hr']), validateObjectId, UserController.getUserMonthlyReports);

router.get('/:id/salaries', auth, role(['admin', 'hr']), validateObjectId, UserController.getUserSalaries);

// ==============================
// 🔎 فلترة
// ==============================

router.get('/filter/by-department/:departmentId', auth, role(['admin', 'hr']), validateObjectId, UserController.getUsersByDepartment);

router.get('/filter/by-role/:role', auth, role(['admin', 'hr']), UserController.getUsersByRole);

router.get('/search', auth, role(['admin', 'hr']), UserController.searchUsers);


module.exports = router;
