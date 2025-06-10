// مساعد لتتبع الأخطاء والتشخيص
class DebugHelper {
    constructor() {
        this.isDebugMode = process.env.NODE_ENV === 'development';
        this.logs = [];
    }

    log(component, action, data = null, status = 'info') {
        const logEntry = {
            timestamp: new Date().toISOString(),
            component,
            action,
            data,
            status
        };

        this.logs.push(logEntry);

        if (this.isDebugMode) {
            const statusEmoji = {
                'info': 'ℹ️',
                'success': '✅',
                'warning': '⚠️',
                'error': '❌'
            };

            console.log(
                `${statusEmoji[status]} [${component}] ${action}`,
                data ? data : ''
            );
        }

        // احتفظ بآخر 100 log فقط
        if (this.logs.length > 100) {
            this.logs.shift();
        }
    }

    success(component, action, data = null) {
        this.log(component, action, data, 'success');
    }

    error(component, action, error) {
        this.log(component, action, {
            message: error.message,
            stack: error.stack,
            name: error.name
        }, 'error');
    }

    warning(component, action, data = null) {
        this.log(component, action, data, 'warning');
    }

    info(component, action, data = null) {
        this.log(component, action, data, 'info');
    }

    // جلب logs للمكون المحدد
    getLogsForComponent(component) {
        return this.logs.filter(log => log.component === component);
    }

    // جلب آخر الـ logs
    getRecentLogs(count = 10) {
        return this.logs.slice(-count);
    }

    // طباعة ملخص الأخطاء
    printErrorSummary() {
        const errors = this.logs.filter(log => log.status === 'error');

        if (errors.length === 0) {
            console.log('✅ لا توجد أخطاء مسجلة');
            return;
        }

        console.group('📋 ملخص الأخطاء:');
        errors.forEach(error => {
            console.log(`❌ [${error.component}] ${error.action}:`, error.data?.message);
        });
        console.groupEnd();
    }

    // تشخيص حالة التطبيق
    diagnoseApp() {
        const summary = {
            totalLogs: this.logs.length,
            errors: this.logs.filter(log => log.status === 'error').length,
            warnings: this.logs.filter(log => log.status === 'warning').length,
            successes: this.logs.filter(log => log.status === 'success').length,
            components: [...new Set(this.logs.map(log => log.component))]
        };

        console.group('🔍 تشخيص التطبيق:');
        console.log('📊 الإحصائيات:', summary);

        if (summary.errors > 0) {
            console.log('❌ المكونات التي تحتوي على أخطاء:');
            const errorComponents = [...new Set(
                this.logs
                    .filter(log => log.status === 'error')
                    .map(log => log.component)
            )];
            errorComponents.forEach(component => {
                const componentErrors = this.logs.filter(
                    log => log.component === component && log.status === 'error'
                );
                console.log(`  - ${component}: ${componentErrors.length} أخطاء`);
            });
        }
        console.groupEnd();

        return summary;
    }

    // تنظيف الـ logs
    clear() {
        this.logs = [];
        console.log('🧹 تم تنظيف جميع الـ logs');
    }
}

// إنشاء instance واحد للاستخدام في كل التطبيق
const debugHelper = new DebugHelper();

export default debugHelper; 