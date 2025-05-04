const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    clockIn: {
        type: Date,
    },
    clockOut: {
        type: Date,
    },
    totalWorkedHours: {
        type: Number, // عدد ساعات العمل المحسوبة في اليوم
        default: 0,
    },
    overtimeHours: {
        type: Number, // الساعات الزائدة عن العمل الرسمي
        default: 0,
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'on_leave'],
        default: 'present',
    },
    note: {
        type: String,
        default: '',
    },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
