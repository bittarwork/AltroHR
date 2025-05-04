const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User'); // Adjust the path as needed
const Department = require('../models/Department'); // Adjust the path as needed

dotenv.config();

mongoose
    .connect("mongodb://127.0.0.1:27017/ALTROHR", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('✅ Connected to MongoDB');
        initializeSystem();
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
    });

async function initializeSystem() {
    try {
        // Step 1: Create core departments if not exist
        const departments = [
            { name: 'General Management', description: 'Handles all administrative operations' },
            { name: 'Human Resources', description: 'Responsible for recruitment and staff' },
            { name: 'IT Department', description: 'Manages technical systems and support' },
            { name: 'Finance', description: 'Handles financial and payroll matters' },
        ];

        const departmentMap = {};

        for (const dept of departments) {
            let department = await Department.findOne({ name: dept.name });
            if (!department) {
                department = await Department.create(dept);
                console.log(`✅ Created department: ${dept.name}`);
            } else {
                console.log(`ℹ️ Department already exists: ${dept.name}`);
            }
            departmentMap[dept.name] = department._id;
        }

        // Step 2: Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('⚠️ Admin account already exists');
            return process.exit();
        }

        // Step 3: Create admin account
        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@example.com',
            password: '12345678', // Will be hashed automatically
            role: 'admin',
            department: departmentMap['General Management'],
            position: 'System Administrator',
            hireDate: new Date('2022-01-01'),
            isActive: true,
            salaryType: 'fixed',
            baseSalary: 7000,
            hourlyRate: 0,
            overtimeRate: 0,
            workHoursPerDay: 8,
            lastLogin: null,
        });

        console.log('✅ Admin account created successfully:');
        console.log(admin);
        process.exit();
    } catch (error) {
        console.error('❌ Error during setup:', error);
        process.exit(1);
    }
}
