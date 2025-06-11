const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SystemSettings = require('../models/SystemSettings');
const User = require('../models/User');

dotenv.config();

mongoose
    .connect("mongodb://127.0.0.1:27017/ALTROHR-NEW", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('✅ Connected to MongoDB');
        initializeSettings();
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

async function initializeSettings() {
    try {
        console.log('🔧 Initializing system settings...');

        // التحقق من وجود إعدادات
        let settings = await SystemSettings.findOne();

        if (settings) {
            console.log('ℹ️ System settings already exist:');
            console.log(`   - System Name: ${settings.systemName}`);
            console.log(`   - Maintenance Mode: ${settings.maintenanceMode ? '🔧 ON' : '✅ OFF'}`);
            console.log(`   - Allow Registration: ${settings.allowRegistration ? '✅ ON' : '🚫 OFF'}`);
            console.log(`   - Session Timeout: ${settings.sessionTimeout} minutes`);
            console.log(`   - Max Login Attempts: ${settings.maxLoginAttempts}`);
            console.log(`   - Email Notifications: ${settings.emailNotifications ? '✅ ON' : '🚫 OFF'}`);
            console.log(`   - Last Updated: ${settings.lastUpdated}`);
        } else {
            console.log('⚙️ Creating default system settings...');

            // العثور على المدير الأول
            const adminUser = await User.findOne({ role: 'admin' });

            if (!adminUser) {
                console.error('❌ No admin user found. Please create an admin user first.');
                process.exit(1);
            }

            // إنشاء الإعدادات الافتراضية
            settings = await SystemSettings.create({
                systemName: 'AltroHR',
                systemDescription: 'نظام إدارة الموارد البشرية الذكي',
                defaultLanguage: 'ar',
                timezone: 'Asia/Riyadh',
                currency: 'SAR',
                dateFormat: 'DD/MM/YYYY',
                maintenanceMode: false,
                allowRegistration: false,
                sessionTimeout: 480, // 8 hours
                maxLoginAttempts: 5,
                backupFrequency: 'daily',
                emailNotifications: true,
                smsNotifications: false,
                workingHours: {
                    start: '08:00',
                    end: '17:00'
                },
                features: {
                    backupSystem: {
                        enabled: false,
                        status: 'under_development'
                    },
                    advancedReporting: {
                        enabled: false,
                        status: 'under_development'
                    },
                    integrations: {
                        enabled: false,
                        status: 'under_development'
                    }
                },
                updatedBy: adminUser._id
            });

            console.log('✅ System settings created successfully:');
            console.log(`   - System Name: ${settings.systemName}`);
            console.log(`   - Maintenance Mode: ${settings.maintenanceMode ? '🔧 ON' : '✅ OFF'}`);
            console.log(`   - Allow Registration: ${settings.allowRegistration ? '✅ ON' : '🚫 OFF'}`);
            console.log(`   - Session Timeout: ${settings.sessionTimeout} minutes`);
            console.log(`   - Working Hours: ${settings.workingHours.start} - ${settings.workingHours.end}`);
        }

        console.log('\n🎯 System Settings Status:');
        console.log('─'.repeat(50));
        console.log(`🏢 System Name: ${settings.systemName}`);
        console.log(`📝 Description: ${settings.systemDescription}`);
        console.log(`🌍 Language: ${settings.defaultLanguage === 'ar' ? 'العربية' : 'English'}`);
        console.log(`🕐 Timezone: ${settings.timezone}`);
        console.log(`💰 Currency: ${settings.currency}`);
        console.log(`📅 Date Format: ${settings.dateFormat}`);
        console.log('─'.repeat(50));
        console.log('🔐 Security Settings:');
        console.log(`   🔧 Maintenance Mode: ${settings.maintenanceMode ? 'ENABLED' : 'DISABLED'}`);
        console.log(`   👥 Allow Registration: ${settings.allowRegistration ? 'ENABLED' : 'DISABLED'}`);
        console.log(`   ⏰ Session Timeout: ${settings.sessionTimeout} minutes`);
        console.log(`   🚪 Max Login Attempts: ${settings.maxLoginAttempts}`);
        console.log('─'.repeat(50));
        console.log('📧 Notification Settings:');
        console.log(`   📧 Email Notifications: ${settings.emailNotifications ? 'ENABLED' : 'DISABLED'}`);
        console.log(`   📱 SMS Notifications: ${settings.smsNotifications ? 'ENABLED' : 'DISABLED'}`);
        console.log('─'.repeat(50));
        console.log('🕒 Working Hours:');
        console.log(`   🌅 Start: ${settings.workingHours.start}`);
        console.log(`   🌅 End: ${settings.workingHours.end}`);
        console.log('─'.repeat(50));
        console.log('🚧 Features Status:');
        console.log(`   💾 Backup System: ${settings.features.backupSystem.status}`);
        console.log(`   📊 Advanced Reporting: ${settings.features.advancedReporting.status}`);
        console.log(`   🔗 Integrations: ${settings.features.integrations.status}`);
        console.log('─'.repeat(50));

        console.log('\n✅ System settings initialization completed!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error initializing system settings:', error);
        process.exit(1);
    }
} 