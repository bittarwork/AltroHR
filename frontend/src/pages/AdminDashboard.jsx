import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// Import Admin-specific tabs
import UsersTab from "../components/DashboardTabs/UsersTab";
import DepartmentTab from "../components/DashboardTabs/DepartmentTab";
import SystemSettingsTab from "../components/DashboardTabs/SystemSettingsTab";
import ReportsTab from "../components/DashboardTabs/ReportsTab";

// Icons
import {
  FiUsers,
  FiSettings,
  FiFileText,
  FiDatabase,
  FiBell,
  FiTrendingUp,
  FiActivity,
  FiServer,
  FiLock,
  FiHome,
  FiCpu,
  FiHardDrive,
  FiWifi,
} from "react-icons/fi";

// Define admin-specific tabs only
const adminTabs = [
  {
    id: "users",
    label: "إدارة المستخدمين",
    icon: FiUsers,
    color: "blue",
    component: UsersTab,
    description: "إدارة حسابات المستخدمين والصلاحيات",
  },
  {
    id: "departments",
    label: "إدارة الأقسام",
    icon: FiDatabase,
    color: "green",
    component: DepartmentTab,
    description: "إدارة أقسام الشركة والهيكل التنظيمي",
  },
  {
    id: "systemSettings",
    label: "إعدادات النظام",
    icon: FiSettings,
    color: "gray",
    component: SystemSettingsTab,
    description: "إعدادات النظام العامة والتكوين",
  },
  {
    id: "reports",
    label: "التقارير الإدارية",
    icon: FiFileText,
    color: "orange",
    component: ReportsTab,
    description: "تقارير إدارية شاملة عن النظام",
  },
];

const AdminDashboard = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [systemInfo, setSystemInfo] = useState({
    totalUsers: 0,
    activeSessions: 0,
    systemUptime: "0 أيام",
    lastBackup: "غير متوفر",
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load system information
  useEffect(() => {
    loadSystemInfo();
  }, []);

  const loadSystemInfo = async () => {
    try {
      setLoading(true);
      const token = user?.token;

      if (!token) {
        console.warn("لا يوجد توكن مصادقة");
        setLoading(false);
        return;
      }

      // جلب إجمالي عدد المستخدمين
      const usersResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const totalUsers = usersResponse.data?.length || 0;

      // حساب الجلسات النشطة (المستخدمين النشطين)
      const activeUsers =
        usersResponse.data?.filter((user) => user.isActive) || [];
      const activeSessions = activeUsers.length;

      // وقت تشغيل النظام - نستخدم الوقت الحالي كمرجع
      const systemStartTime = new Date("2024-01-01"); // يمكن تحديثها لتاريخ إطلاق النظام
      const currentDate = new Date();
      const uptimeInDays = Math.floor(
        (currentDate - systemStartTime) / (1000 * 60 * 60 * 24)
      );
      const systemUptime =
        uptimeInDays > 0 ? `${uptimeInDays} أيام` : "أقل من يوم";

      // آخر نسخة احتياطية - قريباً سنضيف نظام النسخ الاحتياطية
      const lastBackup = "سيتم تطبيقها قريباً";

      setSystemInfo({
        totalUsers,
        activeSessions,
        systemUptime,
        lastBackup,
      });
    } catch (error) {
      console.error("خطأ في تحميل معلومات النظام:", error);
      // في حالة الفشل، نضع قيم افتراضية معقولة
      setSystemInfo({
        totalUsers: 0,
        activeSessions: 0,
        systemUptime: "غير متوفر",
        lastBackup: "غير متوفر",
      });
    } finally {
      setLoading(false);
    }
  };

  const activeTabData = adminTabs.find((tab) => tab.id === activeTab);
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
      gray: isActive
        ? "bg-gray-500 text-white shadow-lg shadow-gray-500/30"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/20",
      orange: isActive
        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
        : "text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20",
    };
    return colors[color] || colors.blue;
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
        className={`${darkMode ? "bg-gray-800" : "bg-white"} border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } pt-24 pb-6`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Admin Info */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  darkMode
                    ? "bg-gradient-to-br from-blue-600 to-blue-800"
                    : "bg-gradient-to-br from-blue-500 to-blue-600"
                } shadow-lg`}
              >
                <FiSettings className="text-white text-2xl" />
              </div>
              <div>
                <h1
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  مرحباً، {user?.user?.name || "المدير"}
                </h1>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  مدير النظام - لوحة التحكم الرئيسية
                </p>
              </div>
            </div>

            {/* System Status Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`p-3 rounded-xl ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                } text-center`}
              >
                <FiUsers
                  className={`text-xl mx-auto mb-1 ${
                    darkMode ? "text-blue-400" : "text-blue-500"
                  }`}
                />
                <div
                  className={`text-lg font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {loading ? "..." : systemInfo.totalUsers}
                </div>
                <div
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  إجمالي المستخدمين
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`p-3 rounded-xl ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                } text-center`}
              >
                <FiActivity
                  className={`text-xl mx-auto mb-1 ${
                    darkMode ? "text-green-400" : "text-green-500"
                  }`}
                />
                <div
                  className={`text-lg font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {loading ? "..." : systemInfo.activeSessions}
                </div>
                <div
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  جلسات نشطة
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`p-3 rounded-xl ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                } text-center`}
              >
                <FiServer
                  className={`text-xl mx-auto mb-1 ${
                    darkMode ? "text-purple-400" : "text-purple-500"
                  }`}
                />
                <div
                  className={`text-lg font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {loading ? "..." : systemInfo.systemUptime}
                </div>
                <div
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  وقت التشغيل
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`p-3 rounded-xl ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                } text-center`}
              >
                <FiHardDrive
                  className={`text-xl mx-auto mb-1 ${
                    darkMode ? "text-orange-400" : "text-orange-500"
                  }`}
                />
                <div
                  className={`text-lg font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {loading ? "..." : systemInfo.lastBackup}
                </div>
                <div
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  آخر نسخة احتياطية
                </div>
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
              <div className="text-2xl font-bold">
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
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-lg p-2 mb-6`}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-4 rounded-xl transition-all duration-200 text-center ${getColorClasses(
                    tab.color,
                    isActive
                  )} ${
                    !isActive &&
                    (darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50")
                  }`}
                >
                  <Icon className="text-2xl mx-auto mb-2" />
                  <div className="text-sm font-medium mb-1">{tab.label}</div>
                  <div
                    className={`text-xs ${
                      isActive
                        ? "text-white/80"
                        : darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {tab.description}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Active Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-lg overflow-hidden`}
          >
            {/* Tab Header */}
            <div
              className={`px-6 py-4 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <div
                  className={`p-2 rounded-lg ${getColorClasses(
                    activeTabData?.color,
                    true
                  )}`}
                >
                  {activeTabData && <activeTabData.icon className="text-lg" />}
                </div>
                <div>
                  <h2
                    className={`text-xl font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {activeTabData?.label}
                  </h2>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {activeTabData?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-0">
              {ActiveTabComponent && <ActiveTabComponent />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
