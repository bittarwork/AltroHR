const SystemSettings = require('../models/SystemSettings');

// middleware للتحقق من وضع الصيانة
const maintenanceMode = async (req, res, next) => {
    try {
        const settings = await SystemSettings.getSettings();

        if (settings.maintenanceMode) {
            // السماح للإداريين بالوصول حتى في وضع الصيانة
            if (req.user && req.user.role === 'admin') {
                return next();
            }

            return res.status(503).json({
                message: 'النظام في وضع الصيانة حالياً. نعتذر عن الإزعاج.',
                error: 'MAINTENANCE_MODE',
                retryAfter: 3600 // ساعة واحدة
            });
        }

        next();
    } catch (error) {
        console.error('خطأ في middleware وضع الصيانة:', error);
        next(); // في حالة الخطأ، نسمح بالمتابعة
    }
};

// middleware للتحقق من إعدادات التسجيل
const registrationPolicy = async (req, res, next) => {
    try {
        // تطبيق هذا فقط على routes التسجيل
        if (req.path !== '/register' && !req.path.includes('register')) {
            return next();
        }

        const settings = await SystemSettings.getSettings();

        if (!settings.allowRegistration) {
            return res.status(403).json({
                message: 'التسجيل الجديد معطل حالياً. يرجى التواصل مع الإدارة.',
                error: 'REGISTRATION_DISABLED'
            });
        }

        next();
    } catch (error) {
        console.error('خطأ في middleware سياسة التسجيل:', error);
        next(); // في حالة الخطأ، نسمح بالمتابعة
    }
};

// middleware للتحقق من إعدادات الجلسة
const sessionTimeout = async (req, res, next) => {
    try {
        if (!req.user) return next();

        const settings = await SystemSettings.getSettings();
        const timeoutMinutes = settings.sessionTimeout || 480;
        const timeoutMs = timeoutMinutes * 60 * 1000;

        // إضافة معلومات المهلة الزمنية للطلب
        req.sessionTimeout = timeoutMs;
        req.sessionTimeoutMinutes = timeoutMinutes;

        next();
    } catch (error) {
        console.error('خطأ في middleware مهلة الجلسة:', error);
        next();
    }
};

// دالة مساعدة للحصول على الإعدادات المؤثرة على الأمان
const getSecuritySettings = async () => {
    try {
        const settings = await SystemSettings.getSettings();
        return {
            maintenanceMode: settings.maintenanceMode,
            allowRegistration: settings.allowRegistration,
            sessionTimeout: settings.sessionTimeout,
            maxLoginAttempts: settings.maxLoginAttempts
        };
    } catch (error) {
        console.error('خطأ في جلب إعدادات الأمان:', error);
        return {
            maintenanceMode: false,
            allowRegistration: false,
            sessionTimeout: 480,
            maxLoginAttempts: 5
        };
    }
};

module.exports = {
    maintenanceMode,
    registrationPolicy,
    sessionTimeout,
    getSecuritySettings
}; 