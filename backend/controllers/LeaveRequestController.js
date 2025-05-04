const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

const LeaveRequestController = {

    // ✅ تقديم طلب إجازة
    async createLeaveRequest(req, res) {
        try {
            const { leaveType, startDate, endDate, reason } = req.body;

            const leave = new LeaveRequest({
                user: req.user.id,
                leaveType,
                startDate,
                endDate,
                reason,
                status: 'pending',
            });

            await leave.save();
            res.status(201).json({ message: 'Leave request submitted', leave });
        } catch (err) {
            res.status(500).json({ message: 'Failed to submit leave request', error: err.message });
        }
    },

    // ✅ إلغاء طلب (مسموح فقط إذا كان الطلب قيد الانتظار)
    async cancelLeaveRequest(req, res) {
        try {
            const leave = await LeaveRequest.findOne({ _id: req.params.id, user: req.user.id });

            if (!leave) {
                return res.status(404).json({ message: 'Leave request not found' });
            }

            if (leave.status !== 'pending') {
                return res.status(400).json({ message: 'Only pending requests can be canceled' });
            }

            await LeaveRequest.deleteOne({ _id: leave._id }); // ✅ الحل الصحيح

            res.json({ message: 'Leave request canceled' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to cancel leave request', error: err.message });
        }
    }
    ,

    // ✅ جلب طلبات الإجازة الخاصة بالمستخدم الحالي
    async getMyLeaveRequests(req, res) {
        try {
            const leaves = await LeaveRequest.find({ user: req.user.id }).sort({ startDate: -1 });
            res.json(leaves);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch leave requests', error: err.message });
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
    }
};

module.exports = LeaveRequestController;
