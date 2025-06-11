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
            const departmentId = req.params.id;

            // تحقق من وجود مستخدمين مرتبطين بهذا القسم
            const userExists = await User.findOne({ department: departmentId });
            if (userExists) {
                return res.status(400).json({
                    message: 'Cannot delete department. It is assigned to one or more users.',
                });
            }

            // حذف القسم إن لم يكن مرتبطًا
            const deleted = await Department.findByIdAndDelete(departmentId);
            if (!deleted) {
                return res.status(404).json({ message: 'Department not found' });
            }

            res.json({ message: 'Department deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to delete department', error: err.message });
        }
    },

    async getAllDepartments(req, res) {
        try {
            const { search = '', status = '' } = req.query;

            // بناء شرط البحث
            const query = {};

            // بحث بالاسم (جزئي)
            if (search) {
                query.name = { $regex: search, $options: 'i' }; // case-insensitive
            }

            // فلترة حسب الحالة
            if (status === 'active') {
                query.isActive = true;
            } else if (status === 'inactive') {
                query.isActive = false;
            }

            // جلب الأقسام مع عدد الموظفين في كل قسم
            const departments = await Department.aggregate([
                { $match: query },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: 'department',
                        as: 'employees'
                    }
                },
                {
                    $addFields: {
                        employeeCount: { $size: '$employees' }
                    }
                },
                {
                    $project: {
                        employees: 0 // لا نحتاج قائمة الموظفين، فقط العدد
                    }
                },
                { $sort: { createdAt: -1 } }
            ]);

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

            // جلب عدد الموظفين في هذا القسم
            const employeeCount = await User.countDocuments({ department: req.params.id });

            res.json({
                ...department.toObject(),
                employeeCount
            });
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
    },

    // ✅ جلب إحصائيات الأقسام
    async getDepartmentStats(req, res) {
        try {
            const stats = await Department.aggregate([
                {
                    $group: {
                        _id: null,
                        totalDepartments: { $sum: 1 },
                        activeDepartments: {
                            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] }
                        },
                        inactiveDepartments: {
                            $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] }
                        }
                    }
                }
            ]);

            // حساب إجمالي الموظفين في جميع الأقسام
            const totalEmployees = await User.countDocuments({ department: { $exists: true, $ne: null } });

            // أقسام بدون موظفين
            const emptyDepartments = await Department.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: 'department',
                        as: 'employees'
                    }
                },
                {
                    $match: {
                        employees: { $size: 0 }
                    }
                },
                {
                    $count: "emptyDepartmentsCount"
                }
            ]);

            const result = {
                totalDepartments: stats[0]?.totalDepartments || 0,
                activeDepartments: stats[0]?.activeDepartments || 0,
                inactiveDepartments: stats[0]?.inactiveDepartments || 0,
                totalEmployees,
                emptyDepartments: emptyDepartments[0]?.emptyDepartmentsCount || 0
            };

            res.json(result);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch department statistics', error: err.message });
        }
    }
};

module.exports = DepartmentController;
