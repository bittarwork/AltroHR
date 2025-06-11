import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiDatabase,
  FiActivity,
  FiTrendingUp,
  FiTrendingDown,
  FiServer,
  FiShield,
  FiClock,
  FiHardDrive,
  FiWifi,
  FiCpu,
  FiMonitor,
  FiBarChart2,
} from "react-icons/fi";

// Components
import UserStatistics from "../Statistics/UserStatistics";
import DepartmentStatistics from "../Statistics/DepartmentStatistics";

const SystemStatsTab = () => {
  const { darkMode } = useTheme();
  const [systemOverview, setSystemOverview] = useState({
    totalUsers: 150,
    activeUsers: 23,
    totalDepartments: 8,
    systemUptime: 99.8,
    storageUsed: 65,
    cpuUsage: 45,
    memoryUsage: 72,
    networkLoad: 30,
  });

  const overviewCards = [
    {
      title: "إجمالي المستخدمين",
      value: systemOverview.totalUsers,
      change: "+12%",
      changeType: "positive",
      icon: FiUsers,
      color: "blue",
      description: "العدد الكلي للمستخدمين المسجلين",
    },
    {
      title: "المستخدمون النشطون",
      value: systemOverview.activeUsers,
      change: "+5%",
      changeType: "positive",
      icon: FiActivity,
      color: "green",
      description: "المستخدمون الذين سجلوا دخول اليوم",
    },
    {
      title: "الأقسام الإدارية",
      value: systemOverview.totalDepartments,
      change: "ثابت",
      changeType: "neutral",
      icon: FiDatabase,
      color: "purple",
      description: "عدد الأقسام في النظام",
    },
    {
      title: "وقت التشغيل",
      value: `${systemOverview.systemUptime}%`,
      change: "+0.2%",
      changeType: "positive",
      icon: FiServer,
      color: "orange",
      description: "نسبة توفر النظام",
    },
  ];

  const performanceMetrics = [
    {
      title: "استخدام المعالج",
      value: systemOverview.cpuUsage,
      unit: "%",
      icon: FiCpu,
      color: "blue",
      status:
        systemOverview.cpuUsage < 70
          ? "good"
          : systemOverview.cpuUsage < 85
          ? "warning"
          : "critical",
    },
    {
      title: "استخدام الذاكرة",
      value: systemOverview.memoryUsage,
      unit: "%",
      icon: FiActivity,
      color: "green",
      status:
        systemOverview.memoryUsage < 80
          ? "good"
          : systemOverview.memoryUsage < 90
          ? "warning"
          : "critical",
    },
    {
      title: "مساحة التخزين",
      value: systemOverview.storageUsed,
      unit: "%",
      icon: FiHardDrive,
      color: "purple",
      status:
        systemOverview.storageUsed < 75
          ? "good"
          : systemOverview.storageUsed < 90
          ? "warning"
          : "critical",
    },
    {
      title: "حمولة الشبكة",
      value: systemOverview.networkLoad,
      unit: "%",
      icon: FiWifi,
      color: "orange",
      status:
        systemOverview.networkLoad < 60
          ? "good"
          : systemOverview.networkLoad < 80
          ? "warning"
          : "critical",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "good":
        return "green";
      case "warning":
        return "yellow";
      case "critical":
        return "red";
      default:
        return "gray";
    }
  };

  const OverviewCard = ({ card }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-xl shadow-lg p-6 border-l-4 border-${card.color}-500`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-lg bg-${card.color}-100 dark:bg-${card.color}-900/20`}
        >
          <card.icon
            className={`text-2xl text-${card.color}-600 dark:text-${card.color}-400`}
          />
        </div>
        <div className="text-left">
          <div
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {card.value}
          </div>
          <div
            className={`text-sm ${
              card.changeType === "positive"
                ? "text-green-500"
                : card.changeType === "negative"
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {card.change}
          </div>
        </div>
      </div>
      <h3
        className={`font-semibold mb-2 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {card.title}
      </h3>
      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        {card.description}
      </p>
    </motion.div>
  );

  const PerformanceCard = ({ metric }) => (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow p-4`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 space-x-reverse">
          <metric.icon className={`text-${metric.color}-500`} />
          <span
            className={`text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {metric.title}
          </span>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(
            metric.status
          )}-100 dark:bg-${getStatusColor(
            metric.status
          )}-900/20 text-${getStatusColor(
            metric.status
          )}-600 dark:text-${getStatusColor(metric.status)}-400`}
        >
          {metric.status === "good"
            ? "طبيعي"
            : metric.status === "warning"
            ? "تحذير"
            : "حرج"}
        </div>
      </div>

      <div
        className={`text-2xl font-bold mb-2 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {metric.value}
        {metric.unit}
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${metric.value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-2 rounded-full bg-${getStatusColor(metric.status)}-500`}
        />
      </div>
    </div>
  );

  return (
    <div
      className={`p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1
            className={`text-3xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            📊 إحصائيات النظام الشاملة
          </h1>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            نظرة شاملة على أداء النظام والمستخدمين والأقسام
          </p>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewCards.map((card, index) => (
            <OverviewCard key={index} card={card} />
          ))}
        </div>

        {/* Performance Metrics */}
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg p-6`}
        >
          <div className="flex items-center space-x-2 space-x-reverse mb-6">
            <FiMonitor className="text-2xl text-blue-500" />
            <h2
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              مؤشرات الأداء
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => (
              <PerformanceCard key={index} metric={metric} />
            ))}
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

        {/* System Health Summary */}
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg p-6`}
        >
          <div className="flex items-center space-x-2 space-x-reverse mb-6">
            <FiShield className="text-2xl text-purple-500" />
            <h2
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              ملخص صحة النظام
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                98.5%
              </div>
              <div
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                معدل التوفر الشهري
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">45ms</div>
              <div
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                متوسط زمن الاستجابة
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                15 أيام
              </div>
              <div
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                وقت التشغيل المستمر
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatsTab;
