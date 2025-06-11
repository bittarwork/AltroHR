const mongoose = require('mongoose');
const Report = require('../models/Report');
const User = require('../models/User');
require('dotenv').config();

const initializeReports = async () => {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ تم الاتصال بقاعدة البيانات');

        // البحث عن مستخدم إداري لإنشاء التقارير
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.log('❌ لم يتم العثور على مستخدم إداري');
            process.exit(1);
        }
        console.log(`📋 سيتم إنشاء التقارير باسم: ${adminUser.name}`);

        // التحقق من وجود تقارير مسبقاً
        const existingReports = await Report.countDocuments();
        if (existingReports > 0) {
            console.log(`📊 يوجد ${existingReports} تقرير مسبقاً في النظام`);
            console.log('💡 لا حاجة لإنشاء تقارير نموذجية جديدة');
            return;
        }

        // إنشاء تقارير نموذجية
        const sampleReports = [
            {
                name: 'تقرير الموظفين - نموذجي',
                description: 'تقرير نموذجي لعرض جميع الموظفين في النظام',
                category: 'employees',
                type: 'summary',
                period: {
                    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    endDate: new Date(),
                    periodType: 'monthly'
                },
                data: {
                    users: [],
                    statistics: {
                        total: 0,
                        byRole: {},
                        byDepartment: {}
                    }
                },
                summary: {
                    totalRecords: 0,
                    totalUsers: 0,
                    trend: 'stable'
                },
                generatedBy: adminUser._id,
                status: 'completed',
                fileSize: 1024
            },
            {
                name: 'تقرير الحضور - نموذجي',
                description: 'تقرير نموذجي لحضور الموظفين خلال الشهر الماضي',
                category: 'attendance',
                type: 'detailed',
                period: {
                    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    endDate: new Date(),
                    periodType: 'monthly'
                },
                data: {
                    records: [],
                    statistics: {
                        totalRecords: 0,
                        presentDays: 0,
                        absentDays: 0,
                        totalHours: 0
                    }
                },
                summary: {
                    totalRecords: 0,
                    trend: 'stable'
                },
                generatedBy: adminUser._id,
                status: 'completed',
                fileSize: 2048
            }
        ];

        // إدراج التقارير النموذجية
        const createdReports = await Report.insertMany(sampleReports);
        console.log(`✅ تم إنشاء ${createdReports.length} تقرير نموذجي بنجاح`);

        // عرض معلومات التقارير المنشأة
        for (const report of createdReports) {
            console.log(`📄 ${report.name} (${report.category})`);
        }

        console.log('🎉 تم إكمال تهيئة التقارير بنجاح!');

    } catch (error) {
        console.error('❌ خطأ في تهيئة التقارير:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 تم قطع الاتصال عن قاعدة البيانات');
        process.exit(0);
    }
};

// تشغيل السكريبت
if (require.main === module) {
    initializeReports();
}

module.exports = initializeReports; 