import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import {
  FiCpu,
  FiHardDrive,
  FiActivity,
  FiUsers,
  FiDatabase,
  FiWifi,
  FiTrendingUp,
  FiTrendingDown,
  FiRefreshCw,
  FiServer,
  FiMonitor,
  FiClock,
} from "react-icons/fi";

// Components
import UserStatistics from "../Statistics/UserStatistics";
import DepartmentStatistics from "../Statistics/DepartmentStatistics";

const SystemStatsTab = () => {
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [systemStats, setSystemStats] = useState({
    cpu: {
      usage: 45,
      cores: 8,
      temperature: 65,
    },
    memory: {
      used: 12.5,
      total: 32,
      percentage: 39,
    },
    disk: {
      used: 250,
      total: 500,
      percentage: 50,
    },
    network: {
      upload: 15.2,
      download: 45.8,
      latency: 12,
    },
    database: {
      connections: 15,
      maxConnections: 100,
      queryTime: 0.8,
    },
    users: {
      online: 23,
      total: 150,
      newToday: 5,
    },
    system: {
      uptime: "15 أيام، 6 ساعات",
      lastBackup: "منذ ساعتين",
      version: "2.1.0",
    },
  });

  const refreshStats = async () => {
    setLoading(true);
    try {
      // Here you would fetch real system statistics
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate random data changes
      setSystemStats((prev) => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          usage: Math.random() * 100,
          temperature: 60 + Math.random() * 20,
        },
        memory: {
          ...prev.memory,
          percentage: Math.random() * 100,
        },
        network: {
          ...prev.network,
          upload: Math.random() * 50,
          download: Math.random() * 100,
          latency: 5 + Math.random() * 20,
        },
      }));

      setLastUpdate(new Date());
    } catch (error) {
      console.error("خطأ في تحديث الإحصائيات:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({
    title,
    icon: Icon,
    value,
    subtitle,
    color,
    trend,
    percentage,
  }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-xl shadow-lg p-6 border-l-4 border-${color}-500`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 space-x-reverse mb-2">
            <Icon className={`text-${color}-500 text-xl`} />
            <h3
              className={`font-medium ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {title}
            </h3>
          </div>
          <div
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {value}
          </div>
          {subtitle && (
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {subtitle}
            </div>
          )}
        </div>
        {percentage !== undefined && (
          <div className="text-left">
            {trend && (
              <div
                className={`flex items-center space-x-1 space-x-reverse mb-1 ${
                  trend > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                <span className="text-sm">{Math.abs(trend)}%</span>
              </div>
            )}
            <div
              className={`text-lg font-semibold ${
                percentage > 80
                  ? "text-red-500"
                  : percentage > 60
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {percentage}%
            </div>
          </div>
        )}
      </div>

      {percentage !== undefined && (
        <div className="mt-4">
          <div
            className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-2 rounded-full ${
                percentage > 80
                  ? "bg-red-500"
                  : percentage > 60
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            />
          </div>
        </div>
      )}
    </motion.div>
  );

  const MetricCard = ({ title, value, unit, icon: Icon, color }) => (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg p-4 shadow`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {title}
          </div>
          <div
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {value} <span className="text-sm font-normal">{unit}</span>
          </div>
        </div>
        <Icon className={`text-${color}-500 text-2xl`} />
      </div>
    </div>
  );

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
              إحصائيات النظام
            </h2>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              آخر تحديث: {lastUpdate.toLocaleTimeString("ar-EG")}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshStats}
            disabled={loading}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg font-medium transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            <span>تحديث</span>
          </motion.button>
        </div>

        {/* Main System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="استخدام المعالج"
            icon={FiCpu}
            value={`${systemStats.cpu.usage.toFixed(1)}%`}
            subtitle={`${
              systemStats.cpu.cores
            } أنوية - ${systemStats.cpu.temperature.toFixed(1)}°م`}
            color="blue"
            percentage={systemStats.cpu.usage}
            trend={2.5}
          />

          <StatCard
            title="استخدام الذاكرة"
            icon={FiActivity}
            value={`${systemStats.memory.used} جيجا`}
            subtitle={`من أصل ${systemStats.memory.total} جيجا`}
            color="green"
            percentage={systemStats.memory.percentage}
            trend={-1.2}
          />

          <StatCard
            title="مساحة القرص"
            icon={FiHardDrive}
            value={`${systemStats.disk.used} جيجا`}
            subtitle={`من أصل ${systemStats.disk.total} جيجا`}
            color="purple"
            percentage={systemStats.disk.percentage}
            trend={0.8}
          />
        </div>

        {/* Network and Database Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg p-6`}
          >
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <FiWifi className="text-orange-500 text-xl" />
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                إحصائيات الشبكة
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="الرفع"
                value={systemStats.network.upload.toFixed(1)}
                unit="ميجا/ث"
                icon={FiTrendingUp}
                color="green"
              />
              <MetricCard
                title="التحميل"
                value={systemStats.network.download.toFixed(1)}
                unit="ميجا/ث"
                icon={FiTrendingDown}
                color="blue"
              />
              <MetricCard
                title="زمن الاستجابة"
                value={systemStats.network.latency.toFixed(0)}
                unit="مللي ثانية"
                icon={FiClock}
                color="yellow"
              />
              <MetricCard
                title="حالة الاتصال"
                value="مستقر"
                unit=""
                icon={FiWifi}
                color="green"
              />
            </div>
          </div>

          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg p-6`}
          >
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <FiDatabase className="text-red-500 text-xl" />
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                إحصائيات قاعدة البيانات
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="الاتصالات النشطة"
                value={systemStats.database.connections}
                unit={`من ${systemStats.database.maxConnections}`}
                icon={FiUsers}
                color="blue"
              />
              <MetricCard
                title="متوسط وقت الاستعلام"
                value={systemStats.database.queryTime}
                unit="ثانية"
                icon={FiClock}
                color="green"
              />
              <MetricCard
                title="حجم قاعدة البيانات"
                value="2.5"
                unit="جيجا"
                icon={FiHardDrive}
                color="purple"
              />
              <MetricCard
                title="حالة قاعدة البيانات"
                value="صحيحة"
                unit=""
                icon={FiDatabase}
                color="green"
              />
            </div>
          </div>
        </div>

        {/* Users and System Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg p-6`}
          >
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <FiUsers className="text-indigo-500 text-xl" />
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                إحصائيات المستخدمين
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  متصل الآن
                </span>
                <span
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {systemStats.users.online}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  إجمالي المستخدمين
                </span>
                <span
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {systemStats.users.total}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  جديد اليوم
                </span>
                <span className="font-semibold text-green-500">
                  +{systemStats.users.newToday}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg p-6`}
          >
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <FiServer className="text-gray-500 text-xl" />
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                معلومات النظام
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  وقت التشغيل
                </span>
                <span
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {systemStats.system.uptime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  آخر نسخة احتياطية
                </span>
                <span
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {systemStats.system.lastBackup}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  إصدار النظام
                </span>
                <span
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {systemStats.system.version}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg p-6`}
          >
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <FiMonitor className="text-teal-500 text-xl" />
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                حالة الخدمات
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { name: "خادم الويب", status: "يعمل", color: "green" },
                { name: "قاعدة البيانات", status: "يعمل", color: "green" },
                { name: "خدمة البريد", status: "يعمل", color: "green" },
                { name: "النسخ الاحتياطي", status: "متوقف", color: "red" },
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {service.name}
                  </span>
                  <span className={`font-semibold text-${service.color}-500`}>
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Statistics Section */}
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg p-6`}
        >
          <div className="flex items-center space-x-2 space-x-reverse mb-6">
            <FiUsers className="text-2xl text-blue-500" />
            <h2
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              إحصائيات المستخدمين التفصيلية
            </h2>
          </div>
          <UserStatistics />
        </div>

        {/* Department Statistics Section */}
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg p-6`}
        >
          <div className="flex items-center space-x-2 space-x-reverse mb-6">
            <FiDatabase className="text-2xl text-green-500" />
            <h2
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              إحصائيات الأقسام التفصيلية
            </h2>
          </div>
          <DepartmentStatistics />
        </div>
      </div>
    </div>
  );
};

export default SystemStatsTab;
