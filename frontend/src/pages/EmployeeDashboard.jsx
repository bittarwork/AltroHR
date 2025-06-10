import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Services
import { attendanceService, leaveService, userService } from "../services";

// Components
import AttendanceTab from "../components/EmployeeDashboard/AttendanceTab";
import LeaveRequestsTab from "../components/EmployeeDashboard/LeaveRequestsTab";
import ProfileTab from "../components/EmployeeDashboard/ProfileTab";
import StatisticsTab from "../components/EmployeeDashboard/StatisticsTab";

// Icons
import {
  FiClock,
  FiCalendar,
  FiUser,
  FiBarChart2,
  FiLogIn,
  FiLogOut,
  FiRefreshCw,
  FiHome,
  FiTrendingUp,
  FiUsers,
  FiActivity,
  FiSun,
  FiMoon,
  FiBell,
  FiSettings,
} from "react-icons/fi";

const EmployeeDashboard = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("attendance");
  const [loading, setLoading] = useState(false);
  const [quickStats, setQuickStats] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // تحديث الوقت الحالي كل ثانية
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // تحميل البيانات الأساسية عند بدء التطبيق
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [statsResponse, todayResponse] = await Promise.all([
        userService.getEmployeeQuickStats(),
        attendanceService.getTodayAttendanceStatus(),
      ]);

      if (statsResponse.success) {
        setQuickStats(statsResponse.data);
      } else {
        setQuickStats({
          totalWorkDays: 0,
          totalWorkHours: 0,
          currentMonthWorkDays: 0,
          currentMonthWorkHours: 0,
          totalLeaveRequests: 0,
          pendingLeaveRequests: 0,
          approvedLeaveRequests: 0,
        });
      }

      if (todayResponse.success) {
        setTodayAttendance(todayResponse.data);
      } else {
        setTodayAttendance({
          clockedIn: false,
          clockedOut: false,
          canClockIn: true,
          canClockOut: false,
        });
      }
    } catch (error) {
      console.error("خطأ في تحميل البيانات:", error);
      setQuickStats({
        totalWorkDays: 0,
        totalWorkHours: 0,
        currentMonthWorkDays: 0,
        currentMonthWorkHours: 0,
        totalLeaveRequests: 0,
        pendingLeaveRequests: 0,
        approvedLeaveRequests: 0,
      });
      setTodayAttendance({
        clockedIn: false,
        clockedOut: false,
        canClockIn: true,
        canClockOut: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: "attendance",
      label: "الحضور",
      icon: FiClock,
      color: "blue",
      component: AttendanceTab,
    },
    {
      id: "statistics",
      label: "الإحصائيات",
      icon: FiBarChart2,
      color: "purple",
      component: StatisticsTab,
    },
    {
      id: "leaves",
      label: "الإجازات",
      icon: FiCalendar,
      color: "green",
      component: LeaveRequestsTab,
    },
    {
      id: "profile",
      label: "الملف الشخصي",
      icon: FiUser,
      color: "orange",
      component: ProfileTab,
    },
  ];

  const ActiveTabComponent = tabs.find(
    (tab) => tab.id === activeTab
  )?.component;

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <div className="text-center">
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              جاري التحميل...
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              يرجى الانتظار بينما نحضر بياناتك
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className={`${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } min-h-screen transition-colors duration-200`}
    >
      <Navbar />

      {/* الشريط العلوي الجديد - Header مدمج */}
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } sticky top-0 z-40 pt-24`}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* معلومات المستخدم */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  darkMode ? "bg-blue-600" : "bg-blue-500"
                } text-white font-bold text-lg`}
              >
                {user?.user?.name?.charAt(0) || "M"}
              </div>
              <div>
                <h1
                  className={`text-xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user?.user?.name}
                </h1>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {user?.user?.position} •{" "}
                  {user?.user?.department?.name || "قسم غير محدد"}
                </p>
              </div>
            </div>

            {/* الوقت الحالي والإحصائيات السريعة */}
            <div className="flex items-center space-x-10 space-x-reverse">
              {/* الوقت الحالي */}
              <div
                className={`hidden md:flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-xl ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <FiClock
                  className={`text-lg ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <div className="text-center">
                  <div
                    className={`text-lg font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {currentTime.toLocaleTimeString("ar-SA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {currentTime.toLocaleDateString("ar-SA", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                </div>
              </div>

              {/* إحصائيات سريعة */}
              {quickStats && (
                <div
                  className={`hidden lg:flex items-center space-x-4 mr-5 space-x-reverse px-4 py-2 rounded-xl ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`text-sm font-bold ${
                        darkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      {quickStats.currentMonthWorkDays}
                    </div>
                    <div
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      أيام هذا الشهر
                    </div>
                  </div>
                  <div
                    className={`w-px h-8 ml-4 ${
                      darkMode ? "bg-gray-600" : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="text-center">
                    <div
                      className={`text-sm font-bold ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {Math.round(quickStats.currentMonthWorkHours)}h
                    </div>
                    <div
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      ساعات هذا الشهر
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* شريط التنقل المحسن */}
          <div className="mt-6">
            <div
              className={`flex space-x-1 space-x-reverse p-1 rounded-2xl ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-xl font-medium transition-all duration-200 flex-1 justify-center ${
                      isActive
                        ? darkMode
                          ? "bg-gray-800 text-white shadow-lg"
                          : "bg-white text-gray-900 shadow-md"
                        : darkMode
                        ? "text-gray-300 hover:text-white hover:bg-gray-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    <Icon
                      className={`text-lg ${
                        isActive
                          ? tab.color === "blue"
                            ? "text-blue-500"
                            : tab.color === "purple"
                            ? "text-purple-500"
                            : tab.color === "green"
                            ? "text-green-500"
                            : "text-orange-500"
                          : ""
                      }`}
                    />
                    <span className="hidden sm:block">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <main className="container mx-auto px-4 py-8">
        {ActiveTabComponent && (
          <div className="max-w-7xl mx-auto">
            <ActiveTabComponent
              user={user}
              darkMode={darkMode}
              quickStats={quickStats}
              todayAttendance={todayAttendance}
              onDataChange={loadInitialData}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EmployeeDashboard;
