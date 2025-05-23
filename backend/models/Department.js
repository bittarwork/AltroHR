const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Department name is required'],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;
