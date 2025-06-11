import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "../styles/admin-dashboard.css";

// Import HR-specific tabs
import EmployeeManagementTab from "../components/HRDashboard/EmployeeManagementTab";
import LeaveManagementTab from "../components/HRDashboard/LeaveManagementTab";
import AttendanceReportsTab from "../components/HRDashboard/AttendanceReportsTab";
import HRReportsTab from "../components/HRDashboard/HRReportsTab";
import DepartmentManagementTab from "../components/HRDashboard/DepartmentManagementTab";

// Icons
import {
  FiUsers,
  FiCalendar,
  FiBarChart2,
  FiFileText,
  FiDatabase,
  FiActivity,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiUserCheck,
  FiUserX,
  FiSettings,
} from "react-icons/fi";

// Define HR-specific tabs
const hrTabs = [
  {
    id: "employees",
    label: "إدارة الموظفين",
    icon: FiUsers,
    color: "blue",
    component: EmployeeManagementTab,
    description: "إدارة بيانات الموظفين وحساباتهم",
  },
  {
    id: "leave-management",
    label: "إدارة الإجازات",
    icon: FiCalendar,
    color: "green",
    component: LeaveManagementTab,
    description: "مراجعة والموافقة على طلبات الإجازة",
  },
  {
    id: "attendance-reports",
    label: "تقارير الحضور",
    icon: FiBarChart2,
    color: "purple",
    component: AttendanceReportsTab,
    description: "تقارير مفصلة عن حضور الموظفين",
  },
  {
    id: "departments",
    label: "إدارة الأقسام",
    icon: FiDatabase,
    color: "orange",
    component: DepartmentManagementTab,
    description: "إدارة أقسام الشركة والهيكل التنظيمي",
  },
  {
    id: "hr-reports",
    label: "التقارير الإدارية",
    icon: FiFileText,
    color: "red",
    component: HRReportsTab,
    description: "تقارير شاملة للموارد البشرية",
  },
];

