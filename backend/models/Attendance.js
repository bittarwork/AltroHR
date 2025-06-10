const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
    date: {
        type: String, // YYYY-MM-DD format for better date handling
        required: [true, 'Date is required'],
        validate: {
            validator: function (value) {
                return /^\d{4}-\d{2}-\d{2}$/.test(value);
            },
            message: 'Date must be in YYYY-MM-DD format'
        }
    },
    clockIn: {
        type: Date,
        validate: {
            validator: function (value) {
                if (!value) return true; // optional field
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                return value >= today && value < tomorrow;
            },
            message: 'Clock in time must be today'
        }
    },
    clockOut: {
        type: Date,
        validate: {
            validator: function (value) {
                if (!value || !this.clockIn) return true;
                return value > this.clockIn;
            },
            message: 'Clock out time must be after clock in time'
        }
    },
    totalWorkedHours: {
        type: Number,
        default: 0,
        min: [0, 'Total worked hours cannot be negative'],
        max: [24, 'Total worked hours cannot exceed 24 hours']
    },
    overtimeHours: {
        type: Number,
        default: 0,
        min: [0, 'Overtime hours cannot be negative']
    },
    note: {
        type: String,
        default: '',
        maxlength: [500, 'Note cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'partial'],
        default: function () {
            if (this.clockIn && this.clockOut) return 'present';
            if (this.clockIn && !this.clockOut) return 'partial';
            return 'absent';
        }
    },
    // حقول إضافية مفيدة
    breakDuration: {
        type: Number, // بالدقائق
        default: 0
    },
    effectiveWorkHours: {
        type: Number, // الساعات الفعلية بعد خصم الاستراحة
        default: function () {
            return Math.max(0, this.totalWorkedHours - (this.breakDuration / 60));
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual للحصول على تاريخ مفصل
attendanceSchema.virtual('formattedDate').get(function () {
    try {
        const date = new Date(this.date);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return this.date;
    }
});

// Virtual للحصول على الوقت المنسق
attendanceSchema.virtual('clockInFormatted').get(function () {
    if (!this.clockIn) return null;
    return this.clockIn.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
});

attendanceSchema.virtual('clockOutFormatted').get(function () {
    if (!this.clockOut) return null;
    return this.clockOut.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
});

// Pre-save middleware لحساب الساعات والحالة
attendanceSchema.pre('save', function (next) {
    // حساب إجمالي ساعات العمل
    if (this.clockIn && this.clockOut) {
        const diffMs = this.clockOut - this.clockIn;
        this.totalWorkedHours = Math.round((diffMs / 1000 / 60 / 60) * 100) / 100;

        // حساب الساعات الفعلية بعد خصم الاستراحة
        this.effectiveWorkHours = Math.max(0, this.totalWorkedHours - (this.breakDuration / 60));

        // تحديث الحالة
        this.status = 'present';
    } else if (this.clockIn && !this.clockOut) {
        this.status = 'partial';
    } else {
        this.status = 'absent';
        this.totalWorkedHours = 0;
        this.effectiveWorkHours = 0;
    }

    next();
});

// Index للبحث السريع
attendanceSchema.index({ user: 1, date: -1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
