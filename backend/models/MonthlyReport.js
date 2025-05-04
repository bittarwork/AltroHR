const mongoose = require('mongoose');

const monthlyReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    month: {
        type: String, // "2025-01"
        required: true,
    },
    totalWorkingDays: {
        type: Number,
        default: 0,
    },
    daysPresent: {
        type: Number,
        default: 0,
    },
    daysAbsent: {
        type: Number,
        default: 0,
    },
    daysOnLeave: {
        type: Number,
        default: 0,
    },
    totalWorkingHours: {
        type: Number,
        default: 0,
    },
    totalOvertimeHours: {
        type: Number,
        default: 0,
    },
    performanceSummary: {
        type: String,
        default: '',
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    salaryRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salary',
    },
}, { timestamps: true });

module.exports = mongoose.model('MonthlyReport', monthlyReportSchema);
