import apiService from './apiService';

class AttendanceService {

    // تسجيل الحضور (Clock In)
    async clockIn() {
        try {
            const response = await apiService.post('/api/attendance/clock-in');
            return {
                success: true,
                data: response,
                message: 'تم تسجيل الحضور بنجاح'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // تسجيل الانصراف (Clock Out)
    async clockOut() {
        try {
            const response = await apiService.post('/api/attendance/clock-out');
            return {
                success: true,
                data: response,
                message: 'تم تسجيل الانصراف بنجاح'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // جلب سجل الحضور الخاص بالموظف الحالي (محسن)
    async getMyAttendance(params = {}) {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const url = `/api/attendance/my${queryParams ? '?' + queryParams : ''}`;

            const response = await apiService.get(url);

            // التأكد من هيكل البيانات
            if (response && typeof response === 'object') {
                return {
                    success: true,
                    data: response.records || response, // دعم الهيكل الجديد والقديم
                    pagination: response.pagination,
                    statistics: response.statistics,
                    totalRecords: response.pagination?.totalRecords || (Array.isArray(response) ? response.length : 0)
                };
            } else {
                return {
                    success: true,
                    data: [],
                    totalRecords: 0
                };
            }
        } catch (error) {
            console.error('خطأ في جلب سجل الحضور:', error);
            return {
                success: false,
                error: error.message,
                data: [],
                totalRecords: 0
            };
        }
    }

    // جلب سجل الحضور لتاريخ محدد
    async getAttendanceByDate(date) {
        try {
            const response = await apiService.get(`/api/attendance/by-date?date=${date}`);
            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // التحقق من حالة الحضور لليوم الحالي (محسّن)
    async getTodayAttendanceStatus() {
        try {
            const response = await apiService.get('/api/attendance/today-status');

            // التأكد من هيكل البيانات وإضافة قيم افتراضية
            const data = {
                date: response.date || new Date().toISOString().split('T')[0],
                hasAttendance: response.hasAttendance || false,
                clockedIn: response.clockedIn || false,
                clockedOut: response.clockedOut || false,
                status: response.status || 'absent',

                // الأوقات
                clockInTime: response.clockInTime,
                clockOutTime: response.clockOutTime,

                // الساعات
                totalWorkedHours: response.totalWorkedHours || 0,
                overtimeHours: response.overtimeHours || 0,
                currentWorkHours: response.currentWorkHours || 0,

                // الإجراءات المتاحة
                canClockIn: response.canClockIn !== false, // default true إذا لم يُحدد
                canClockOut: response.canClockOut || false,

                // معلومات إضافية
                workingStatus: response.workingStatus || {
                    status: 'not_started',
                    message: 'لم يبدأ العمل بعد'
                },

                // إحصائيات سريعة
                weekSummary: response.weekSummary || { workDays: 0, workHours: 0 },
                monthSummary: response.monthSummary || { workDays: 0, workHours: 0 }
            };

            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('خطأ في جلب حالة اليوم:', error);
            return {
                success: false,
                error: error.message,
                data: {
                    date: new Date().toISOString().split('T')[0],
                    hasAttendance: false,
                    clockedIn: false,
                    clockedOut: false,
                    status: 'absent',
                    canClockIn: true,
                    canClockOut: false,
                    totalWorkedHours: 0,
                    overtimeHours: 0,
                    currentWorkHours: 0
                }
            };
        }
    }

    // حساب الإحصائيات الشهرية (محسن مع استخدام Backend API)
    async getMonthlyStats(year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
        try {
            // استخدام الـ API الجديد للحصول على التقرير الشهري
            const response = await apiService.get(`/api/attendance/my/monthly/${year}/${month}`);
            return {
                success: true,
                data: {
                    totalDays: response.statistics?.totalDays || response.statistics?.totalRecords || 0,
                    totalHours: response.statistics?.totalHours || response.statistics?.totalWorkedHours || 0,
                    totalOvertimeHours: response.statistics?.totalOvertimeHours || response.statistics?.overtimeHours || 0,
                    averageHoursPerDay: response.statistics?.avgHoursPerDay || response.statistics?.averageHours || 0,
                    daysPresent: response.statistics?.presentDays || response.statistics?.workDays || 0,
                    records: response.records || [],
                    attendanceRate: response.statistics?.attendanceRate || 0,
                    weeklyBreakdown: response.weeklyBreakdown || []
                }
            };
        } catch (error) {
            // Fallback للطريقة المحسنة
            console.warn('Monthly API failed, using attendance data:', error.message);
            try {
                // استخدام API الحضور العام مع فلتر الشهر
                const response = await this.getMyAttendance({
                    month: month.toString(),
                    year: year.toString(),
                    limit: 100 // تأكد من جلب جميع السجلات للشهر
                });

                if (response.success && Array.isArray(response.data)) {
                    const monthlyRecords = response.data.filter(record => {
                        const recordDate = new Date(record.date);
                        return recordDate.getFullYear() === year &&
                            recordDate.getMonth() + 1 === month;
                    });

                    const stats = {
                        totalDays: monthlyRecords.length,
                        totalHours: monthlyRecords.reduce((sum, record) => sum + (record.totalWorkedHours || 0), 0),
                        totalOvertimeHours: monthlyRecords.reduce((sum, record) => sum + (record.overtimeHours || 0), 0),
                        averageHoursPerDay: 0,
                        daysPresent: monthlyRecords.filter(record => record.clockIn).length,
                        records: monthlyRecords,
                        attendanceRate: 0
                    };

                    if (stats.daysPresent > 0) {
                        stats.averageHoursPerDay = Number((stats.totalHours / stats.daysPresent).toFixed(2));
                    }

                    // حساب معدل الحضور (افتراض 22 يوم عمل في الشهر)
                    const workingDaysInMonth = 22;
                    stats.attendanceRate = Math.round((stats.daysPresent / workingDaysInMonth) * 100);

                    return {
                        success: true,
                        data: stats
                    };
                } else {
                    // إرجاع قيم افتراضية
                    return {
                        success: true,
                        data: {
                            totalDays: 0,
                            totalHours: 0,
                            totalOvertimeHours: 0,
                            averageHoursPerDay: 0,
                            daysPresent: 0,
                            records: [],
                            attendanceRate: 0
                        }
                    };
                }
            } catch (fallbackError) {
                console.error('Fallback method also failed:', fallbackError.message);
                return {
                    success: false,
                    error: fallbackError.message,
                    data: {
                        totalDays: 0,
                        totalHours: 0,
                        totalOvertimeHours: 0,
                        averageHoursPerDay: 0,
                        daysPresent: 0,
                        records: [],
                        attendanceRate: 0
                    }
                };
            }
        }
    }

    // جلب إحصائيات متقدمة (جديد)
    async getMyStats(period = 'month') {
        try {
            const response = await apiService.get(`/api/attendance/my/stats?period=${period}`);
            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // جلب التقرير الأسبوعي (جديد)
    async getWeeklyReport() {
        try {
            const response = await apiService.get('/api/attendance/my/weekly');
            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // جلب التقرير الشهري المفصل (جديد)
    async getMonthlyReport(year, month) {
        try {
            const response = await apiService.get(`/api/attendance/my/monthly/${year}/${month}`);
            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // تنسيق الوقت للعرض (12 ساعة)
    formatTime(timeString) {
        if (!timeString) return '--:--';

        try {
            const date = new Date(timeString);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            return '--:--';
        }
    }

    // تنسيق الوقت للعرض (24 ساعة)
    formatTime24(timeString) {
        if (!timeString) return '--:--';

        try {
            const date = new Date(timeString);
            return date.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch (error) {
            return '--:--';
        }
    }

    // تنسيق التاريخ للعرض (ميلادي)
    formatDate(dateString) {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    // تنسيق التاريخ المختصر (ميلادي)
    formatShortDate(dateString) {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    }

    // حساب الفرق بين وقتين بالساعات
    calculateHoursDifference(startTime, endTime) {
        if (!startTime || !endTime) return 0;

        try {
            const start = new Date(startTime);
            const end = new Date(endTime);
            const diffMs = end - start;
            return Math.round((diffMs / 1000 / 60 / 60) * 100) / 100;
        } catch (error) {
            return 0;
        }
    }
}

// إنشاء instance واحد لاستخدامه في كل التطبيق
const attendanceService = new AttendanceService();

export default attendanceService; 