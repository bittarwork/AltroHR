const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    month: {
        type: String, // مثل: "2025-04"
        required: true,
    },
    totalWorkingHours: {
        type: Number,
        default: 0,
    },
    totalOvertimeHours: {
        type: Number,
        default: 0,
    },
    baseSalary: {
        type: Number,
        required: true,
    },
    bonuses: {
        type: Number,
        default: 0,
    },
    deductions: {
        type: Number,
        default: 0,
    },
    overtimePayment: {
        type: Number,
        default: 0,
    },
    netSalary: {
        type: Number,
        required: true,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    notes: {
        type: String,
        default: '',
    },
}, { timestamps: true });

module.exports = mongoose.model('Salary', salarySchema);
