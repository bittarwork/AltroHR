const SystemSettings = require('../models/SystemSettings');
const User = require('../models/User');

const SystemSettingsController = {

    // جلب الإعدادات الحالية
    async getSettings(req, res) {
        try {
            const settings = await SystemSettings.getSettings();

            // إخفاء معلومات حساسة للمستخدمين غير المخولين
            const sanitizedSettings = {
                ...settings.toObject(),
                updatedBy: undefined
            };

            res.json(sanitizedSettings);
        } catch (error) {
            console.error('خطأ في جلب الإعدادات:', error);
            res.status(500).json({
                message: 'فشل في جلب إعدادات النظام',
                error: error.message
            });
        }
    },

    // تحديث الإعدادات
    async updateSettings(req, res) {
        try {
            const userId = req.user._id;
            const newSettings = req.body;

            // التحقق من صحة البيانات المرسلة
            const allowedFields = [
                'systemName', 'systemDescription', 'defaultLanguage', 'timezone',
                'currency', 'dateFormat', 'maintenanceMode', 'allowRegistration',
                'sessionTimeout', 'maxLoginAttempts', 'backupFrequency',
                'emailNotifications', 'smsNotifications', 'workingHours'
            ];

            const filteredSettings = {};
            allowedFields.forEach(field => {
                if (newSettings[field] !== undefined) {
                    filteredSettings[field] = newSettings[field];
                }
            });

            // التحقق من القيم الصالحة
            if (filteredSettings.sessionTimeout && (filteredSettings.sessionTimeout < 30 || filteredSettings.sessionTimeout > 1440)) {
                return res.status(400).json({
                    message: 'مهلة الجلسة يجب أن تكون بين 30 و 1440 دقيقة'
                });
            }

            if (filteredSettings.maxLoginAttempts && (filteredSettings.maxLoginAttempts < 3 || filteredSettings.maxLoginAttempts > 10)) {
                return res.status(400).json({
                    message: 'عدد محاولات تسجيل الدخول يجب أن يكون بين 3 و 10'
                });
            }

            // تحديث الإعدادات
            const updatedSettings = await SystemSettings.updateSettings(filteredSettings, userId);

            // تطبيق بعض الإعدادات فوراً
            await this.applySettings(updatedSettings);

            res.json({
                message: 'تم حفظ الإعدادات بنجاح',
                settings: {
                    ...updatedSettings.toObject(),
                    updatedBy: undefined
                }
            });

        } catch (error) {
            console.error('خطأ في تحديث الإعدادات:', error);
            res.status(500).json({
                message: 'فشل في حفظ الإعدادات',
                error: error.message
            });
        }
    },

    // تطبيق الإعدادات على النظام
    async applySettings(settings) {
        try {
            // تطبيق وضع الصيانة
            if (settings.maintenanceMode) {
                console.log('🔧 تم تفعيل وضع الصيانة');
                // يمكن إضافة منطق لإشعار المستخدمين أو إيقاف الخدمات
            }

            // تطبيق إعدادات التسجيل
            if (!settings.allowRegistration) {
                console.log('🚫 تم تعطيل التسجيل الجديد');
            }

            // إعدادات الجلسة - سيتم تطبيقها في الطلبات القادمة
            console.log(`⏰ مهلة الجلسة: ${settings.sessionTimeout} دقيقة`);
            console.log(`🔒 عدد محاولات تسجيل الدخول: ${settings.maxLoginAttempts}`);

        } catch (error) {
            console.error('خطأ في تطبيق الإعدادات:', error);
        }
    },

    // إعادة تعيين الإعدادات للقيم الافتراضية
    async resetSettings(req, res) {
        try {
            const userId = req.user._id;

            // حذف الإعدادات الحالية
            await SystemSettings.deleteMany({});

            // إنشاء إعدادات جديدة بالقيم الافتراضية
            const adminUser = await User.findOne({ role: 'admin' });
            const settings = await SystemSettings.create({
                updatedBy: adminUser ? adminUser._id : userId
            });

            res.json({
                message: 'تم إعادة تعيين الإعدادات بنجاح',
                settings: {
                    ...settings.toObject(),
                    updatedBy: undefined
                }
            });

        } catch (error) {
            console.error('خطأ في إعادة تعيين الإعدادات:', error);
            res.status(500).json({
                message: 'فشل في إعادة تعيين الإعدادات',
                error: error.message
            });
        }
    },

    // تصدير الإعدادات
    async exportSettings(req, res) {
        try {
            const settings = await SystemSettings.getSettings();

            const exportData = {
                exportDate: new Date().toISOString(),
                version: '1.0',
                settings: {
                    ...settings.toObject(),
                    _id: undefined,
                    updatedBy: undefined,
                    createdAt: undefined,
                    updatedAt: undefined,
                    __v: undefined
                }
            };

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename=system-settings.json');
            res.json(exportData);

        } catch (error) {
            console.error('خطأ في تصدير الإعدادات:', error);
            res.status(500).json({
                message: 'فشل في تصدير الإعدادات',
                error: error.message
            });
        }
    },

    // استيراد الإعدادات
    async importSettings(req, res) {
        try {
            const { settings: importedSettings } = req.body;

            if (!importedSettings) {
                return res.status(400).json({
                    message: 'بيانات الإعدادات مطلوبة'
                });
            }

            const userId = req.user._id;

            // تحديث الإعدادات
            const updatedSettings = await SystemSettings.updateSettings(importedSettings, userId);

            res.json({
                message: 'تم استيراد الإعدادات بنجاح',
                settings: {
                    ...updatedSettings.toObject(),
                    updatedBy: undefined
                }
            });

        } catch (error) {
            console.error('خطأ في استيراد الإعدادات:', error);
            res.status(500).json({
                message: 'فشل في استيراد الإعدادات',
                error: error.message
            });
        }
    },

    // جلب حالة الميزات
    async getFeaturesStatus(req, res) {
        try {
            const settings = await SystemSettings.getSettings();

            const featuresStatus = {
                backupSystem: {
                    ...settings.features.backupSystem,
                    description: 'نظام النسخ الاحتياطي التلقائي'
                },
                advancedReporting: {
                    ...settings.features.advancedReporting,
                    description: 'تقارير متقدمة وتحليلات ذكية'
                },
                integrations: {
                    ...settings.features.integrations,
                    description: 'التكامل مع الأنظمة الخارجية'
                }
            };

            res.json(featuresStatus);

        } catch (error) {
            console.error('خطأ في جلب حالة الميزات:', error);
            res.status(500).json({
                message: 'فشل في جلب حالة الميزات',
                error: error.message
            });
        }
    }
};

module.exports = SystemSettingsController; 