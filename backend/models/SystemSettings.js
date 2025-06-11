const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
    // الإعدادات العامة
    systemName: {
        type: String,
        default: 'AltroHR',
        required: true
    },
    systemDescription: {
        type: String,
        default: 'نظام إدارة الموارد البشرية الذكي'
    },
    defaultLanguage: {
        type: String,
        enum: ['ar', 'en'],
        default: 'ar'
    },
    timezone: {
        type: String,
        default: 'Asia/Riyadh',
        enum: ['Asia/Riyadh', 'Asia/Dubai', 'Asia/Kuwait']
    },
    currency: {
        type: String,
        default: 'SAR'
    },
    dateFormat: {
        type: String,
        default: 'DD/MM/YYYY'
    },

    // إعدادات الأمان
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    allowRegistration: {
        type: Boolean,
        default: false
    },
    sessionTimeout: {
        type: Number,
        default: 480, // minutes
        min: 30,
        max: 1440
    },
    maxLoginAttempts: {
        type: Number,
        default: 5,
        min: 3,
        max: 10
    },

    // إعدادات النسخ الاحتياطي (للمستقبل)
    backupFrequency: {
        type: String,
        enum: ['disabled', 'hourly', 'daily', 'weekly', 'monthly'],
        default: 'daily'
    },
    lastBackupDate: {
        type: Date,
        default: null
    },

    // إعدادات الإشعارات
    emailNotifications: {
        type: Boolean,
        default: true
    },
    smsNotifications: {
        type: Boolean,
        default: false
    },

    // معلومات التحديث
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // إعدادات إضافية
    companyLogo: {
        type: String,
        default: null
    },
    workingHours: {
        start: {
            type: String,
            default: '08:00'
        },
        end: {
            type: String,
            default: '17:00'
        }
    },

    // حالة الميزات
    features: {
        backupSystem: {
            enabled: { type: Boolean, default: false },
            status: { type: String, default: 'under_development' }
        },
        advancedReporting: {
            enabled: { type: Boolean, default: false },
            status: { type: String, default: 'under_development' }
        },
        integrations: {
            enabled: { type: Boolean, default: false },
            status: { type: String, default: 'under_development' }
        }
    }
}, {
    timestamps: true
});

// فهرس لضمان وجود إعدادات واحدة فقط
systemSettingsSchema.index({ systemName: 1 }, { unique: true });

// دالة للحصول على الإعدادات أو إنشاؤها
systemSettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        // إنشاء إعدادات افتراضية
        const adminUser = await mongoose.model('User').findOne({ role: 'admin' });
        settings = await this.create({
            updatedBy: adminUser ? adminUser._id : null
        });
    }
    return settings;
};

// دالة لتحديث الإعدادات
systemSettingsSchema.statics.updateSettings = async function (newSettings, userId) {
    let settings = await this.getSettings();

    // تحديث الحقول المرسلة فقط
    Object.keys(newSettings).forEach(key => {
        if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt') {
            settings[key] = newSettings[key];
        }
    });

    settings.updatedBy = userId;
    settings.lastUpdated = new Date();

    return await settings.save();
};

module.exports = mongoose.model('SystemSettings', systemSettingsSchema); 