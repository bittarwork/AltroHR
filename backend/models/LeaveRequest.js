const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
    leaveType: {
        type: String,
        enum: {
            values: ['annual', 'sick', 'unpaid', 'vacation', 'emergency', 'personal', 'maternity', 'paternity', 'other'],
            message: 'Invalid leave type: {VALUE}'
        },
        required: [true, 'Leave type is required'],
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator: function (value) {
                // تأكد أن تاريخ البداية ليس في الماضي
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return value >= today;
            },
            message: 'Start date cannot be in the past'
        }
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
        validate: {
            validator: function (value) {
                // تأكد أن تاريخ النهاية بعد تاريخ البداية
                return !this.startDate || value >= this.startDate;
            },
            message: 'End date must be after or equal to start date'
        }
    },
    reason: {
        type: String,
        default: '',
        maxlength: [500, 'Reason cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'approved', 'rejected'],
            message: 'Invalid status: {VALUE}'
        },
        default: 'pending',
    },
    adminComment: {
        type: String,
        default: '',
        maxlength: [1000, 'Admin comment cannot exceed 1000 characters']
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reviewedAt: {
        type: Date,
    },
    // حساب عدد الأيام المطلوبة
    totalDays: {
        type: Number,
        default: function () {
            if (this.startDate && this.endDate) {
                const timeDiff = this.endDate - this.startDate;
                return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
            }
            return 0;
        }
    },
    // أولوية الطلب
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: function () {
            return this.leaveType === 'emergency' ? 'urgent' :
                this.leaveType === 'sick' ? 'high' : 'medium';
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual لحساب عدد الأيام المطلوبة
leaveRequestSchema.virtual('daysCount').get(function () {
    if (this.startDate && this.endDate) {
        const timeDiff = this.endDate - this.startDate;
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
});

// Virtual لحساب مدة الطلب بالأسابيع
leaveRequestSchema.virtual('weeksCount').get(function () {
    return Math.ceil(this.daysCount / 7);
});

// Virtual لحالة الطلب بالعربية
leaveRequestSchema.virtual('statusText').get(function () {
    const statusMap = {
        'pending': 'قيد المراجعة',
        'approved': 'مقبول',
        'rejected': 'مرفوض'
    };
    return statusMap[this.status] || this.status;
});

// Virtual لنوع الإجازة بالعربية
leaveRequestSchema.virtual('leaveTypeText').get(function () {
    const typeMap = {
        'annual': 'إجازة سنوية',
        'sick': 'إجازة مرضية',
        'unpaid': 'إجازة بدون راتب',
        'vacation': 'إجازة عادية',
        'emergency': 'إجازة طارئة',
        'personal': 'إجازة شخصية',
        'maternity': 'إجازة أمومة',
        'paternity': 'إجازة أبوة',
        'other': 'أخرى'
    };
    return typeMap[this.leaveType] || this.leaveType;
});

// Pre-save middleware لحساب totalDays
leaveRequestSchema.pre('save', function (next) {
    if (this.startDate && this.endDate) {
        const timeDiff = this.endDate - this.startDate;
        this.totalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

        // التحقق من عدم تجاوز 90 يوم
        if (this.totalDays > 90) {
            return next(new Error('Leave request cannot exceed 90 days'));
        }

        // التحقق من الحد الأدنى للأيام
        if (this.totalDays < 1) {
            return next(new Error('Leave request must be at least 1 day'));
        }
    }
    next();
});

// Pre-save middleware للتحقق من التواريخ المتداخلة
leaveRequestSchema.pre('save', async function (next) {
    if (this.isNew && this.startDate && this.endDate) {
        try {
            // البحث عن إجازات متداخلة للمستخدم نفسه
            const overlappingLeaves = await this.constructor.find({
                user: this.user,
                status: { $in: ['pending', 'approved'] },
                $or: [
                    {
                        $and: [
                            { startDate: { $lte: this.startDate } },
                            { endDate: { $gte: this.startDate } }
                        ]
                    },
                    {
                        $and: [
                            { startDate: { $lte: this.endDate } },
                            { endDate: { $gte: this.endDate } }
                        ]
                    },
                    {
                        $and: [
                            { startDate: { $gte: this.startDate } },
                            { endDate: { $lte: this.endDate } }
                        ]
                    }
                ]
            });

            if (overlappingLeaves.length > 0) {
                return next(new Error('Leave request overlaps with existing leave request'));
            }
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Index للبحث السريع
leaveRequestSchema.index({ user: 1, startDate: -1 });
leaveRequestSchema.index({ status: 1, createdAt: -1 });
leaveRequestSchema.index({ leaveType: 1 });
leaveRequestSchema.index({ priority: 1 });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
