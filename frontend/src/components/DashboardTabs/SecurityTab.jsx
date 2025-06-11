import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import {
  FiShield,
  FiKey,
  FiLock,
  FiUnlock,
  FiAlertTriangle,
  FiActivity,
  FiUsers,
  FiClock,
  FiRefreshCw,
  FiEye,
  FiEyeOff,
  FiTrash2,
  FiDownload,
  FiFilter,
} from "react-icons/fi";

const SecurityTab = () => {
  const { darkMode } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState("permissions");
  const [loading, setLoading] = useState(false);

  const securitySubTabs = [
    {
      id: "permissions",
      label: "الصلاحيات",
      icon: FiKey,
      color: "blue",
    },
    {
      id: "sessions",
      label: "الجلسات النشطة",
      icon: FiActivity,
      color: "green",
    },
    {
      id: "loginAttempts",
      label: "محاولات تسجيل الدخول",
      icon: FiLock,
      color: "red",
    },
    {
      id: "auditLog",
      label: "سجل التدقيق",
      icon: FiEye,
      color: "purple",
    },
  ];

  const PermissionsTab = () => {
    const [roles, setRoles] = useState([
      {
        id: 1,
        name: "مدير النظام",
        code: "admin",
        permissions: [
          "full_access",
          "user_management",
          "system_settings",
          "security",
        ],
        usersCount: 2,
        color: "red",
      },
      {
        id: 2,
        name: "مدير الموارد البشرية",
        code: "hr",
        permissions: ["employee_management", "attendance", "leaves", "reports"],
        usersCount: 5,
        color: "blue",
      },
      {
        id: 3,
        name: "موظف",
        code: "employee",
        permissions: ["profile_access", "attendance_self", "leave_request"],
        usersCount: 143,
        color: "green",
      },
    ]);

    const permissionLabels = {
      full_access: "الوصول الكامل",
      user_management: "إدارة المستخدمين",
      system_settings: "إعدادات النظام",
      security: "الأمان",
      employee_management: "إدارة الموظفين",
      attendance: "الحضور والانصراف",
      leaves: "إدارة الإجازات",
      reports: "التقارير",
      profile_access: "الوصول للملف الشخصي",
      attendance_self: "تسجيل الحضور الشخصي",
      leave_request: "طلب الإجازات",
    };

    return (
      <div className="space-y-6">
        {roles.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg p-6 border-l-4 border-${role.color}-500`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div
                  className={`p-2 rounded-lg bg-${role.color}-100 dark:bg-${role.color}-900/20`}
                >
                  <FiUsers
                    className={`text-${role.color}-600 dark:text-${role.color}-400`}
                  />
                </div>
                <div>
                  <h3
                    className={`text-lg font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {role.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {role.usersCount} مستخدم
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  className={`px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40`}
                >
                  تعديل
                </button>
                <button
                  className={`px-3 py-1 rounded-lg text-sm font-medium bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40`}
                >
                  حذف
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {role.permissions.map((permission) => (
                <div
                  key={permission}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {permissionLabels[permission] || permission}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const SessionsTab = () => {
    const [sessions, setSessions] = useState([
      {
        id: 1,
        user: "أحمد محمد",
        role: "admin",
        device: "Chrome على Windows",
        ip: "192.168.1.100",
        location: "الرياض، السعودية",
        loginTime: "2024-01-15 09:30:00",
        lastActivity: "منذ 5 دقائق",
        status: "نشط",
      },
      {
        id: 2,
        user: "فاطمة أحمد",
        role: "hr",
        device: "Safari على iPhone",
        ip: "192.168.1.105",
        location: "جدة، السعودية",
        loginTime: "2024-01-15 08:15:00",
        lastActivity: "منذ 2 ساعة",
        status: "خامل",
      },
      {
        id: 3,
        user: "محمد علي",
        role: "employee",
        device: "Firefox على Linux",
        ip: "192.168.1.110",
        location: "الدمام، السعودية",
        loginTime: "2024-01-15 07:45:00",
        lastActivity: "منذ 30 دقيقة",
        status: "نشط",
      },
    ]);

    const terminateSession = (sessionId) => {
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));
    };

    const getRoleColor = (role) => {
      switch (role) {
        case "admin":
          return "red";
        case "hr":
          return "blue";
        case "employee":
          return "green";
        default:
          return "gray";
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "نشط":
          return "green";
        case "خامل":
          return "yellow";
        default:
          return "gray";
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {sessions.length} جلسة نشطة
          </div>
          <button
            onClick={() => setLoading(true)}
            className="flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            <span>تحديث</span>
          </button>
        </div>

        <div className="space-y-3">
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow p-4`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div
                    className={`p-2 rounded-lg bg-${getRoleColor(
                      session.role
                    )}-100 dark:bg-${getRoleColor(session.role)}-900/20`}
                  >
                    <FiUsers
                      className={`text-${getRoleColor(
                        session.role
                      )}-600 dark:text-${getRoleColor(session.role)}-400`}
                    />
                  </div>
                  <div>
                    <h4
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {session.user}
                    </h4>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {session.device} • {session.ip}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="text-left">
                    <div
                      className={`text-sm font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {session.lastActivity}
                    </div>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(
                        session.status
                      )}-100 dark:bg-${getStatusColor(
                        session.status
                      )}-900/20 text-${getStatusColor(
                        session.status
                      )}-600 dark:text-${getStatusColor(session.status)}-400`}
                    >
                      {session.status}
                    </div>
                  </div>

                  <button
                    onClick={() => terminateSession(session.id)}
                    className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const LoginAttemptsTab = () => {
    const [attempts, setAttempts] = useState([
      {
        id: 1,
        email: "admin@company.com",
        ip: "192.168.1.100",
        location: "الرياض، السعودية",
        device: "Chrome على Windows",
        timestamp: "2024-01-15 09:30:00",
        status: "نجح",
        reason: "-",
      },
      {
        id: 2,
        email: "hacker@malicious.com",
        ip: "45.123.456.789",
        location: "غير معروف",
        device: "Bot/Script",
        timestamp: "2024-01-15 09:25:00",
        status: "فشل",
        reason: "كلمة مرور خاطئة",
      },
      {
        id: 3,
        email: "employee@company.com",
        ip: "192.168.1.105",
        location: "جدة، السعودية",
        device: "Safari على iPhone",
        timestamp: "2024-01-15 09:20:00",
        status: "فشل",
        reason: "حساب مغلق",
      },
    ]);

    const getStatusColor = (status) => {
      switch (status) {
        case "نجح":
          return "green";
        case "فشل":
          return "red";
        default:
          return "gray";
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {attempts.length} محاولة في آخر 24 ساعة
            </div>
            <select
              className={`px-3 py-1 rounded-lg text-sm border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option>كل المحاولات</option>
              <option>نجحت فقط</option>
              <option>فشلت فقط</option>
            </select>
          </div>

          <div className="flex space-x-2 space-x-reverse">
            <button className="flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-lg text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40">
              <FiDownload />
              <span>تصدير</span>
            </button>
            <button className="flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40">
              <FiRefreshCw />
              <span>تحديث</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table
            className={`w-full ${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow overflow-hidden`}
          >
            <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th
                  className={`px-4 py-3 text-right text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  البريد الإلكتروني
                </th>
                <th
                  className={`px-4 py-3 text-right text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  عنوان IP
                </th>
                <th
                  className={`px-4 py-3 text-right text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  الموقع
                </th>
                <th
                  className={`px-4 py-3 text-right text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  الجهاز
                </th>
                <th
                  className={`px-4 py-3 text-right text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  التوقيت
                </th>
                <th
                  className={`px-4 py-3 text-right text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  النتيجة
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {attempts.map((attempt) => (
                <tr
                  key={attempt.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td
                    className={`px-4 py-3 text-sm ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {attempt.email}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {attempt.ip}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {attempt.location}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {attempt.device}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {attempt.timestamp}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(
                          attempt.status
                        )}-100 dark:bg-${getStatusColor(
                          attempt.status
                        )}-900/20 text-${getStatusColor(
                          attempt.status
                        )}-600 dark:text-${getStatusColor(attempt.status)}-400`}
                      >
                        {attempt.status}
                      </span>
                      {attempt.reason !== "-" && (
                        <span
                          className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {attempt.reason}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const AuditLogTab = () => {
    const [auditLogs, setAuditLogs] = useState([
      {
        id: 1,
        user: "أحمد محمد",
        action: "تسجيل دخول",
        resource: "النظام",
        timestamp: "2024-01-15 09:30:00",
        ip: "192.168.1.100",
        details: "تسجيل دخول ناجح",
      },
      {
        id: 2,
        user: "فاطمة أحمد",
        action: "إنشاء مستخدم",
        resource: "محمد علي",
        timestamp: "2024-01-15 09:25:00",
        ip: "192.168.1.105",
        details: "إنشاء حساب موظف جديد",
      },
      {
        id: 3,
        user: "أحمد محمد",
        action: "تعديل إعدادات",
        resource: "إعدادات النظام",
        timestamp: "2024-01-15 09:20:00",
        ip: "192.168.1.100",
        details: "تعديل وقت انتهاء الجلسة",
      },
    ]);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {auditLogs.length} عملية في آخر 24 ساعة
          </div>

          <div className="flex space-x-2 space-x-reverse">
            <select
              className={`px-3 py-1 rounded-lg text-sm border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option>كل العمليات</option>
              <option>تسجيل الدخول</option>
              <option>إدارة المستخدمين</option>
              <option>تعديل الإعدادات</option>
            </select>
            <button className="flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-lg text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40">
              <FiDownload />
              <span>تصدير</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {auditLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow p-4`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div
                    className={`p-2 rounded-lg ${
                      darkMode ? "bg-purple-900/20" : "bg-purple-100"
                    }`}
                  >
                    <FiEye className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {log.user} • {log.action}
                    </h4>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {log.resource} • {log.details}
                    </p>
                  </div>
                </div>

                <div className="text-left">
                  <div
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {log.timestamp}
                  </div>
                  <div
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {log.ip}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeSubTab) {
      case "permissions":
        return <PermissionsTab />;
      case "sessions":
        return <SessionsTab />;
      case "loginAttempts":
        return <LoginAttemptsTab />;
      case "auditLog":
        return <AuditLogTab />;
      default:
        return <PermissionsTab />;
    }
  };

  return (
    <div
      className={`p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Sub Navigation */}
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg p-2`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {securitySubTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`p-3 rounded-lg transition-all duration-200 text-center ${
                    isActive
                      ? `bg-${tab.color}-500 text-white shadow-lg shadow-${tab.color}-500/30`
                      : `text-${tab.color}-600 dark:text-${tab.color}-400 hover:bg-${tab.color}-50 dark:hover:bg-${tab.color}-900/20`
                  } ${
                    !isActive &&
                    (darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50")
                  }`}
                >
                  <Icon className="text-xl mx-auto mb-1" />
                  <div className="text-sm font-medium">{tab.label}</div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default SecurityTab;
