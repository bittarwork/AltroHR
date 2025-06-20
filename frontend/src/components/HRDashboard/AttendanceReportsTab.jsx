import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FiBarChart2,
  FiCalendar,
  FiClock,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiDownload,
  FiRefreshCw,
  FiEye,
} from "react-icons/fi";

const AttendanceReportsTab = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState({
    totalRecords: 0,
    totalHours: 0,
    totalOvertimeHours: 0,
    presentDays: 0,
    partialDays: 0,
    absentDays: 0,
  });
  const [userStats, setUserStats] = useState([]);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split("T")[0], // First day of current month
    endDate: new Date().toISOString().split("T")[0], // Today
    department: "",
  });

  useEffect(() => {
    loadAttendanceReports();
  }, [filters]);

  const loadAttendanceReports = async () => {
    try {
      setLoading(true);
      const token = user?.token;
      if (!token) return;

      // Load attendance summary
      const summaryResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/attendance/reports/summary`,
        {
          params: filters,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Load all attendance records for the period
      const attendanceResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/attendance`,
        {
          params: {
            startDate: filters.startDate,
            endDate: filters.endDate,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (summaryResponse.data.success) {
        setSummary(
          summaryResponse.data.data.totalStats[0] || {
            totalRecords: 0,
            totalHours: 0,
            totalOvertimeHours: 0,
            presentDays: 0,
            partialDays: 0,
            absentDays: 0,
          }
        );
        setUserStats(summaryResponse.data.data.userStats || []);
      }

      setAttendanceData(attendanceResponse.data || []);
    } catch (error) {
      console.error("خطأ في تحميل تقارير الحضور:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg shadow-lg ${
        darkMode ? "bg-gray-800" : "bg-white"
      } border-l-4 border-${color}-500`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {title}
          </p>
          <p
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div
              className={`flex items-center text-sm ${
                trend > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend > 0 ? (
                <FiTrendingUp className="mr-1" />
              ) : (
                <FiTrendingDown className="mr-1" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900`}
        >
          <Icon
            className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`}
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            تقارير الحضور والانصراف
          </h2>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            تحليل شامل لحضور الموظفين وأداء الدوام
          </p>
        </div>
        <button
          onClick={loadAttendanceReports}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          تحديث التقارير
        </button>
      </div>

      {/* Filters */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg p-4 shadow`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              من تاريخ
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              إلى تاريخ
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              القسم
            </label>
            <select
              value={filters.department}
              onChange={(e) =>
                setFilters({ ...filters, department: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-purple-500`}
            >
              <option value="">جميع الأقسام</option>
              <option value="hr">الموارد البشرية</option>
              <option value="it">تقنية المعلومات</option>
              <option value="finance">المالية</option>
              <option value="marketing">التسويق</option>
            </select>
          </div>
        </div>
      </div>

      {/* الإحصائيات المجمّعة تم إزالتها حسب الطلب */}

      {/* Top Performers */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow p-6`}
      >
        <h3
          className={`text-lg font-bold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          أفضل الموظفين أداءً
        </h3>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : userStats.length === 0 ? (
          <div className="text-center py-8">
            <FiUsers
              className={`mx-auto h-12 w-12 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              } mb-4`}
            />
            <p
              className={`text-lg font-medium ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              لا توجد بيانات متاحة
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th
                    className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    الموظف
                  </th>
                  <th
                    className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    أيام الحضور
                  </th>
                  <th
                    className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    إجمالي الساعات
                  </th>
                  <th
                    className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    أيام الحضور
                  </th>
                  <th
                    className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    معدل الحضور
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {userStats.slice(0, 10).map((stat, index) => (
                  <motion.tr
                    key={stat._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`hover:${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    } transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-10 w-10 rounded-full ${
                            darkMode ? "bg-gray-600" : "bg-gray-200"
                          } flex items-center justify-center`}
                        >
                          <FiUsers
                            className={`h-5 w-5 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                        </div>
                        <div className="mr-4">
                          <div
                            className={`text-sm font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {stat.user?.name || "غير محدد"}
                          </div>
                          <div
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {stat.user?.email || "غير محدد"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {stat.totalDays}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {Math.round(stat.totalHours || 0)}h
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {stat.presentDays}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2`}
                        >
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                (stat.presentDays / stat.totalDays) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            darkMode ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          {Math.round(
                            (stat.presentDays / stat.totalDays) * 100
                          )}
                          %
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Daily Attendance Chart Placeholder */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow p-6`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-lg font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            نظرة عامة على الحضور اليومي
          </h3>
          <button className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-lg">
            <FiDownload />
            تصدير
          </button>
        </div>

        {/* Chart placeholder */}
        <div
          className={`h-64 rounded-lg border-2 border-dashed ${
            darkMode
              ? "border-gray-600 bg-gray-700"
              : "border-gray-300 bg-gray-50"
          } flex items-center justify-center`}
        >
          <div className="text-center">
            <FiBarChart2
              className={`mx-auto h-12 w-12 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              } mb-4`}
            />
            <p
              className={`text-lg font-medium ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              رسم بياني للحضور اليومي
            </p>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              سيتم إضافة المخططات البيانية قريباً
            </p>
          </div>
        </div>
      </div>

      {/* Recent Attendance Records */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow p-6`}
      >
        <h3
          className={`text-lg font-bold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          سجلات الحضور الأخيرة
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : attendanceData.length === 0 ? (
          <div className="text-center py-8">
            <FiClock
              className={`mx-auto h-12 w-12 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              } mb-4`}
            />
            <p
              className={`text-lg font-medium ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              لا توجد سجلات حضور
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th
                    className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    الموظف
                  </th>
                  <th
                    className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    التاريخ
                  </th>
                  <th
                    className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    وقت الحضور
                  </th>
                  <th
                    className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    وقت الانصراف
                  </th>
                  <th
                    className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    إجمالي الساعات
                  </th>
                  <th
                    className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {attendanceData.slice(0, 10).map((record, index) => (
                  <motion.tr
                    key={record._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`hover:${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    } transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {record.user?.name || "غير محدد"}
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {new Date(record.date).toLocaleDateString("ar-SA")}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {record.clockIn
                        ? new Date(record.clockIn).toLocaleTimeString("ar-SA", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "لم يسجل"}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {record.clockOut
                        ? new Date(record.clockOut).toLocaleTimeString(
                            "ar-SA",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "لم يسجل"}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {Math.round(record.totalWorkedHours || 0)}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          record.status === "present"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : record.status === "partial"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {record.status === "present"
                          ? "حاضر"
                          : record.status === "partial"
                          ? "جزئي"
                          : "غائب"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReportsTab;
