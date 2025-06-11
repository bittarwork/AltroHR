const Report = require('../models/Report');
const User = require('../models/User');
const Department = require('../models/Department');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const MonthlyReport = require('../models/MonthlyReport');

const ReportsController = {

    // جلب جميع التقارير مع الفلترة
    async getAllReports(req, res) {
        try {
            const { category, type, page = 1, limit = 10 } = req.query;

            // بناء الفلتر
            const filter = { status: 'completed' };
            if (category) filter.category = category;
            if (type) filter.type = type;

            const skip = (page - 1) * limit;
            const totalReports = await Report.countDocuments(filter);

            const reports = await Report.find(filter)
                .populate('generatedBy', 'name email role')
                .sort({ generatedAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            res.json({
                reports,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalReports / limit),
                    totalReports
                }
            });

        } catch (error) {
            console.error('خطأ في جلب التقارير:', error);
            res.status(500).json({
                message: 'فشل في جلب التقارير',
                error: error.message
            });
        }
    },

    // جلب تقرير محدد
    async getReportById(req, res) {
        try {
            const report = await Report.findById(req.params.id)
                .populate('generatedBy', 'name email role');

            if (!report) {
                return res.status(404).json({ message: 'التقرير غير موجود' });
            }

            res.json(report);

        } catch (error) {
            console.error('خطأ في جلب التقرير:', error);
            res.status(500).json({
                message: 'فشل في جلب التقرير',
                error: error.message
            });
        }
    },

    // إنشاء تقرير الموظفين
    async generateEmployeesReport(req, res) {
        try {
            const { startDate, endDate, departmentId } = req.body;
            const userId = req.user._id;

            // بناء الفلتر
            const userFilter = { isActive: true };
            if (departmentId) userFilter.department = departmentId;

            // جلب البيانات
            const users = await User.find(userFilter)
                .populate('department', 'name')
                .sort({ createdAt: -1 });

            // تجميع الإحصائيات
            const totalUsers = users.length;
            const usersByRole = users.reduce((acc, user) => {
                acc[user.role] = (acc[user.role] || 0) + 1;
                return acc;
            }, {});

            const reportData = {
                users,
                statistics: {
                    total: totalUsers,
                    byRole: usersByRole,
                    byDepartment: users.reduce((acc, user) => {
                        const deptName = user.department?.name || 'غير محدد';
                        acc[deptName] = (acc[deptName] || 0) + 1;
                        return acc;
                    }, {})
                }
            };

            // إنشاء التقرير
            const report = await Report.create({
                name: 'تقرير الموظفين',
                description: `تقرير شامل عن الموظفين`,
                category: 'employees',
                type: 'summary',
                period: {
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    periodType: 'custom'
                },
                data: reportData,
                summary: {
                    totalRecords: totalUsers,
                    totalUsers: totalUsers,
                    trend: 'stable'
                },
                generatedBy: userId,
                fileSize: JSON.stringify(reportData).length
            });

            res.status(201).json({
                message: 'تم إنشاء تقرير الموظفين بنجاح',
                reportId: report._id,
                summary: report.summary
            });

        } catch (error) {
            console.error('خطأ في إنشاء تقرير الموظفين:', error);
            res.status(500).json({
                message: 'فشل في إنشاء تقرير الموظفين',
                error: error.message
            });
        }
    },

    // إنشاء تقرير الحضور
    async generateAttendanceReport(req, res) {
        try {
            const { startDate, endDate, departmentId } = req.body;
            const userId = req.user._id;

            // بناء الفلتر
            const attendanceFilter = {
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            };

            if (departmentId) {
                const departmentUsers = await User.find({ department: departmentId }).select('_id');
                attendanceFilter.user = { $in: departmentUsers.map(u => u._id) };
            }

            // جلب بيانات الحضور
            const attendanceRecords = await Attendance.find(attendanceFilter)
                .populate('user', 'name email department')
                .sort({ date: -1 });

            // تجميع الإحصائيات
            const totalRecords = attendanceRecords.length;
            const presentDays = attendanceRecords.filter(r => r.status === 'present').length;
            const absentDays = attendanceRecords.filter(r => r.status === 'absent').length;
            const totalHours = attendanceRecords.reduce((sum, r) => sum + (r.totalWorkedHours || 0), 0);

            const reportData = {
                records: attendanceRecords,
                statistics: {
                    totalRecords,
                    presentDays,
                    absentDays,
                    totalHours: Math.round(totalHours * 100) / 100
                }
            };

            // إنشاء التقرير
            const report = await Report.create({
                name: 'تقرير الحضور والانصراف',
                description: `تقرير الحضور من ${startDate} إلى ${endDate}`,
                category: 'attendance',
                type: 'detailed',
                period: {
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    periodType: 'custom'
                },
                data: reportData,
                summary: {
                    totalRecords,
                    trend: 'stable'
                },
                generatedBy: userId,
                fileSize: JSON.stringify(reportData).length
            });

            res.status(201).json({
                message: 'تم إنشاء تقرير الحضور بنجاح',
                reportId: report._id,
                summary: report.summary
            });

        } catch (error) {
            console.error('خطأ في إنشاء تقرير الحضور:', error);
            res.status(500).json({
                message: 'فشل في إنشاء تقرير الحضور',
                error: error.message
            });
        }
    },

    // إنشاء تقرير الإجازات
    async generateLeavesReport(req, res) {
        try {
            const { startDate, endDate, status, departmentId } = req.body;
            const userId = req.user._id;

            // بناء الفلتر
            const leaveFilter = {
                startDate: { $gte: new Date(startDate) },
                endDate: { $lte: new Date(endDate) }
            };

            if (status) leaveFilter.status = status;

            if (departmentId) {
                const departmentUsers = await User.find({ department: departmentId }).select('_id');
                leaveFilter.user = { $in: departmentUsers.map(u => u._id) };
            }

            // جلب بيانات الإجازات
            const leaveRequests = await LeaveRequest.find(leaveFilter)
                .populate('user', 'name email department')
                .populate('user.department', 'name')
                .sort({ startDate: -1 });

            // تجميع الإحصائيات
            const totalRequests = leaveRequests.length;
            const approvedRequests = leaveRequests.filter(l => l.status === 'approved').length;
            const pendingRequests = leaveRequests.filter(l => l.status === 'pending').length;
            const rejectedRequests = leaveRequests.filter(l => l.status === 'rejected').length;

            const totalDays = leaveRequests.reduce((sum, l) => sum + l.totalDays, 0);
            const approvedDays = leaveRequests.filter(l => l.status === 'approved')
                .reduce((sum, l) => sum + l.totalDays, 0);

            const approvalRate = totalRequests > 0 ? (approvedRequests / totalRequests * 100) : 0;

            const reportData = {
                requests: leaveRequests,
                statistics: {
                    totalRequests,
                    approvedRequests,
                    pendingRequests,
                    rejectedRequests,
                    totalDays,
                    approvedDays,
                    approvalRate: Math.round(approvalRate * 100) / 100,
                    averageDaysPerRequest: totalRequests > 0 ? Math.round((totalDays / totalRequests) * 100) / 100 : 0,
                    byLeaveType: leaveRequests.reduce((acc, leave) => {
                        acc[leave.leaveType] = (acc[leave.leaveType] || 0) + 1;
                        return acc;
                    }, {})
                }
            };

            // إنشاء التقرير
            const report = await Report.create({
                name: 'تقرير الإجازات',
                description: `تقرير الإجازات من ${startDate} إلى ${endDate}`,
                category: 'leaves',
                type: 'summary',
                period: {
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    periodType: 'custom'
                },
                data: reportData,
                summary: {
                    totalRecords: totalRequests,
                    averageValue: approvalRate,
                    trend: approvalRate >= 80 ? 'up' : approvalRate >= 60 ? 'stable' : 'down'
                },
                generatedBy: userId,
                filters: {
                    department: departmentId || null,
                    status: status || null
                },
                fileSize: JSON.stringify(reportData).length
            });

            res.status(201).json({
                message: 'تم إنشاء تقرير الإجازات بنجاح',
                reportId: report._id,
                summary: report.summary
            });

        } catch (error) {
            console.error('خطأ في إنشاء تقرير الإجازات:', error);
            res.status(500).json({
                message: 'فشل في إنشاء تقرير الإجازات',
                error: error.message
            });
        }
    },

    // إنشاء تقرير الأقسام
    async generateDepartmentsReport(req, res) {
        try {
            const userId = req.user._id;

            // جلب بيانات الأقسام
            const departments = await Department.find()
                .populate({
                    path: 'employees',
                    select: 'name email isActive role'
                })
                .sort({ name: 1 });

            // جلب إحصائيات إضافية
            const departmentStats = await Promise.all(
                departments.map(async (dept) => {
                    const employeeCount = await User.countDocuments({ department: dept._id });
                    const activeEmployees = await User.countDocuments({
                        department: dept._id,
                        isActive: true
                    });

                    return {
                        _id: dept._id,
                        name: dept.name,
                        description: dept.description,
                        isActive: dept.isActive,
                        employeeCount,
                        activeEmployees,
                        inactiveEmployees: employeeCount - activeEmployees
                    };
                })
            );

            const reportData = {
                departments: departmentStats,
                statistics: {
                    totalDepartments: departments.length,
                    activeDepartments: departments.filter(d => d.isActive).length,
                    totalEmployees: departmentStats.reduce((sum, d) => sum + d.employeeCount, 0),
                    averageEmployeesPerDepartment: Math.round(
                        (departmentStats.reduce((sum, d) => sum + d.employeeCount, 0) / departments.length) * 100
                    ) / 100,
                    emptyDepartments: departmentStats.filter(d => d.employeeCount === 0).length
                }
            };

            // إنشاء التقرير
            const report = await Report.create({
                name: 'تقرير الأقسام',
                description: 'تقرير شامل عن جميع الأقسام وإحصائياتها',
                category: 'departments',
                type: 'summary',
                period: {
                    startDate: new Date(),
                    endDate: new Date(),
                    periodType: 'custom'
                },
                data: reportData,
                summary: {
                    totalRecords: departments.length,
                    totalUsers: reportData.statistics.totalEmployees,
                    averageValue: reportData.statistics.averageEmployeesPerDepartment,
                    trend: 'stable'
                },
                generatedBy: userId,
                fileSize: JSON.stringify(reportData).length
            });

            res.status(201).json({
                message: 'تم إنشاء تقرير الأقسام بنجاح',
                reportId: report._id,
                summary: report.summary
            });

        } catch (error) {
            console.error('خطأ في إنشاء تقرير الأقسام:', error);
            res.status(500).json({
                message: 'فشل في إنشاء تقرير الأقسام',
                error: error.message
            });
        }
    },

    // حذف تقرير
    async deleteReport(req, res) {
        try {
            const report = await Report.findById(req.params.id);

            if (!report) {
                return res.status(404).json({ message: 'التقرير غير موجود' });
            }

            // التحقق من الصلاحيات
            if (report.generatedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'ليس لديك صلاحية لحذف هذا التقرير' });
            }

            await Report.findByIdAndDelete(req.params.id);

            res.json({ message: 'تم حذف التقرير بنجاح' });

        } catch (error) {
            console.error('خطأ في حذف التقرير:', error);
            res.status(500).json({
                message: 'فشل في حذف التقرير',
                error: error.message
            });
        }
    },

    // جلب إحصائيات التقارير
    async getReportsStatistics(req, res) {
        try {
            const stats = await Report.getReportsStatistics();
            res.json(stats);

        } catch (error) {
            console.error('خطأ في جلب إحصائيات التقارير:', error);
            res.status(500).json({
                message: 'فشل في جلب إحصائيات التقارير',
                error: error.message
            });
        }
    }
};

module.exports = ReportsController; 