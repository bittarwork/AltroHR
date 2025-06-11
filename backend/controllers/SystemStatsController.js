const User = require("../models/User");
const Department = require("../models/Department");

// إحصائيات عامة للنظام
const getSystemStats = async (req, res) => {
    try {
        // إحصائيات المستخدمين
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const inactiveUsers = totalUsers - activeUsers;
        const employees = await User.countDocuments({ role: "employee" });
        const admins = await User.countDocuments({ role: "admin" });

        // المستخدمين الجدد خلال 30 يوم الماضية
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newUsersLast30Days = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        // إحصائيات الأقسام
        const totalDepartments = await Department.countDocuments();
        const activeDepartments = await Department.countDocuments({ isActive: true });
        const inactiveDepartments = totalDepartments - activeDepartments;

        // الأقسام مع عدد الموظفين
        const departmentsWithEmployeeCount = await Department.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "department",
                    as: "employees"
                }
            },
            {
                $project: {
                    name: 1,
                    isActive: 1,
                    employeeCount: { $size: "$employees" }
                }
            }
        ]);

        const emptyDepartments = departmentsWithEmployeeCount.filter(dept => dept.employeeCount === 0).length;
        const totalEmployeesInDepartments = departmentsWithEmployeeCount.reduce(
            (sum, dept) => sum + dept.employeeCount,
            0
        );

        // إحصائيات إضافية
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const usersCreatedToday = await User.countDocuments({
            createdAt: { $gte: startOfToday }
        });

        const stats = {
            users: {
                total: totalUsers,
                active: activeUsers,
                inactive: inactiveUsers,
                employees: employees,
                admins: admins,
                newLast30Days: newUsersLast30Days,
                createdToday: usersCreatedToday
            },
            departments: {
                total: totalDepartments,
                active: activeDepartments,
                inactive: inactiveDepartments,
                empty: emptyDepartments,
                totalEmployees: totalEmployeesInDepartments
            },
            system: {
                lastUpdate: new Date(),
                version: "2.1.0"
            }
        };

        res.json(stats);
    } catch (error) {
        console.error("خطأ في جلب إحصائيات النظام:", error);
        res.status(500).json({
            message: "خطأ في الخادم",
            error: error.message
        });
    }
};

module.exports = {
    getSystemStats
}; 