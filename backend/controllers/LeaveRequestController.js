const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

const LeaveRequestController = {

    // ✅ تقديم طلب إجازة محسن
    async createLeaveRequest(req, res) {
        try {
            const { leaveType, startDate, endDate, reason } = req.body;

            // التحقق من المدخلات
            if (!leaveType || !startDate || !endDate) {
                return res.status(400).json({
                    message: 'Leave type, start date, and end date are required',
                    missingFields: {
                        leaveType: !leaveType,
                        startDate: !startDate,
                        endDate: !endDate
                    }
                });
            }

            // التحقق من صحة التواريخ
            const start = new Date(startDate);
            const end = new Date(endDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (start < today) {
                return res.status(400).json({
                    message: 'Start date cannot be in the past'
                });
            }

            if (end < start) {
                return res.status(400).json({
                    message: 'End date must be after or equal to start date'
                });
            }

            // حساب عدد الأيام
            const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

            if (totalDays > 90) {
                return res.status(400).json({
                    message: 'Leave request cannot exceed 90 days',
                    requestedDays: totalDays,
                    maxAllowed: 90
                });
            }

            // التحقق من عدم وجود إجازات متداخلة
            const overlappingLeaves = await LeaveRequest.find({
                user: req.user.id,
                status: { $in: ['pending', 'approved'] },
                $or: [
                    {
                        $and: [
                            { startDate: { $lte: start } },
                            { endDate: { $gte: start } }
                        ]
                    },
                    {
                        $and: [
                            { startDate: { $lte: end } },
                            { endDate: { $gte: end } }
                        ]
                    },
                    {
                        $and: [
                            { startDate: { $gte: start } },
                            { endDate: { $lte: end } }
                        ]
                    }
                ]
            });

            if (overlappingLeaves.length > 0) {
                return res.status(400).json({
                    message: 'Leave request overlaps with existing leave request',
                    overlappingLeaves: overlappingLeaves.map(leave => ({
                        id: leave._id,
                        startDate: leave.startDate,
                        endDate: leave.endDate,
                        status: leave.status
                    }))
                });
            }

            // إنشاء الطلب
            const leave = new LeaveRequest({
                user: req.user.id,
                leaveType,
                startDate: start,
                endDate: end,
                reason: reason || '',
                status: 'pending',
                totalDays
            });

            await leave.save();

            // جلب الطلب مع بيانات المستخدم
            const populatedLeave = await LeaveRequest.findById(leave._id)
                .populate('user', 'name email department position');

            res.status(201).json({
                message: 'Leave request submitted successfully',
                leave: populatedLeave,
                summary: {
                    totalDays,
                    leaveType,
                    status: 'pending'
                }
            });
        } catch (err) {
            console.error('Create leave request error:', err);

            // معالجة أخطاء التحقق من النموذج
            if (err.name === 'ValidationError') {
                const validationErrors = Object.values(err.errors).map(e => e.message);
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: validationErrors
                });
            }

            res.status(500).json({
                message: 'Failed to submit leave request',
                error: err.message
            });
        }
    },

    // ✅ إلغاء طلب إجازة محسن
    async cancelLeaveRequest(req, res) {
        try {
            // التحقق من صحة معرف الطلب
            if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ message: 'Invalid leave request ID' });
            }

            const leave = await LeaveRequest.findOne({
                _id: req.params.id,
                user: req.user.id
            });

            if (!leave) {
                return res.status(404).json({
                    message: 'Leave request not found or you do not have permission to cancel it'
                });
            }

            if (leave.status !== 'pending') {
                return res.status(400).json({
                    message: 'Only pending requests can be canceled',
                    currentStatus: leave.status,
                    allowedStatus: 'pending'
                });
            }

            // التحقق من أن تاريخ البداية لم يبدأ بعد
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (leave.startDate <= today) {
                return res.status(400).json({
                    message: 'Cannot cancel leave request that has already started or is starting today'
                });
            }

            // حفظ بيانات الطلب قبل الحذف للمراجعة
            const canceledLeave = {
                id: leave._id,
                leaveType: leave.leaveType,
                startDate: leave.startDate,
                endDate: leave.endDate,
                totalDays: leave.totalDays,
                reason: leave.reason
            };

            await LeaveRequest.deleteOne({ _id: leave._id });

            res.json({
                message: 'Leave request canceled successfully',
                canceledLeave
            });
        } catch (err) {
            console.error('Cancel leave request error:', err);
            res.status(500).json({
                message: 'Failed to cancel leave request',
                error: err.message
            });
        }
    },

    // ✅ جلب طلبات الإجازة الخاصة بالمستخدم الحالي محسن
    async getMyLeaveRequests(req, res) {
        try {
            // استخراج معايير الفلترة من query parameters
            const {
                status,
                leaveType,
                startDate,
                endDate,
                page = 1,
                limit = 10,
                sortBy = 'startDate',
                sortOrder = 'desc'
            } = req.query;

            // إنشاء فلتر البحث
            const filter = { user: req.user.id };

            if (status && status !== 'all') {
                filter.status = status;
            }

            if (leaveType && leaveType !== 'all') {
                filter.leaveType = leaveType;
            }

            if (startDate || endDate) {
                filter.startDate = {};
                if (startDate) {
                    filter.startDate.$gte = new Date(startDate);
                }
                if (endDate) {
                    filter.startDate.$lte = new Date(endDate);
                }
            }

            // إنشاء الترتيب
            const sort = {};
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

            // حساب pagination
            const skip = (page - 1) * limit;

            // جلب البيانات
            const [leaves, totalCount] = await Promise.all([
                LeaveRequest.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(parseInt(limit))
                    .populate('reviewedBy', 'name email'),
                LeaveRequest.countDocuments(filter)
            ]);

            // حساب الإحصائيات
            const stats = await LeaveRequest.aggregate([
                { $match: { user: req.user._id } },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalDays: { $sum: '$totalDays' }
                    }
                }
            ]);

            const statsMap = stats.reduce((acc, stat) => {
                acc[stat._id] = {
                    count: stat.count,
                    totalDays: stat.totalDays
                };
                return acc;
            }, {});

            // حساب pagination info
            const totalPages = Math.ceil(totalCount / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;

            res.json({
                leaves,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalCount,
                    hasNextPage,
                    hasPrevPage,
                    limit: parseInt(limit)
                },
                statistics: {
                    pending: statsMap.pending || { count: 0, totalDays: 0 },
                    approved: statsMap.approved || { count: 0, totalDays: 0 },
                    rejected: statsMap.rejected || { count: 0, totalDays: 0 },
                    total: {
                        count: totalCount,
                        totalDays: Object.values(statsMap).reduce((sum, stat) => sum + stat.totalDays, 0)
                    }
                },
                filters: {
                    status,
                    leaveType,
                    startDate,
                    endDate
                }
            });
        } catch (err) {
            console.error('Get my leave requests error:', err);
            res.status(500).json({
                message: 'Failed to fetch leave requests',
                error: err.message
            });
        }
    },

    // ✅ جلب كل طلبات الإجازة (للإدارة)
    async getAllLeaveRequests(req, res) {
        try {
            const leaves = await LeaveRequest.find()
                .populate('user', 'name email department position')
                .sort({ startDate: -1 });

            res.json(leaves);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch all leave requests', error: err.message });
        }
    },

    // ✅ جلب طلب معين حسب الـ ID
    async getLeaveRequestById(req, res) {
        try {
            const leave = await LeaveRequest.findById(req.params.id)
                .populate('user', 'name email department position reviewedBy');

            if (!leave) return res.status(404).json({ message: 'Leave request not found' });

            // فقط المدير أو الموظف صاحب الطلب يمكنه الوصول
            if (req.user.role === 'employee' && leave.user._id.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Access denied' });
            }

            res.json(leave);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch leave request', error: err.message });
        }
    },

    // ✅ جلب طلبات موظف معين (للإدارة)
    async getLeaveRequestsByUser(req, res) {
        try {
            const leaves = await LeaveRequest.find({ user: req.params.id })
                .sort({ startDate: -1 })
                .populate('user', 'name email department position');

            res.json(leaves);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch user leave requests', error: err.message });
        }
    },

    // ✅ مراجعة الطلب (موافقة أو رفض) من قبل الإدارة
    async reviewLeaveRequest(req, res) {
        try {
            const { status, adminComment } = req.body;

            if (!['approved', 'rejected'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status value' });
            }

            const leave = await LeaveRequest.findById(req.params.id);
            if (!leave) return res.status(404).json({ message: 'Leave request not found' });

            if (leave.status !== 'pending') {
                return res.status(400).json({ message: 'This request has already been reviewed' });
            }

            leave.status = status;
            leave.adminComment = adminComment || '';
            leave.reviewedBy = req.user.id;
            leave.reviewedAt = new Date();

            await leave.save();
            res.json({ message: `Leave request ${status}`, leave });
        } catch (err) {
            res.status(500).json({ message: 'Failed to review leave request', error: err.message });
        }
    },

    // 🆕 جلب إحصائيات الإجازات للموظف
    async getMyLeaveStatistics(req, res) {
        try {
            const { year = new Date().getFullYear() } = req.query;

            const stats = await LeaveRequest.aggregate([
                {
                    $match: {
                        user: req.user._id,
                        $expr: {
                            $eq: [{ $year: '$startDate' }, parseInt(year)]
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            status: '$status',
                            leaveType: '$leaveType'
                        },
                        count: { $sum: 1 },
                        totalDays: { $sum: '$totalDays' }
                    }
                }
            ]);

            // تنظيم البيانات
            const organized = {
                byStatus: {
                    pending: { count: 0, totalDays: 0 },
                    approved: { count: 0, totalDays: 0 },
                    rejected: { count: 0, totalDays: 0 }
                },
                byType: {},
                totalRequests: 0,
                totalDaysRequested: 0,
                totalDaysApproved: 0
            };

            stats.forEach(stat => {
                const { status, leaveType } = stat._id;

                // إحصائيات حسب الحالة
                if (organized.byStatus[status]) {
                    organized.byStatus[status].count += stat.count;
                    organized.byStatus[status].totalDays += stat.totalDays;
                }

                // إحصائيات حسب النوع
                if (!organized.byType[leaveType]) {
                    organized.byType[leaveType] = { count: 0, totalDays: 0 };
                }
                organized.byType[leaveType].count += stat.count;
                organized.byType[leaveType].totalDays += stat.totalDays;

                // الإجماليات
                organized.totalRequests += stat.count;
                organized.totalDaysRequested += stat.totalDays;

                if (status === 'approved') {
                    organized.totalDaysApproved += stat.totalDays;
                }
            });

            res.json({
                year: parseInt(year),
                statistics: organized
            });
        } catch (err) {
            console.error('Get leave statistics error:', err);
            res.status(500).json({
                message: 'Failed to fetch leave statistics',
                error: err.message
            });
        }
    },

    // 🆕 التحقق من توفر التواريخ للإجازة
    async checkAvailability(req, res) {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({
                    message: 'Start date and end date are required'
                });
            }

            const start = new Date(startDate);
            const end = new Date(endDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // التحقق من التواريخ المتداخلة
            const overlappingLeaves = await LeaveRequest.find({
                user: req.user.id,
                status: { $in: ['pending', 'approved'] },
                $or: [
                    {
                        $and: [
                            { startDate: { $lte: start } },
                            { endDate: { $gte: start } }
                        ]
                    },
                    {
                        $and: [
                            { startDate: { $lte: end } },
                            { endDate: { $gte: end } }
                        ]
                    },
                    {
                        $and: [
                            { startDate: { $gte: start } },
                            { endDate: { $lte: end } }
                        ]
                    }
                ]
            });

            const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

            res.json({
                available: overlappingLeaves.length === 0 && start >= today && end >= start && totalDays <= 90,
                totalDays,
                conflicts: overlappingLeaves.map(leave => ({
                    id: leave._id,
                    startDate: leave.startDate,
                    endDate: leave.endDate,
                    leaveType: leave.leaveType,
                    status: leave.status
                })),
                validations: {
                    validDates: start >= today && end >= start,
                    noConflicts: overlappingLeaves.length === 0,
                    withinLimit: totalDays <= 90,
                    startDateNotPast: start >= today,
                    endDateAfterStart: end >= start
                }
            });
        } catch (err) {
            console.error('Check availability error:', err);
            res.status(500).json({
                message: 'Failed to check availability',
                error: err.message
            });
        }
    },

    // 🆕 جلب تقرير شهري للإجازات
    async getMonthlyReport(req, res) {
        try {
            const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query;

            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);

            const leaves = await LeaveRequest.find({
                user: req.user.id,
                $or: [
                    {
                        $and: [
                            { startDate: { $gte: startDate } },
                            { startDate: { $lte: endDate } }
                        ]
                    },
                    {
                        $and: [
                            { endDate: { $gte: startDate } },
                            { endDate: { $lte: endDate } }
                        ]
                    },
                    {
                        $and: [
                            { startDate: { $lte: startDate } },
                            { endDate: { $gte: endDate } }
                        ]
                    }
                ]
            }).sort({ startDate: 1 });

            const report = {
                month: parseInt(month),
                year: parseInt(year),
                totalRequests: leaves.length,
                pendingRequests: leaves.filter(l => l.status === 'pending').length,
                approvedRequests: leaves.filter(l => l.status === 'approved').length,
                rejectedRequests: leaves.filter(l => l.status === 'rejected').length,
                totalDaysRequested: leaves.reduce((sum, leave) => sum + leave.totalDays, 0),
                approvedDays: leaves.filter(l => l.status === 'approved').reduce((sum, leave) => sum + leave.totalDays, 0),
                leaves: leaves
            };

            res.json(report);
        } catch (err) {
            console.error('Get monthly report error:', err);
            res.status(500).json({
                message: 'Failed to fetch monthly report',
                error: err.message
            });
        }
    }
};

module.exports = LeaveRequestController;
