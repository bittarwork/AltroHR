import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import {
  FiSettings,
  FiSave,
  FiRefreshCw,
  FiDatabase,
  FiMail,
  FiShield,
  FiGlobe,
  FiClock,
  FiUpload,
  FiDownload,
  FiAlertTriangle,
  FiCheck,
} from "react-icons/fi";

const SystemSettingsTab = () => {
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    systemName: "AltroHR",
    systemDescription: "نظام إدارة الموارد البشرية الذكي",
    maintenanceMode: false,
    allowRegistration: false,
    sessionTimeout: 480, // minutes
    maxLoginAttempts: 5,
    backupFrequency: "daily",
    emailNotifications: true,
    smsNotifications: false,
    defaultLanguage: "ar",
    timezone: "Asia/Riyadh",
    currency: "SAR",
    dateFormat: "DD/MM/YYYY",
    companyLogo: null,
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Here you would save to API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("خطأ في حفظ الإعدادات:", error);
    } finally {
      setLoading(false);
    }
  };

  const settingSections = [
    {
      title: "الإعدادات العامة",
      icon: FiSettings,
      fields: [
        {
          key: "systemName",
          label: "اسم النظام",
          type: "text",
          placeholder: "اسم النظام",
        },
        {
          key: "systemDescription",
          label: "وصف النظام",
          type: "textarea",
          placeholder: "وصف مختصر للنظام",
        },
        {
          key: "defaultLanguage",
          label: "اللغة الافتراضية",
          type: "select",
          options: [
            { value: "ar", label: "العربية" },
            { value: "en", label: "English" },
          ],
        },
        {
          key: "timezone",
          label: "المنطقة الزمنية",
          type: "select",
          options: [
            { value: "Asia/Riyadh", label: "الرياض" },
            { value: "Asia/Dubai", label: "دبي" },
            { value: "Asia/Kuwait", label: "الكويت" },
          ],
        },
      ],
    },
    {
      title: "إعدادات الأمان",
      icon: FiShield,
      fields: [
        {
          key: "maintenanceMode",
          label: "وضع الصيانة",
          type: "toggle",
          description: "تعطيل الوصول للمستخدمين العاديين",
        },
        {
          key: "allowRegistration",
          label: "السماح بالتسجيل",
          type: "toggle",
          description: "السماح للمستخدمين الجدد بالتسجيل",
        },
        {
          key: "sessionTimeout",
          label: "انتهاء الجلسة (بالدقائق)",
          type: "number",
          min: 30,
          max: 1440,
        },
        {
          key: "maxLoginAttempts",
          label: "عدد محاولات تسجيل الدخول القصوى",
          type: "number",
          min: 3,
          max: 10,
        },
      ],
    },
    {
      title: "إعدادات النسخ الاحتياطي",
      icon: FiDatabase,
      fields: [
        {
          key: "backupFrequency",
          label: "تكرار النسخ الاحتياطي",
          type: "select",
          options: [
            { value: "hourly", label: "كل ساعة" },
            { value: "daily", label: "يومياً" },
            { value: "weekly", label: "أسبوعياً" },
            { value: "monthly", label: "شهرياً" },
          ],
        },
      ],
    },
    {
      title: "إعدادات الإشعارات",
      icon: FiMail,
      fields: [
        {
          key: "emailNotifications",
          label: "إشعارات البريد الإلكتروني",
          type: "toggle",
          description: "إرسال إشعارات عبر البريد الإلكتروني",
        },
        {
          key: "smsNotifications",
          label: "إشعارات الرسائل النصية",
          type: "toggle",
          description: "إرسال إشعارات عبر الرسائل النصية",
        },
      ],
    },
  ];

  const renderField = (field) => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={settings[field.key]}
            onChange={(e) => handleSettingChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          />
        );

      case "textarea":
        return (
          <textarea
            value={settings[field.key]}
            onChange={(e) => handleSettingChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={`w-full px-4 py-2 rounded-lg border transition-colors resize-none ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          />
        );

      case "select":
        return (
          <select
            value={settings[field.key]}
            onChange={(e) => handleSettingChange(field.key, e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "number":
        return (
          <input
            type="number"
            value={settings[field.key]}
            onChange={(e) =>
              handleSettingChange(field.key, parseInt(e.target.value))
            }
            min={field.min}
            max={field.max}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          />
        );

      case "toggle":
        return (
          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={() =>
                handleSettingChange(field.key, !settings[field.key])
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings[field.key]
                  ? "bg-blue-600"
                  : darkMode
                  ? "bg-gray-600"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[field.key] ? "translate-x-1" : "translate-x-6"
                }`}
              />
            </button>
            {field.description && (
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {field.description}
              </span>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Message */}
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4 flex items-center space-x-3 space-x-reverse"
          >
            <FiCheck className="text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200">
              تم حفظ الإعدادات بنجاح
            </span>
          </motion.div>
        )}

        {settingSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg p-6`}
            >
              <div className="flex items-center space-x-3 space-x-reverse mb-6">
                <div
                  className={`p-2 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`text-xl ${
                      darkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                </div>
                <h3
                  className={`text-xl font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {section.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {field.label}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveSettings}
              disabled={loading}
              className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-lg font-medium transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
              <span>{loading ? "جاري الحفظ..." : "حفظ الإعدادات"}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-lg font-medium border transition-colors ${
                darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FiRefreshCw />
              <span>إعادة تعيين</span>
            </motion.button>
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white"
            >
              <FiDownload />
              <span>تصدير الإعدادات</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white"
            >
              <FiUpload />
              <span>استيراد الإعدادات</span>
            </motion.button>
          </div>
        </div>

        {/* Warning */}
        <div
          className={`p-4 rounded-lg border ${
            darkMode
              ? "bg-yellow-900/20 border-yellow-700"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div className="flex items-start space-x-3 space-x-reverse">
            <FiAlertTriangle className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h4
                className={`font-medium ${
                  darkMode ? "text-yellow-200" : "text-yellow-800"
                }`}
              >
                تحذير مهم
              </h4>
              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-yellow-300" : "text-yellow-700"
                }`}
              >
                تغيير هذه الإعدادات قد يؤثر على أداء النظام. تأكد من فهم تأثير
                كل إعداد قبل التغيير.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsTab;
