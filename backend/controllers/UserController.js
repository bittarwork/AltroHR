// src/controllers/UserController.js

const User = require('../models/User');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const PerformanceNote = require('../models/PerformanceNote');
const MonthlyReport = require('../models/MonthlyReport');
const Salary = require('../models/Salary');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { deleteOldProfileImage, getImageUrl } = require('../middleware/uploadMiddleware');

// ✅ توليد JWT
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

const UserController = {

    // ============================
    // 🔐 المصادقة
    // ============================

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email }).populate('department');
            if (!user) return res.status(401).json({ message: 'Invalid email or password' });

            const isMatch = await user.matchPassword(password);
            if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

            user.lastLogin = new Date();
            await user.save();

            const token = generateToken(user);
            res.json({ token, user });
        } catch (err) {
            res.status(500).json({ message: 'Login failed', error: err.message });
        }
    },

    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id).populate('department');
            if (!user) return res.status(404).json({ message: 'User not found' });

            // التأكد من إرجاع الصورة الشخصية
            const userProfile = {
                ...user.toObject(),
                profileImage: user.profileImage || null
            };

            res.json(userProfile);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching profile', error: err.message });
        }
    },

    async changePassword(req, res) {
        const { oldPassword, newPassword } = req.body;
        try {
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const isMatch = await user.matchPassword(oldPassword);
            if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

            user.password = newPassword;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to update password', error: err.message });
        }
    },

    // تحديث الملف الشخصي (جديد)
    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const { name, email, phone, address } = req.body;

            // التحقق من صحة البيانات
            if (!name || name.trim().length < 2) {
                return res.status(400).json({ message: 'Name must be at least 2 characters long' });
            }

            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({ message: 'Invalid email format' });
                }

                // التحقق من عدم وجود البريد الإلكتروني مع مستخدم آخر
                const existingUser = await User.findOne({
                    email: email,
                    _id: { $ne: userId }
                });
                if (existingUser) {
                    return res.status(400).json({ message: 'Email already exists' });
                }
            }

            // تحديث البيانات
            const updateData = {
                name: name.trim(),
                ...(email && { email: email.trim() }),
                ...(phone && { phone: phone.trim() }),
                ...(address && { address: address.trim() })
            };

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            ).populate('department');

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({
                message: 'Profile updated successfully',
                user: updatedUser
            });

        } catch (err) {
            console.error('Update profile error:', err);

            if (err.name === 'ValidationError') {
                const validationErrors = Object.values(err.errors).map(e => e.message);
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: validationErrors
                });
            }

            res.status(500).json({
                message: 'Failed to update profile',
                error: err.message
            });
        }
    },

    // رفع الصورة الشخصية (جديد)
    async uploadProfileImage(req, res) {
        try {
            console.log('=== Upload Profile Image Controller ===');
            console.log('User ID:', req.user.id);
            console.log('File received:', req.file);
            console.log('Body:', req.body);

            const userId = req.user.id;

            if (!req.file) {
                console.log('❌ No file received');
                return res.status(400).json({
                    message: 'No image file provided',
                    error: 'NO_FILE'
                });
            }

            // الحصول على المستخدم الحالي
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // حذف الصورة القديمة إن وجدت
            if (user.profileImage) {
                const oldImagePath = path.join(__dirname, '../uploads/profiles', path.basename(user.profileImage));
                deleteOldProfileImage(oldImagePath);
            }

            // إنشاء URL للصورة الجديدة
            const imageUrl = getImageUrl(req, req.file.filename);

            // تحديث بيانات المستخدم
            user.profileImage = imageUrl;
            await user.save();

            res.json({
                message: 'Profile image uploaded successfully',
                profileImage: imageUrl,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profileImage: imageUrl
                }
            });

        } catch (err) {
            console.error('Upload profile image error:', err);

            // حذف الملف المرفوع في حالة الخطأ
            if (req.file) {
                const uploadedFilePath = req.file.path;
                if (fs.existsSync(uploadedFilePath)) {
                    fs.unlinkSync(uploadedFilePath);
                }
            }

            res.status(500).json({
                message: 'Failed to upload profile image',
                error: err.message
            });
        }
    },

    // حذف الصورة الشخصية (جديد)
    async deleteProfileImage(req, res) {
        try {
            const userId = req.user.id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!user.profileImage) {
                return res.status(400).json({
                    message: 'No profile image to delete'
                });
            }

            // حذف الصورة من الخادم
            const imagePath = path.join(__dirname, '../uploads/profiles', path.basename(user.profileImage));
            deleteOldProfileImage(imagePath);

            // تحديث بيانات المستخدم
            user.profileImage = null;
            user.profileImagePublicId = null;
            await user.save();

            res.json({
                message: 'Profile image deleted successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profileImage: null
                }
            });

        } catch (err) {
            console.error('Delete profile image error:', err);
            res.status(500).json({
                message: 'Failed to delete profile image',
                error: err.message
            });
        }
    },

    // ============================
    // 🧾 إدارة المستخدمين (CRUD)
    // ============================

    // إنشاء حساب موظف جديد (من المسؤولين)
    async createEmployee(req, res) {
        try {
            const { name, email, password, department, position, role, phoneNumber, startDate } = req.body;

            // التحقق من صحة البيانات المطلوبة
            if (!name || !email || !password || !department || !position) {
                return res.status(400).json({
                    message: 'الرجاء إدخال جميع البيانات المطلوبة: الاسم، البريد الإلكتروني، كلمة المرور، القسم، المنصب'
                });
            }

            // التحقق من أن المستخدم الحالي لديه صلاحية إنشاء حسابات
            const currentUser = await User.findById(req.user.id);
            if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'hr')) {
                return res.status(403).json({
                    message: 'غير مصرح لك بإنشاء حسابات الموظفين'
                });
            }

            // التحقق من عدم وجود المستخدم
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    message: 'البريد الإلكتروني مستخدم مسبقًا'
                });
            }

            // البحث عن القسم
            let departmentDoc = null;
            if (department) {
                const Department = require('../models/Department');
                departmentDoc = await Department.findOne({ name: department });
                if (!departmentDoc) {
                    // إنشاء قسم جديد إذا لم يكن موجود
                    departmentDoc = new Department({ name: department });
                    await departmentDoc.save();
                }
            }

            // إنشاء المستخدم الجديد
            const userData = {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
                role: role || 'employee',
                department: departmentDoc ? departmentDoc._id : null,
                position: position.trim(),
                phone: phoneNumber ? phoneNumber.trim() : undefined,
                hireDate: startDate ? new Date(startDate) : new Date(),
                isActive: true,
                createdBy: req.user.id // تسجيل من قام بإنشاء الحساب
            };

            const newUser = new User(userData);
            await newUser.save();

            // إزالة كلمة المرور من الاستجابة
            const userResponse = await User.findById(newUser._id)
                .populate('department')
                .select('-password');

            res.status(201).json({
                message: 'تم إنشاء حساب الموظف بنجاح',
                user: userResponse,
                createdBy: {
                    id: currentUser._id,
                    name: currentUser.name,
                    role: currentUser.role
                }
            });

        } catch (err) {
            console.error('Create employee error:', err);

            if (err.name === 'ValidationError') {
                const validationErrors = Object.values(err.errors).map(e => e.message);
                return res.status(400).json({
                    message: 'خطأ في التحقق من البيانات',
                    errors: validationErrors
                });
            }

            res.status(500).json({
                message: 'حدث خطأ في إنشاء حساب الموظف',
                error: err.message
            });
        }
    },

    async createUser(req, res) {
        try {
            const {
                name, email, password, role, department,
                position, hireDate, salaryType,
                baseSalary, hourlyRate, overtimeRate, workHoursPerDay
            } = req.body;

            const existing = await User.findOne({ email });
            if (existing) return res.status(400).json({ message: 'Email already exists' });

            const user = new User({
                name,
                email,
                password,
                role,
                department,
                position,
                hireDate,
                salaryType,
                baseSalary,
                hourlyRate,
                overtimeRate,
                workHoursPerDay
            });

            await user.save();

            // ✅ إعادة المستخدم بعد الحفظ مع بيانات القسم
            const populatedUser = await User.findById(user._id).populate('department');

            const token = generateToken(populatedUser);
            res.status(201).json({ token, user: populatedUser });

        } catch (err) {
            res.status(500).json({ message: 'Failed to create user', error: err.message });
        }
    },

    async updateUser(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } catch (err) {
            res.status(500).json({ message: 'Failed to update user', error: err.message });
        }
    },

    async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to delete user', error: err.message });
        }
    },

    async toggleUserActive(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            user.isActive = !user.isActive;
            await user.save();
            res.json({ message: `User is now ${user.isActive ? 'active' : 'inactive'}` });
        } catch (err) {
            res.status(500).json({ message: 'Failed to update user status', error: err.message });
        }
    },

    async getAllUsers(req, res) {
        try {
            const { q, role, departmentId, isActive } = req.query;

            // بناء شروط البحث
            const filter = {};

            if (q) {
                filter.$or = [
                    { name: { $regex: q, $options: "i" } },
                    { email: { $regex: q, $options: "i" } },
                ];
            }

            if (role) {
                filter.role = role;
            }

            if (departmentId) {
                filter.department = departmentId;
            }

            if (typeof isActive !== "undefined") {
                filter.isActive = isActive === "true";
            }

            const users = await User.find(filter).populate("department");

            res.json(users);
        } catch (err) {
            res.status(500).json({
                message: "Failed to fetch users",
                error: err.message,
            });
        }
    },

    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id).populate('department');
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch user', error: err.message });
        }
    },

    // ============================
    // 📅 بيانات مرتبطة بالمستخدم
    // ============================

    async getUserAttendance(req, res) {
        try {
            const records = await Attendance.find({ user: req.params.id }).sort({ date: -1 });
            res.json(records);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch attendance', error: err.message });
        }
    },

    async getUserLeaves(req, res) {
        try {
            const leaves = await LeaveRequest.find({ user: req.params.id }).sort({ startDate: -1 });
            res.json(leaves);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch leaves', error: err.message });
        }
    },

    async getUserPerformanceNotes(req, res) {
        try {
            const notes = await PerformanceNote.find({ user: req.params.id }).sort({ createdAt: -1 });
            res.json(notes);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch performance notes', error: err.message });
        }
    },

    async getUserMonthlyReports(req, res) {
        try {
            const reports = await MonthlyReport.find({ user: req.params.id }).populate('salaryRef').sort({ month: -1 });
            res.json(reports);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch reports', error: err.message });
        }
    },

    async getUserSalaries(req, res) {
        try {
            const salaries = await Salary.find({ user: req.params.id }).sort({ month: -1 });
            res.json(salaries);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch salaries', error: err.message });
        }
    },

    // ============================
    // 📊 فلترة
    // ============================

    async getUsersByDepartment(req, res) {
        try {
            const users = await User.find({ department: req.params.departmentId }).populate('department');
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch users by department', error: err.message });
        }
    },

    async getUsersByRole(req, res) {
        try {
            const users = await User.find({ role: req.params.role }).populate('department');
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch users by role', error: err.message });
        }
    },

    async searchUsers(req, res) {
        try {
            const q = req.query.q || '';
            const users = await User.find({
                $or: [
                    { name: new RegExp(q, 'i') },
                    { email: new RegExp(q, 'i') },
                ],
            }).populate('department');
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: 'Search failed', error: err.message });
        }
    },

    // ============================
    // 📊 إحصائيات الموظف السريعة (جديد)
    // ============================

    async getEmployeeQuickStats(req, res) {
        try {
            const userId = req.user.id;
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            // جلب سجل الحضور
            const attendanceRecords = await Attendance.find({ user: userId });

            // جلب طلبات الإجازة
            const leaveRequests = await LeaveRequest.find({ user: userId });

            // حساب الإحصائيات
            const stats = {
                // إحصائيات الحضور الإجمالية
                totalWorkDays: attendanceRecords.length,
                totalWorkHours: attendanceRecords.reduce((sum, record) =>
                    sum + (record.totalWorkedHours || 0), 0),
                totalOvertimeHours: attendanceRecords.reduce((sum, record) =>
                    sum + (record.overtimeHours || 0), 0),

                // إحصائيات الشهر الحالي
                currentMonthWorkDays: 0,
                currentMonthWorkHours: 0,
                currentMonthOvertimeHours: 0,

                // إحصائيات الإجازات
                totalLeaveRequests: leaveRequests.length,
                pendingLeaveRequests: leaveRequests.filter(l => l.status === 'pending').length,
                approvedLeaveRequests: leaveRequests.filter(l => l.status === 'approved').length,
                rejectedLeaveRequests: leaveRequests.filter(l => l.status === 'rejected').length,

                // إحصائيات إضافية
                averageWorkHours: 0,
                thisWeekWorkDays: 0,
                thisWeekWorkHours: 0
            };

            // حساب إحصائيات الشهر الحالي
            const currentMonthRecords = attendanceRecords.filter(record => {
                const recordDate = new Date(record.date);
                return recordDate.getMonth() === currentMonth &&
                    recordDate.getFullYear() === currentYear;
            });

            stats.currentMonthWorkDays = currentMonthRecords.length;
            stats.currentMonthWorkHours = currentMonthRecords.reduce((sum, record) =>
                sum + (record.totalWorkedHours || 0), 0);
            stats.currentMonthOvertimeHours = currentMonthRecords.reduce((sum, record) =>
                sum + (record.overtimeHours || 0), 0);

            // حساب إحصائيات الأسبوع الحالي
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            const thisWeekRecords = attendanceRecords.filter(record => {
                const recordDate = new Date(record.date);
                return recordDate >= oneWeekAgo;
            });

            stats.thisWeekWorkDays = thisWeekRecords.length;
            stats.thisWeekWorkHours = thisWeekRecords.reduce((sum, record) =>
                sum + (record.totalWorkedHours || 0), 0);

            // حساب متوسط ساعات العمل
            if (stats.totalWorkDays > 0) {
                stats.averageWorkHours = stats.totalWorkHours / stats.totalWorkDays;
            }

            res.json({
                success: true,
                data: stats,
                lastUpdated: new Date().toISOString()
            });

        } catch (err) {
            console.error('Error getting employee quick stats:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to get employee statistics',
                error: err.message
            });
        }
    },

};

module.exports = UserController;
