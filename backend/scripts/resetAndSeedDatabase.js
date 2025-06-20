const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// استيراد النماذج
const User = require('../models/User');
const Department = require('../models/Department');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const Salary = require('../models/Salary');
const PerformanceNote = require('../models/PerformanceNote');
const Report = require('../models/Report');
const MonthlyReport = require('../models/MonthlyReport');
const SystemSettings = require('../models/SystemSettings');

// الاتصال بقاعدة البيانات
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ALTROHR-NEW');
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    } catch (error) {
        console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error);
        process.exit(1);
    }
};

// مسح جميع البيانات عدا الأدمن
const clearDatabase = async () => {
    try {
        console.log('🧹 بدء مسح قاعدة البيانات...');

        // البحث عن حساب الأدمن قبل المسح
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.log('⚠️ لم يتم العثور على حساب أدمن، سيتم إنشاء واحد جديد');
        }

        // مسح جميع المجموعات
        await Report.deleteMany({});
        await MonthlyReport.deleteMany({});
        await PerformanceNote.deleteMany({});
        await Salary.deleteMany({});
        await LeaveRequest.deleteMany({});
        await Attendance.deleteMany({});
        await User.deleteMany({ role: { $ne: 'admin' } }); // مسح جميع المستخدمين عدا الأدمن
        await Department.deleteMany({});

        console.log('✅ تم مسح قاعدة البيانات بنجاح');
        return adminUser;
    } catch (error) {
        console.error('❌ خطأ في مسح قاعدة البيانات:', error);
        throw error;
    }
};

// إنشاء بيانات الأقسام
const createDepartments = async () => {
    console.log('📁 إنشاء الأقسام...');

    const departments = [
        {
            name: 'تقنية المعلومات',
            description: 'قسم مسؤول عن تطوير وصيانة الأنظمة التقنية',
            isActive: true
        },
        {
            name: 'الموارد البشرية',
            description: 'قسم إدارة شؤون الموظفين والتوظيف',
            isActive: true
        },
        {
            name: 'المحاسبة',
            description: 'قسم إدارة الحسابات والمالية',
            isActive: true
        },
        {
            name: 'التسويق',
            description: 'قسم التسويق والعلاقات العامة',
            isActive: true
        },
        {
            name: 'المبيعات',
            description: 'قسم المبيعات وخدمة العملاء',
            isActive: true
        },
        {
            name: 'الإدارة العامة',
            description: 'قسم الإدارة العامة والتخطيط الاستراتيجي',
            isActive: true
        },
        {
            name: 'الصيانة',
            description: 'قسم صيانة المعدات والمرافق',
            isActive: true
        },
        {
            name: 'الأمن',
            description: 'قسم الأمن والحراسة',
            isActive: true
        },
        {
            name: 'الجودة',
            description: 'قسم ضمان الجودة والتحسين المستمر',
            isActive: true
        },
        {
            name: 'البحث والتطوير',
            description: 'قسم البحث والتطوير والابتكار',
            isActive: true
        }
    ];

    const createdDepartments = await Department.insertMany(departments);
    console.log(`✅ تم إنشاء ${createdDepartments.length} قسم`);
    return createdDepartments;
};

