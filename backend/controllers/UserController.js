// src/controllers/UserController.js

const User = require('../models/User');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const PerformanceNote = require('../models/PerformanceNote');
const MonthlyReport = require('../models/MonthlyReport');
const Salary = require('../models/Salary');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
            res.json(user);
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

    // ============================
    // 🧾 إدارة المستخدمين (CRUD)
    // ============================

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
            const users = await User.find().populate('department');
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch users', error: err.message });
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


};

module.exports = UserController;
