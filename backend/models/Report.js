const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    // معلومات التقرير الأساسية
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['employees', 'attendance', 'leaves', 'departments', 'system', 'security'],
        required: true
    },
    type: {
        type: String,
        enum: ['summary', 'detailed', 'analytics', 'monthly', 'yearly', 'custom'],
        required: true
    },

    // فترة التقرير
    period: {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        periodType: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'],
            default: 'monthly'
        }
    },

    // بيانات التقرير
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },

    // الإحصائيات السريعة
    summary: {
        totalRecords: { type: Number, default: 0 },
        totalUsers: { type: Number, default: 0 },
        averageValue: { type: Number, default: 0 },
        percentageChange: { type: Number, default: 0 },
        trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' }
    },

    // معلومات التوليد
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    },

    // حالة التقرير
    status: {
        type: String,
        enum: ['generating', 'completed', 'failed', 'expired'],
        default: 'completed'
    },

    // معلومات الملف
    filePath: {
        type: String,
        default: null
    },
    fileSize: {
        type: Number,
        default: 0
    },
    format: {
        type: String,
        enum: ['json', 'pdf', 'excel', 'csv'],
        default: 'json'
    },

    // الفلاتر المطبقة
    filters: {
        department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        status: { type: String, default: null },
        custom: { type: mongoose.Schema.Types.Mixed, default: {} }
    },

    // إعدادات إضافية
    settings: {
        includeCharts: { type: Boolean, default: true },
        includeDetails: { type: Boolean, default: true },
        groupBy: { type: String, default: null },
        sortBy: { type: String, default: 'date' },
        sortOrder: { type: String, enum: ['asc', 'desc'], default: 'desc' }
    }
}, {
    timestamps: true
});

// فهارس للبحث السريع
reportSchema.index({ category: 1, type: 1 });
reportSchema.index({ generatedBy: 1, generatedAt: -1 });
reportSchema.index({ 'period.startDate': 1, 'period.endDate': 1 });
reportSchema.index({ status: 1 });

// دالة للحصول على التقارير بالفترة
reportSchema.statics.getReportsByPeriod = async function (startDate, endDate, category = null) {
    const query = {
        'period.startDate': { $gte: startDate },
        'period.endDate': { $lte: endDate },
        status: 'completed'
    };

    if (category) {
        query.category = category;
    }

    return await this.find(query)
        .populate('generatedBy', 'name email')
        .sort({ generatedAt: -1 });
};

// دالة لحساب إحصائيات التقارير
reportSchema.statics.getReportsStatistics = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 },
                avgSize: { $avg: '$fileSize' },
                totalSize: { $sum: '$fileSize' },
                lastGenerated: { $max: '$generatedAt' }
            }
        }
    ]);

    const totalReports = await this.countDocuments();
    const recentReports = await this.countDocuments({
        generatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    return {
        byCategory: stats,
        total: totalReports,
        recentWeek: recentReports
    };
};

module.exports = mongoose.model('Report', reportSchema); 