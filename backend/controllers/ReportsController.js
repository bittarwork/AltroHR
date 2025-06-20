const Report = require('../models/Report');
const User = require('../models/User');
const Department = require('../models/Department');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const MonthlyReport = require('../models/MonthlyReport');
const { Parser } = require('json2csv');

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
    },

    // تحميل تقرير الموظفين بصيغة CSV
    async downloadEmployeesReportCSV(req, res) {
        try {
            const { startDate, endDate, departmentId } = req.query;

            // بناء الفلتر
            const userFilter = { isActive: true };
            if (departmentId) userFilter.department = departmentId;

            // جلب البيانات
            const users = await User.find(userFilter)
                .populate('department', 'name')
                .sort({ createdAt: -1 });

            // تحضير البيانات للـ CSV
            const csvData = users.map(user => ({
                'الاسم': user.name,
                'البريد الإلكتروني': user.email,
                'الهاتف': user.phone || 'غير محدد',
                'الوظيفة': user.role === 'admin' ? 'مدير' :
                    user.role === 'hr' ? 'موارد بشرية' :
                        user.role === 'employee' ? 'موظف' :
                            user.role === 'technician' ? 'فني' : user.role,
                'القسم': user.department?.name || 'غير محدد',
                'تاريخ التوظيف': user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : 'غير محدد',
                'الحالة': user.isActive ? 'نشط' : 'غير نشط',
                'العنوان': user.address || 'غير محدد'
            }));

            // تحديد الحقول
            const fields = [
                'الاسم', 'البريد الإلكتروني', 'الهاتف', 'الوظيفة',
                'القسم', 'تاريخ التوظيف', 'الحالة', 'العنوان'
            ];

            // تحويل إلى CSV
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(csvData);

            // إعداد الاستجابة
            const fileName = `تقرير_الموظفين_${new Date().toISOString().split('T')[0]}.csv`;

            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Length', Buffer.byteLength(csv, 'utf8'));

            // إضافة BOM للدعم العربي
            res.write('\ufeff');
            res.end(csv);

        } catch (error) {
            console.error('خطأ في تحميل تقرير الموظفين:', error);
            res.status(500).json({
                message: 'فشل في تحميل تقرير الموظفين',
                error: error.message
            });
        }
    },

    // تحميل تقرير الحضور بصيغة CSV
    async downloadAttendanceReportCSV(req, res) {
        try {
            const { startDate, endDate, departmentId } = req.query;

            // بناء الفلتر
            const attendanceFilter = {
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };

            if (departmentId) {
                const departmentUsers = await User.find({ department: departmentId }).select('_id');
                attendanceFilter.user = { $in: departmentUsers.map(u => u._id) };
            }

            // جلب بيانات الحضور
            const attendanceRecords = await Attendance.find(attendanceFilter)
                .populate('user', 'name email department')
                .populate('user.department', 'name')
                .sort({ date: -1 });

            // تحضير البيانات للـ CSV
            const csvData = attendanceRecords.map(record => ({
                'اسم الموظف': record.user?.name || 'غير محدد',
                'البريد الإلكتروني': record.user?.email || 'غير محدد',
                'القسم': record.user?.department?.name || 'غير محدد',
                'التاريخ': new Date(record.date).toLocaleDateString('ar-SA'),
                'وقت الحضور': record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString('ar-SA') : 'لم يسجل',
                'وقت الانصراف': record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString('ar-SA') : 'لم يسجل',
                'إجمالي الساعات': record.totalWorkedHours || 0,
                'الحالة': record.status === 'present' ? 'حاضر' :
                    record.status === 'absent' ? 'غائب' :
                        record.status === 'late' ? 'متأخر' : record.status,
                'ملاحظات': record.notes || 'لا توجد ملاحظات'
            }));

            // تحديد الحقول
            const fields = [
                'اسم الموظف', 'البريد الإلكتروني', 'القسم', 'التاريخ',
                'وقت الحضور', 'وقت الانصراف', 'إجمالي الساعات', 'الحالة', 'ملاحظات'
            ];

            // تحويل إلى CSV
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(csvData);

            // إعداد الاستجابة
            const fileName = `تقرير_الحضور_${startDate}_إلى_${endDate}.csv`;

            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Length', Buffer.byteLength(csv, 'utf8'));

            // إضافة BOM للدعم العربي
            res.write('\ufeff');
            res.end(csv);

        } catch (error) {
            console.error('خطأ في تحميل تقرير الحضور:', error);
            res.status(500).json({
                message: 'فشل في تحميل تقرير الحضور',
                error: error.message
            });
        }
    },

    // تحميل تقرير الإجازات بصيغة CSV
    async downloadLeavesReportCSV(req, res) {
        try {
            const { startDate, endDate, status, departmentId } = req.query;

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

            // تحضير البيانات للـ CSV
            const csvData = leaveRequests.map(leave => ({
                'اسم الموظف': leave.user?.name || 'غير محدد',
                'البريد الإلكتروني': leave.user?.email || 'غير محدد',
                'القسم': leave.user?.department?.name || 'غير محدد',
                'نوع الإجازة': leave.leaveType === 'annual' ? 'سنوية' :
                    leave.leaveType === 'sick' ? 'مرضية' :
                        leave.leaveType === 'emergency' ? 'طارئة' : leave.leaveType,
                'تاريخ البداية': new Date(leave.startDate).toLocaleDateString('ar-SA'),
                'تاريخ النهاية': new Date(leave.endDate).toLocaleDateString('ar-SA'),
                'عدد الأيام': leave.totalDays,
                'الحالة': leave.status === 'pending' ? 'في الانتظار' :
                    leave.status === 'approved' ? 'موافق عليها' :
                        leave.status === 'rejected' ? 'مرفوضة' : leave.status,
                'سبب الإجازة': leave.reason || 'غير محدد',
                'تاريخ الطلب': new Date(leave.createdAt).toLocaleDateString('ar-SA'),
                'ملاحظات': leave.notes || 'لا توجد ملاحظات'
            }));

            // تحديد الحقول
            const fields = [
                'اسم الموظف', 'البريد الإلكتروني', 'القسم', 'نوع الإجازة',
                'تاريخ البداية', 'تاريخ النهاية', 'عدد الأيام', 'الحالة',
                'سبب الإجازة', 'تاريخ الطلب', 'ملاحظات'
            ];

            // تحويل إلى CSV
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(csvData);

            // إعداد الاستجابة
            const fileName = `تقرير_الإجازات_${startDate}_إلى_${endDate}.csv`;

            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Length', Buffer.byteLength(csv, 'utf8'));

            // إضافة BOM للدعم العربي
            res.write('\ufeff');
            res.end(csv);

        } catch (error) {
            console.error('خطأ في تحميل تقرير الإجازات:', error);
            res.status(500).json({
                message: 'فشل في تحميل تقرير الإجازات',
                error: error.message
            });
        }
    },

    // تحميل تقرير الأقسام بصيغة CSV
    async downloadDepartmentsReportCSV(req, res) {
        try {
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
                        'اسم القسم': dept.name,
                        'الوصف': dept.description || 'غير محدد',
                        'حالة القسم': dept.isActive ? 'نشط' : 'غير نشط',
                        'إجمالي الموظفين': employeeCount,
                        'الموظفون النشطون': activeEmployees,
                        'الموظفون غير النشطون': employeeCount - activeEmployees,
                        'تاريخ الإنشاء': new Date(dept.createdAt).toLocaleDateString('ar-SA'),
                        'آخر تحديث': new Date(dept.updatedAt).toLocaleDateString('ar-SA')
                    };
                })
            );

            // تحديد الحقول
            const fields = [
                'اسم القسم', 'الوصف', 'حالة القسم', 'إجمالي الموظفين',
                'الموظفون النشطون', 'الموظفون غير النشطون', 'تاريخ الإنشاء', 'آخر تحديث'
            ];

            // تحويل إلى CSV
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(departmentStats);

            // إعداد الاستجابة
            const fileName = `تقرير_الأقسام_${new Date().toISOString().split('T')[0]}.csv`;

            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Length', Buffer.byteLength(csv, 'utf8'));

            // إضافة BOM للدعم العربي
            res.write('\ufeff');
            res.end(csv);

        } catch (error) {
            console.error('خطأ في تحميل تقرير الأقسام:', error);
            res.status(500).json({
                message: 'فشل في تحميل تقرير الأقسام',
                error: error.message
            });
        }
    },

    // تحميل تقرير محدد بصيغة CSV
    async downloadReportCSV(req, res) {
        try {
            const { id } = req.params;

            const report = await Report.findById(id)
                .populate('generatedBy', 'name email role');

            if (!report) {
                return res.status(404).json({ message: 'التقرير غير موجود' });
            }

            // إضافة logs تشخيصية
            console.log('تحميل التقرير:', {
                id: report._id,
                category: report.category,
                type: report.type,
                hasData: !!report.data,
                dataKeys: report.data ? Object.keys(report.data) : null,
                dataStructure: report.data ? JSON.stringify(report.data, null, 2).substring(0, 500) : null
            });

            // التحقق من وجود البيانات
            if (!report.data) {
                return res.status(400).json({ message: 'التقرير لا يحتوي على بيانات للتحميل' });
            }

            let csvData = [];
            let fields = [];
            let fileName = '';

            // تحديد نوع التقرير وتحضير البيانات
            switch (report.category) {
                case 'employees':
                    console.log('تحليل تقرير الموظفين:', {
                        hasUsers: !!report.data.users,
                        usersType: typeof report.data.users,
                        usersLength: Array.isArray(report.data.users) ? report.data.users.length : 'ليس مصفوفة',
                        firstUser: Array.isArray(report.data.users) && report.data.users.length > 0 ? report.data.users[0] : null
                    });

                    if (!report.data.users || !Array.isArray(report.data.users)) {
                        return res.status(400).json({ message: 'بيانات الموظفين غير متوفرة في التقرير' });
                    }
                    csvData = report.data.users.map(user => ({
                        'الاسم': user.name || 'غير محدد',
                        'البريد الإلكتروني': user.email || 'غير محدد',
                        'الهاتف': user.phone || 'غير محدد',
                        'الوظيفة': user.role === 'admin' ? 'مدير' :
                            user.role === 'hr' ? 'موارد بشرية' :
                                user.role === 'employee' ? 'موظف' :
                                    user.role === 'technician' ? 'فني' : user.role || 'غير محدد',
                        'القسم': user.department?.name || 'غير محدد',
                        'تاريخ التوظيف': user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : 'غير محدد',
                        'الحالة': user.isActive ? 'نشط' : 'غير نشط',
                        'العنوان': user.address || 'غير محدد'
                    }));
                    fields = ['الاسم', 'البريد الإلكتروني', 'الهاتف', 'الوظيفة', 'القسم', 'تاريخ التوظيف', 'الحالة', 'العنوان'];
                    fileName = `تقرير_الموظفين_${report._id}.csv`;
                    break;

                case 'attendance':
                    console.log('تحليل تقرير الحضور:', {
                        hasRecords: !!report.data.records,
                        recordsType: typeof report.data.records,
                        recordsLength: Array.isArray(report.data.records) ? report.data.records.length : 'ليس مصفوفة',
                        firstRecord: Array.isArray(report.data.records) && report.data.records.length > 0 ? report.data.records[0] : null
                    });

                    if (!report.data.records || !Array.isArray(report.data.records)) {
                        return res.status(400).json({ message: 'بيانات الحضور غير متوفرة في التقرير' });
                    }
                    csvData = report.data.records.map(record => ({
                        'اسم الموظف': record.user?.name || 'غير محدد',
                        'البريد الإلكتروني': record.user?.email || 'غير محدد',
                        'القسم': record.user?.department?.name || 'غير محدد',
                        'التاريخ': record.date ? new Date(record.date).toLocaleDateString('ar-SA') : 'غير محدد',
                        'وقت الحضور': record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString('ar-SA') : 'لم يسجل',
                        'وقت الانصراف': record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString('ar-SA') : 'لم يسجل',
                        'إجمالي الساعات': record.totalWorkedHours || 0,
                        'الحالة': record.status === 'present' ? 'حاضر' :
                            record.status === 'absent' ? 'غائب' :
                                record.status === 'late' ? 'متأخر' : record.status || 'غير محدد',
                        'ملاحظات': record.notes || 'لا توجد ملاحظات'
                    }));
                    fields = ['اسم الموظف', 'البريد الإلكتروني', 'القسم', 'التاريخ', 'وقت الحضور', 'وقت الانصراف', 'إجمالي الساعات', 'الحالة', 'ملاحظات'];
                    fileName = `تقرير_الحضور_${report._id}.csv`;
                    break;

                case 'leaves':
                    console.log('تحليل تقرير الإجازات:', {
                        hasRequests: !!report.data.requests,
                        requestsType: typeof report.data.requests,
                        requestsLength: Array.isArray(report.data.requests) ? report.data.requests.length : 'ليس مصفوفة',
                        firstRequest: Array.isArray(report.data.requests) && report.data.requests.length > 0 ? report.data.requests[0] : null
                    });

                    if (!report.data.requests || !Array.isArray(report.data.requests)) {
                        return res.status(400).json({ message: 'بيانات الإجازات غير متوفرة في التقرير' });
                    }
                    csvData = report.data.requests.map(leave => ({
                        'اسم الموظف': leave.user?.name || 'غير محدد',
                        'البريد الإلكتروني': leave.user?.email || 'غير محدد',
                        'القسم': leave.user?.department?.name || 'غير محدد',
                        'نوع الإجازة': leave.leaveType === 'annual' ? 'سنوية' :
                            leave.leaveType === 'sick' ? 'مرضية' :
                                leave.leaveType === 'emergency' ? 'طارئة' :
                                    leave.leaveType === 'maternity' ? 'أمومة' :
                                        leave.leaveType === 'paternity' ? 'أبوة' : leave.leaveType || 'غير محدد',
                        'تاريخ البداية': leave.startDate ? new Date(leave.startDate).toLocaleDateString('ar-SA') : 'غير محدد',
                        'تاريخ النهاية': leave.endDate ? new Date(leave.endDate).toLocaleDateString('ar-SA') : 'غير محدد',
                        'عدد الأيام': leave.totalDays || 0,
                        'الحالة': leave.status === 'pending' ? 'في الانتظار' :
                            leave.status === 'approved' ? 'موافق عليها' :
                                leave.status === 'rejected' ? 'مرفوضة' : leave.status || 'غير محدد',
                        'سبب الإجازة': leave.reason || 'غير محدد',
                        'تاريخ الطلب': leave.createdAt ? new Date(leave.createdAt).toLocaleDateString('ar-SA') : 'غير محدد',
                        'ملاحظات': leave.notes || 'لا توجد ملاحظات'
                    }));
                    fields = ['اسم الموظف', 'البريد الإلكتروني', 'القسم', 'نوع الإجازة', 'تاريخ البداية', 'تاريخ النهاية', 'عدد الأيام', 'الحالة', 'سبب الإجازة', 'تاريخ الطلب', 'ملاحظات'];
                    fileName = `تقرير_الإجازات_${report._id}.csv`;
                    break;

                case 'departments':
                    console.log('تحليل تقرير الأقسام:', {
                        hasDepartments: !!report.data.departments,
                        departmentsType: typeof report.data.departments,
                        departmentsLength: Array.isArray(report.data.departments) ? report.data.departments.length : 'ليس مصفوفة',
                        firstDepartment: Array.isArray(report.data.departments) && report.data.departments.length > 0 ? report.data.departments[0] : null
                    });

                    if (!report.data.departments || !Array.isArray(report.data.departments)) {
                        return res.status(400).json({ message: 'بيانات الأقسام غير متوفرة في التقرير' });
                    }
                    csvData = report.data.departments.map(dept => ({
                        'اسم القسم': dept.name || 'غير محدد',
                        'الوصف': dept.description || 'غير محدد',
                        'حالة القسم': dept.isActive ? 'نشط' : 'غير نشط',
                        'إجمالي الموظفين': dept.employeeCount || 0,
                        'الموظفون النشطون': dept.activeEmployees || 0,
                        'الموظفون غير النشطون': dept.inactiveEmployees || 0,
                        'تاريخ الإنشاء': dept.createdAt ? new Date(dept.createdAt).toLocaleDateString('ar-SA') : 'غير محدد',
                        'آخر تحديث': dept.updatedAt ? new Date(dept.updatedAt).toLocaleDateString('ar-SA') : 'غير محدد'
                    }));
                    fields = ['اسم القسم', 'الوصف', 'حالة القسم', 'إجمالي الموظفين', 'الموظفون النشطون', 'الموظفون غير النشطون', 'تاريخ الإنشاء', 'آخر تحديث'];
                    fileName = `تقرير_الأقسام_${report._id}.csv`;
                    break;

                default:
                    return res.status(400).json({ message: 'نوع التقرير غير مدعوم للتحميل' });
            }

            // التحقق من وجود بيانات للتحميل
            if (!csvData || csvData.length === 0) {
                return res.status(400).json({ message: 'التقرير فارغ - لا توجد بيانات للتحميل' });
            }

            // تحويل إلى CSV
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(csvData);

            // إعداد الاستجابة
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Length', Buffer.byteLength(csv, 'utf8'));

            // إضافة BOM للدعم العربي
            res.write('\ufeff');
            res.end(csv);

        } catch (error) {
            console.error('خطأ في تحميل التقرير:', error);
            res.status(500).json({
                message: 'فشل في تحميل التقرير',
                error: error.message
            });
        }
    }
};

module.exports = ReportsController; 