const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User'); // Adjust the path as needed
const Department = require('../models/Department'); // Optional unless needed

dotenv.config();

mongoose
    .connect("mongodb://127.0.0.1:27017/ALTROHR", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('✅ Connected to MongoDB');
        getAdminInfo();
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
    });

async function getAdminInfo() {
    try {
        const admin = await User.findOne({ email: 'admin@example.com' }).populate('department');

        if (!admin) {
            console.log('⚠️ Admin account not found.');
            return process.exit();
        }

        console.log('✅ Admin account details:\n');
        console.log({
            name: admin.name,
            email: admin.email,
            role: admin.role,
            position: admin.position,
            hireDate: admin.hireDate,
            isActive: admin.isActive,
            salaryType: admin.salaryType,
            baseSalary: admin.baseSalary,
            hourlyRate: admin.hourlyRate,
            overtimeRate: admin.overtimeRate,
            workHoursPerDay: admin.workHoursPerDay,
            lastLogin: admin.lastLogin,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
            department: {
                id: admin.department._id,
                name: admin.department.name,
                description: admin.department.description,
                isActive: admin.department.isActive,
            },
        });

        process.exit();
    } catch (error) {
        console.error('❌ Error retrieving admin info:', error);
        process.exit(1);
    }
}
