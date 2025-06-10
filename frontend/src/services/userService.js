import apiService from './apiService';

class UserService {

    // جلب بيانات الملف الشخصي
    async getProfile() {
        try {
            const response = await apiService.get('/api/user/me');
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

    // تغيير كلمة المرور
    async changePassword(passwordData) {
        try {
            const response = await apiService.put('/api/user/change-password', passwordData);
            return {
                success: true,
                data: response,
                message: 'تم تغيير كلمة المرور بنجاح'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // تحديث الملف الشخصي (جديد)
    async updateProfile(profileData) {
        try {
            const response = await apiService.put('/api/user/me/profile', profileData);
            return {
                success: true,
                data: response,
                message: 'تم تحديث الملف الشخصي بنجاح'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // جلب سجل الحضور للمستخدم الحالي
    async getMyAttendance() {
        try {
            const response = await apiService.get('/api/attendance/my');
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

    // جلب طلبات الإجازة للمستخدم الحالي
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

    // جلب الرواتب للمستخدم الحالي
    async getMySalaries() {
        try {
            const response = await apiService.get('/api/salaries/my');
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

    // تنسيق تاريخ التوظيف
    formatHireDate(dateString) {
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

    // حساب مدة الخدمة
    calculateServiceDuration(hireDate) {
        if (!hireDate) return '';

        try {
            const hire = new Date(hireDate);
            const now = new Date();
            const diffMs = now - hire;

            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const years = Math.floor(diffDays / 365);
            const months = Math.floor((diffDays % 365) / 30);

            if (years > 0) {
                return `${years} سنة و ${months} شهر`;
            } else if (months > 0) {
                return `${months} شهر`;
            } else {
                return `${diffDays} يوم`;
            }
        } catch (error) {
            return '';
        }
    }

    // تنسيق الراتب
    formatSalary(salary, currency = 'ريال') {
        if (!salary) return '0';

        try {
            return new Intl.NumberFormat('ar-SA').format(salary) + ' ' + currency;
        } catch (error) {
            return salary + ' ' + currency;
        }
    }

    // الحصول على نص الدور بالعربية
    getRoleText(role) {
        switch (role) {
            case 'admin':
                return 'مدير النظام';
            case 'hr':
                return 'موارد بشرية';
            case 'employee':
                return 'موظف';
            default:
                return role;
        }
    }

    // الحصول على نص نوع الراتب بالعربية
    getSalaryTypeText(salaryType) {
        switch (salaryType) {
            case 'fixed':
                return 'راتب ثابت';
            case 'hourly':
                return 'راتب بالساعة';
            default:
                return salaryType;
        }
    }

    // التحقق من صحة كلمة المرور الجديدة
    validatePassword(password) {
        const errors = [];

        if (!password) {
            errors.push('كلمة المرور مطلوبة');
            return { isValid: false, errors };
        }

        if (password.length < 6) {
            errors.push('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        }

        if (!/(?=.*[a-z])/.test(password)) {
            errors.push('كلمة المرور يجب أن تحتوي على حرف صغير');
        }

        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push('كلمة المرور يجب أن تحتوي على حرف كبير');
        }

        if (!/(?=.*\d)/.test(password)) {
            errors.push('كلمة المرور يجب أن تحتوي على رقم');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // التحقق من تطابق كلمات المرور
    validatePasswordMatch(password, confirmPassword) {
        if (password !== confirmPassword) {
            return {
                isValid: false,
                errors: ['كلمة المرور وتأكيد كلمة المرور غير متطابقين']
            };
        }

        return { isValid: true, errors: [] };
    }

    // حساب إحصائيات سريعة للموظف (محسن لاستخدام API الجديد)
    async getEmployeeQuickStats() {
        try {
            // استخدام API الجديد المحسن من الباك إند
            const response = await apiService.get('/api/user/me/quick-stats');

            if (response.success) {
                return {
                    success: true,
                    data: response.data
                };
            } else {
                throw new Error(response.message || 'Failed to get stats');
            }
        } catch (error) {
            console.warn('New API failed, using fallback method:', error.message);

            // Fallback للطريقة القديمة
            try {
                const [attendanceResponse, leaveResponse] = await Promise.all([
                    this.getMyAttendance(),
                    this.getMyLeaveRequests()
                ]);

                let stats = {
                    totalWorkDays: 0,
                    totalWorkHours: 0,
                    totalOvertimeHours: 0,
                    totalLeaveRequests: 0,
                    pendingLeaveRequests: 0,
                    approvedLeaveRequests: 0,
                    currentMonthWorkDays: 0,
                    currentMonthWorkHours: 0
                };

                if (attendanceResponse.success) {
                    const attendance = Array.isArray(attendanceResponse.data)
                        ? attendanceResponse.data
                        : attendanceResponse.data?.records || [];

                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();

                    stats.totalWorkDays = attendance.length;
                    stats.totalWorkHours = attendance.reduce((sum, record) =>
                        sum + (record.totalWorkedHours || 0), 0);
                    stats.totalOvertimeHours = attendance.reduce((sum, record) =>
                        sum + (record.overtimeHours || 0), 0);

                    // إحصائيات الشهر الحالي
                    const currentMonthAttendance = attendance.filter(record => {
                        const recordDate = new Date(record.date);
                        return recordDate.getMonth() === currentMonth &&
                            recordDate.getFullYear() === currentYear;
                    });

                    stats.currentMonthWorkDays = currentMonthAttendance.length;
                    stats.currentMonthWorkHours = currentMonthAttendance.reduce((sum, record) =>
                        sum + (record.totalWorkedHours || 0), 0);
                }

                if (leaveResponse.success) {
                    const leaves = Array.isArray(leaveResponse.data)
                        ? leaveResponse.data
                        : leaveResponse.data?.records || [];

                    stats.totalLeaveRequests = leaves.length;
                    stats.pendingLeaveRequests = leaves.filter(l => l.status === 'pending').length;
                    stats.approvedLeaveRequests = leaves.filter(l => l.status === 'approved').length;
                }

                return {
                    success: true,
                    data: stats
                };
            } catch (fallbackError) {
                return {
                    success: false,
                    error: fallbackError.message
                };
            }
        }
    }

    // تنسيق آخر تسجيل دخول
    formatLastLogin(lastLoginString) {
        if (!lastLoginString) return 'لم يسجل دخول من قبل';

        try {
            const date = new Date(lastLoginString);
            const now = new Date();
            const diffMs = now - date;
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffDays > 7) {
                return date.toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            } else if (diffDays > 0) {
                return `منذ ${diffDays} ${diffDays === 1 ? 'يوم' : 'أيام'}`;
            } else if (diffHours > 0) {
                return `منذ ${diffHours} ${diffHours === 1 ? 'ساعة' : 'ساعات'}`;
            } else if (diffMinutes > 0) {
                return `منذ ${diffMinutes} ${diffMinutes === 1 ? 'دقيقة' : 'دقائق'}`;
            } else {
                return 'الآن';
            }
        } catch (error) {
            return lastLoginString;
        }
    }

    // التحقق من صحة البريد الإلكتروني
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // تنسيق رقم الهاتف (إذا كان متوفراً)
    formatPhoneNumber(phone) {
        if (!phone) return '';

        // إزالة جميع الأحرف غير الرقمية
        const cleaned = phone.replace(/\D/g, '');

        // تنسيق الرقم السعودي
        if (cleaned.startsWith('966')) {
            return '+966 ' + cleaned.slice(3, 6) + ' ' + cleaned.slice(6, 9) + ' ' + cleaned.slice(9);
        } else if (cleaned.startsWith('05')) {
            return cleaned.slice(0, 3) + ' ' + cleaned.slice(3, 6) + ' ' + cleaned.slice(6);
        }

        return phone;
    }

    // رفع الصورة الشخصية (جديد)
    async uploadProfileImage(imageFile) {
        try {
            const formData = new FormData();
            formData.append('profileImage', imageFile);

            const response = await apiService.postFormData('/api/user/me/upload-image', formData);

            console.log('Profile image uploaded successfully:', response);
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Error uploading profile image:', error);

            return {
                success: false,
                error: error.message || 'Failed to upload image'
            };
        }
    }

    // حذف الصورة الشخصية (جديد)
    async deleteProfileImage() {
        try {
            const response = await apiService.delete('/api/user/me/delete-image');
            console.log('Profile image deleted successfully:', response.data);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Error deleting profile image:', error);

            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Failed to delete image'
            };
        }
    }

    // التحقق من صحة أنواع الملفات المسموحة للصور
    validateImageFile(file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            return {
                isValid: false,
                error: 'نوع الملف غير مدعوم. يرجى اختيار صورة بصيغة JPG, PNG, GIF أو WebP'
            };
        }

        if (file.size > maxSize) {
            return {
                isValid: false,
                error: 'حجم الملف كبير جداً. الحد الأقصى هو 5 ميجابايت'
            };
        }

        return {
            isValid: true,
            error: null
        };
    }
}

// إنشاء instance واحد لاستخدامه في كل التطبيق
const userService = new UserService();

export default userService; 