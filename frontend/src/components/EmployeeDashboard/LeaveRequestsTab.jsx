import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FiPlus,
  FiCalendar,
  FiClock,
  FiUser,
  FiEdit,
  FiTrash2,
  FiEye,
  FiFilter,
  FiSearch,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";
import leaveService from "../../services/leaveService";
import { toast } from "react-hot-toast";

const LeaveRequestsTab = ({ onDataChange }) => {
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    leaveType: "all",
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });

  // تحميل البيانات عند تحميل المكون
  useEffect(() => {
    loadLeaveRequests();
    loadStatistics();
  }, [filters, pagination.currentPage]);

  // تحميل طلبات الإجازة
  const loadLeaveRequests = async () => {
    setLoading(true);
    try {
      const response = await leaveService.getMyLeaveRequests();
      if (response.success) {
        setRequests(response.data.leaves || response.data || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
        if (response.data.statistics) {
          setStatistics(response.data.statistics);
        }
      }
    } catch (error) {
      toast.error("فشل في تحميل طلبات الإجازة");
    } finally {
      setLoading(false);
    }
  };

  // تحميل الإحصائيات
  const loadStatistics = async () => {
    try {
      const response = await leaveService.getYearlyLeaveStatistics();
      if (response.success) {
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error("فشل في تحميل الإحصائيات:", error);
    }
  };

  return (
    <div
      className={`p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">طلبات الإجازة</h2>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            إدارة طلبات الإجازة ومتابعة حالتها
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          <FiPlus />
          طلب إجازة جديد
        </button>
      </div>

      {/* بطاقات الإحصائيات */}
      <StatisticsCards statistics={statistics} darkMode={darkMode} />

      {/* أدوات الفلترة */}
      <FiltersSection
        filters={filters}
        setFilters={setFilters}
        darkMode={darkMode}
        onRefresh={loadLeaveRequests}
      />

      {/* جدول الطلبات */}
      <RequestsTable
        requests={requests}
        loading={loading}
        darkMode={darkMode}
        onRefresh={loadLeaveRequests}
        pagination={pagination}
        setPagination={setPagination}
      />

      {/* نموذج إنشاء طلب جديد */}
      {showCreateForm && (
        <CreateRequestModal
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            loadLeaveRequests();
            onDataChange?.();
          }}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

// مكون بطاقات الإحصائيات
const StatisticsCards = ({ statistics, darkMode }) => {
  const stats = [
    {
      title: "إجمالي الطلبات",
      value: statistics?.total?.count || 0,
      subtitle: `${statistics?.total?.totalDays || 0} يوم`,
      icon: FiCalendar,
      color: "blue",
    },
    {
      title: "قيد المراجعة",
      value: statistics?.pending?.count || 0,
      subtitle: `${statistics?.pending?.totalDays || 0} يوم`,
      icon: FiClock,
      color: "yellow",
    },
    {
      title: "مقبولة",
      value: statistics?.approved?.count || 0,
      subtitle: `${statistics?.approved?.totalDays || 0} يوم`,
      icon: FiUser,
      color: "green",
    },
    {
      title: "مرفوضة",
      value: statistics?.rejected?.count || 0,
      subtitle: `${statistics?.rejected?.totalDays || 0} يوم`,
      icon: FiTrash2,
      color: "red",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} darkMode={darkMode} />
      ))}
    </div>
  );
};

// مكون بطاقة إحصائية
const StatCard = ({ title, value, subtitle, icon: Icon, color, darkMode }) => {
  const colorClasses = {
    blue: "border-blue-500 bg-blue-50 text-blue-600",
    yellow: "border-yellow-500 bg-yellow-50 text-yellow-600",
    green: "border-green-500 bg-green-50 text-green-600",
    red: "border-red-500 bg-red-50 text-red-600",
  };

  const darkColorClasses = {
    blue: "border-blue-400 bg-blue-900/20 text-blue-400",
    yellow: "border-yellow-400 bg-yellow-900/20 text-yellow-400",
    green: "border-green-400 bg-green-900/20 text-green-400",
    red: "border-red-400 bg-red-900/20 text-red-400",
  };

  return (
    <div
      className={`rounded-xl p-6 border-r-4 transition-all duration-200 hover:shadow-lg ${
        darkMode
          ? `bg-gray-800 ${darkColorClasses[color]}`
          : `bg-white ${colorClasses[color]}`
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3
            className={`text-sm font-semibold mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-3xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {value}
          </p>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {subtitle}
          </p>
        </div>
        <div
          className={`p-3 rounded-full ${
            darkMode ? darkColorClasses[color] : colorClasses[color]
          }`}
        >
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

// مكون قسم الفلترة
const FiltersSection = ({ filters, setFilters, darkMode, onRefresh }) => {
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className={`rounded-xl p-6 mb-6 ${
        darkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-4 flex-1">
          {/* فلتر الحالة */}
          <div className="min-w-40">
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              الحالة
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">قيد المراجعة</option>
              <option value="approved">مقبول</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>

          {/* فلتر نوع الإجازة */}
          <div className="min-w-40">
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              نوع الإجازة
            </label>
            <select
              value={filters.leaveType}
              onChange={(e) => handleFilterChange("leaveType", e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="all">جميع الأنواع</option>
              <option value="vacation">إجازة عادية</option>
              <option value="sick">إجازة مرضية</option>
              <option value="emergency">إجازة طارئة</option>
              <option value="personal">إجازة شخصية</option>
              <option value="annual">إجازة سنوية</option>
            </select>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <FiRefreshCw size={16} />
            تحديث
          </button>
        </div>
      </div>
    </div>
  );
};

// مكون جدول الطلبات
const RequestsTable = ({ requests, loading, darkMode, onRefresh }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleDelete = async (requestId) => {
    if (!window.confirm("هل أنت متأكد من إلغاء هذا الطلب؟")) return;

    try {
      const response = await leaveService.cancelLeaveRequest(requestId);
      if (response.success) {
        toast.success("تم إلغاء الطلب بنجاح");
        onRefresh();
      } else {
        toast.error(response.error || "فشل في إلغاء الطلب");
      }
    } catch (error) {
      toast.error("فشل في إلغاء الطلب");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };

    const darkStyles = {
      pending: "bg-yellow-900/20 text-yellow-400 border-yellow-400/20",
      approved: "bg-green-900/20 text-green-400 border-green-400/20",
      rejected: "bg-red-900/20 text-red-400 border-red-400/20",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${
          darkMode ? darkStyles[status] : styles[status]
        }`}
      >
        {leaveService.getStatusText(status)}
      </span>
    );
  };

  if (loading) {
    return (
      <div
        className={`rounded-xl p-8 text-center ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          جاري تحميل الطلبات...
        </p>
      </div>
    );
  }

  if (!requests.length) {
    return (
      <div
        className={`rounded-xl p-8 text-center ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <FiCalendar
          className={`mx-auto mb-4 text-4xl ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        />
        <h3
          className={`text-lg font-semibold mb-2 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          لا توجد طلبات إجازة
        </h3>
        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
          ابدأ بتقديم طلب إجازة جديد
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl overflow-hidden ${
        darkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
            <tr>
              <th
                className={`px-6 py-4 text-right text-sm font-semibold ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                نوع الإجازة
              </th>
              <th
                className={`px-6 py-4 text-right text-sm font-semibold ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                التاريخ
              </th>
              <th
                className={`px-6 py-4 text-right text-sm font-semibold ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                المدة
              </th>
              <th
                className={`px-6 py-4 text-right text-sm font-semibold ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                الحالة
              </th>
              <th
                className={`px-6 py-4 text-right text-sm font-semibold ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {requests.map((request) => (
              <tr
                key={request._id}
                className={`hover:${
                  darkMode ? "bg-gray-700/50" : "bg-gray-50"
                } transition-colors`}
              >
                <td className="px-6 py-4">
                  <div className="font-medium">
                    {leaveService.getLeaveTypeText(request.leaveType)}
                  </div>
                  {request.reason && (
                    <div
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {request.reason.length > 50
                        ? `${request.reason.substring(0, 50)}...`
                        : request.reason}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div>
                      من: {leaveService.formatShortDate(request.startDate)}
                    </div>
                    <div>
                      إلى: {leaveService.formatShortDate(request.endDate)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium">
                    {request.totalDays ||
                      leaveService.calculateLeaveDays(
                        request.startDate,
                        request.endDate
                      )}{" "}
                    يوم
                  </span>
                </td>
                <td className="px-6 py-4">{getStatusBadge(request.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className={`p-2 rounded-lg transition-colors ${
                        darkMode
                          ? "hover:bg-gray-600 text-gray-400 hover:text-white"
                          : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                      }`}
                      title="عرض التفاصيل"
                    >
                      <FiEye size={16} />
                    </button>
                    {request.status === "pending" && (
                      <button
                        onClick={() => handleDelete(request._id)}
                        className="p-2 rounded-lg transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="إلغاء الطلب"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نافذة تفاصيل الطلب */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

// مكون نموذج إنشاء طلب جديد
const CreateRequestModal = ({ onClose, onSuccess, darkMode }) => {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [availability, setAvailability] = useState(null);

  // فحص توفر التواريخ عند تغيير التواريخ
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      checkAvailability();
    }
  }, [formData.startDate, formData.endDate]);

  const checkAvailability = async () => {
    try {
      const response = await leaveService.checkDateAvailability(
        formData.startDate,
        formData.endDate
      );
      if (response.success) {
        setAvailability(response.data);
      }
    } catch (error) {
      console.error("فشل في فحص التوفر:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // التحقق من البيانات
      const validation = leaveService.validateLeaveDates(
        formData.startDate,
        formData.endDate
      );
      if (!validation.isValid) {
        setErrors({ dates: validation.errors });
        setLoading(false);
        return;
      }

      const response = await leaveService.createLeaveRequest(formData);
      if (response.success) {
        toast.success("تم تقديم طلب الإجازة بنجاح");
        onSuccess();
      } else {
        setErrors({ submit: response.error });
        toast.error(response.error || "فشل في تقديم الطلب");
      }
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error("فشل في تقديم الطلب");
    } finally {
      setLoading(false);
    }
  };

  const totalDays =
    formData.startDate && formData.endDate
      ? leaveService.calculateLeaveDays(formData.startDate, formData.endDate)
      : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              طلب إجازة جديد
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* نوع الإجازة */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                نوع الإجازة *
              </label>
              <select
                value={formData.leaveType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    leaveType: e.target.value,
                  }))
                }
                required
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">اختر نوع الإجازة</option>
                {leaveService.getLeaveTypes().map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* التواريخ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  تاريخ البداية *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  تاريخ النهاية *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  required
                  min={
                    formData.startDate || new Date().toISOString().split("T")[0]
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
            </div>

            {/* معلومات الأيام والتوفر */}
            {totalDays > 0 && (
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    إجمالي الأيام:
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {totalDays} يوم
                  </span>
                </div>

                {availability && (
                  <div className="mt-2">
                    {availability.available ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <span>✓</span>
                        <span>التواريخ متاحة</span>
                      </div>
                    ) : (
                      <div className="text-red-600">
                        <div className="flex items-center gap-2 mb-2">
                          <span>✗</span>
                          <span>التواريخ غير متاحة</span>
                        </div>
                        {availability.conflicts?.length > 0 && (
                          <div className="text-sm">
                            تتعارض مع الطلبات التالية:
                            <ul className="mt-1 space-y-1">
                              {availability.conflicts.map((conflict, index) => (
                                <li key={index} className="mr-4">
                                  •{" "}
                                  {leaveService.getLeaveTypeText(
                                    conflict.leaveType
                                  )}
                                  (
                                  {leaveService.formatShortDate(
                                    conflict.startDate
                                  )}{" "}
                                  -{" "}
                                  {leaveService.formatShortDate(
                                    conflict.endDate
                                  )}
                                  )
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* سبب الإجازة */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                سبب الإجازة (اختياري)
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, reason: e.target.value }))
                }
                rows={3}
                maxLength={500}
                placeholder="اكتب سبب الإجازة..."
                className={`w-full px-4 py-3 rounded-lg border resize-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              <div
                className={`text-sm text-right mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {formData.reason.length}/500
              </div>
            </div>

            {/* رسائل الخطأ */}
            {errors.dates && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <ul className="text-red-600 dark:text-red-400 text-sm space-y-1">
                  {errors.dates.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {errors.submit && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {errors.submit}
                </p>
              </div>
            )}

            {/* أزرار الإجراءات */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || (availability && !availability.available)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {loading ? "جاري الإرسال..." : "تقديم الطلب"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// مكون نافذة تفاصيل الطلب
const RequestDetailsModal = ({ request, onClose, darkMode }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`max-w-lg w-full rounded-xl ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              تفاصيل الطلب
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  نوع الإجازة
                </label>
                <p
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {leaveService.getLeaveTypeText(request.leaveType)}
                </p>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  الحالة
                </label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    request.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      : request.status === "approved"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {leaveService.getStatusText(request.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  تاريخ البداية
                </label>
                <p
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {leaveService.formatDate(request.startDate)}
                </p>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  تاريخ النهاية
                </label>
                <p
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {leaveService.formatDate(request.endDate)}
                </p>
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                إجمالي الأيام
              </label>
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {request.totalDays ||
                  leaveService.calculateLeaveDays(
                    request.startDate,
                    request.endDate
                  )}{" "}
                يوم
              </p>
            </div>

            {request.reason && (
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  سبب الإجازة
                </label>
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } leading-relaxed`}
                >
                  {request.reason}
                </p>
              </div>
            )}

            {request.adminComment && (
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  تعليق الإدارة
                </label>
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } leading-relaxed`}
                >
                  {request.adminComment}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  تاريخ التقديم
                </label>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {leaveService.formatDate(request.createdAt)}
                </p>
              </div>
              {request.reviewedAt && (
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    تاريخ المراجعة
                  </label>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {leaveService.formatDate(request.reviewedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={onClose}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestsTab;
