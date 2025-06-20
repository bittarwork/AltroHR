import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import Toast from "../common/Toast";
import "../../styles/reports.css";
import {
  FiUsers,
  FiClock,
  FiCalendar,
  FiRefreshCw,
  FiDownload,
  FiFileText,
  FiEye,
  FiX,
  FiBarChart2,
  FiTrendingUp,
} from "react-icons/fi";
import { HiOfficeBuilding } from "react-icons/hi";

const HRReportsTab = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();

  // States
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(null);
  const [reports, setReports] = useState([]);
  const [quickStats, setQuickStats] = useState({
    totalEmployees: 0,
    attendanceRate: 0,
    pendingLeaves: 0,
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Toast function
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  // Report types configuration
  const reportTypes = [
    {
      id: "employees",
      title: "تقرير الموظفين",
      description: "تقرير شامل بجميع بيانات الموظفين والأقسام والمناصب",
      icon: FiUsers,
      color: "blue",
      endpoint: "/api/reports/generate/employees",
      downloadEndpoint: "/api/reports/download/employees/csv",
    },
    {
      id: "attendance",
      title: "تقرير الحضور",
      description: "تقرير مفصل عن حضور وغياب الموظفين لفترة محددة",
      icon: FiClock,
      color: "green",
      endpoint: "/api/reports/generate/attendance",
      downloadEndpoint: "/api/reports/download/attendance/csv",
    },
    {
      id: "leaves",
      title: "تقرير الإجازات",
      description: "تقرير بجميع طلبات الإجازات وحالاتها والمدد المستغرقة",
      icon: FiCalendar,
      color: "orange",
      endpoint: "/api/reports/generate/leaves",
      downloadEndpoint: "/api/reports/download/leaves/csv",
    },
    {
      id: "departments",
      title: "تقرير الأقسام",
      description: "تقرير تفصيلي عن الأقسام وعدد الموظفين في كل قسم",
      icon: HiOfficeBuilding,
      color: "purple",
      endpoint: "/api/reports/generate/departments",
      downloadEndpoint: "/api/reports/download/departments/csv",
    },
  ];

  // Load functions
  const loadQuickStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const token = user?.token;
      if (!token) {
        setStatsLoading(false);
        return;
      }

      // Load quick statistics
      const [usersResponse, leavesResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/leaves`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const totalEmployees = usersResponse.data?.users?.length || 0;
      const pendingLeaves =
        leavesResponse.data?.filter((leave) => leave.status === "pending")
          ?.length || 0;

      setQuickStats({
        totalEmployees,
        attendanceRate: 94.2, // This would come from attendance API
        pendingLeaves,
      });
    } catch (error) {
      console.error("خطأ في تحميل الإحصائيات السريعة:", error);
    } finally {
      setStatsLoading(false);
    }
  }, [user?.token]);

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      const token = user?.token;
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reports`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReports(response.data?.reports || []);
    } catch (error) {
      console.error("خطأ في تحميل التقارير:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  // Effects
  useEffect(() => {
    if (user?.token) {
      loadReports();
      loadQuickStats();
    }
  }, [user?.token, loadReports, loadQuickStats]);

  const generateReport = async (reportType) => {
    try {
      setGenerateLoading(reportType.id);
      const token = user?.token;
      if (!token) return;

      const currentDate = new Date();
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endDate = new Date();

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${reportType.endpoint}`,
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message && response.data.reportId) {
        // Success - report generated
        setReportData(response.data);
        setSelectedReport(reportType);
        loadReports();

        // Show success message and open modal
        showToast("تم إنشاء التقرير بنجاح! 🎉", "success");
        setShowReportModal(true);
      }
    } catch (error) {
      console.error("خطأ في إنشاء التقرير:", error);
      showToast("حدث خطأ في إنشاء التقرير", "error");
    } finally {
      setGenerateLoading(null);
    }
  };

  // Download report as CSV
  const downloadReportCSV = async (reportType, reportId = null) => {
    try {
      setDownloadLoading(reportType.id);
      const token = user?.token;
      if (!token) return;

      let downloadUrl;
      let params = {};

      if (reportId) {
        // Download specific report
        downloadUrl = `${
          import.meta.env.VITE_API_URL
        }/api/reports/${reportId}/download/csv`;
      } else {
        // Download fresh report
        downloadUrl = `${import.meta.env.VITE_API_URL}${
          reportType.downloadEndpoint
        }`;

        // Add date parameters for time-based reports
        if (reportType.id === "attendance" || reportType.id === "leaves") {
          const currentDate = new Date();
          const startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          );
          const endDate = new Date();

          params = {
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          };
        }
      }

      const response = await axios.get(downloadUrl, {
        headers: { Authorization: `Bearer ${token}` },
        params: params,
        responseType: "blob",
      });

      // Create download link
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);

      // Get filename from response headers or create default
      const contentDisposition = response.headers["content-disposition"];
      let filename = `${reportType.title}_${
        new Date().toISOString().split("T")[0]
      }.csv`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("تم تحميل التقرير بنجاح! 📊", "success");
    } catch (error) {
      console.error("خطأ في تحميل التقرير:", error);

      // معالجة أنواع الأخطاء المختلفة
      let errorMessage = "حدث خطأ في تحميل التقرير";

      if (error.response?.status === 404) {
        errorMessage = "التقرير غير موجود";
      } else if (error.response?.status === 400) {
        errorMessage =
          error.response.data?.message || "التقرير لا يحتوي على بيانات للتحميل";
      } else if (error.response?.status === 403) {
        errorMessage = "ليس لديك صلاحية لتحميل هذا التقرير";
      } else if (error.response?.status === 500) {
        errorMessage = "خطأ في الخادم - يرجى المحاولة لاحقاً";
      } else if (error.code === "NETWORK_ERROR") {
        errorMessage = "خطأ في الاتصال بالخادم";
      }

      showToast(errorMessage, "error");
    } finally {
      setDownloadLoading(null);
    }
  };

  // Download existing report
  const downloadExistingReport = async (report) => {
    try {
      setDownloadLoading(report._id);
      const token = user?.token;
      if (!token) {
        showToast("خطأ في المصادقة - يرجى تسجيل الدخول مرة أخرى", "error");
        return;
      }

      // التحقق من وجود معرف التقرير
      if (!report._id) {
        showToast("معرف التقرير غير صحيح", "error");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reports/${
          report._id
        }/download/csv`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      // التحقق من وجود البيانات
      if (!response.data || response.data.size === 0) {
        showToast("التقرير فارغ - لا توجد بيانات للتحميل", "error");
        return;
      }

      // Create download link
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);

      // Get filename from response headers or create default
      const contentDisposition = response.headers["content-disposition"];
      let filename = `${report.name || "تقرير"}_${report._id}.csv`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("تم تحميل التقرير بنجاح! 📊", "success");
    } catch (error) {
      console.error("خطأ في تحميل التقرير:", error);

      // معالجة أنواع الأخطاء المختلفة
      let errorMessage = "حدث خطأ في تحميل التقرير";

      if (error.response?.status === 404) {
        errorMessage = "التقرير غير موجود";
      } else if (error.response?.status === 400) {
        errorMessage =
          error.response.data?.message || "التقرير لا يحتوي على بيانات للتحميل";
      } else if (error.response?.status === 403) {
        errorMessage = "ليس لديك صلاحية لتحميل هذا التقرير";
      } else if (error.response?.status === 500) {
        errorMessage = "خطأ في الخادم - يرجى المحاولة لاحقاً";
      } else if (error.code === "NETWORK_ERROR") {
        errorMessage = "خطأ في الاتصال بالخادم";
      }

      showToast(errorMessage, "error");
    } finally {
      setDownloadLoading(null);
    }
  };

  // Simple Report Card Component (without Framer Motion)
  const ReportCard = ({ report, onClick, loading }) => {
    const Icon = report.icon;
    const colorClasses = {
      blue: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        iconBg: "bg-blue-100 dark:bg-blue-800/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-700",
        hoverBg: "hover:bg-blue-100 dark:hover:bg-blue-800/20",
      },
      green: {
        bg: "bg-green-50 dark:bg-green-900/20",
        iconBg: "bg-green-100 dark:bg-green-800/30",
        iconColor: "text-green-600 dark:text-green-400",
        border: "border-green-200 dark:border-green-700",
        hoverBg: "hover:bg-green-100 dark:hover:bg-green-800/20",
      },
      orange: {
        bg: "bg-orange-50 dark:bg-orange-900/20",
        iconBg: "bg-orange-100 dark:bg-orange-800/30",
        iconColor: "text-orange-600 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-700",
        hoverBg: "hover:bg-orange-100 dark:hover:bg-orange-800/20",
      },
      purple: {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        iconBg: "bg-purple-100 dark:bg-purple-800/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-700",
        hoverBg: "hover:bg-purple-100 dark:hover:bg-purple-800/20",
      },
    };

    const colors = colorClasses[report.color] || colorClasses.blue;

    return (
      <div
        className={`relative overflow-hidden rounded-2xl border-2 ${
          colors.border
        } ${colors.bg} 
          report-card shadow-colored shadow-colored-hover active-state
          ${
            darkMode
              ? "shadow-xl shadow-gray-900/20"
              : "shadow-xl shadow-gray-200/30"
          }`}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className={`p-4 rounded-2xl ${colors.iconBg} shadow-lg`}>
              <Icon className={`w-8 h-8 ${colors.iconColor}`} />
            </div>
            {loading && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-400 border-t-transparent"></div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h3
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {report.title}
            </h3>
            <p
              className={`text-sm leading-relaxed ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {report.description}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              onClick={onClick}
              disabled={loading || downloadLoading === report.id}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${colors.hoverBg} ${colors.iconColor} border ${colors.border} hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <FiFileText className="w-4 h-4" />
              <span className="text-sm">إنشاء</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadReportCSV(report);
              }}
              disabled={loading || downloadLoading === report.id}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {downloadLoading === report.id ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <FiDownload className="w-4 h-4" />
              )}
              <span className="text-sm">تحميل CSV</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Quick Stats Card Component
  const StatCard = ({ icon: Icon, title, value, change, color }) => {
    const colorClasses = {
      blue: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
      green:
        "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
      orange:
        "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30",
    };

    return (
      <div
        className={`p-6 rounded-xl ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border stat-card shadow-colored shadow-colored-hover`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div
              className={`text-sm font-medium mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {title}
            </div>
            <div
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {statsLoading ? (
                <div className="loading-shimmer h-8 w-20 rounded"></div>
              ) : (
                value
              )}
            </div>
            {change && (
              <div className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">
                {change}
              </div>
            )}
          </div>
          <div className={`p-4 rounded-xl ${colorClasses[color]} shadow-lg`}>
            <Icon className="w-7 h-7" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-8 scroll-smooth">
      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: "", type: "" })}
      />

      {/* Header */}
      <div
        className={`relative overflow-hidden rounded-3xl p-8 ${
          darkMode
            ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800"
            : "bg-gradient-to-br from-indigo-50 via-white to-blue-50"
        } border ${darkMode ? "border-gray-700" : "border-indigo-100"}`}
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2
              className={`text-4xl font-bold mb-3 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              📊 التقارير الإدارية
            </h2>
            <p
              className={`text-lg ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              إنشاء وإدارة التقارير المختلفة للنظام بطريقة احترافية ومتقدمة
            </p>
          </div>
          <button
            onClick={() => {
              loadReports();
              loadQuickStats();
            }}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FiRefreshCw
              className={`w-5 h-5 ${
                loading || statsLoading ? "animate-spin" : ""
              }`}
            />
            تحديث البيانات
          </button>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-200/20 to-indigo-200/20 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Quick Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={FiUsers}
          title="إجمالي الموظفين"
          value={quickStats.totalEmployees}
          color="blue"
        />
        <StatCard
          icon={FiTrendingUp}
          title="معدل الحضور"
          value={`${quickStats.attendanceRate}%`}
          change="+2.5% من الشهر الماضي"
          color="green"
        />
        <StatCard
          icon={FiCalendar}
          title="طلبات الإجازة المعلقة"
          value={quickStats.pendingLeaves}
          color="orange"
        />
      </div>

      {/* Report Generation Cards */}
      <div>
        <h3
          className={`text-xl font-semibold mb-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          إنشاء التقارير
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reportTypes.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => generateReport(report)}
              loading={generateLoading === report.id}
            />
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div>
        <h3
          className={`text-xl font-semibold mb-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          التقارير الأخيرة
        </h3>
        <div
          className={`rounded-2xl border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } overflow-hidden shadow-xl`}
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                جاري تحميل التقارير...
              </p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-8 text-center">
              <FiFileText
                className={`w-12 h-12 mx-auto mb-4 ${
                  darkMode ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <h4
                className={`text-lg font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                لا توجد تقارير
              </h4>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                قم بإنشاء تقرير جديد لبدء العمل
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {reports.slice(0, 5).map((report, index) => (
                <div
                  key={report._id || index}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <FiFileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h4
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {report.name || "تقرير"}
                        </h4>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {report.generatedAt || report.createdAt
                            ? new Date(
                                report.generatedAt || report.createdAt
                              ).toLocaleDateString("ar-SA")
                            : "غير محدد"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                        title="عرض التقرير"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadExistingReport(report)}
                        disabled={downloadLoading === report._id}
                        className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="تحميل التقرير CSV"
                      >
                        {downloadLoading === report._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
                        ) : (
                          <FiDownload className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Details Modal */}
      {showReportModal && selectedReport && reportData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/60 animate-fadeIn">
          <div
            className={`w-full max-w-2xl mx-4 rounded-2xl shadow-2xl modal-content ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`px-6 py-4 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <FiBarChart2
                      className="text-green-600 dark:text-green-400"
                      size={20}
                    />
                  </div>
                  <h2 className="text-xl font-bold">تم إنشاء التقرير بنجاح</h2>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                      : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <selectedReport.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {selectedReport.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    تم إنشاء التقرير بنجاح ويمكنك الآن عرضه أو تحميله
                  </p>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <p className="text-sm">
                    <span className="font-medium">معرف التقرير:</span>{" "}
                    {reportData.reportId}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className={`px-6 py-4 border-t ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } flex justify-end space-x-3 space-x-reverse`}
            >
              <button
                onClick={() => setShowReportModal(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                إغلاق
              </button>
              <button
                onClick={() =>
                  downloadReportCSV(selectedReport, reportData.reportId)
                }
                disabled={downloadLoading === selectedReport.id}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloadLoading === selectedReport.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <FiDownload className="w-4 h-4" />
                )}
                تحميل CSV
              </button>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                عرض التقرير
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRReportsTab;
