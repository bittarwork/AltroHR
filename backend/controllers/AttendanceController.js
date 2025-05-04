const Attendance = require('../models/Attendance');
const User = require('../models/User');

const AttendanceController = {

    // ✅ تسجيل الحضور (Clock In)
    async clockIn(req, res) {
        try {
            const userId = req.user.id;
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            // تحقق إذا تم تسجيل الدخول سابقًا اليوم
            const existing = await Attendance.findOne({
                user: userId,
                date: today,
            });

            if (existing && existing.clockIn) {
                return res.status(400).json({ message: 'You already clocked in today' });
            }

            const attendance = existing || new Attendance({ user: userId, date: today });
            attendance.clockIn = new Date();

            await attendance.save();
            res.status(200).json({ message: 'Clock-in recorded', attendance });
        } catch (err) {
            res.status(500).json({ message: 'Failed to clock in', error: err.message });
        }
    },

    // ✅ تسجيل الانصراف (Clock Out)
    async clockOut(req, res) {
        try {
            const userId = req.user.id;
            const today = new Date().toISOString().split('T')[0];

            const attendance = await Attendance.findOne({
                user: userId,
                date: today,
            });

            if (!attendance || !attendance.clockIn) {
                return res.status(400).json({ message: 'You must clock in first' });
            }

            if (attendance.clockOut) {
                return res.status(400).json({ message: 'You already clocked out today' });
            }

            attendance.clockOut = new Date();

            // حساب عدد الساعات
            const diffMs = attendance.clockOut - attendance.clockIn;
            const hours = Math.round((diffMs / 1000 / 60 / 60) * 100) / 100;
            attendance.totalWorkedHours = hours;

            // حساب الساعات الإضافية إذا تجاوز العمل اليومي
            const user = await User.findById(userId);
            const standard = user?.workHoursPerDay || 8;

            if (hours > standard) {
                attendance.overtimeHours = Math.round((hours - standard) * 100) / 100;
            }

            await attendance.save();
            res.status(200).json({ message: 'Clock-out recorded', attendance });
        } catch (err) {
            res.status(500).json({ message: 'Failed to clock out', error: err.message });
        }
    },

    // ✅ جلب سجل الحضور للمستخدم الحالي
    async getMyAttendance(req, res) {
        try {
            const records = await Attendance.find({ user: req.user.id }).sort({ date: -1 });
            res.json(records);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch attendance', error: err.message });
        }
    },

    // ✅ جلب سجل الحضور لموظف معيّن (للإدارة)
    async getUserAttendance(req, res) {
        try {
            const records = await Attendance.find({ user: req.params.id }).sort({ date: -1 });
            res.json(records);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch user attendance', error: err.message });
        }
    },

    // ✅ جلب سجل الحضور الكامل (للإدارة)
    async getAllAttendance(req, res) {
        try {
            const records = await Attendance.find()
                .populate('user', 'name email department position')
                .sort({ date: -1 });
            res.json(records);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch all attendance', error: err.message });
        }
    },

    // ✅ جلب الحضور حسب التاريخ
    async getAttendanceByDate(req, res) {
        try {
            const date = req.query.date;
            if (!date) return res.status(400).json({ message: 'Please provide a date in YYYY-MM-DD format' });

            const records = await Attendance.find({ date }).populate('user', 'name email department position');
            res.json(records);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch attendance by date', error: err.message });
        }
    }
};

module.exports = AttendanceController;
