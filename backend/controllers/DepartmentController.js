const Department = require('../models/Department');
const User = require('../models/User');

const DepartmentController = {
    // ✅ إنشاء قسم جديد
    async createDepartment(req, res) {
        try {
            const { name, description } = req.body;

            const exists = await Department.findOne({ name });
            if (exists) return res.status(400).json({ message: 'Department already exists' });

            const department = new Department({ name, description });
            await department.save();

            res.status(201).json(department);
        } catch (err) {
            res.status(500).json({ message: 'Failed to create department', error: err.message });
        }
    },

    // ✅ تعديل بيانات القسم
    async updateDepartment(req, res) {
        try {
            const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!department) return res.status(404).json({ message: 'Department not found' });

            res.json(department);
        } catch (err) {
            res.status(500).json({ message: 'Failed to update department', error: err.message });
        }
    },

    // ✅ حذف قسم
    async deleteDepartment(req, res) {
        try {
            const department = await Department.findByIdAndDelete(req.params.id);
            if (!department) return res.status(404).json({ message: 'Department not found' });

            res.json({ message: 'Department deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to delete department', error: err.message });
        }
    },

    // ✅ جلب كل الأقسام
    async getAllDepartments(req, res) {
        try {
            const departments = await Department.find();
            res.json(departments);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch departments', error: err.message });
        }
    },

    // ✅ جلب قسم محدد
    async getDepartmentById(req, res) {
        try {
            const department = await Department.findById(req.params.id);
            if (!department) return res.status(404).json({ message: 'Department not found' });

            res.json(department);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch department', error: err.message });
        }
    },

    // ✅ جلب الموظفين ضمن قسم معين
    async getDepartmentUsers(req, res) {
        try {
            const users = await User.find({ department: req.params.id }).select('-password').populate('department');
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch department users', error: err.message });
        }
    }
};

module.exports = DepartmentController;
