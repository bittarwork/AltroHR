const Salary = require('../models/Salary');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

const SalaryController = {

    // ✅ توليد راتب لموظف معيّن
    async generateSalaryForUser(req, res) {
        try {
            const { userId, month } = req.body;

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: 'User not found' });

            // جلب الحضور لهذا الشهر
            const attendances = await Attendance.find({
                user: userId,
                date: { $regex: `^${month}` }, // مثل 2025-04
            });

            const totalWorkingHours = attendances.reduce((sum, a) => sum + (a.totalWorkedHours || 0), 0);
            const totalOvertimeHours = attendances.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);

            let base = user.baseSalary || 0;
            let net = 0;
            let overtimePayment = 0;

            if (user.salaryType === 'hourly') {
                base = totalWorkingHours * user.hourlyRate;
            }

            overtimePayment = totalOvertimeHours * (user.overtimeRate || 0);
            net = base + overtimePayment;

            const salary = new Salary({
                user: userId,
                month,
                baseSalary: base,
                totalWorkingHours,
                totalOvertimeHours,
                overtimePayment,
                bonuses: 0,
                deductions: 0,
                netSalary: net,
                isPaid: false,
            });

            await salary.save();
            res.status(201).json({ message: 'Salary generated', salary });
        } catch (err) {
            res.status(500).json({ message: 'Failed to generate salary', error: err.message });
        }
    },

    // ✅ توليد رواتب كل الموظفين لشهر معيّن
    async generateSalaryForAll(req, res) {
        try {
            const { month } = req.body;
            const users = await User.find({ isActive: true });

            const results = [];

            for (const user of users) {
                const attendances = await Attendance.find({
                    user: user._id,
                    date: { $regex: `^${month}` },
                });

                const totalWorkingHours = attendances.reduce((sum, a) => sum + (a.totalWorkedHours || 0), 0);
                const totalOvertimeHours = attendances.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);

                let base = user.baseSalary || 0;
                let net = 0;
                let overtimePayment = 0;

                if (user.salaryType === 'hourly') {
                    base = totalWorkingHours * user.hourlyRate;
                }

                overtimePayment = totalOvertimeHours * (user.overtimeRate || 0);
                net = base + overtimePayment;

                const salary = new Salary({
                    user: user._id,
                    month,
                    baseSalary: base,
                    totalWorkingHours,
                    totalOvertimeHours,
                    overtimePayment,
                    bonuses: 0,
                    deductions: 0,
                    netSalary: net,
                    isPaid: false,
                });

                await salary.save();
                results.push(salary);
            }

            res.status(201).json({ message: 'Salaries generated for all users', salaries: results });
        } catch (err) {
            res.status(500).json({ message: 'Failed to generate salaries', error: err.message });
        }
    },

    // ✅ تعديل الراتب يدويًا (خصم أو مكافأة)
    async updateSalaryManually(req, res) {
        try {
            const { bonuses, deductions } = req.body;
            const salary = await Salary.findById(req.params.id);

            if (!salary) return res.status(404).json({ message: 'Salary not found' });

            salary.bonuses = bonuses || 0;
            salary.deductions = deductions || 0;
            salary.netSalary = (salary.baseSalary + salary.overtimePayment + salary.bonuses) - salary.deductions;

            await salary.save();
            res.json({ message: 'Salary updated', salary });
        } catch (err) {
            res.status(500).json({ message: 'Failed to update salary', error: err.message });
        }
    },

    // ✅ جلب رواتب موظف معيّن
    async getSalariesByUser(req, res) {
        try {
            const salaries = await Salary.find({ user: req.params.id }).sort({ month: -1 });
            res.json(salaries);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch salaries', error: err.message });
        }
    },

    // ✅ عرض راتب محدد
    async getSalaryById(req, res) {
        try {
            const salary = await Salary.findById(req.params.id).populate('user', 'name email position');
            if (!salary) return res.status(404).json({ message: 'Salary not found' });
            res.json(salary);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch salary', error: err.message });
        }
    },

    // ✅ تحديد أن الراتب تم دفعه
    async markSalaryAsPaid(req, res) {
        try {
            const salary = await Salary.findById(req.params.id);
            if (!salary) return res.status(404).json({ message: 'Salary not found' });

            salary.isPaid = true;
            salary.paymentDate = new Date();
            await salary.save();

            res.json({ message: 'Salary marked as paid', salary });
        } catch (err) {
            res.status(500).json({ message: 'Failed to mark as paid', error: err.message });
        }
    }
};

module.exports = SalaryController;
