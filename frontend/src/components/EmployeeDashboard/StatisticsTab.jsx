import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { userService, attendanceService } from "../../services";
import { useToast, SimpleToastContainer } from "../ToastNotification";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Icons
import {
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiTrendingDown,
  FiUser,
  FiDollarSign,
  FiTarget,
  FiAward,
  FiRefreshCw,
  FiBarChart2,
  FiPieChart,
  FiActivity,
  FiSun,
  FiMoon,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiUsers,
  FiHome,
  FiCoffee,
} from "react-icons/fi";

const StatisticsTab = ({ user, onDataChange }) => {
  const { darkMode } = useTheme();
  const { user: authUser } = useAuth();
  const toast = useToast();

  // States
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("current_month"); // current_month, last_month, current_year
  const [refreshing, setRefreshing] = useState(false);

  // تحميل البيانات عند البدء
  useEffect(() => {
    loadAllData();
  }, [selectedPeriod]);

  // إعادة حساب الإحصائيات عند تغيير بيانات الحضور
  useEffect(() => {
    if (attendanceData.length > 0) {
      loadMonthlyAnalytics();
    }
  }, [attendanceData, selectedPeriod]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadQuickStats(),
        loadAttendanceData(),
        loadMonthlyAnalytics(),
      ]);
    } catch (error) {
      toast.error("فشل في تحميل الإحصائيات");
    } finally {
      setLoading(false);
    }
  };

  const loadQuickStats = async () => {
    try {
      const response = await userService.getEmployeeQuickStats();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error("Error loading quick stats:", error);
    }
  };

  const loadAttendanceData = async () => {
    try {
      const response = await userService.getMyAttendance();
      if (response.success) {
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.records || [];
        setAttendanceData(data);
      }
    } catch (error) {
      console.error("Error loading attendance data:", error);
    }
  };

  const loadMonthlyAnalytics = async () => {
    try {
      // حساب الإحصائيات الشهرية من بيانات الحضور بناءً على الفترة المختارة
      const monthlyStats = calculateMonthlyStats(
        attendanceData,
        selectedPeriod
      );
      setMonthlyData(monthlyStats);
    } catch (error) {
      console.error("Error calculating monthly analytics:", error);
    }
  };

  const calculateMonthlyStats = (attendance, period) => {
    if (!Array.isArray(attendance)) return [];

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const monthsData = [];

    switch (period) {
      case "current_month": {
        // الشهر الحالي فقط - عرض أسبوعي
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

        // تقسيم الشهر إلى أسابيع
        for (let week = 1; week <= 4; week++) {
          const weekStart = new Date(
            currentYear,
            currentMonth,
            (week - 1) * 7 + 1
          );
          const weekEnd = new Date(currentYear, currentMonth, week * 7);

          const weekAttendance = attendance.filter((record) => {
            const recordDate = new Date(record.date);
            return recordDate >= weekStart && recordDate <= weekEnd;
          });

          const workDays = weekAttendance.length;
          const totalHours = weekAttendance.reduce(
            (sum, record) => sum + (record.totalWorkedHours || 0),
            0
          );
          const overtimeHours = weekAttendance.reduce(
            (sum, record) => sum + (record.overtimeHours || 0),
            0
          );
          const lateCount = weekAttendance.filter(
            (record) => record.status === "late"
          ).length;
          const earlyLeaveCount = weekAttendance.filter(
            (record) => record.earlyLeave
          ).length;

          monthsData.push({
            month: `الأسبوع ${week}`,
            workDays,
            totalHours: Math.round(totalHours * 10) / 10,
            overtimeHours: Math.round(overtimeHours * 10) / 10,
            lateCount,
            earlyLeaveCount,
            averageHoursPerDay:
              workDays > 0 ? Math.round((totalHours / workDays) * 10) / 10 : 0,
          });
        }
        break;
      }

      case "last_month": {
        // الشهر الماضي فقط - عرض أسبوعي
        const lastMonth = currentMonth - 1;
        const lastMonthYear = lastMonth < 0 ? currentYear - 1 : currentYear;
        const adjustedLastMonth = lastMonth < 0 ? 11 : lastMonth;

        for (let week = 1; week <= 4; week++) {
          const weekStart = new Date(
            lastMonthYear,
            adjustedLastMonth,
            (week - 1) * 7 + 1
          );
          const weekEnd = new Date(lastMonthYear, adjustedLastMonth, week * 7);

          const weekAttendance = attendance.filter((record) => {
            const recordDate = new Date(record.date);
            return recordDate >= weekStart && recordDate <= weekEnd;
          });

          const workDays = weekAttendance.length;
          const totalHours = weekAttendance.reduce(
            (sum, record) => sum + (record.totalWorkedHours || 0),
            0
          );
          const overtimeHours = weekAttendance.reduce(
            (sum, record) => sum + (record.overtimeHours || 0),
            0
          );

          monthsData.push({
            month: `الأسبوع ${week}`,
            workDays,
            totalHours: Math.round(totalHours * 10) / 10,
            overtimeHours: Math.round(overtimeHours * 10) / 10,
            lateCount: weekAttendance.filter(
              (record) => record.status === "late"
            ).length,
            earlyLeaveCount: weekAttendance.filter(
              (record) => record.earlyLeave
            ).length,
            averageHoursPerDay:
              workDays > 0 ? Math.round((totalHours / workDays) * 10) / 10 : 0,
          });
        }
        break;
      }

      case "current_year":
      default: {
        // السنة الحالية - عرض شهري (آخر 12 شهر)
        for (let i = 11; i >= 0; i--) {
          const targetDate = new Date(currentYear, currentMonth - i, 1);
          const month = targetDate.getMonth();
          const year = targetDate.getFullYear();

          const monthAttendance = attendance.filter((record) => {
            const recordDate = new Date(record.date);
            return (
              recordDate.getMonth() === month &&
              recordDate.getFullYear() === year
            );
          });

          const workDays = monthAttendance.length;
          const totalHours = monthAttendance.reduce(
            (sum, record) => sum + (record.totalWorkedHours || 0),
            0
          );
          const overtimeHours = monthAttendance.reduce(
            (sum, record) => sum + (record.overtimeHours || 0),
            0
          );
          const lateCount = monthAttendance.filter(
            (record) => record.status === "late"
          ).length;
          const earlyLeaveCount = monthAttendance.filter(
            (record) => record.earlyLeave
          ).length;

          monthsData.push({
            month: targetDate.toLocaleDateString("ar-SA", {
              month: "short",
              year: "numeric",
            }),
            workDays,
            totalHours: Math.round(totalHours * 10) / 10,
            overtimeHours: Math.round(overtimeHours * 10) / 10,
            lateCount,
            earlyLeaveCount,
            averageHoursPerDay:
              workDays > 0 ? Math.round((totalHours / workDays) * 10) / 10 : 0,
          });
        }
        break;
      }
    }

    return monthsData;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
    toast.success("تم تحديث الإحصائيات");
  };

  const getCurrentMonthStats = () => {
    if (!statistics) return null;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // تحديد البيانات بناءً على الفترة المختارة
    let workDays, workHours, expectedDays, expectedHours;

    switch (selectedPeriod) {
      case "current_month":
        workDays = statistics.currentMonthWorkDays || 0;
        workHours = statistics.currentMonthWorkHours || 0;
        expectedDays = getWorkingDaysInMonth(currentYear, currentMonth);
        expectedHours = (statistics.workHoursPerDay || 8) * expectedDays;
        break;

      case "last_month":
        // حساب الشهر الماضي
        const lastMonth = currentMonth - 1;
        const lastMonthYear = lastMonth < 0 ? currentYear - 1 : currentYear;
        const adjustedLastMonth = lastMonth < 0 ? 11 : lastMonth;

        // فلترة بيانات الحضور للشهر الماضي
        const lastMonthAttendance = attendanceData.filter((record) => {
          const recordDate = new Date(record.date);
          return (
            recordDate.getMonth() === adjustedLastMonth &&
            recordDate.getFullYear() === lastMonthYear
          );
        });

        workDays = lastMonthAttendance.length;
        workHours = lastMonthAttendance.reduce(
          (sum, record) => sum + (record.totalWorkedHours || 0),
          0
        );
        expectedDays = getWorkingDaysInMonth(lastMonthYear, adjustedLastMonth);
        expectedHours = (statistics.workHoursPerDay || 8) * expectedDays;
        break;

      case "current_year":
      default:
        // بيانات السنة الحالية
        const currentYearAttendance = attendanceData.filter((record) => {
          const recordDate = new Date(record.date);
          return recordDate.getFullYear() === currentYear;
        });

        workDays = currentYearAttendance.length;
        workHours = currentYearAttendance.reduce(
          (sum, record) => sum + (record.totalWorkedHours || 0),
          0
        );
        expectedDays = getWorkingDaysInYear(currentYear);
        expectedHours = (statistics.workHoursPerDay || 8) * expectedDays;
        break;
    }

    return {
      workDays,
      workHours: Math.round(workHours * 10) / 10,
      expectedDays,
      expectedHours,
      attendanceRate: expectedDays > 0 ? (workDays / expectedDays) * 100 : 0,
    };
  };

  const getWorkingDaysInMonth = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let workingDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      // استثناء الجمعة (5) والسبت (6)
      if (dayOfWeek !== 5 && dayOfWeek !== 6) {
        workingDays++;
      }
    }

    return workingDays;
  };

  const getWorkingDaysInYear = (year) => {
    let totalWorkingDays = 0;
    for (let month = 0; month < 12; month++) {
      totalWorkingDays += getWorkingDaysInMonth(year, month);
    }
    return totalWorkingDays;
  };

  if (loading && !statistics) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2 space-x-reverse">
          <FiRefreshCw className="animate-spin text-2xl text-blue-600" />
          <span className={darkMode ? "text-white" : "text-gray-900"}>
            جاري تحميل الإحصائيات...
          </span>
        </div>
      </div>
    );
  }

  const currentMonthStats = getCurrentMonthStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* العنوان والتحكم */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2
            className={`text-3xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            📊 الإحصائيات والتحليلات
          </h2>
          <p
            className={`text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            تحليل شامل لأدائك وحضورك
          </p>
        </div>

        <div className="flex items-center space-x-4 space-x-reverse">
          {/* فترة التحليل */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="current_month">الشهر الحالي</option>
            <option value="last_month">الشهر الماضي</option>
            <option value="current_year">السنة الحالية</option>
          </select>

          {/* زر التحديث */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`p-3 rounded-lg transition-colors ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            <FiRefreshCw className={`${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <QuickStatCard
          title="أيام العمل"
          value={currentMonthStats?.workDays || 0}
          total={currentMonthStats?.expectedDays || 0}
          icon={<FiCalendar />}
          color="blue"
          percentage={currentMonthStats?.attendanceRate || 0}
          darkMode={darkMode}
        />

        <QuickStatCard
          title="ساعات العمل"
          value={Math.round(currentMonthStats?.workHours || 0)}
          total={Math.round(currentMonthStats?.expectedHours || 0)}
          icon={<FiClock />}
          color="green"
          percentage={
            ((currentMonthStats?.workHours || 0) /
              (currentMonthStats?.expectedHours || 1)) *
            100
          }
          darkMode={darkMode}
        />

        <QuickStatCard
          title="ساعات إضافية"
          value={statistics?.totalOvertimeHours || 0}
          icon={<FiTrendingUp />}
          color="purple"
          darkMode={darkMode}
        />

        <QuickStatCard
          title="طلبات الإجازة"
          value={statistics?.totalLeaveRequests || 0}
          approved={statistics?.approvedLeaveRequests || 0}
          pending={statistics?.pendingLeaveRequests || 0}
          icon={<FiUser />}
          color="orange"
          darkMode={darkMode}
        />
      </div>

      {/* الرسوم البيانية والتحليلات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* رسم بياني للحضور الشهري */}
        <MonthlyAttendanceChart
          data={monthlyData}
          darkMode={darkMode}
          selectedPeriod={selectedPeriod}
        />

        {/* رسم دائري لتوزيع الوقت */}
        <TimeDistributionChart statistics={statistics} darkMode={darkMode} />
      </div>

      {/* تحليل الأداء */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <PerformanceAnalysis
          statistics={statistics}
          currentMonthStats={currentMonthStats}
          darkMode={darkMode}
        />

        <AttendancePatterns
          attendanceData={attendanceData}
          darkMode={darkMode}
        />

        <ProductivityInsights
          statistics={statistics}
          monthlyData={monthlyData}
          darkMode={darkMode}
        />
      </div>

      {/* نظام التنبيهات */}
      <SimpleToastContainer />
    </div>
  );
};

// مكون بطاقة الإحصائيات السريعة
const QuickStatCard = ({
  title,
  value,
  total,
  icon,
  color,
  percentage,
  approved,
  pending,
  darkMode,
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <div
      className={`rounded-2xl p-6 ${
        darkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-200 shadow-lg"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} text-white`}
        >
          {icon}
        </div>
        {percentage && (
          <div
            className={`text-sm font-medium ${
              percentage >= 80
                ? "text-green-600"
                : percentage >= 60
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {Math.round(percentage)}%
          </div>
        )}
      </div>

      <h3
        className={`text-sm font-medium mb-2 ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {title}
      </h3>

      <div className="flex items-baseline space-x-2 space-x-reverse">
        <span
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {value}
        </span>
        {total && (
          <span
            className={`text-sm ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            / {total}
          </span>
        )}
      </div>

      {(approved !== undefined || pending !== undefined) && (
        <div className="mt-3 flex space-x-4 space-x-reverse text-xs">
          {approved !== undefined && (
            <span className="text-green-600">✓ {approved} مقبولة</span>
          )}
          {pending !== undefined && (
            <span className="text-yellow-600">⏳ {pending} معلقة</span>
          )}
        </div>
      )}

      {percentage && (
        <div className="mt-3">
          <div
            className={`w-full bg-gray-200 rounded-full h-2 ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${colorClasses[color]}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

// رسم بياني للحضور الشهري
const MonthlyAttendanceChart = ({ data, darkMode, selectedPeriod }) => {
  if (!data || data.length === 0) {
    return (
      <div
        className={`rounded-2xl p-6 ${
          darkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200 shadow-lg"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          📈 الحضور الشهري
        </h3>
        <p
          className={`text-center py-8 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          لا توجد بيانات كافية لعرض الرسم البياني
        </p>
      </div>
    );
  }

  const maxWorkDays = Math.max(...data.map((d) => d.workDays));
  const maxHours = Math.max(...data.map((d) => d.totalHours));

  return (
    <div
      className={`rounded-2xl p-6 ${
        darkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-200 shadow-lg"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-lg font-semibold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          📈{" "}
          {selectedPeriod === "current_month"
            ? "الحضور الأسبوعي (الشهر الحالي)"
            : selectedPeriod === "last_month"
            ? "الحضور الأسبوعي (الشهر الماضي)"
            : "الحضور الشهري (السنة الحالية)"}
        </h3>
        <FiBarChart2
          className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        />
      </div>

      <div className="h-64">
        <Bar
          data={{
            labels: data.map((d) => d.month),
            datasets: [
              {
                label: "أيام العمل",
                data: data.map((d) => d.workDays),
                backgroundColor: "rgba(59, 130, 246, 0.5)",
                borderColor: "rgb(59, 130, 246)",
                borderWidth: 2,
                yAxisID: "y",
              },
              {
                label: "ساعات العمل",
                data: data.map((d) => d.totalHours),
                backgroundColor: "rgba(16, 185, 129, 0.5)",
                borderColor: "rgb(16, 185, 129)",
                borderWidth: 2,
                yAxisID: "y1",
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: "index",
              intersect: false,
            },
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: darkMode ? "#D1D5DB" : "#374151",
                  font: { size: 12 },
                },
              },
              tooltip: {
                backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
                titleColor: darkMode ? "#F9FAFB" : "#111827",
                bodyColor: darkMode ? "#D1D5DB" : "#374151",
                borderColor: darkMode ? "#374151" : "#E5E7EB",
                borderWidth: 1,
              },
            },
            scales: {
              x: {
                grid: {
                  color: darkMode ? "#374151" : "#F3F4F6",
                },
                ticks: {
                  color: darkMode ? "#9CA3AF" : "#6B7280",
                },
              },
              y: {
                type: "linear",
                position: "left",
                grid: {
                  color: darkMode ? "#374151" : "#F3F4F6",
                },
                ticks: {
                  color: darkMode ? "#9CA3AF" : "#6B7280",
                },
                title: {
                  display: true,
                  text: "أيام العمل",
                  color: darkMode ? "#D1D5DB" : "#374151",
                },
              },
              y1: {
                type: "linear",
                position: "right",
                grid: {
                  drawOnChartArea: false,
                },
                ticks: {
                  color: darkMode ? "#9CA3AF" : "#6B7280",
                },
                title: {
                  display: true,
                  text: "ساعات العمل",
                  color: darkMode ? "#D1D5DB" : "#374151",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

// رسم دائري لتوزيع الوقت
const TimeDistributionChart = ({ statistics, darkMode }) => {
  if (!statistics) {
    return (
      <div
        className={`rounded-2xl p-6 ${
          darkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200 shadow-lg"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          🥧 توزيع الوقت
        </h3>
        <p
          className={`text-center py-8 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          لا توجد بيانات
        </p>
      </div>
    );
  }

  const totalHours = statistics.totalWorkHours || 0;
  const overtimeHours = statistics.totalOvertimeHours || 0;
  const regularHours = totalHours - overtimeHours;

  const data = [
    {
      label: "ساعات عادية",
      value: regularHours,
      color: "bg-blue-500",
      percentage: (regularHours / totalHours) * 100,
    },
    {
      label: "ساعات إضافية",
      value: overtimeHours,
      color: "bg-purple-500",
      percentage: (overtimeHours / totalHours) * 100,
    },
  ];

  return (
    <div
      className={`rounded-2xl p-6 ${
        darkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-200 shadow-lg"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-lg font-semibold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          🥧 توزيع الوقت
        </h3>
        <FiPieChart
          className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        />
      </div>

      {totalHours > 0 ? (
        <div className="space-y-4">
          {/* الرسم الدائري */}
          <div className="h-64">
            <Doughnut
              data={{
                labels: ["ساعات عادية", "ساعات إضافية"],
                datasets: [
                  {
                    data: [regularHours, overtimeHours],
                    backgroundColor: [
                      "rgba(59, 130, 246, 0.8)",
                      "rgba(147, 51, 234, 0.8)",
                    ],
                    borderColor: ["rgb(59, 130, 246)", "rgb(147, 51, 234)"],
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      color: darkMode ? "#D1D5DB" : "#374151",
                      font: { size: 12 },
                      padding: 20,
                    },
                  },
                  tooltip: {
                    backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
                    titleColor: darkMode ? "#F9FAFB" : "#111827",
                    bodyColor: darkMode ? "#D1D5DB" : "#374151",
                    borderColor: darkMode ? "#374151" : "#E5E7EB",
                    borderWidth: 1,
                    callbacks: {
                      label: function (context) {
                        const percentage = Math.round(
                          (context.parsed / totalHours) * 100
                        );
                        return `${context.label}: ${Math.round(
                          context.parsed
                        )} ساعة (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>

          {/* ملخص البيانات */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-blue-600 font-bold text-lg">
                {Math.round(regularHours)}
              </div>
              <div className="text-blue-600 text-sm">ساعات عادية</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="text-purple-600 font-bold text-lg">
                {Math.round(overtimeHours)}
              </div>
              <div className="text-purple-600 text-sm">ساعات إضافية</div>
            </div>
          </div>
        </div>
      ) : (
        <p
          className={`text-center py-8 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          لا توجد بيانات وقت كافية
        </p>
      )}
    </div>
  );
};

// تحليل الأداء
const PerformanceAnalysis = ({ statistics, currentMonthStats, darkMode }) => {
  const performanceScore = currentMonthStats?.attendanceRate || 0;
  const getPerformanceLevel = (score) => {
    if (score >= 95)
      return { level: "ممتاز", color: "text-green-600", icon: <FiAward /> };
    if (score >= 85)
      return { level: "جيد جداً", color: "text-blue-600", icon: <FiTarget /> };
    if (score >= 75)
      return { level: "جيد", color: "text-yellow-600", icon: <FiTrendingUp /> };
    return {
      level: "يحتاج تحسين",
      color: "text-red-600",
      icon: <FiTrendingDown />,
    };
  };

  const performance = getPerformanceLevel(performanceScore);

  return (
    <div
      className={`rounded-2xl p-6 ${
        darkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-200 shadow-lg"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-lg font-semibold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          🎯 تحليل الأداء
        </h3>
        <FiActivity
          className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        />
      </div>

      <div className="text-center mb-6">
        <div className={`text-3xl mb-2 ${performance.color}`}>
          {performance.icon}
        </div>
        <div
          className={`text-2xl font-bold mb-1 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {Math.round(performanceScore)}%
        </div>
        <div className={`text-sm font-medium ${performance.color}`}>
          {performance.level}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            أيام الحضور
          </span>
          <span
            className={`text-sm font-medium ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {currentMonthStats?.workDays || 0} /{" "}
            {currentMonthStats?.expectedDays || 0}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            ساعات العمل
          </span>
          <span
            className={`text-sm font-medium ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {Math.round(currentMonthStats?.workHours || 0)} /{" "}
            {Math.round(currentMonthStats?.expectedHours || 0)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            ساعات إضافية
          </span>
          <span className={`text-sm font-medium text-purple-600`}>
            +{statistics?.totalOvertimeHours || 0} ساعة
          </span>
        </div>
      </div>
    </div>
  );
};

// أنماط الحضور
const AttendancePatterns = ({ attendanceData, darkMode }) => {
  const calculatePatterns = () => {
    if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
      return { morningPerson: 0, lateDays: 0, earlyLeaves: 0, perfectDays: 0 };
    }

    const morningCheckins = attendanceData.filter((record) => {
      if (!record.checkIn) return false;
      const checkInTime = new Date(`2000-01-01 ${record.checkIn}`);
      return checkInTime.getHours() < 9;
    }).length;

    const lateDays = attendanceData.filter(
      (record) => record.status === "late"
    ).length;
    const earlyLeaves = attendanceData.filter(
      (record) => record.earlyLeave
    ).length;
    const perfectDays = attendanceData.filter(
      (record) =>
        record.status === "present" &&
        !record.earlyLeave &&
        record.totalWorkedHours >= 8
    ).length;

    return {
      morningPerson: Math.round(
        (morningCheckins / attendanceData.length) * 100
      ),
      lateDays,
      earlyLeaves,
      perfectDays,
    };
  };

  const patterns = calculatePatterns();

  return (
    <div
      className={`rounded-2xl p-6 ${
        darkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-200 shadow-lg"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-lg font-semibold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          🕐 أنماط الحضور
        </h3>
        <FiClock
          className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <div className="flex items-center space-x-3 space-x-reverse">
            <FiSun className="text-yellow-600" />
            <span
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              شخص صباحي
            </span>
          </div>
          <span className="text-sm font-medium text-yellow-600">
            {patterns.morningPerson}%
          </span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="flex items-center space-x-3 space-x-reverse">
            <FiCheckCircle className="text-green-600" />
            <span
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              أيام مثالية
            </span>
          </div>
          <span className="text-sm font-medium text-green-600">
            {patterns.perfectDays} يوم
          </span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
          <div className="flex items-center space-x-3 space-x-reverse">
            <FiAlertCircle className="text-red-600" />
            <span
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              أيام تأخير
            </span>
          </div>
          <span className="text-sm font-medium text-red-600">
            {patterns.lateDays} يوم
          </span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center space-x-3 space-x-reverse">
            <FiHome className="text-blue-600" />
            <span
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              خروج مبكر
            </span>
          </div>
          <span className="text-sm font-medium text-blue-600">
            {patterns.earlyLeaves} يوم
          </span>
        </div>
      </div>
    </div>
  );
};

// رؤى الإنتاجية
const ProductivityInsights = ({ statistics, monthlyData, darkMode }) => {
  const getProductivityTrend = () => {
    if (!monthlyData || monthlyData.length < 2) return "مستقر";

    const lastMonth = monthlyData[monthlyData.length - 1];
    const prevMonth = monthlyData[monthlyData.length - 2];

    const lastAvg = lastMonth.averageHoursPerDay;
    const prevAvg = prevMonth.averageHoursPerDay;

    if (lastAvg > prevAvg + 0.5) return "متزايد";
    if (lastAvg < prevAvg - 0.5) return "متناقص";
    return "مستقر";
  };

  const trend = getProductivityTrend();
  const averageHours =
    monthlyData.length > 0
      ? monthlyData.reduce((sum, month) => sum + month.averageHoursPerDay, 0) /
        monthlyData.length
      : 0;

  const getTrendIcon = () => {
    switch (trend) {
      case "متزايد":
        return <FiTrendingUp className="text-green-600" />;
      case "متناقص":
        return <FiTrendingDown className="text-red-600" />;
      default:
        return <FiActivity className="text-blue-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "متزايد":
        return "text-green-600";
      case "متناقص":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div
      className={`rounded-2xl p-6 ${
        darkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-200 shadow-lg"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-lg font-semibold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          💡 رؤى الإنتاجية
        </h3>
        <FiTarget
          className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        />
      </div>

      <div className="space-y-4">
        <div className="text-center p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <div className="text-2xl mb-2">{getTrendIcon()}</div>
          <div className={`text-lg font-bold mb-1 ${getTrendColor()}`}>
            {trend}
          </div>
          <div
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            اتجاه الإنتاجية
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            متوسط الساعات يومياً
          </span>
          <span
            className={`text-sm font-medium ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {Math.round(averageHours * 10) / 10} ساعة
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            إجمالي أيام العمل
          </span>
          <span
            className={`text-sm font-medium ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {statistics?.totalWorkDays || 0} يوم
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            معدل الكفاءة
          </span>
          <span className={`text-sm font-medium text-purple-600`}>
            {averageHours >= 8 ? "عالي" : averageHours >= 6 ? "متوسط" : "منخفض"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatisticsTab;
