const mongoose = require('mongoose');

const performanceNoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    noteType: {
        type: String,
        enum: ['positive', 'negative', 'warning', 'commendation'],
        default: 'positive',
    },
    content: {
        type: String,
        required: true,
    },
    relatedMonth: {
        type: String, // "2025-01" مثلاً
        required: true,
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // من أضاف الملاحظة (مدير، HR)
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('PerformanceNote', performanceNoteSchema);
