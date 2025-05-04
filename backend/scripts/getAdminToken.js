const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Department = require('../models/Department');

dotenv.config();

mongoose
    .connect("mongodb://127.0.0.1:27017/ALTROHR", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('✅ Connected to MongoDB');
        getAdminToken();
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
    });

async function getAdminToken() {
    try {
        const admin = await User.findOne({ email: 'admin@example.com' }).populate('department');

        if (!admin) {
            console.log('⚠️ Admin not found');
            return process.exit();
        }

        // 🔐 Generate JWT
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        console.log('✅ Admin information and token:\n');
        console.log({
            name: admin.name,
            email: admin.email,
            role: admin.role,
            department: {
                id: admin.department._id,
                name: admin.department.name,
            },
            token,
        });

        process.exit();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}
