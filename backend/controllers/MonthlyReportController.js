const MonthlyReport = require('../models/MonthlyReport');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const Salary = require('../models/Salary');
const User = require('../models/User');

const MonthlyReportController = {

    // ✅ توليد تقرير شهري لموظف معين
    async generateReportForUser(req, res) {
        try {
            const { userId, month } = req.body;

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: 'User not found' });

            // جلب السجلات
            const attendance = await Attendance.find({ user: userId, date: { $regex: `^${month}` } });
            const leaves = await LeaveRequest.find({ user: userId, status: 'approved', startDate: { $regex: `^${month}` } });
            const salary = await Salary.findOne({ user: userId, month });

            const totalWorkingDays = attendance.length;
            const daysPresent = attendance.filter(a => a.status === 'present').length;
            const daysAbsent = attendance.filter(a => a.status === 'absent').length;
            const daysOnLeave = leaves.length;

            const totalWorkingHours = attendance.reduce((sum, a) => sum + (a.totalWorkedHours || 0), 0);
            const totalOvertimeHours = attendance.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);

            const report = new MonthlyReport({
                user: userId,
                month,
                totalWorkingDays,
                daysPresent,
                daysAbsent,
                daysOnLeave,
                totalWorkingHours,
                totalOvertimeHours,
                performanceSummary: '',
                rating: 0,
                salaryRef: salary?._id || null,
            });

            await report.save();
            res.status(201).json({ message: 'Monthly report generated', report });

        } catch (err) {
            res.status(500).json({ message: 'Failed to generate report', error: err.message });
        }
    },

    // ✅ توليد تقارير لكل الموظفين
    async generateReportsForAll(req, res) {
        try {
            const { month } = req.body;
            const users = await User.find({ isActive: true });

            const results = [];

            for (const user of users) {
                const attendance = await Attendance.find({ user: user._id, date: { $regex: `^${month}` } });
                const leaves = await LeaveRequest.find({ user: user._id, status: 'approved', startDate: { $regex: `^${month}` } });
                const salary = await Salary.findOne({ user: user._id, month });

                const totalWorkingDays = attendance.length;
                const daysPresent = attendance.filter(a => a.status === 'present').length;
                const daysAbsent = attendance.filter(a => a.status === 'absent').length;
                const daysOnLeave = leaves.length;
                const totalWorkingHours = attendance.reduce((sum, a) => sum + (a.totalWorkedHours || 0), 0);
                const totalOvertimeHours = attendance.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);

                const report = new MonthlyReport({
                    user: user._id,
                    month,
                    totalWorkingDays,
                    daysPresent,
                    daysAbsent,
                    daysOnLeave,
                    totalWorkingHours,
                    totalOvertimeHours,
                    performanceSummary: '',
                    rating: 0,
                    salaryRef: salary?._id || null,
                });

                await report.save();
                results.push(report);
            }

            res.status(201).json({ message: 'Reports generated', reports: results });

        } catch (err) {
            res.status(500).json({ message: 'Failed to generate reports', error: err.message });
        }
    },

    // ✅ جلب تقرير معيّن
    async getReportById(req, res) {
        try {
            const report = await MonthlyReport.findById(req.params.id)
                .populate('user', 'name email department')
                .populate('salaryRef');

            if (!report) return res.status(404).json({ message: 'Report not found' });

            res.json(report);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch report', error: err.message });
        }
    },

    // ✅ جلب كل تقارير موظف معيّن
    async getReportsByUser(req, res) {
        try {
            const reports = await MonthlyReport.find({ user: req.params.id })
                .populate('salaryRef')
                .sort({ month: -1 });

            res.json(reports);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch user reports', error: err.message });
        }
    },

    // ✅ جلب كل التقارير في النظام
    async getAllReports(req, res) {
        try {
            const reports = await MonthlyReport.find()
                .populate('user', 'name email position')
                .populate('salaryRef')
                .sort({ month: -1 });

            res.json(reports);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch all reports', error: err.message });
        }
    }

};

module.exports = MonthlyReportController;
