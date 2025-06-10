import apiService from './apiService';

class LeaveService {

    // تقديم طلب إجازة جديد
    async createLeaveRequest(leaveData) {
        try {
            const response = await apiService.post('/api/leaves', leaveData);
            return {
                success: true,
                data: response,
                message: 'تم تقديم طلب الإجازة بنجاح'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // إلغاء طلب إجازة (pending فقط)
    async cancelLeaveRequest(requestId) {
        try {
            const response = await apiService.delete(`/api/leaves/${requestId}`);
            return {
                success: true,
                data: response,
                message: 'تم إلغاء طلب الإجازة بنجاح'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // جلب طلبات الإجازة الخاصة بالموظف الحالي
    async getMyLeaveRequests() {
        try {
            const response = await apiService.get('/api/leaves/my');
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

    // جلب تفاصيل طلب إجازة محدد
    async getLeaveRequestById(requestId) {
        try {
            const response = await apiService.get(`/api/leaves/${requestId}`);
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

    // حساب عدد أيام الإجازة
    calculateLeaveDays(startDate, endDate) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const timeDiff = end - start;
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // +1 لتضمين اليوم الأول
            return daysDiff > 0 ? daysDiff : 0;
        } catch (error) {
            return 0;
        }
    }

    // التحقق من صحة تواريخ الإجازة
    validateLeaveDates(startDate, endDate) {
        const errors = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const start = new Date(startDate);
        const end = new Date(endDate);

        // التحقق من أن التاريخ ليس في الماضي
        if (start < today) {
            errors.push('تاريخ بداية الإجازة لا يمكن أن يكون في الماضي');
        }

        // التحقق من أن تاريخ النهاية أكبر من تاريخ البداية
        if (end < start) {
            errors.push('تاريخ نهاية الإجازة يجب أن يكون بعد تاريخ البداية');
        }

        // التحقق من عدم تجاوز 30 يوم
        const daysDiff = this.calculateLeaveDays(startDate, endDate);
        if (daysDiff > 30) {
            errors.push('لا يمكن أن تتجاوز الإجازة 30 يوماً');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // تنسيق التاريخ للعرض
    formatDate(dateString) {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    // تنسيق التاريخ المختصر
    formatShortDate(dateString) {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    }

    // الحصول على لون الحالة
    getStatusColor(status) {
        switch (status) {
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'approved':
                return 'text-green-600 bg-green-100';
            case 'rejected':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    }

    // الحصول على نص الحالة بالعربية
    getStatusText(status) {
        switch (status) {
            case 'pending':
                return 'قيد المراجعة';
            case 'approved':
                return 'مقبول';
            case 'rejected':
                return 'مرفوض';
            default:
                return 'غير محدد';
        }
    }

    // الحصول على نص نوع الإجازة بالعربية
    getLeaveTypeText(leaveType) {
        switch (leaveType) {
            case 'sick':
                return 'إجازة مرضية';
            case 'vacation':
                return 'إجازة عادية';
            case 'emergency':
                return 'إجازة طارئة';
            case 'maternity':
                return 'إجازة أمومة';
            case 'paternity':
                return 'إجازة أبوة';
            case 'personal':
                return 'إجازة شخصية';
            default:
                return leaveType;
        }
    }

    // الحصول على أنواع الإجازات المتاحة
    getLeaveTypes() {
        return [
            { value: 'sick', label: 'إجازة مرضية' },
            { value: 'vacation', label: 'إجازة عادية' },
            { value: 'emergency', label: 'إجازة طارئة' },
            { value: 'personal', label: 'إجازة شخصية' },
            { value: 'maternity', label: 'إجازة أمومة' },
            { value: 'paternity', label: 'إجازة أبوة' }
        ];
    }

    // فلترة الطلبات حسب الحالة
    filterRequestsByStatus(requests, status) {
        if (!status || status === 'all') {
            return requests;
        }
        return requests.filter(request => request.status === status);
    }

    // فلترة الطلبات حسب التاريخ
    filterRequestsByDate(requests, startDate, endDate) {
        if (!startDate && !endDate) {
            return requests;
        }

        return requests.filter(request => {
            const requestDate = new Date(request.startDate);
            let isInRange = true;

            if (startDate) {
                isInRange = isInRange && requestDate >= new Date(startDate);
            }

            if (endDate) {
                isInRange = isInRange && requestDate <= new Date(endDate);
            }

            return isInRange;
        });
    }

    // حساب الإحصائيات الشهرية للإجازات محسن
    async getMonthlyLeaveStats(year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
        try {
            // استخدام الـ API الجديد إذا كان متوفر
            const response = await apiService.get(`/api/leaves/my/monthly-report?year=${year}&month=${month}`);
            return {
                success: true,
                data: response
            };
        } catch (error) {
            // Fallback للطريقة القديمة
            try {
                const response = await this.getMyLeaveRequests();

                if (response.success) {
                    const requests = response.data.leaves || response.data;
                    const monthlyRequests = requests.filter(request => {
                        const requestDate = new Date(request.startDate);
                        return requestDate.getFullYear() === year &&
                            requestDate.getMonth() + 1 === month;
                    });

                    const stats = {
                        totalRequests: monthlyRequests.length,
                        pendingRequests: monthlyRequests.filter(r => r.status === 'pending').length,
                        approvedRequests: monthlyRequests.filter(r => r.status === 'approved').length,
                        rejectedRequests: monthlyRequests.filter(r => r.status === 'rejected').length,
                        totalDaysRequested: monthlyRequests.reduce((sum, request) => {
                            return sum + this.calculateLeaveDays(request.startDate, request.endDate);
                        }, 0),
                        approvedDays: monthlyRequests
                            .filter(r => r.status === 'approved')
                            .reduce((sum, request) => {
                                return sum + this.calculateLeaveDays(request.startDate, request.endDate);
                            }, 0)
                    };

                    return {
                        success: true,
                        data: stats
                    };
                }

                return response;
            } catch (fallbackError) {
                return {
                    success: false,
                    error: fallbackError.message
                };
            }
        }
    }

    // 🆕 جلب إحصائيات سنوية للإجازات
    async getYearlyLeaveStatistics(year = new Date().getFullYear()) {
        try {
            const response = await apiService.get(`/api/leaves/my/statistics?year=${year}`);
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

    // 🆕 فحص توفر التواريخ للإجازة
    async checkDateAvailability(startDate, endDate) {
        try {
            const response = await apiService.get(`/api/leaves/check-availability?startDate=${startDate}&endDate=${endDate}`);
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

    // 🆕 جلب إحصائيات متقدمة للإجازات
    async getAdvancedLeaveStats() {
        try {
            const currentYear = new Date().getFullYear();
            const [yearlyStats, monthlyStats] = await Promise.all([
                this.getYearlyLeaveStatistics(currentYear),
                this.getMonthlyLeaveStats(currentYear, new Date().getMonth() + 1)
            ]);

            return {
                success: true,
                data: {
                    yearly: yearlyStats.success ? yearlyStats.data : null,
                    monthly: monthlyStats.success ? monthlyStats.data : null
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// إنشاء instance واحد لاستخدامه في كل التطبيق
const leaveService = new LeaveService();

export default leaveService; 