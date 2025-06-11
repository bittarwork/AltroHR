import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FiFileText,
  FiDownload,
  FiCalendar,
  FiUsers,
  FiBarChart2,
  FiTrendingUp,
  FiClock,
  FiRefreshCw,
  FiEye,
  FiFilter,
  FiX,
  FiActivity,
  FiPieChart,
  FiTarget,
  FiAward,
  FiZap,
  FiDatabase,
} from "react-icons/fi";

const HRReportsTab = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [generateLoading, setGenerateLoading] = useState(null);

  const availableReports = [
    {
      id: "employees",
      title: "تقرير الموظفين",
      description: "تقرير شامل عن جميع الموظفين في النظام",
      icon: FiUsers,
      color: "blue",
      endpoint: "/api/reports/generate/employees",
    },
    {
      id: "attendance",
      title: "تقرير الحضور والانصراف",
      description: "تقرير مفصل عن حضور الموظفين",
      icon: FiClock,
      color: "green",
      endpoint: "/api/reports/generate/attendance",
    },
    {
      id: "leaves",
      title: "تقرير الإجازات",
      description: "تقرير عن طلبات الإجازة والموافقات",
      icon: FiCalendar,
      color: "purple",
      endpoint: "/api/reports/generate/leaves",
    },
    {
      id: "departments",
      title: "تقرير الأقسام",
      description: "إحصائيات وتحليل أقسام الشركة",
      icon: FiBarChart2,
      color: "orange",
      endpoint: "/api/reports/generate/departments",
    },
  ];

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const token = user?.token;
      if (!token) return;

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
  };

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

      if (response.data.success) {
        setReportData(response.data.data);
        setSelectedReport(reportType);
        loadReports();
      }
    } catch (error) {
      console.error("خطأ في إنشاء التقرير:", error);
      alert("حدث خطأ في إنشاء التقرير");
    } finally {
      setGenerateLoading(null);
    }
  };

  // Modern Analytics Dashboard
  const AnalyticsDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className={`relative overflow-hidden rounded-2xl ${
          darkMode
            ? "bg-gradient-to-br from-blue-900 to-blue-800"
            : "bg-gradient-to-br from-blue-500 to-blue-600"
        } p-6 text-white shadow-2xl`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <FiActivity className="w-8 h-8" />
            <div className="text-right">
              <div className="text-3xl font-bold">1,247</div>
              <div className="text-blue-100">تقرير مُنشأ</div>
            </div>
          </div>
          <div className="flex items-center text-blue-100">
            <FiTrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">+12% من الشهر الماضي</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.05 }}
        className={`relative overflow-hidden rounded-2xl ${
          darkMode
            ? "bg-gradient-to-br from-green-900 to-green-800"
            : "bg-gradient-to-br from-green-500 to-green-600"
        } p-6 text-white shadow-2xl`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <FiTarget className="w-8 h-8" />
            <div className="text-right">
              <div className="text-3xl font-bold">98.5%</div>
              <div className="text-green-100">دقة التقارير</div>
            </div>
          </div>
          <div className="flex items-center text-green-100">
            <FiAward className="w-4 h-4 mr-1" />
            <span className="text-sm">تقييم ممتاز</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        className={`relative overflow-hidden rounded-2xl ${
          darkMode
            ? "bg-gradient-to-br from-purple-900 to-purple-800"
            : "bg-gradient-to-br from-purple-500 to-purple-600"
        } p-6 text-white shadow-2xl`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <FiZap className="w-8 h-8" />
            <div className="text-right">
              <div className="text-3xl font-bold">2.3s</div>
              <div className="text-purple-100">متوسط الإنشاء</div>
            </div>
          </div>
          <div className="flex items-center text-purple-100">
            <FiBarChart2 className="w-4 h-4 mr-1" />
            <span className="text-sm">أداء سريع</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        className={`relative overflow-hidden rounded-2xl ${
          darkMode
            ? "bg-gradient-to-br from-orange-900 to-orange-800"
            : "bg-gradient-to-br from-orange-500 to-orange-600"
        } p-6 text-white shadow-2xl`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <FiDatabase className="w-8 h-8" />
            <div className="text-right">
              <div className="text-3xl font-bold">847GB</div>
              <div className="text-orange-100">البيانات المُحللة</div>
            </div>
          </div>
          <div className="flex items-center text-orange-100">
            <FiPieChart className="w-4 h-4 mr-1" />
            <span className="text-sm">تحليل شامل</span>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Advanced Report Cards
  const ReportCard = ({ report, onClick, loading }) => {
    const Icon = report.icon;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -5 }}
        className={`relative overflow-hidden rounded-2xl ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-2xl border ${
          darkMode ? "border-gray-700" : "border-gray-100"
        } cursor-pointer group`}
        onClick={onClick}
      >
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-${report.color}-500/5 to-${report.color}-600/10 opacity-0 group-hover:opacity-100 transition-opacity`}
        />

        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <div
              className={`p-4 rounded-2xl bg-${report.color}-100 dark:bg-${report.color}-900/30 group-hover:scale-110 transition-transform`}
            >
              <Icon
                className={`w-8 h-8 text-${report.color}-600 dark:text-${report.color}-400`}
              />
            </div>
            {loading && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
            )}
          </div>

          <div className="space-y-3">
            <h3
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {report.title}
            </h3>
            <p
              className={`text-sm leading-relaxed ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {report.description}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div
                className={`w-2 h-2 rounded-full bg-${report.color}-500`}
              ></div>
              <span
                className={`text-xs font-medium ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                جاهز للإنشاء
              </span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <FiDownload
                className={`w-4 h-4 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } group-hover:text-${report.color}-500 transition-colors`}
              />
              <span
                className={`text-xs font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } group-hover:text-${report.color}-500 transition-colors`}
              >
                تحميل
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            التقارير الإدارية
          </h2>
          <p
            className={`text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } mt-1`}
          >
            مركز تحليل البيانات وإنشاء التقارير المتقدمة
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadReports}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            تحديث القائمة
          </button>
        </div>
      </div>

      {/* Modern Analytics Dashboard */}
      <AnalyticsDashboard />

      {/* Quick Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl p-6 shadow-xl border ${
          darkMode ? "border-gray-700" : "border-gray-100"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              نظرة سريعة على الأداء
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              تحليل مباشر لأهم المؤشرات
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span
              className={`text-sm font-medium ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              مُحدث الآن
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full"></div>
              <div className="absolute inset-2 bg-blue-500 rounded-full flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
            </div>
            <div
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              156
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              إجمالي الموظفين
            </div>
          </div>

          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full"></div>
              <div className="absolute inset-2 bg-green-500 rounded-full flex items-center justify-center">
                <FiClock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              94.2%
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              معدل الحضور
            </div>
          </div>

          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 rounded-full"></div>
              <div className="absolute inset-2 bg-purple-500 rounded-full flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <div
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              23
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              طلبات الإجازة
            </div>
          </div>
        </div>
      </motion.div>

      {/* Report Generation Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            إنشاء التقارير
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiFileText className="w-4 h-4" />
            <span>اختر نوع التقرير المطلوب</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {availableReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ReportCard
                report={report}
                onClick={() => generateReport(report)}
                loading={generateLoading === report.id}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl border ${
          darkMode ? "border-gray-700" : "border-gray-100"
        } overflow-hidden`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                التقارير الأخيرة
              </h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } mt-1`}
              >
                التقارير المُنشاة مؤخراً
              </p>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <FiEye className="w-4 h-4" />
              عرض الكل
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <FiFileText
                className={`mx-auto h-12 w-12 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } mb-4`}
              />
              <p
                className={`text-lg font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                لا توجد تقارير متاحة
              </p>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                } mt-2`}
              >
                ابدأ بإنشاء تقرير جديد من الأعلى
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.slice(0, 5).map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    darkMode
                      ? "bg-gray-700/50 hover:bg-gray-700"
                      : "bg-gray-50 hover:bg-gray-100"
                  } transition-colors`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30`}
                    >
                      <FiFileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {report.name || `تقرير ${report.type}`}
                      </div>
                      <div
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {new Date(report.createdAt).toLocaleDateString("ar-SA")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                      <FiDownload className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">
                      <FiEye className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default HRReportsTab;
