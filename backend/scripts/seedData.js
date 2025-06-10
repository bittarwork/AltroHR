const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('../models/User');
const Department = require('../models/Department');
const Attendance = require('../models/Attendance');

// Connect to MongoDB
const connectDB = require('../config/db');

const seedData = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Department.deleteMany({});
        await Attendance.deleteMany({});
        console.log('Cleared existing data');

        // Create departments
        const departments = await Department.insertMany([
            {
                name: 'تقنية المعلومات',
                description: 'قسم تطوير البرمجيات والدعم التقني',
                isActive: true
            },
            {
                name: 'الموارد البشرية',
                description: 'قسم إدارة الموظفين والتوظيف',
                isActive: true
            },
            {
                name: 'المحاسبة',
                description: 'قسم الشؤون المالية والمحاسبة',
                isActive: true
            },
            {
                name: 'المبيعات',
                description: 'قسم المبيعات وخدمة العملاء',
                isActive: true
            }
        ]);

        console.log('Created departments:', departments.length);

        // Create users
        const users = await User.insertMany([
            {
                name: 'أحمد محمد',
                email: 'admin@test.com',
                password: '123456',
                role: 'admin',
                department: departments[0]._id,
                position: 'مدير النظام',
                hireDate: new Date('2022-01-15'),
                salaryType: 'fixed',
                baseSalary: 8000,
                workHoursPerDay: 8,
                isActive: true
            },
            {
                name: 'فاطمة علي',
                email: 'hr@test.com',
                password: '123456',
                role: 'hr',
                department: departments[1]._id,
                position: 'مدير الموارد البشرية',
                hireDate: new Date('2022-03-10'),
                salaryType: 'fixed',
                baseSalary: 6500,
                workHoursPerDay: 8,
                isActive: true
            },
            {
                name: 'محمد عبدالله',
                email: 'employee@test.com',
                password: '123456',
                role: 'employee',
                department: departments[0]._id,
                position: 'مطور برمجيات',
                hireDate: new Date('2023-01-20'),
                salaryType: 'fixed',
                baseSalary: 5500,
                workHoursPerDay: 8,
                isActive: true
            },
            {
                name: 'نورا أحمد',
                email: 'employee2@test.com',
                password: '123456',
                role: 'employee',
                department: departments[2]._id,
                position: 'محاسبة',
                hireDate: new Date('2023-06-15'),
                salaryType: 'hourly',
                hourlyRate: 30,
                overtimeRate: 45,
                workHoursPerDay: 8,
                isActive: true
            },
            {
                name: 'خالد سعد',
                email: 'employee3@test.com',
                password: '123456',
                role: 'employee',
                department: departments[3]._id,
                position: 'مندوب مبيعات',
                hireDate: new Date('2023-09-01'),
                salaryType: 'fixed',
                baseSalary: 4500,
                workHoursPerDay: 8,
                isActive: true
            }
        ]);

        console.log('Created users:', users.length);

        // Create some sample attendance records for the past week
        const employee = users.find(u => u.role === 'employee');
        const attendanceRecords = [];

        for (let i = 7; i >= 1; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];

            // Random clock in time between 8:00-9:30 AM
            const clockInHour = 8 + Math.random() * 1.5;
            const clockInTime = new Date(date);
            clockInTime.setHours(Math.floor(clockInHour), Math.floor((clockInHour % 1) * 60));

            // Random clock out time between 4:30-6:00 PM
            const clockOutHour = 16.5 + Math.random() * 1.5;
            const clockOutTime = new Date(date);
            clockOutTime.setHours(Math.floor(clockOutHour), Math.floor((clockOutHour % 1) * 60));

            // Calculate hours
            const diffMs = clockOutTime - clockInTime;
            const hours = Math.round((diffMs / 1000 / 60 / 60) * 100) / 100;
            const overtimeHours = hours > 8 ? Math.round((hours - 8) * 100) / 100 : 0;

            attendanceRecords.push({
                user: employee._id,
                date: dateString,
                clockIn: clockInTime,
                clockOut: clockOutTime,
                totalWorkedHours: hours,
                overtimeHours: overtimeHours
            });
        }

        await Attendance.insertMany(attendanceRecords);
        console.log('Created attendance records:', attendanceRecords.length);

        console.log('\n=== تم إنشاء البيانات التجريبية بنجاح ===');
        console.log('\nبيانات تسجيل الدخول:');
        console.log('1. Admin: admin@test.com / 123456');
        console.log('2. HR: hr@test.com / 123456');
        console.log('3. Employee: employee@test.com / 123456');
        console.log('4. Employee 2: employee2@test.com / 123456');
        console.log('5. Employee 3: employee3@test.com / 123456');
        console.log('\nالأقسام المتاحة:');
        departments.forEach((dept, index) => {
            console.log(`${index + 1}. ${dept.name}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

// Run the seed function
if (require.main === module) {
    seedData();
}

module.exports = seedData; 