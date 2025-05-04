const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
        },
        role: {
            type: String,
            enum: ['admin', 'hr', 'employee'],
            default: 'employee',
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            required: true,
        },
        position: {
            type: String,
            required: [true, 'Position is required'],
        },
        hireDate: {
            type: Date,
            required: [true, 'Hire date is required'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },

        // 💰 إعدادات الرواتب وساعات العمل
        salaryType: {
            type: String,
            enum: ['fixed', 'hourly'],
            default: 'fixed',
        },
        baseSalary: {
            type: Number,
            default: 0, // يتم استخدامه إذا كان fixed
        },
        hourlyRate: {
            type: Number,
            default: 0, // يتم استخدامه إذا كان hourly
        },
        overtimeRate: {
            type: Number,
            default: 0, // مثلاً: 1.5 * hourlyRate
        },
        workHoursPerDay: {
            type: Number,
            default: 8, // عدد الساعات الطبيعية لليوم
        },
        lastLogin: {
            type: Date,
        },

    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


const User = mongoose.model('User', userSchema);
module.exports = User;
