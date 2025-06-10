const Attendance = require('../models/Attendance');
const User = require('../models/User');

const AttendanceController = {

    // ✅ تسجيل الحضور (Clock In) محسن
    async clockIn(req, res) {
        try {
            const userId = req.user.id;
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const now = new Date();

            // التحقق من وقت العمل المسموح (اختياري)
            const currentHour = now.getHours();
            if (currentHour < 6 || currentHour > 23) {
                return res.status(400).json({
                    message: 'Clock-in is only allowed between 6:00 AM and 11:00 PM',
                    currentTime: now.toTimeString()
                });
            }

            // تحقق إذا تم تسجيل الدخول سابقًا اليوم
            const existing = await Attendance.findOne({
                user: userId,
                date: today,
            });

            if (existing && existing.clockIn) {
                return res.status(400).json({
                    message: 'You have already clocked in today',
                    clockInTime: existing.clockIn,
                    canClockOut: !existing.clockOut
                });
            }

            try {
                const attendance = existing || new Attendance({
                    user: userId,
                    date: today
                });
                attendance.clockIn = now;
                attendance.status = 'partial'; // جزئي حتى يتم تسجيل الانصراف

                await attendance.save();

                // جلب السجل مع بيانات المستخدم
                const populatedAttendance = await Attendance.findById(attendance._id)
                    .populate('user', 'name email department position');

                res.status(200).json({
                    message: 'Clock-in recorded successfully',
                    attendance: populatedAttendance,
                    nextAction: 'clock-out',
                    summary: {
                        clockInTime: now,
                        date: today,
                        status: 'checked-in'
                    }
                });
            } catch (saveError) {
                console.error('Save error:', saveError);

                if (saveError.name === 'ValidationError') {
                    const validationErrors = Object.values(saveError.errors).map(e => e.message);
                    return res.status(400).json({
                        message: 'Validation failed',
                        errors: validationErrors
                    });
                }

                throw saveError;
            }
        } catch (err) {
            console.error('Clock-in error:', err);
            res.status(500).json({
                message: 'Failed to clock in',
                error: err.message,
                timestamp: new Date().toISOString()
            });
        }
    },

    // ✅ تسجيل الانصراف (Clock Out) محسن
    async clockOut(req, res) {
        try {
            const userId = req.user.id;
            const today = new Date().toISOString().split('T')[0];
            const now = new Date();

            const attendance = await Attendance.findOne({
                user: userId,
                date: today,
            });

            if (!attendance || !attendance.clockIn) {
                return res.status(400).json({
                    message: 'You must clock in first before clocking out',
                    suggestion: 'Please clock in first',
                    canClockIn: true
                });
            }

            if (attendance.clockOut) {
                return res.status(400).json({
                    message: 'You have already clocked out today',
                    clockOutTime: attendance.clockOut,
                    totalWorkedHours: attendance.totalWorkedHours
                });
            }

            // التحقق من الحد الأدنى لوقت العمل (10 دقائق على الأقل)
            const minWorkTime = 10 * 60 * 1000; // 10 دقائق بالميلي ثانية
            const workDuration = now - attendance.clockIn;

            if (workDuration < minWorkTime) {
                return res.status(400).json({
                    message: 'Minimum work duration is 10 minutes',
                    currentDuration: Math.round(workDuration / 1000 / 60) + ' minutes',
                    minimumRequired: '10 minutes'
                });
            }

            try {
                attendance.clockOut = now;

                // حساب عدد الساعات (سيتم تلقائياً في pre-save middleware)
                const diffMs = attendance.clockOut - attendance.clockIn;
                const hours = Math.round((diffMs / 1000 / 60 / 60) * 100) / 100;

                // جلب بيانات المستخدم لحساب الساعات الإضافية
                const user = await User.findById(userId);
                const standardHours = user?.workHoursPerDay || 8;

                if (hours > standardHours) {
                    attendance.overtimeHours = Math.round((hours - standardHours) * 100) / 100;
                } else {
                    attendance.overtimeHours = 0;
                }

                await attendance.save();

                // جلب السجل المحدث مع بيانات المستخدم
                const populatedAttendance = await Attendance.findById(attendance._id)
                    .populate('user', 'name email department position');

                res.status(200).json({
                    message: 'Clock-out recorded successfully',
                    attendance: populatedAttendance,
                    summary: {
                        clockInTime: attendance.clockIn,
                        clockOutTime: attendance.clockOut,
                        totalWorkedHours: attendance.totalWorkedHours,
                        overtimeHours: attendance.overtimeHours,
                        effectiveWorkHours: attendance.effectiveWorkHours,
                        status: attendance.status,
                        date: today
                    },
                    workSummary: {
                        regularHours: Math.min(hours, standardHours),
                        overtimeHours: attendance.overtimeHours,
                        totalHours: hours,
                        workDay: hours >= 4 ? 'full' : 'partial'
                    }
                });
            } catch (saveError) {
                console.error('Save error:', saveError);

                if (saveError.name === 'ValidationError') {
                    const validationErrors = Object.values(saveError.errors).map(e => e.message);
                    return res.status(400).json({
                        message: 'Validation failed',
                        errors: validationErrors
                    });
                }

                throw saveError;
            }
        } catch (err) {
            console.error('Clock-out error:', err);
            res.status(500).json({
                message: 'Failed to clock out',
                error: err.message,
                timestamp: new Date().toISOString()
            });
        }
    },

    // ✅ جلب سجل الحضور للمستخدم الحالي محسن
    async getMyAttendance(req, res) {
        try {
            const userId = req.user.id;
            const {
                page = 1,
                limit = 50,
                month,
                year,
                status,
                startDate,
                endDate
            } = req.query;

            // بناء فلتر البحث
            const filter = { user: userId };

            // فلترة حسب الشهر والسنة
            if (month && year) {
                const startOfMonth = `${year}-${month.padStart(2, '0')}-01`;
                const endOfMonth = new Date(year, month, 0).getDate();
                const endOfMonthStr = `${year}-${month.padStart(2, '0')}-${endOfMonth.toString().padStart(2, '0')}`;
                filter.date = { $gte: startOfMonth, $lte: endOfMonthStr };
            }

            // فلترة حسب تاريخ البداية والنهاية
            if (startDate && endDate) {
                filter.date = { $gte: startDate, $lte: endDate };
            }

            // فلترة حسب الحالة
            if (status && ['present', 'absent', 'partial'].includes(status)) {
                filter.status = status;
            }

            // حساب pagination
            const skip = (parseInt(page) - 1) * parseInt(limit);

            // جلب السجلات مع العد الإجمالي
            const [records, totalCount] = await Promise.all([
                Attendance.find(filter)
                    .sort({ date: -1, clockIn: -1 })
                    .skip(skip)
                    .limit(parseInt(limit))
                    .populate('user', 'name email department position'),
                Attendance.countDocuments(filter)
            ]);

            // حساب الإحصائيات
            const stats = await AttendanceController.calculateAttendanceStats(userId, filter);

            res.json({
                records,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / parseInt(limit)),
                    totalRecords: totalCount,
                    hasNextPage: skip + records.length < totalCount,
                    hasPrevPage: parseInt(page) > 1
                },
                statistics: stats,
                filters: { month, year, status, startDate, endDate }
            });
        } catch (err) {
            console.error('Get my attendance error:', err);
            res.status(500).json({
                message: 'Failed to fetch attendance records',
                error: err.message,
                timestamp: new Date().toISOString()
            });
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
    },

    // ✅ جلب حالة الحضور اليوم للمستخدم الحالي محسن
    async getTodayStatus(req, res) {
        try {
            const userId = req.user.id;
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const now = new Date();

            const attendance = await Attendance.findOne({
                user: userId,
                date: today,
            });

            // جلب بيانات المستخدم للإعدادات
            const user = await User.findById(userId);
            const standardWorkHours = user?.workHoursPerDay || 8;

            // حساب ساعات العمل الجارية إذا تم الحضور ولم يتم الانصراف
            let currentWorkHours = 0;
            if (attendance && attendance.clockIn && !attendance.clockOut) {
                const diffMs = now - attendance.clockIn;
                currentWorkHours = Math.round((diffMs / 1000 / 60 / 60) * 100) / 100;
            }

            const status = {
                date: today,
                dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
                currentTime: now.toISOString(),

                // الحالة الأساسية
                hasAttendance: !!attendance,
                clockedIn: !!(attendance && attendance.clockIn),
                clockedOut: !!(attendance && attendance.clockOut),
                status: attendance?.status || 'absent',

                // الأوقات
                clockInTime: attendance?.clockIn || null,
                clockOutTime: attendance?.clockOut || null,
                clockInFormatted: attendance?.clockInFormatted || null,
                clockOutFormatted: attendance?.clockOutFormatted || null,

                // الساعات
                totalWorkedHours: attendance?.totalWorkedHours || 0,
                overtimeHours: attendance?.overtimeHours || 0,
                effectiveWorkHours: attendance?.effectiveWorkHours || 0,
                currentWorkHours, // الساعات الجارية
                remainingHours: Math.max(0, standardWorkHours - currentWorkHours),

                // الإجراءات المتاحة
                canClockIn: !attendance || !attendance.clockIn,
                canClockOut: !!(attendance && attendance.clockIn && !attendance.clockOut),

                // معلومات إضافية
                workingStatus: AttendanceController.getWorkingStatus(attendance, currentWorkHours, standardWorkHours),
                settings: {
                    standardWorkHours,
                    allowedClockInHours: { start: 6, end: 23 }
                },

                // إحصائيات سريعة
                weekSummary: await AttendanceController.getWeekSummary(userId),
                monthSummary: await AttendanceController.getMonthSummary(userId)
            };

            res.json(status);
        } catch (err) {
            console.error('Get today status error:', err);
            res.status(500).json({
                message: 'Failed to fetch today status',
                error: err.message,
                timestamp: new Date().toISOString()
            });
        }
    },

    // ✅ دالة مساعدة لحساب الإحصائيات
    async calculateAttendanceStats(userId, filter = {}) {
        try {
            const baseFilter = { user: userId, ...filter };

            const stats = await Attendance.aggregate([
                { $match: baseFilter },
                {
                    $group: {
                        _id: null,
                        totalDays: { $sum: 1 },
                        presentDays: {
                            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
                        },
                        partialDays: {
                            $sum: { $cond: [{ $eq: ['$status', 'partial'] }, 1, 0] }
                        },
                        absentDays: {
                            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] }
                        },
                        totalHours: { $sum: '$totalWorkedHours' },
                        totalOvertimeHours: { $sum: '$overtimeHours' },
                        totalEffectiveHours: { $sum: '$effectiveWorkHours' },
                        avgHoursPerDay: { $avg: '$totalWorkedHours' }
                    }
                }
            ]);

            const result = stats[0] || {
                totalDays: 0, presentDays: 0, partialDays: 0, absentDays: 0,
                totalHours: 0, totalOvertimeHours: 0, totalEffectiveHours: 0, avgHoursPerDay: 0
            };

            return {
                ...result,
                attendanceRate: result.totalDays > 0 ?
                    Math.round((result.presentDays / result.totalDays) * 100) : 0,
                avgHoursPerDay: Math.round((result.avgHoursPerDay || 0) * 100) / 100
            };
        } catch (error) {
            console.error('Calculate stats error:', error);
            return {
                totalDays: 0, presentDays: 0, partialDays: 0, absentDays: 0,
                totalHours: 0, totalOvertimeHours: 0, totalEffectiveHours: 0,
                avgHoursPerDay: 0, attendanceRate: 0
            };
        }
    },

    // ✅ دالة لتحديد حالة العمل الحالية
    getWorkingStatus(attendance, currentHours, standardHours) {
        if (!attendance || !attendance.clockIn) {
            return { status: 'not_started', message: 'لم يبدأ العمل اليوم' };
        }

        if (attendance.clockOut) {
            return {
                status: 'completed',
                message: 'تم إنهاء العمل اليوم',
                completionTime: attendance.clockOut
            };
        }

        if (currentHours >= standardHours) {
            return {
                status: 'overtime',
                message: 'يعمل ساعات إضافية',
                overtimeHours: Math.round((currentHours - standardHours) * 100) / 100
            };
        }

        return {
            status: 'working',
            message: 'يعمل حالياً',
            remainingHours: Math.round((standardHours - currentHours) * 100) / 100
        };
    },

    // ✅ ملخص الأسبوع
    async getWeekSummary(userId) {
        try {
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            const weekFilter = {
                user: userId,
                date: {
                    $gte: startOfWeek.toISOString().split('T')[0],
                    $lte: endOfWeek.toISOString().split('T')[0]
                }
            };

            return await AttendanceController.calculateAttendanceStats(userId, weekFilter);
        } catch (error) {
            return { totalDays: 0, presentDays: 0, totalHours: 0 };
        }
    },

    // ✅ ملخص الشهر
    async getMonthSummary(userId) {
        try {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1;
            const startOfMonth = `${year}-${month.toString().padStart(2, '0')}-01`;
            const endOfMonth = new Date(year, month, 0).getDate();
            const endOfMonthStr = `${year}-${month.toString().padStart(2, '0')}-${endOfMonth.toString().padStart(2, '0')}`;

            const monthFilter = {
                user: userId,
                date: { $gte: startOfMonth, $lte: endOfMonthStr }
            };

            return await AttendanceController.calculateAttendanceStats(userId, monthFilter);
        } catch (error) {
            return { totalDays: 0, presentDays: 0, totalHours: 0 };
        }
    },

    // 📊 الإحصائيات الشخصية للموظف
    async getMyStats(req, res) {
        try {
            const userId = req.user.id;
            const { period = 'month' } = req.query; // month, quarter, year

            let dateFilter = {};
            const today = new Date();

            switch (period) {
                case 'week':
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - today.getDay());
                    dateFilter = {
                        date: {
                            $gte: startOfWeek.toISOString().split('T')[0],
                            $lte: today.toISOString().split('T')[0]
                        }
                    };
                    break;

                case 'quarter':
                    const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
                    dateFilter = {
                        date: {
                            $gte: quarterStart.toISOString().split('T')[0],
                            $lte: today.toISOString().split('T')[0]
                        }
                    };
                    break;

                case 'year':
                    const yearStart = new Date(today.getFullYear(), 0, 1);
                    dateFilter = {
                        date: {
                            $gte: yearStart.toISOString().split('T')[0],
                            $lte: today.toISOString().split('T')[0]
                        }
                    };
                    break;

                default: // month
                    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                    dateFilter = {
                        date: {
                            $gte: monthStart.toISOString().split('T')[0],
                            $lte: today.toISOString().split('T')[0]
                        }
                    };
            }

            const stats = await AttendanceController.calculateAttendanceStats(userId, dateFilter);

            res.json({
                period,
                periodLabel: this.getPeriodLabel(period),
                stats,
                generatedAt: new Date().toISOString()
            });
        } catch (err) {
            console.error('Get my stats error:', err);
            res.status(500).json({
                message: 'Failed to fetch statistics',
                error: err.message
            });
        }
    },

    // 📅 تقرير شهري مفصل للموظف
    async getMyMonthlyReport(req, res) {
        try {
            const userId = req.user.id;
            const { year, month } = req.params;

            if (!year || !month || month < 1 || month > 12) {
                return res.status(400).json({
                    message: 'Invalid year or month parameter'
                });
            }

            const startOfMonth = `${year}-${month.padStart(2, '0')}-01`;
            const endOfMonth = new Date(year, month, 0).getDate();
            const endOfMonthStr = `${year}-${month.padStart(2, '0')}-${endOfMonth.toString().padStart(2, '0')}`;

            const filter = {
                user: userId,
                date: { $gte: startOfMonth, $lte: endOfMonthStr }
            };

            const [records, stats] = await Promise.all([
                Attendance.find(filter).sort({ date: 1 }),
                AttendanceController.calculateAttendanceStats(userId, filter)
            ]);

            // تجميع البيانات حسب الأسبوع
            const weeklyBreakdown = AttendanceController.groupByWeek(records, parseInt(year), parseInt(month));

            res.json({
                period: { year: parseInt(year), month: parseInt(month) },
                monthName: new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long' }),
                totalDaysInMonth: endOfMonth,
                records,
                statistics: stats,
                weeklyBreakdown,
                generatedAt: new Date().toISOString()
            });
        } catch (err) {
            console.error('Get monthly report error:', err);
            res.status(500).json({
                message: 'Failed to fetch monthly report',
                error: err.message
            });
        }
    },

    // 📊 تقرير أسبوعي للموظف
    async getMyWeeklyReport(req, res) {
        try {
            const userId = req.user.id;
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            const filter = {
                user: userId,
                date: {
                    $gte: startOfWeek.toISOString().split('T')[0],
                    $lte: endOfWeek.toISOString().split('T')[0]
                }
            };

            const [records, stats] = await Promise.all([
                Attendance.find(filter).sort({ date: 1 }),
                AttendanceController.calculateAttendanceStats(userId, filter)
            ]);

            // إنشاء مصفوفة أيام الأسبوع
            const weekDays = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(startOfWeek);
                date.setDate(startOfWeek.getDate() + i);
                const dateStr = date.toISOString().split('T')[0];
                const dayRecord = records.find(r => r.date === dateStr);

                weekDays.push({
                    date: dateStr,
                    dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
                    attendance: dayRecord || null,
                    status: dayRecord?.status || 'absent'
                });
            }

            res.json({
                weekPeriod: {
                    startDate: startOfWeek.toISOString().split('T')[0],
                    endDate: endOfWeek.toISOString().split('T')[0]
                },
                weekDays,
                statistics: stats,
                generatedAt: new Date().toISOString()
            });
        } catch (err) {
            console.error('Get weekly report error:', err);
            res.status(500).json({
                message: 'Failed to fetch weekly report',
                error: err.message
            });
        }
    },

    // 🔧 دوال مساعدة
    getPeriodLabel(period) {
        const labels = {
            week: 'هذا الأسبوع',
            month: 'هذا الشهر',
            quarter: 'هذا الربع',
            year: 'هذا العام'
        };
        return labels[period] || 'فترة غير محددة';
    },

    groupByWeek(records, year, month) {
        const weeks = [];
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);

        let weekStart = new Date(firstDay);
        weekStart.setDate(firstDay.getDate() - firstDay.getDay());

        while (weekStart <= lastDay) {
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            const weekRecords = records.filter(record => {
                const recordDate = new Date(record.date);
                return recordDate >= weekStart && recordDate <= weekEnd;
            });

            weeks.push({
                weekNumber: weeks.length + 1,
                startDate: weekStart.toISOString().split('T')[0],
                endDate: weekEnd.toISOString().split('T')[0],
                records: weekRecords,
                totalDays: weekRecords.length,
                totalHours: weekRecords.reduce((sum, r) => sum + (r.totalWorkedHours || 0), 0)
            });

            weekStart.setDate(weekStart.getDate() + 7);
        }

        return weeks;
    },

    // 📊 تقارير الإدارة - ملخص الحضور العام
    async getAttendanceSummary(req, res) {
        try {
            const { startDate, endDate, department } = req.query;

            let filter = {};
            if (startDate && endDate) {
                filter.date = { $gte: startDate, $lte: endDate };
            }

            // إحصائيات عامة
            const totalStats = await Attendance.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: null,
                        totalRecords: { $sum: 1 },
                        totalHours: { $sum: '$totalWorkedHours' },
                        totalOvertimeHours: { $sum: '$overtimeHours' },
                        presentDays: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
                        partialDays: { $sum: { $cond: [{ $eq: ['$status', 'partial'] }, 1, 0] } },
                        absentDays: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } }
                    }
                }
            ]);

            // إحصائيات حسب المستخدم
            const userStats = await Attendance.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: '$user',
                        totalDays: { $sum: 1 },
                        totalHours: { $sum: '$totalWorkedHours' },
                        presentDays: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                { $sort: { totalHours: -1 } },
                { $limit: 10 }
            ]);

            res.json({
                summary: totalStats[0] || {
                    totalRecords: 0, totalHours: 0, totalOvertimeHours: 0,
                    presentDays: 0, partialDays: 0, absentDays: 0
                },
                topPerformers: userStats,
                generatedAt: new Date().toISOString(),
                period: { startDate, endDate }
            });
        } catch (err) {
            console.error('Get attendance summary error:', err);
            res.status(500).json({
                message: 'Failed to fetch attendance summary',
                error: err.message
            });
        }
    },

    // 📈 تحليلات الحضور المتقدمة
    async getAttendanceAnalytics(req, res) {
        try {
            const { period = 'month' } = req.query;

            let groupBy = {};
            let sortBy = {};

            switch (period) {
                case 'week':
                    groupBy = {
                        year: { $year: { $dateFromString: { dateString: '$date' } } },
                        week: { $week: { $dateFromString: { dateString: '$date' } } }
                    };
                    sortBy = { '_id.year': -1, '_id.week': -1 };
                    break;
                case 'year':
                    groupBy = {
                        year: { $year: { $dateFromString: { dateString: '$date' } } }
                    };
                    sortBy = { '_id.year': -1 };
                    break;
                default: // month
                    groupBy = {
                        year: { $year: { $dateFromString: { dateString: '$date' } } },
                        month: { $month: { $dateFromString: { dateString: '$date' } } }
                    };
                    sortBy = { '_id.year': -1, '_id.month': -1 };
            }

            const analytics = await Attendance.aggregate([
                {
                    $group: {
                        _id: groupBy,
                        totalRecords: { $sum: 1 },
                        totalHours: { $sum: '$totalWorkedHours' },
                        avgHours: { $avg: '$totalWorkedHours' },
                        totalOvertimeHours: { $sum: '$overtimeHours' },
                        presentCount: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
                        partialCount: { $sum: { $cond: [{ $eq: ['$status', 'partial'] }, 1, 0] } },
                        absentCount: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } }
                    }
                },
                { $sort: sortBy },
                { $limit: 12 }
            ]);

            res.json({
                period,
                analytics,
                generatedAt: new Date().toISOString()
            });
        } catch (err) {
            console.error('Get attendance analytics error:', err);
            res.status(500).json({
                message: 'Failed to fetch attendance analytics',
                error: err.message
            });
        }
    }
};

module.exports = AttendanceController;