const HRDashboard = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("employees");
  const [hrStats, setHrStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingLeaves: 0,
    todayAttendance: 0,
    thisMonthLeaves: 0,
    departmentsCount: 0,
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load HR statistics
  useEffect(() => {
    loadHRStats();
  }, []);

  const loadHRStats = async () => {
    try {
      setLoading(true);
      const token = user?.token;

      if (!token) {
        console.warn("لا يوجد توكن مصادقة");
        setLoading(false);
        return;
      }

      // Parallel API calls for better performance
      const [
        usersResponse,
        leavesResponse,
        attendanceResponse,
        departmentsResponse,
      ] = await Promise.all([
        // Total employees
        axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        // Pending leave requests
        axios.get(`${import.meta.env.VITE_API_URL}/api/leave`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        // Today's attendance summary
        axios.get(`${import.meta.env.VITE_API_URL}/api/attendance/by-date`, {
          params: { date: new Date().toISOString().split("T")[0] },
          headers: { Authorization: `Bearer ${token}` },
        }),
        // Departments count
        axios.get(`${import.meta.env.VITE_API_URL}/api/departments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const users = usersResponse.data || [];
      const leaves = leavesResponse.data?.requests || [];
      const attendance = attendanceResponse.data || [];
      const departments = departmentsResponse.data || [];

      // Calculate statistics
      const totalEmployees = users.length;
      const activeEmployees = users.filter((user) => user.isActive).length;
      const pendingLeaves = leaves.filter(
        (leave) => leave.status === "pending"
      ).length;
      const todayAttendance = attendance.length;

      // This month leaves
      const currentDate = new Date();
      const thisMonthLeaves = leaves.filter((leave) => {
        const leaveDate = new Date(leave.createdAt);
        return (
          leaveDate.getMonth() === currentDate.getMonth() &&
          leaveDate.getFullYear() === currentDate.getFullYear()
        );
      }).length;

      const departmentsCount = departments.length;

      setHrStats({
        totalEmployees,
        activeEmployees,
        pendingLeaves,
        todayAttendance,
        thisMonthLeaves,
        departmentsCount,
      });
    } catch (error) {
      console.error("خطأ في تحميل إحصائيات الموارد البشرية:", error);
      // Set default values on error
      setHrStats({
        totalEmployees: 0,
        activeEmployees: 0,
        pendingLeaves: 0,
        todayAttendance: 0,
        thisMonthLeaves: 0,
        departmentsCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const activeTabData = hrTabs.find((tab) => tab.id === activeTab);
  const ActiveTabComponent = activeTabData?.component;

  const getColorClasses = (color, isActive = false) => {
    const colors = {
      blue: isActive
        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
        : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20",
      green: isActive
        ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
        : "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20",
      purple: isActive
        ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
        : "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20",
      red: isActive
        ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
        : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
      orange: isActive
        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
        : "text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20",
    };
    return colors[color] || colors.blue;
  };

  const getGradientClasses = (color) => {
    const gradients = {
      blue: "from-blue-500 via-blue-600 to-indigo-600",
      green: "from-green-500 via-emerald-600 to-teal-600",
      purple: "from-purple-500 via-violet-600 to-indigo-600",
      red: "from-red-500 via-rose-600 to-pink-600",
      orange: "from-orange-500 via-amber-600 to-yellow-600",
    };
    return gradients[color] || gradients.blue;
  };

  return (
    <div
      dir="rtl"
      className={`${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } min-h-screen transition-colors duration-200`}
    >
      <Navbar />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${
          darkMode
            ? "bg-gradient-to-r from-gray-800 via-gray-850 to-gray-800 border-gray-700"
            : "bg-gradient-to-r from-white via-gray-50 to-white border-gray-200"
        } border-b pt-24 pb-6`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* HR Manager Info */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  darkMode
                    ? "bg-gradient-to-br from-green-600 to-emerald-800"
                    : "bg-gradient-to-br from-green-500 to-emerald-600"
                } shadow-lg`}
              >
                <FiUsers className="text-white text-2xl" />
              </div>
              <div>
                <h1
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  مرحباً، {user?.user?.name || "مدير الموارد البشرية"}
                </h1>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  مدير الموارد البشرية - لوحة التحكم
                </p>
              </div>
            </div>

            {/* HR Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white text-center shadow-lg"
              >
                <FiUsers className="text-xl mx-auto mb-1" />
                <div className="text-lg font-bold">
                  {loading ? (
                    <div className="w-6 h-5 bg-white/20 rounded animate-pulse mx-auto"></div>
                  ) : (
                    hrStats.totalEmployees
                  )}
                </div>
                <div className="text-xs opacity-90">إجمالي الموظفين</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white text-center shadow-lg"
              >
                <FiUserCheck className="text-xl mx-auto mb-1" />
                <div className="text-lg font-bold">
                  {loading ? (
                    <div className="w-6 h-5 bg-white/20 rounded animate-pulse mx-auto"></div>
                  ) : (
                    hrStats.activeEmployees
                  )}
                </div>
                <div className="text-xs opacity-90">موظف نشط</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 text-white text-center shadow-lg"
              >
                <FiAlertCircle className="text-xl mx-auto mb-1" />
                <div className="text-lg font-bold">
                  {loading ? (
                    <div className="w-6 h-5 bg-white/20 rounded animate-pulse mx-auto"></div>
                  ) : (
                    hrStats.pendingLeaves
                  )}
                </div>
                <div className="text-xs opacity-90">طلبات معلقة</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white text-center shadow-lg"
              >
                <FiActivity className="text-xl mx-auto mb-1" />
                <div className="text-lg font-bold">
                  {loading ? (
                    <div className="w-6 h-5 bg-white/20 rounded animate-pulse mx-auto"></div>
                  ) : (
                    hrStats.todayAttendance
                  )}
                </div>
                <div className="text-xs opacity-90">حضور اليوم</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="p-3 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-center shadow-lg"
              >
                <FiCalendar className="text-xl mx-auto mb-1" />
                <div className="text-lg font-bold">
                  {loading ? (
                    <div className="w-6 h-5 bg-white/20 rounded animate-pulse mx-auto"></div>
                  ) : (
                    hrStats.thisMonthLeaves
                  )}
                </div>
                <div className="text-xs opacity-90">إجازات الشهر</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-center shadow-lg"
              >
                <FiDatabase className="text-xl mx-auto mb-1" />
                <div className="text-lg font-bold">
                  {loading ? (
                    <div className="w-6 h-5 bg-white/20 rounded animate-pulse mx-auto"></div>
                  ) : (
                    hrStats.departmentsCount
                  )}
                </div>
                <div className="text-xs opacity-90">الأقسام</div>
              </motion.div>
            </div>

            {/* Current Time */}
            <div
              className={`text-center ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <div className="text-sm font-medium">
                {currentTime.toLocaleDateString("ar-EG", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="text-xl font-bold">
                {currentTime.toLocaleTimeString("ar-EG", {
                  hour12: true,
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${
            darkMode
              ? "bg-gradient-to-r from-gray-800 to-gray-850 border border-gray-700"
              : "bg-gradient-to-r from-white to-gray-50 border border-gray-200"
          } rounded-2xl shadow-2xl p-3 mb-6 backdrop-blur-lg`}
        >
          {/* Title */}
          <div className="mb-4">
            <h3
              className={`text-lg font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              } text-center mb-2`}
            >
              أقسام إدارة الموارد البشرية
            </h3>
            <div
              className={`w-24 h-1 mx-auto rounded-full ${
                darkMode
                  ? "bg-gradient-to-r from-green-400 to-emerald-500"
                  : "bg-gradient-to-r from-green-500 to-emerald-600"
              }`}
            ></div>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {hrTabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (activeTab !== tab.id) {
                      setTabLoading(true);
                      setTimeout(() => {
                        setActiveTab(tab.id);
                        setTabLoading(false);
                      }, 300);
                    }
                  }}
                  className={`group relative p-5 rounded-xl transition-all duration-300 text-center overflow-hidden tab-shimmer ripple-effect ${
                    isActive
                      ? `bg-gradient-to-br ${getGradientClasses(
                          tab.color
                        )} text-white shadow-2xl transform scale-105 active-tab-pulse`
                      : `${
                          darkMode
                            ? "bg-gray-700/50 hover:bg-gray-600/70 text-gray-300 hover:text-white"
                            : "bg-white/80 hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                        } modern-shadow hover:modern-shadow-lg`
                  }`}
                >
                  {/* Background Effect */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                      !isActive
                        ? `bg-gradient-to-br ${getGradientClasses(tab.color)}`
                        : ""
                    }`}
                  ></div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 transition-all duration-300 ${
                        isActive
                          ? "bg-white/20 text-white scale-110"
                          : `bg-${tab.color}-100 dark:bg-${tab.color}-900/20 text-${tab.color}-600 dark:text-${tab.color}-400 group-hover:scale-110`
                      }`}
                    >
                      <Icon className="text-xl" />
                    </div>

                    {/* Label */}
                    <div className="text-sm font-bold mb-1 transition-all duration-300">
                      {tab.label}
                    </div>

                    {/* Description */}
                    <div
                      className={`text-xs transition-all duration-300 ${
                        isActive
                          ? "text-white/90"
                          : darkMode
                          ? "text-gray-400 group-hover:text-gray-300"
                          : "text-gray-500 group-hover:text-gray-600"
                      }`}
                    >
                      {tab.description}
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeHRTab"
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </div>

                  {/* Light Effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Active Tab Content */}
        <AnimatePresence mode="wait">
          {tabLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-lg overflow-hidden`}
            >
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 mx-auto rounded-full border-4 ${
                        darkMode ? "border-gray-600" : "border-gray-200"
                      } border-t-transparent animate-spin`}
                    ></div>
                    <div
                      className={`absolute inset-0 w-16 h-16 mx-auto rounded-full border-4 border-transparent ${
                        darkMode ? "border-t-green-400" : "border-t-green-500"
                      } animate-spin`}
                      style={{
                        animationDirection: "reverse",
                        animationDuration: "0.8s",
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-center space-x-1 space-x-reverse mb-4">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          darkMode ? "bg-green-400" : "bg-green-500"
                        }`}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>

                  <p
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    جاري التحميل...
                  </p>

                  <div
                    className={`w-64 h-1 ${
                      darkMode ? "bg-gray-700" : "bg-gray-200"
                    } rounded-full mt-4 overflow-hidden mx-auto`}
                  >
                    <motion.div
                      className={`h-full rounded-full ${
                        darkMode
                          ? "bg-gradient-to-r from-green-400 to-emerald-500"
                          : "bg-gradient-to-r from-green-500 to-emerald-600"
                      }`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm modern-shadow-lg slide-up-enter`}
            >
              {/* Tab Header */}
              <div
                className={`px-6 py-5 border-b ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                } bg-gradient-to-r ${
                  darkMode
                    ? "from-gray-800 to-gray-750"
                    : "from-gray-50 to-white"
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-4 space-x-reverse"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className={`p-3 rounded-xl bg-gradient-to-br ${getGradientClasses(
                      activeTabData?.color
                    )} shadow-lg`}
                  >
                    {activeTabData && (
                      <activeTabData.icon className="text-xl text-white" />
                    )}
                  </motion.div>
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {activeTabData?.label}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {activeTabData?.description}
                    </motion.p>
                  </div>
                </motion.div>
              </div>

              {/* Tab Content */}
              <motion.div
                className="p-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {ActiveTabComponent && (
                  <ActiveTabComponent
                    onStatsUpdate={loadHRStats}
                    hrStats={hrStats}
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
};

export default HRDashboard;
