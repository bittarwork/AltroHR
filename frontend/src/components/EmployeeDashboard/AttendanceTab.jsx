import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { attendanceService } from "../../services";
import { useToast, SimpleToastContainer } from "../ToastNotification";

import {
  FiClock,
  FiLogIn,
  FiLogOut,
  FiRefreshCw,
  FiCalendar,
  FiBarChart2,
  FiCheckCircle,
  FiXCircle,
  FiFilter,
  FiTrendingUp,
  FiActivity,
  FiTarget,
} from "react-icons/fi";

const AttendanceTab = ({
  user,
  darkMode,
  todayAttendance,
  quickStats,
  onDataChange,
}) => {
  const toast = useToast();
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // تحديث الوقت كل ثانية
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadAttendanceData();
  }, [filterMonth, filterYear]);

  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      const [historyResponse, statsResponse] = await Promise.all([
        attendanceService.getMyAttendance({
          month: filterMonth.toString(),
          year: filterYear.toString(),
          limit: 100,
        }),
        attendanceService.getMonthlyStats(filterYear, filterMonth),
      ]);

      if (historyResponse.success) {
        const historyData = historyResponse.data;
        if (Array.isArray(historyData)) {
          setAttendanceHistory(historyData);
        } else if (historyData && Array.isArray(historyData.records)) {
          setAttendanceHistory(historyData.records);
        } else {
          setAttendanceHistory([]);
        }
      } else {
        setAttendanceHistory([]);
      }

      if (statsResponse.success) {
        setMonthlyStats(statsResponse.data);
      } else {
        setMonthlyStats({
          totalDays: 0,
          totalHours: 0,
          totalOvertimeHours: 0,
          averageHoursPerDay: 0,
          daysPresent: 0,
          attendanceRate: 0,
        });
      }
    } catch (error) {
      console.error("خطأ في تحميل بيانات الحضور:", error);
      setAttendanceHistory([]);
      setMonthlyStats({
        totalDays: 0,
        totalHours: 0,
        totalOvertimeHours: 0,
        averageHoursPerDay: 0,
        daysPresent: 0,
        attendanceRate: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    setActionLoading(true);
    try {
      const response = await attendanceService.clockIn();
      if (response.success) {
        await loadAttendanceData();
        onDataChange?.();
        toast.success(response.message || "تم تسجيل الحضور بنجاح");
      } else {
        toast.error(response.error || "فشل في تسجيل الحضور");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الحضور");
    } finally {
      setActionLoading(false);
    }
  };

  const handleClockOut = async () => {
    setActionLoading(true);
    try {
      const response = await attendanceService.clockOut();
      if (response.success) {
        await loadAttendanceData();
        onDataChange?.();
        toast.success(response.message || "تم تسجيل الانصراف بنجاح");
      } else {
        toast.error(response.error || "فشل في تسجيل الانصراف");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الانصراف");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredHistory = Array.isArray(attendanceHistory)
    ? attendanceHistory.filter((record) => {
        const recordDate = new Date(record.date);
        return (
          recordDate.getFullYear() === filterYear &&
          recordDate.getMonth() + 1 === filterMonth
        );
      })
    : [];

  return (
    <div className="space-y-8">
      <SimpleToastContainer />

      {/* Hero Section - حالة الحضور اليوم */}
      <div
        className={`relative overflow-hidden rounded-3xl ${
          darkMode
            ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800"
            : "bg-gradient-to-br from-blue-50 via-white to-indigo-50"
        } p-8 border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full -ml-16 -mb-16"></div>

        <div className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* معلومات الوقت والحالة */}
            <div className="space-y-6-">
              <div>
                <h2
                  className={`text-3xl font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  مرحباً {user?.user?.name?.split(" ")[0]} 👋
                </h2>
                <p
                  className={`text-lg ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {currentTime.toLocaleDateString("ar-SA", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* الوقت الحالي */}
              <div
                className={`inline-flex items-center space-x- space-x-reverse px-6 py-4 rounded-2xl ${
                  darkMode ? "bg-gray-700/50" : "bg-white/80"
                } backdrop-blur-sm border ${
                  darkMode ? "border-gray-600" : "border-gray-200"
                }`}
              >
                <FiClock
                  className={`text-2xl ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <div>
                  <div
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {currentTime.toLocaleTimeString("ar-SA", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </div>
                  <div
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    الوقت الحالي
                  </div>
                </div>
              </div>

              {/* حالة الحضور */}
              <AttendanceStatus
                todayAttendance={todayAttendance}
                darkMode={darkMode}
              />
            </div>

            {/* أزرار الحضور والانصراف */}
            <div className="flex flex-col space-y-4">
              <ClockButton
                type="in"
                onClick={handleClockIn}
                disabled={!todayAttendance?.canClockIn || actionLoading}
                loading={actionLoading}
                darkMode={darkMode}
                todayAttendance={todayAttendance}
              />
              <ClockButton
                type="out"
                onClick={handleClockOut}
                disabled={!todayAttendance?.canClockOut || actionLoading}
                loading={actionLoading}
                darkMode={darkMode}
                todayAttendance={todayAttendance}
              />
            </div>
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="أيام العمل"
          value={quickStats?.currentMonthWorkDays || 0}
          subtitle="هذا الشهر"
          icon={FiCalendar}
          color="blue"
          darkMode={darkMode}
        />
        <StatCard
          title="ساعات العمل"
          value={`${Math.round(quickStats?.currentMonthWorkHours || 0)}h`}
          subtitle="هذا الشهر"
          icon={FiClock}
          color="green"
          darkMode={darkMode}
        />
        <StatCard
          title="معدل الحضور"
          value={`${Math.round(
            ((quickStats?.currentMonthWorkDays || 0) / 22) * 100
          )}%`}
          subtitle="من أيام العمل"
          icon={FiTrendingUp}
          color="purple"
          darkMode={darkMode}
        />
        <StatCard
          title="الحالة اليوم"
          value={
            todayAttendance?.clockedIn
              ? todayAttendance?.clockedOut
                ? "مكتمل"
                : "حاضر"
              : "غائب"
          }
          subtitle={
            todayAttendance?.clockInTime
              ? `الحضور: ${new Date(
                  todayAttendance.clockInTime
                ).toLocaleTimeString("ar-SA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "لم يسجل بعد"
          }
          icon={FiActivity}
          color="orange"
          darkMode={darkMode}
        />
      </div>

      {/* فلتر وجدول السجلات */}
      <div
        className={`rounded-2xl border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } overflow-hidden`}
      >
        {/* الهيدر مع الفلتر */}
        <div
          className={`px-6 py-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                سجل الحضور
              </h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                تابع سجل حضورك وانصرافك
              </p>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              {/* فلتر الشهر */}
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(parseInt(e.target.value))}
                className={`px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2024, i, 1).toLocaleDateString("ar-SA", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>

              {/* فلتر السنة */}
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(parseInt(e.target.value))}
                className={`px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <option key={2024 - i} value={2024 - i}>
                    {2024 - i}
                  </option>
                ))}
              </select>

              {/* زر التحديث */}
              <button
                onClick={loadAttendanceData}
                disabled={loading}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* الجدول */}
        <AttendanceTable
          history={filteredHistory}
          loading={loading}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

// مكون حالة الحضور
const AttendanceStatus = ({ todayAttendance, darkMode }) => {
  const getStatusInfo = () => {
    if (!todayAttendance?.clockedIn) {
      return {
        text: "لم يتم تسجيل الحضور بعد",
        color: "gray",
        icon: "⏰",
      };
    }

    if (todayAttendance.clockedOut) {
      return {
        text: "تم إنهاء يوم العمل",
        color: "blue",
        icon: "✅",
      };
    }

    return {
      text: "أنت حاضر حالياً",
      color: "green",
      icon: "🟢",
    };
  };

  const status = getStatusInfo();

  return (
    <div
      className={`inline-flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-xl ${
        status.color === "green"
          ? darkMode
            ? "bg-green-900/30 text-green-300 border border-green-700/50"
            : "bg-green-50 text-green-700 border border-green-200"
          : status.color === "blue"
          ? darkMode
            ? "bg-blue-900/30 text-blue-300 border border-blue-700/50"
            : "bg-blue-50 text-blue-700 border border-blue-200"
          : darkMode
          ? "bg-gray-700/50 text-gray-300 border border-gray-600"
          : "bg-gray-100 text-gray-600 border border-gray-300"
      }`}
    >
      <span className="text-lg">{status.icon}</span>
      <span className="font-medium">{status.text}</span>
    </div>
  );
};

// مكون أزرار الحضور والانصراف
const ClockButton = ({
  type,
  onClick,
  disabled,
  loading,
  darkMode,
  todayAttendance,
}) => {
  const isClockIn = type === "in";
  const Icon = isClockIn ? FiLogIn : FiLogOut;

  const getButtonState = () => {
    if (isClockIn) {
      if (todayAttendance?.clockedIn) {
        return { text: "تم تسجيل الحضور", disabled: true, variant: "success" };
      }
      return {
        text: "تسجيل الحضور",
        disabled: !todayAttendance?.canClockIn,
        variant: "primary",
      };
    } else {
      if (todayAttendance?.clockedOut) {
        return {
          text: "تم تسجيل الانصراف",
          disabled: true,
          variant: "success",
        };
      }
      return {
        text: "تسجيل الانصراف",
        disabled: !todayAttendance?.canClockOut,
        variant: "secondary",
      };
    }
  };

  const buttonState = getButtonState();

  return (
    <button
      onClick={onClick}
      disabled={buttonState.disabled || loading}
      className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 ${
        buttonState.variant === "success"
          ? darkMode
            ? "bg-green-700 text-green-100 border border-green-600"
            : "bg-green-500 text-white border border-green-400"
          : buttonState.variant === "primary"
          ? darkMode
            ? "bg-blue-600 hover:bg-blue-700 text-white border border-blue-500"
            : "bg-blue-500 hover:bg-blue-600 text-white border border-blue-400"
          : darkMode
          ? "bg-orange-600 hover:bg-orange-700 text-white border border-orange-500"
          : "bg-orange-500 hover:bg-orange-600 text-white border border-orange-400"
      } ${
        buttonState.disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-lg active:shadow-md"
      }`}
    >
      <div className="flex items-center justify-center space-x-3 space-x-reverse">
        {loading ? (
          <FiRefreshCw className="animate-spin text-xl" />
        ) : (
          <Icon className="text-xl" />
        )}
        <span>{loading ? "جاري التسجيل..." : buttonState.text}</span>
      </div>
    </button>
  );
};

// مكون بطاقة الإحصائية
const StatCard = ({ title, value, subtitle, icon: Icon, color, darkMode }) => {
  const colorClasses = {
    blue: darkMode ? "text-blue-400" : "text-blue-600",
    green: darkMode ? "text-green-400" : "text-green-600",
    purple: darkMode ? "text-purple-400" : "text-purple-600",
    orange: darkMode ? "text-orange-400" : "text-orange-600",
  };

  const bgClasses = {
    blue: darkMode ? "bg-blue-900/20" : "bg-blue-50",
    green: darkMode ? "bg-green-900/20" : "bg-green-50",
    purple: darkMode ? "bg-purple-900/20" : "bg-purple-50",
    orange: darkMode ? "bg-orange-900/20" : "bg-orange-50",
  };

  return (
    <div
      className={`rounded-2xl p-6 border transition-all duration-200 hover:shadow-lg ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgClasses[color]}`}>
          <Icon className={`text-xl ${colorClasses[color]}`} />
        </div>
      </div>

      <div>
        <h3
          className={`text-2xl font-bold mb-1 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {value}
        </h3>
        <p
          className={`text-sm font-medium mb-1 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {title}
        </p>
        <p
          className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
};

// مكون الجدول
const AttendanceTable = ({ history, loading, darkMode }) => {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <FiRefreshCw
          className={`animate-spin text-2xl mx-auto mb-4 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        />
        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
          جاري تحميل البيانات...
        </p>
      </div>
    );
  }

  if (!Array.isArray(history) || history.length === 0) {
    return (
      <div className="p-8 text-center">
        <FiCalendar
          className={`text-4xl mx-auto mb-4 ${
            darkMode ? "text-gray-400" : "text-gray-400"
          }`}
        />
        <h3
          className={`text-lg font-semibold mb-2 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          لا توجد سجلات
        </h3>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          لم يتم العثور على أي سجلات حضور للفترة المحددة
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className={`${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
          <tr>
            <th
              className={`px-6 py-4 text-right text-sm font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              التاريخ
            </th>
            <th
              className={`px-6 py-4 text-right text-sm font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              وقت الحضور
            </th>
            <th
              className={`px-6 py-4 text-right text-sm font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              وقت الانصراف
            </th>
            <th
              className={`px-6 py-4 text-right text-sm font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              ساعات العمل
            </th>
            <th
              className={`px-6 py-4 text-right text-sm font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              الحالة
            </th>
          </tr>
        </thead>
        <tbody>
          {history.map((record, index) => (
            <tr
              key={record._id || index}
              className={`border-t transition-colors hover:bg-opacity-50 ${
                darkMode
                  ? "border-gray-700 hover:bg-gray-700"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <td
                className={`px-6 py-4 ${
                  darkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                {new Date(record.date).toLocaleDateString("ar-SA", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </td>
              <td
                className={`px-6 py-4 ${
                  darkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                {record.clockInTime
                  ? new Date(record.clockInTime).toLocaleTimeString("ar-SA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </td>
              <td
                className={`px-6 py-4 ${
                  darkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                {record.clockOutTime
                  ? new Date(record.clockOutTime).toLocaleTimeString("ar-SA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </td>
              <td
                className={`px-6 py-4 ${
                  darkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                {record.totalWorkedHours
                  ? `${record.totalWorkedHours.toFixed(2)}h`
                  : "-"}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    record.status === "present"
                      ? "bg-green-100 text-green-800"
                      : record.status === "late"
                      ? "bg-yellow-100 text-yellow-800"
                      : record.status === "absent"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {record.status === "present"
                    ? "حاضر"
                    : record.status === "late"
                    ? "متأخر"
                    : record.status === "absent"
                    ? "غائب"
                    : "غير محدد"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTab;
