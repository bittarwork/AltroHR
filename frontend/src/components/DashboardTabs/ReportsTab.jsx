import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiPieChart,
  FiTrendingUp,
  FiUsers,
  FiShield,
  FiMonitor,
  FiDownload,
  FiFilter,
  FiCalendar,
  FiFileText,
  FiActivity,
  FiDatabase,
  FiClock,
  FiRefreshCw,
  FiEye,
} from "react-icons/fi";

const ReportsTab = () => {
  const { darkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("system");
  const [loading, setLoading] = useState(false);

  const reportCategories = [
    {
      id: "system",
      label: "تقارير النظام",
      icon: FiMonitor,
      color: "blue",
      count: 8,
    },
    {
      id: "users",
      label: "تقارير المستخدمين",
      icon: FiUsers,
      color: "green",
      count: 12,
    },
    {
      id: "security",
      label: "تقارير الأمان",
      icon: FiShield,
      color: "red",
      count: 6,
    },
    {
      id: "analytics",
      label: "تقارير التحليلات",
      icon: FiBarChart2,
      color: "purple",
      count: 10,
    },
  ];

  const systemReports = [
    {
      id: 1,
      name: "تقرير أداء النظام",
      description: "تحليل مفصل لأداء النظام والخوادم",
      lastUpdated: "2024-01-15 09:30:00",
      format: ["PDF", "Excel", "JSON"],
      frequency: "يومي",
      status: "مكتمل",
      size: "2.5 MB",
    },
    {
      id: 2,
      name: "تقرير استخدام قاعدة البيانات",
      description: "إحصائيات الاستعلامات والتخزين",
      lastUpdated: "2024-01-15 08:45:00",
      format: ["PDF", "Excel"],
      frequency: "أسبوعي",
      status: "قيد التنفيذ",
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "تقرير النسخ الاحتياطية",
      description: "حالة وسجل النسخ الاحتياطية",
      lastUpdated: "2024-01-15 07:00:00",
      format: ["PDF", "CSV"],
      frequency: "يومي",
      status: "مكتمل",
      size: "950 KB",
    },
    {
      id: 4,
      name: "تقرير الأخطاء والتحذيرات",
      description: "سجل مفصل للأخطاء والتحذيرات",
      lastUpdated: "2024-01-15 06:30:00",
      format: ["PDF", "JSON"],
      frequency: "يومي",
      status: "مكتمل",
      size: "3.2 MB",
    },
  ];

  const userReports = [
    {
      id: 5,
      name: "تقرير نشاط المستخدمين",
      description: "تحليل نشاط وسلوك المستخدمين",
      lastUpdated: "2024-01-15 09:15:00",
      format: ["PDF", "Excel", "CSV"],
      frequency: "يومي",
      status: "مكتمل",
      size: "4.1 MB",
    },
    {
      id: 6,
      name: "تقرير المستخدمين الجدد",
      description: "إحصائيات التسجيل والمستخدمين الجدد",
      lastUpdated: "2024-01-15 08:30:00",
      format: ["PDF", "Excel"],
      frequency: "أسبوعي",
      status: "مكتمل",
      size: "1.2 MB",
    },
    {
      id: 7,
      name: "تقرير الأدوار والصلاحيات",
      description: "توزيع الأدوار والصلاحيات",
      lastUpdated: "2024-01-15 07:45:00",
      format: ["PDF", "Excel"],
      frequency: "شهري",
      status: "مكتمل",
      size: "880 KB",
    },
  ];

  const securityReports = [
    {
      id: 8,
      name: "تقرير محاولات تسجيل الدخول",
      description: "تحليل محاولات تسجيل الدخول الناجحة والفاشلة",
      lastUpdated: "2024-01-15 09:00:00",
      format: ["PDF", "Excel", "JSON"],
      frequency: "يومي",
      status: "مكتمل",
      size: "2.8 MB",
    },
    {
      id: 9,
      name: "تقرير الجلسات النشطة",
      description: "تحليل الجلسات النشطة والخاملة",
      lastUpdated: "2024-01-15 08:15:00",
      format: ["PDF", "CSV"],
      frequency: "يومي",
      status: "مكتمل",
      size: "1.5 MB",
    },
    {
      id: 10,
      name: "تقرير سجل التدقيق",
      description: "سجل مفصل لجميع العمليات الإدارية",
      lastUpdated: "2024-01-15 07:30:00",
      format: ["PDF", "JSON"],
      frequency: "يومي",
      status: "مكتمل",
      size: "5.2 MB",
    },
  ];

  const analyticsReports = [
    {
      id: 11,
      name: "تقرير الاستخدام العام",
      description: "تحليل شامل لاستخدام النظام",
      lastUpdated: "2024-01-15 09:45:00",
      format: ["PDF", "Excel", "PowerBI"],
      frequency: "أسبوعي",
      status: "مكتمل",
      size: "6.3 MB",
    },
    {
      id: 12,
      name: "تقرير الأداء والكفاءة",
      description: "مقاييس الأداء والكفاءة",
      lastUpdated: "2024-01-15 08:00:00",
      format: ["PDF", "Excel"],
      frequency: "شهري",
      status: "مكتمل",
      size: "3.7 MB",
    },
  ];

  const getReportsByCategory = (category) => {
    switch (category) {
      case "system":
        return systemReports;
      case "users":
        return userReports;
      case "security":
        return securityReports;
      case "analytics":
        return analyticsReports;
      default:
        return systemReports;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "مكتمل":
        return "green";
      case "قيد التنفيذ":
        return "yellow";
      case "فشل":
        return "red";
      default:
        return "gray";
    }
  };

  const generateReport = (reportId) => {
    setLoading(true);
    // Simulate report generation
    setTimeout(() => {
      setLoading(false);
      alert("تم إنشاء التقرير بنجاح!");
    }, 2000);
  };

  const downloadReport = (reportId, format) => {
    alert(`تم تحميل التقرير بصيغة ${format}`);
  };

  return (
    <div
      className={`p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
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
              إنشاء وتحميل التقارير الإدارية والتحليلية
            </p>
          </div>
          <div className="flex space-x-3 space-x-reverse">
            <button
              onClick={() => setLoading(true)}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg font-medium ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              } bg-blue-600 hover:bg-blue-700 text-white`}
              disabled={loading}
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              <span>تحديث جميع التقارير</span>
            </button>
          </div>
        </div>

        {/* Category Navigation */}
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg p-2`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {reportCategories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;

              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg transition-all duration-200 text-center ${
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
                    {category.count} تقرير
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Reports Grid */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {getReportsByCategory(selectedCategory).map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    } mb-2`}
                  >
                    {report.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-3`}
                  >
                    {report.description}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-lg ${
                    reportCategories.find((c) => c.id === selectedCategory)
                      ?.color === "blue"
                      ? "bg-blue-100 dark:bg-blue-900/20"
                      : reportCategories.find((c) => c.id === selectedCategory)
                          ?.color === "green"
                      ? "bg-green-100 dark:bg-green-900/20"
                      : reportCategories.find((c) => c.id === selectedCategory)
                          ?.color === "red"
                      ? "bg-red-100 dark:bg-red-900/20"
                      : "bg-purple-100 dark:bg-purple-900/20"
                  }`}
                >
                  <FiFileText
                    className={`${
                      reportCategories.find((c) => c.id === selectedCategory)
                        ?.color === "blue"
                        ? "text-blue-600 dark:text-blue-400"
                        : reportCategories.find(
                            (c) => c.id === selectedCategory
                          )?.color === "green"
                        ? "text-green-600 dark:text-green-400"
                        : reportCategories.find(
                            (c) => c.id === selectedCategory
                          )?.color === "red"
                        ? "text-red-600 dark:text-red-400"
                        : "text-purple-600 dark:text-purple-400"
                    }`}
                  />
                </div>
              </div>

              {/* Report Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    آخر تحديث:
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {report.lastUpdated}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    التكرار:
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {report.frequency}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    الحجم:
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {report.size}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    الحالة:
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(
                      report.status
                    )}-100 dark:bg-${getStatusColor(
                      report.status
                    )}-900/20 text-${getStatusColor(
                      report.status
                    )}-600 dark:text-${getStatusColor(report.status)}-400`}
                  >
                    {report.status}
                  </span>
                </div>
              </div>

              {/* Format Options */}
              <div className="mb-4">
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2 block`}
                >
                  الصيغ المتاحة:
                </span>
                <div className="flex flex-wrap gap-2">
                  {report.format.map((format) => (
                    <span
                      key={format}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        darkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => generateReport(report.id)}
                  className="flex-1 flex items-center justify-center space-x-2 space-x-reverse px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  <FiRefreshCw className={loading ? "animate-spin" : ""} />
                  <span>إنشاء</span>
                </button>

                <div className="relative group">
                  <button className="flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition-colors">
                    <FiDownload />
                  </button>

                  {/* Download Dropdown */}
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    {report.format.map((format) => (
                      <button
                        key={format}
                        onClick={() => downloadReport(report.id, format)}
                        className="w-full text-right px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white transition-colors">
                  <FiEye />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsTab;
