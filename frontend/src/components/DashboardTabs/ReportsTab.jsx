import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FiBarChart2,
  FiUsers,
  FiClock,
  FiFileText,
  FiRefreshCw,
  FiEye,
  FiCalendar,
  FiSettings,
  FiDownload,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";

const ReportsTab = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("employees");
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [reportStats, setReportStats] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const reportCategories = [
    {
      id: "employees",
      label: "تقارير الموظفين",
      icon: FiUsers,
      color: "blue",
      functional: true,
      description: "تقارير شاملة عن الموظفين والأقسام",
    },
    {
      id: "attendance",
      label: "تقارير الحضور",
      icon: FiClock,
      color: "green",
      functional: true,
      description: "تقارير الحضور والانصراف والساعات",
    },
  ];

  const functionalReports = {
    employees: {
      name: "تقرير الموظفين",
      description: "تقرير شامل عن جميع الموظفين بالنظام",
      endpoint: "/api/reports/generate/employees",
      params: ["startDate", "endDate", "departmentId"],
      formats: ["JSON", "PDF"],
      realTime: true,
    },
    attendance: {
      name: "تقرير الحضور والانصراف",
      description: "تقرير مفصل عن حضور الموظفين",
      endpoint: "/api/reports/generate/attendance",
      params: ["startDate", "endDate", "departmentId"],
      formats: ["JSON", "PDF", "Excel"],
      realTime: true,
    },
  };

  const developmentReports = {};

  // تحميل التقارير المولدة
  const loadReports = async () => {
    if (!user?.token) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/reports?category=${selectedCategory}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setReports(response.data.reports || []);
    } catch (error) {
      console.error("فشل في تحميل التقارير:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // تحميل إحصائيات التقارير
  const loadReportStats = async () => {
    if (!user?.token) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reports/statistics/overview`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setReportStats(response.data);
    } catch (error) {
      console.error("فشل في تحميل إحصائيات التقارير:", error);
    }
  };

  // إنشاء تقرير جديد
  const generateReport = async (category) => {
    if (!functionalReports[category]) {
      return;
    }

    setLoading(true);
    try {
      const reportConfig = functionalReports[category];
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${reportConfig.endpoint}`,
        {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      // إظهار رسالة نجاح
      setSuccessMessage("تم إنشاء التقرير بنجاح!");
      setTimeout(() => setSuccessMessage(null), 3000);

      console.log("تم إنشاء التقرير بنجاح:", response.data);
      loadReports(); // إعادة تحميل التقارير

      // تحميل CSV مباشرة بعد الإنشاء
      if (response.data.reportId) {
        setTimeout(() => {
          downloadReportCSV(category);
        }, 1000);
      }
    } catch (error) {
      console.error("فشل في إنشاء التقرير:", error);
    } finally {
      setLoading(false);
    }
  };

  // تحميل التقرير كـ CSV بدلاً من عرضه
  const downloadReportCSV = async (category) => {
    setDownloadLoading(true);
    setErrorMessage(null);

    try {
      let downloadUrl = "";
      let reportName = "";

      // تحديد الرابط الصحيح للتحميل حسب نوع التقرير
      switch (category) {
        case "employees":
          downloadUrl = "/api/reports/download/employees/csv";
          reportName = "الموظفين";
          break;
        case "attendance":
          downloadUrl = "/api/reports/download/attendance/csv";
          reportName = "الحضور";
          break;
        default:
          setErrorMessage("نوع تقرير غير معروف");
          return;
      }

      // بناء معاملات الاستعلام
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      // تحميل التقرير باستخدام axios للتعامل مع المصادقة
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}${downloadUrl}?${params}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
          responseType: "blob", // مهم لتحميل الملفات
        }
      );

      // إنشاء رابط تحميل من البيانات المستلمة
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `تقرير_${reportName}_${dateRange.startDate}_الى_${dateRange.endDate}.csv`;

      // تنفيذ التحميل
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // إظهار رسالة نجاح
      setSuccessMessage(`تم تحميل تقرير ${reportName} بنجاح!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("فشل في تحميل التقرير:", error);
      setErrorMessage(
        `فشل في تحميل التقرير: ${
          error.response?.data?.message || error.message
        }`
      );
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setDownloadLoading(false);
    }
  };

  // عرض تفاصيل التقرير المحفوظ بتحميل CSV
  const viewReportDetails = async (reportId) => {
    setDownloadLoading(true);
    setErrorMessage(null);

    try {
      console.log("جلب تفاصيل التقرير:", reportId);

      // تحميل التقرير المحفوظ مباشرة كـ CSV
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reports/${reportId}/download/csv`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
          responseType: "blob",
        }
      );

      // إنشاء رابط تحميل من البيانات المستلمة
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `saved_report_${reportId}.csv`;

      // تنفيذ التحميل
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // إظهار رسالة نجاح
      setSuccessMessage("تم تحميل التقرير المحفوظ بنجاح!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("خطأ في تحميل التقرير المحفوظ:", error);
      setErrorMessage(
        `فشل في تحميل التقرير المحفوظ: ${
          error.response?.data?.message || error.message
        }`
      );
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setDownloadLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      loadReports();
      loadReportStats();
    }
  }, [selectedCategory, user?.token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-SA");
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    const mb = kb / 1024;
    return `${Math.round(mb * 100) / 100} MB`;
  };

  return (
    <div
      className={`p-6 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } min-h-screen relative`}
    >
      {/* Loading Overlay */}
      {(loading || downloadLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-4 space-x-reverse">
            <FiRefreshCw className="animate-spin text-2xl text-blue-500" />
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              {loading ? "جاري إنشاء التقرير..." : "جاري تحميل الملف..."}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* رسالة النجاح */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center space-x-3 space-x-reverse p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <FiCheckCircle className="text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200 font-medium">
              {successMessage}
            </span>
          </motion.div>
        )}

        {/* رسالة الخطأ */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center space-x-3 space-x-reverse p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <FiX className="text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200 font-medium">
              {errorMessage}
            </span>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              التقارير الإدارية
            </h2>
            <p
              className={`mt-1 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              إنشاء وإدارة التقارير الإدارية والتحليلية
            </p>
          </div>

          <div className="flex items-center space-x-3 space-x-reverse">
            {/* نطاق التاريخ */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className={`px-3 py-2 rounded-lg text-sm ${
                  darkMode
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white border-gray-300"
                } border focus:ring-2 focus:ring-blue-500`}
              />
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                إلى
              </span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className={`px-3 py-2 rounded-lg text-sm ${
                  darkMode
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white border-gray-300"
                } border focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <button
              onClick={loadReports}
              disabled={loading}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg font-medium ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              } bg-blue-600 hover:bg-blue-700 text-white`}
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              <span>تحديث</span>
            </button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        {reportStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow`}
            >
              <div className="flex items-center">
                <FiFileText className="text-2xl text-blue-500 mr-3" />
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    إجمالي التقارير
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {reportStats.total || 0}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow`}
            >
              <div className="flex items-center">
                <FiCalendar className="text-2xl text-green-500 mr-3" />
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    هذا الأسبوع
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {reportStats.recentWeek || 0}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow`}
            >
              <div className="flex items-center">
                <FiBarChart2 className="text-2xl text-purple-500 mr-3" />
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    الفئات النشطة
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {reportStats.byCategory?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow`}
            >
              <div className="flex items-center">
                <FiSettings className="text-2xl text-orange-500 mr-3" />
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    الفئات النشطة
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    2
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* فئات التقارير */}
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg p-2`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {reportCategories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              const isFunctional = category.functional;

              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg transition-all duration-200 text-center relative ${
                    isActive
                      ? `bg-${category.color}-500 text-white shadow-lg shadow-${category.color}-500/30`
                      : `text-${category.color}-600 dark:text-${category.color}-400 hover:bg-${category.color}-50 dark:hover:bg-${category.color}-900/20`
                  } ${
                    !isActive &&
                    (darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50")
                  }`}
                >
                  <Icon className="text-2xl mx-auto mb-2" />
                  <div className="text-sm font-medium">{category.label}</div>
                  <div
                    className={`text-xs mt-1 ${
                      isActive
                        ? "text-white/80"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {category.description}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* محتوى التقارير */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* التقارير الوظيفية */}
          {reportCategories.find((c) => c.id === selectedCategory)
            ?.functional && (
            <div className="space-y-6">
              {/* إنشاء تقرير جديد */}
              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl shadow-lg p-6`}
              >
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  إنشاء تقرير جديد
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <h4
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {functionalReports[selectedCategory]?.name}
                    </h4>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {functionalReports[selectedCategory]?.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    <button
                      onClick={() => downloadReportCSV(selectedCategory)}
                      disabled={downloadLoading}
                      className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg font-medium ${
                        downloadLoading ? "opacity-50 cursor-not-allowed" : ""
                      } bg-green-600 hover:bg-green-700 text-white`}
                      title="تحميل التقرير مباشرة كـ CSV"
                    >
                      <FiDownload
                        className={downloadLoading ? "animate-spin" : ""}
                      />
                      <span>
                        {downloadLoading ? "جاري التحميل..." : "تحميل CSV"}
                      </span>
                    </button>

                    <button
                      onClick={() => generateReport(selectedCategory)}
                      disabled={loading || downloadLoading}
                      className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-lg font-medium ${
                        loading || downloadLoading
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      } bg-blue-600 hover:bg-blue-700 text-white`}
                    >
                      <FiBarChart2 className={loading ? "animate-spin" : ""} />
                      <span>{loading ? "جاري الإنشاء..." : "إنشاء وحفظ"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* التقارير المولدة */}
              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl shadow-lg p-6`}
              >
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  التقارير المولدة مؤخراً
                </h3>

                {loading ? (
                  <div className="text-center py-8">
                    <FiRefreshCw className="animate-spin text-3xl mx-auto mb-4 text-blue-500" />
                    <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                      جاري تحميل التقارير...
                    </p>
                  </div>
                ) : reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div
                        key={report._id}
                        className={`border rounded-lg p-4 ${
                          darkMode
                            ? "border-gray-700 bg-gray-700/50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4
                              className={`font-medium ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {report.name}
                            </h4>
                            <p
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {report.description}
                            </p>
                            <div className="flex items-center space-x-4 space-x-reverse mt-2 text-xs">
                              <span
                                className={
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                }
                              >
                                تم الإنشاء: {formatDate(report.generatedAt)}
                              </span>
                              <span
                                className={
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                }
                              >
                                الحجم: {formatFileSize(report.fileSize)}
                              </span>
                              <span
                                className={
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                }
                              >
                                السجلات: {report.summary?.totalRecords || 0}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                              مكتمل
                            </span>

                            <button
                              onClick={() => viewReportDetails(report._id)}
                              disabled={downloadLoading}
                              className={`p-2 rounded-lg ${
                                downloadLoading
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              } bg-blue-600 hover:bg-blue-700 text-white`}
                              title="تحميل التقرير كـ CSV"
                            >
                              <FiEye
                                className={
                                  downloadLoading ? "animate-spin" : ""
                                }
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiFileText className="text-4xl mx-auto mb-4 text-gray-400" />
                    <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                      لا توجد تقارير متاحة حالياً
                    </p>
                    <p
                      className={`text-sm mt-2 ${
                        darkMode ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      قم بإنشاء تقرير جديد لرؤية النتائج هنا
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsTab;
