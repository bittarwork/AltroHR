const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    leaveType: {
        type: String,
        enum: ['annual', 'sick', 'unpaid', 'other'],
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    reason: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    adminComment: {
        type: String,
        default: '',
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // المستخدم الذي راجع الطلب (مدير أو مسؤول HR)
    },
    reviewedAt: {
        type: Date,
    },
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
