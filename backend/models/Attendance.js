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
        type: Number,
        default: 0,
    },
    overtimeHours: {
        type: Number,
        default: 0,
    },
    note: {
        type: String,
        default: '',
    },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