// إنشاء المستخدمين
const createUsers = async (departments, adminUser) => {
    console.log('👥 إنشاء المستخدمين...');

    // إنشاء كلمة مرور مشفرة للمستخدمين التجريبيين
    const hashedPassword = await bcrypt.hash('123456', 10);

    // إنشاء أدمن جديد إذا لم يكن موجود
    if (!adminUser) {
        const adminPassword = await bcrypt.hash('admin123', 10);
        adminUser = await User.create({
            name: 'المدير العام',
            email: 'admin@altrohrs.com',
            password: adminPassword,
            role: 'admin',
            phone: '0501234567',
            address: 'الرياض، المملكة العربية السعودية',
            position: 'المدير العام',
            hireDate: new Date('2020-01-01'),
            isActive: true,
            department: departments[5]._id // الإدارة العامة
        });
        console.log('✅ تم إنشاء حساب أدمن جديد');
    }

    const users = [
        // موظفو الموارد البشرية
        {
            name: 'سارة أحمد محمد',
            email: 'sara.ahmed@altrohrs.com',
            password: hashedPassword,
            role: 'hr',
            phone: '0501234568',
            address: 'الرياض، حي النرجس',
            position: 'مدير الموارد البشرية',
            hireDate: new Date('2021-03-15'),
            department: departments[1]._id,
            isActive: true
        },
        {
            name: 'فاطمة علي حسن',
            email: 'fatima.ali@altrohrs.com',
            password: hashedPassword,
            role: 'hr',
            phone: '0501234569',
            address: 'الرياض، حي الملقا',
            position: 'أخصائي موارد بشرية',
            hireDate: new Date('2021-06-20'),
            department: departments[1]._id,
            isActive: true
        },

        // موظفو تقنية المعلومات
        {
            name: 'محمد عبدالله السعد',
            email: 'mohammed.saad@altrohrs.com',
            password: hashedPassword,
            role: 'employee',
            phone: '0501234570',
            address: 'الرياض، حي العليا',
            position: 'مطور برمجيات أول',
            hireDate: new Date('2020-09-10'),
            department: departments[0]._id,
            isActive: true
        },
        {
            name: 'أحمد خالد المطيري',
            email: 'ahmed.almutairi@altrohrs.com',
            password: hashedPassword,
            role: 'employee',
            phone: '0501234571',
            address: 'الرياض، حي الورود',
            position: 'مهندس شبكات',
            hireDate: new Date('2021-01-25'),
            department: departments[0]._id,
            isActive: true
        },
        {
            name: 'يوسف سعد الغامدي',
            email: 'yousef.alghamdi@altrohrs.com',
            password: hashedPassword,
            role: 'employee',
            phone: '0501234572',
            address: 'الرياض، حي الرحاب',
            position: 'مطور واجهات',
            hireDate: new Date('2021-08-12'),
            department: departments[0]._id,
            isActive: true
        },

        // موظفو المحاسبة
        {
            name: 'نورا فهد القحطاني',
            email: 'nora.alqahtani@altrohrs.com',
            password: hashedPassword,
            role: 'employee',
            phone: '0501234573',
            address: 'الرياض، حي الشفا',
            position: 'محاسب أول',
            hireDate: new Date('2020-11-05'),
            department: departments[2]._id,
            isActive: true
        },
        {
            name: 'خالد محمد العتيبي',
            email: 'khalid.alotaibi@altrohrs.com',
            password: hashedPassword,
            role: 'employee',
            phone: '0501234574',
            address: 'الرياض، حي الياسمين',
            position: 'مساعد محاسب',
            hireDate: new Date('2022-02-14'),
            department: departments[2]._id,
            isActive: true
        },

        // موظفو التسويق
        {
            name: 'مريم عبدالرحمن الدوسري',
            email: 'mariam.aldosari@altrohrs.com',
            password: hashedPassword,
            role: 'employee',
            phone: '0501234575',
            address: 'الرياض، حي الحمراء',
            position: 'أخصائي تسويق رقمي',
            hireDate: new Date('2021-05-18'),
            department: departments[3]._id,
            isActive: true
        },
        {
            name: 'عبدالعزيز صالح الشهري',
            email: 'abdulaziz.alshahri@altrohrs.com',
            password: hashedPassword,
            role: 'employee',
            phone: '0501234576',
            address: 'الرياض، حي الربوة',
            position: 'مدير علاقات عامة',
            hireDate: new Date('2020-07-22'),
            department: departments[3]._id,
            isActive: true
        },

        // موظفو المبيعات
        {
            name: 'هند ناصر العجمي',
            email: 'hind.alajmi@altrohrs.com',
            password: hashedPassword,
            role: 'employee',
            phone: '0501234577',
            address: 'الرياض، حي الصحافة',
            position: 'مندوب مبيعات أول',
            hireDate: new Date('2021-04-08'),
            department: departments[4]._id,
            isActive: true
        },
        {
            name: 'عمر محمد الزهراني',
            email: 'omar.alzahrani@altrohrs.com',
            password: hashedPassword,
            role: 'employee',
            phone: '0501234578',
            address: 'الرياض، حي الغدير',
            position: 'أخصائي خدمة عملاء',
            hireDate: new Date('2021-09-30'),
            department: departments[4]._id,
            isActive: true
        },

        // موظفو الصيانة
        {
            name: 'سعد عبدالله الحربي',
            email: 'saad.alharbi@altrohrs.com',
            password: hashedPassword,
            role: 'employee',
            phone: '0501234579',
            address: 'الرياض، حي الفيصلية',
            position: 'فني صيانة كهربائية',
            hireDate: new Date('2020-12-16'),
            department: departments[6]._id,
            isActive: true
        },
        {
            name: 'ماجد فيصل السبيعي',
            email: 'majed.alsubaie@altrohrs.com',
            password: hashedPassword,
            role: 'employee',
            phone: '0501234580',
            address: 'الرياض، حي المروج',
            position: 'فني صيانة ميكانيكية',
            hireDate: new Date('2021-10-11'),
            department: departments[6]._id,
            isActive: true
        },

        // موظفو الأمن
        {
            name: 'طارق حمد الرشيد',
            email: 'tariq.alrasheed@altrohrs.com',
            password: hashedPassword,
            role: 'employee',
            phone: '0501234581',
            address: 'الرياض، حي السلي',
            position: 'ضابط أمن',
            hireDate: new Date('2020-05-28'),
            department: departments[7]._id,
            isActive: true
        },

        // موظفو الجودة
        {
            name: 'ريم سليمان المالكي',
            email: 'reem.almalki@altrohrs.com',
            password: hashedPassword,
            role: 'employee',
            phone: '0501234582',
            address: 'الرياض، حي الوادي',
            position: 'مراقب جودة',
            hireDate: new Date('2021-07-03'),
            department: departments[8]._id,
            isActive: true
        },

        // موظفو البحث والتطوير
        {
            name: 'بدر عبدالمحسن القرني',
            email: 'badr.alqarni@altrohrs.com',
            password: hashedPassword,
            role: 'employee',
            phone: '0501234583',
            address: 'الرياض، حي النخيل',
            position: 'باحث تطوير',
            hireDate: new Date('2022-01-19'),
            department: departments[9]._id,
            isActive: true
        }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ تم إنشاء ${createdUsers.length} مستخدم`);

    // إضافة الأدمن للقائمة
    return [adminUser, ...createdUsers];
};

// إنشاء سجلات الحضور
const createAttendanceRecords = async (users) => {
    console.log('⏰ إنشاء سجلات الحضور...');

    const attendanceRecords = [];
    const statuses = ['present', 'absent', 'partial'];

    // إنشاء سجلات لليوم الحالي فقط (لتجنب مشكلة التحقق من التاريخ)
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    for (let user of users.slice(0, 12)) { // أول 12 مستخدم
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // إنشاء أوقات الحضور والانصراف لليوم الحالي
        const clockInTime = new Date();
        clockInTime.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);

        const clockOutTime = new Date();
        clockOutTime.setHours(clockInTime.getHours() + 8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);

        const totalWorkedHours = (status === 'present' || status === 'partial') ?
            Math.round(((clockOutTime - clockInTime) / (1000 * 60 * 60)) * 100) / 100 : 0;

        attendanceRecords.push({
            user: user._id,
            date: dateStr,
            clockIn: status !== 'absent' ? clockInTime : null,
            clockOut: status === 'present' ? clockOutTime : null,
            totalWorkedHours,
            status,
            note: status === 'partial' ? 'لم يسجل خروج' :
                status === 'absent' ? 'غياب بدون إذن' : 'حضور منتظم'
        });
    }

    const createdRecords = await Attendance.insertMany(attendanceRecords);
    console.log(`✅ تم إنشاء ${createdRecords.length} سجل حضور`);
    return createdRecords;
};

// إنشاء طلبات الإجازات
const createLeaveRequests = async (users) => {
    console.log('🏖️ إنشاء طلبات الإجازات...');

    const leaveTypes = ['annual', 'sick', 'emergency', 'maternity', 'paternity'];
    const statuses = ['pending', 'approved', 'rejected'];
    const leaveRequests = [];

    for (let i = 0; i < 15; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        const startDate = new Date();
        startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) + 1); // تواريخ مستقبلية

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 10) + 1);

        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        leaveRequests.push({
            user: user._id,
            leaveType,
            startDate,
            endDate,
            totalDays,
            reason: `طلب إجازة ${leaveType === 'annual' ? 'سنوية' :
                leaveType === 'sick' ? 'مرضية' :
                    leaveType === 'emergency' ? 'طارئة' :
                        leaveType === 'maternity' ? 'أمومة' : 'أبوة'}`,
            status,
            notes: status === 'rejected' ? 'تم الرفض لظروف العمل' :
                status === 'approved' ? 'تم الموافقة' : 'في انتظار المراجعة',
            appliedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
        });
    }

    const createdRequests = await LeaveRequest.insertMany(leaveRequests);
    console.log(`✅ تم إنشاء ${createdRequests.length} طلب إجازة`);
    return createdRequests;
};

// إنشاء سجلات الرواتب
const createSalaryRecords = async (users) => {
    console.log('💰 إنشاء سجلات الرواتب...');

    const salaryRecords = [];

    for (let user of users.slice(0, 12)) { // أول 12 مستخدم
        const baseSalary = user.role === 'admin' ? 15000 :
            user.role === 'hr' ? 8000 :
                user.role === 'technician' ? 6000 : 5000;

        const allowances = Math.floor(Math.random() * 1000) + 500;
        const deductions = Math.floor(Math.random() * 500);
        const bonus = Math.floor(Math.random() * 2000);
        const netSalary = baseSalary + allowances + bonus - deductions;

        // إنشاء راتب للشهر الماضي
        const payDate = new Date();
        payDate.setMonth(payDate.getMonth() - 1);
        payDate.setDate(25); // يوم صرف الراتب

        salaryRecords.push({
            user: user._id,
            month: payDate.getMonth() + 1,
            year: payDate.getFullYear(),
            baseSalary,
            allowances,
            deductions,
            bonus,
            netSalary,
            payDate,
            status: 'paid',
            notes: 'راتب منتظم'
        });
    }

    const createdSalaries = await Salary.insertMany(salaryRecords);
    console.log(`✅ تم إنشاء ${createdSalaries.length} سجل راتب`);
    return createdSalaries;
};

// إنشاء ملاحظات الأداء
const createPerformanceNotes = async (users) => {
    console.log('📝 إنشاء ملاحظات الأداء...');

    const noteTypes = ['positive', 'negative', 'warning', 'commendation'];
    const performanceNotes = [];

    for (let i = 0; i < 20; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const reviewer = users.find(u => u.role === 'admin' || u.role === 'hr');
        const noteType = noteTypes[Math.floor(Math.random() * noteTypes.length)];

        const notes = {
            positive: [
                'أداء ممتاز في المشروع الأخير',
                'التزام عالي بمواعيد العمل',
                'تعاون ممتاز مع الفريق',
                'مبادرة في حل المشاكل',
                'تطوير مهارات جديدة'
            ],
            negative: [
                'تأخير في تسليم المهام',
                'حاجة لتحسين التواصل',
                'عدم الالتزام بالمواعيد',
                'حاجة لتطوير المهارات التقنية'
            ],
            warning: [
                'تحذير بسبب التأخير المتكرر',
                'تحذير بسبب عدم اتباع الإجراءات',
                'تحذير نهائي قبل اتخاذ إجراء'
            ],
            commendation: [
                'شهادة تقدير للأداء المتميز',
                'تقدير لإنجاز المشروع في الوقت المحدد',
                'تقدير للمبادرة والإبداع'
            ]
        };

        const notesList = notes[noteType];
        const content = notesList[Math.floor(Math.random() * notesList.length)];

        // إنشاء relatedMonth بصيغة YYYY-MM
        const date = new Date();
        date.setMonth(date.getMonth() - Math.floor(Math.random() * 6)); // آخر 6 شهور
        const relatedMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        performanceNotes.push({
            user: user._id,
            addedBy: reviewer._id,
            noteType: noteType,
            content: content,
            relatedMonth: relatedMonth
        });
    }

    const createdNotes = await PerformanceNote.insertMany(performanceNotes);
    console.log(`✅ تم إنشاء ${createdNotes.length} ملاحظة أداء`);
    return createdNotes;
};

// إنشاء التقارير
const createReports = async (users, departments, attendanceRecords, leaveRequests) => {
    console.log('📊 إنشاء التقارير...');

    const reports = [];
    const admin = users.find(u => u.role === 'admin');

    // تقرير الموظفين
    reports.push({
        name: 'تقرير الموظفين الشامل',
        description: 'تقرير يحتوي على جميع بيانات الموظفين',
        category: 'employees',
        type: 'detailed',
        period: {
            startDate: new Date(2024, 0, 1),
            endDate: new Date(),
            periodType: 'yearly'
        },
        data: {
            users: users.map(user => ({
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                department: departments.find(d => d._id.toString() === user.department.toString()),
                createdAt: user.createdAt,
                isActive: user.isActive,
                address: user.address
            }))
        },
        summary: {
            totalRecords: users.length,
            totalUsers: users.length,
            averageValue: 0,
            percentageChange: 5.2,
            trend: 'up'
        },
        generatedBy: admin._id,
        status: 'completed'
    });

    // تقرير الحضور
    reports.push({
        name: 'تقرير الحضور الشهري',
        description: 'تقرير حضور الموظفين للشهر الماضي',
        category: 'attendance',
        type: 'monthly',
        period: {
            startDate: new Date(2024, new Date().getMonth() - 1, 1),
            endDate: new Date(),
            periodType: 'monthly'
        },
        data: {
            records: attendanceRecords.slice(0, 50).map(record => ({
                user: users.find(u => u._id.toString() === record.user.toString()),
                date: record.date,
                checkInTime: record.checkInTime,
                checkOutTime: record.checkOutTime,
                totalWorkedHours: record.totalWorkedHours,
                status: record.status,
                notes: record.notes
            }))
        },
        summary: {
            totalRecords: attendanceRecords.length,
            totalUsers: 12,
            averageValue: 8.2,
            percentageChange: 2.1,
            trend: 'stable'
        },
        generatedBy: admin._id,
        status: 'completed'
    });

    // تقرير الإجازات
    reports.push({
        name: 'تقرير الإجازات الربع سنوي',
        description: 'تقرير طلبات الإجازات للربع الأخير',
        category: 'leaves',
        type: 'summary',
        period: {
            startDate: new Date(2024, new Date().getMonth() - 3, 1),
            endDate: new Date(),
            periodType: 'quarterly'
        },
        data: {
            requests: leaveRequests.map(leave => ({
                user: users.find(u => u._id.toString() === leave.user.toString()),
                leaveType: leave.leaveType,
                startDate: leave.startDate,
                endDate: leave.endDate,
                totalDays: leave.totalDays,
                status: leave.status,
                reason: leave.reason,
                createdAt: leave.appliedDate,
                notes: leave.notes
            }))
        },
        summary: {
            totalRecords: leaveRequests.length,
            totalUsers: 8,
            averageValue: 4.5,
            percentageChange: -1.2,
            trend: 'down'
        },
        generatedBy: admin._id,
        status: 'completed'
    });

    // تقرير الأقسام
    reports.push({
        name: 'تقرير الأقسام التفصيلي',
        description: 'تقرير شامل عن جميع الأقسام وإحصائياتها',
        category: 'departments',
        type: 'detailed',
        period: {
            startDate: new Date(2024, 0, 1),
            endDate: new Date(),
            periodType: 'yearly'
        },
        data: {
            departments: departments.map(dept => ({
                name: dept.name,
                description: dept.description,
                isActive: dept.isActive,
                employeeCount: users.filter(u => u.department.toString() === dept._id.toString()).length,
                activeEmployees: users.filter(u => u.department.toString() === dept._id.toString() && u.isActive).length,
                inactiveEmployees: users.filter(u => u.department.toString() === dept._id.toString() && !u.isActive).length,
                createdAt: dept.createdAt,
                updatedAt: dept.updatedAt
            }))
        },
        summary: {
            totalRecords: departments.length,
            totalUsers: 0,
            averageValue: 3.2,
            percentageChange: 8.5,
            trend: 'up'
        },
        generatedBy: admin._id,
        status: 'completed'
    });

    const createdReports = await Report.insertMany(reports);
    console.log(`✅ تم إنشاء ${createdReports.length} تقرير`);
    return createdReports;
};

// إنشاء إعدادات النظام
const createSystemSettings = async (users) => {
    console.log('⚙️ إنشاء إعدادات النظام...');

    const admin = users.find(u => u.role === 'admin');

    const settings = {
        systemName: 'شركة الترو للموارد البشرية',
        systemDescription: 'نظام إدارة الموارد البشرية الذكي',
        companyLogo: '/assets/logo.png',
        workingHours: {
            start: '08:00',
            end: '17:00'
        },
        defaultLanguage: 'ar',
        timezone: 'Asia/Riyadh',
        currency: 'SAR',
        emailNotifications: true,
        smsNotifications: false,
        sessionTimeout: 480,
        maxLoginAttempts: 5,
        updatedBy: admin._id
    };

    const existingSettings = await SystemSettings.findOne();
    if (existingSettings) {
        await SystemSettings.findByIdAndUpdate(existingSettings._id, settings);
        console.log('✅ تم تحديث إعدادات النظام');
    } else {
        await SystemSettings.create(settings);
        console.log('✅ تم إنشاء إعدادات النظام');
    }
};

// الدالة الرئيسية
const resetAndSeedDatabase = async () => {
    try {
        console.log('🚀 بدء عملية إعادة تعيين وملء قاعدة البيانات...\n');

        await connectDB();

        // مسح قاعدة البيانات
        const adminUser = await clearDatabase();

        // إنشاء البيانات الجديدة
        const departments = await createDepartments();
        const users = await createUsers(departments, adminUser);
        const attendanceRecords = await createAttendanceRecords(users);
        const leaveRequests = await createLeaveRequests(users);
        const salaryRecords = await createSalaryRecords(users);
        const performanceNotes = await createPerformanceNotes(users);
        const reports = await createReports(users, departments, attendanceRecords, leaveRequests);
        await createSystemSettings(users);

        console.log('\n🎉 تم إكمال عملية إعادة تعيين وملء قاعدة البيانات بنجاح!');
        console.log('\n📋 ملخص البيانات المنشأة:');
        console.log(`👤 المستخدمين: ${users.length}`);
        console.log(`🏢 الأقسام: ${departments.length}`);
        console.log(`⏰ سجلات الحضور: ${attendanceRecords.length}`);
        console.log(`🏖️ طلبات الإجازات: ${leaveRequests.length}`);
        console.log(`💰 سجلات الرواتب: ${salaryRecords.length}`);
        console.log(`📝 ملاحظات الأداء: ${performanceNotes.length}`);
        console.log(`📊 التقارير: ${reports.length}`);
        console.log('⚙️ إعدادات النظام: محدثة');

        console.log('\n🔑 بيانات تسجيل الدخول:');
        console.log('👨‍💼 الأدمن:');
        console.log(`   البريد: ${adminUser.email}`);
        console.log(`   كلمة المرور: ${adminUser.email === 'admin@altrohrs.com' ? 'admin123' : 'كلمة المرور الحالية'}`);
        console.log('\n👥 المستخدمين الآخرين:');
        console.log('   كلمة المرور لجميع المستخدمين: 123456');

    } catch (error) {
        console.error('❌ خطأ في عملية إعادة التعيين:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 تم إغلاق الاتصال بقاعدة البيانات');
        process.exit(0);
    }
};

// تشغيل الدالة الرئيسية
if (require.main === module) {
    resetAndSeedDatabase();
}

module.exports = { resetAndSeedDatabase }; 