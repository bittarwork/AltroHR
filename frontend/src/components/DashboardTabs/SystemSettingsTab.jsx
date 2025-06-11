import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";
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
  FiInfo,
  FiX,
} from "react-icons/fi";

const SystemSettingsTab = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const token = user?.token;

  const [loading, setLoading] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    systemName: "AltroHR",
    systemDescription: "نظام إدارة الموارد البشرية الذكي",
    maintenanceMode: false,
    allowRegistration: false,
    sessionTimeout: 480,
    maxLoginAttempts: 5,
    backupFrequency: "daily",
    emailNotifications: true,
    smsNotifications: false,
    defaultLanguage: "ar",
    timezone: "Asia/Riyadh",
    currency: "SAR",
    dateFormat: "DD/MM/YYYY",
    workingHours: {
      start: "08:00",
      end: "17:00",
    },
  });

  // تحميل الإعدادات عند بدء التشغيل
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (!token) return;

    setLoadingSettings(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/system-settings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSettings(response.data);
      setError(null);
    } catch (error) {
      console.error("خطأ في تحميل الإعدادات:", error);
      setError("فشل في تحميل الإعدادات");
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleSettingChange = (key, value) => {
    if (key.includes(".")) {
      // للحقول المتداخلة مثل workingHours.start
      const [parent, child] = key.split(".");
      setSettings((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleSaveSettings = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/system-settings`,
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      // تحديث الإعدادات بالبيانات المحدثة من الخادم
      if (response.data.settings) {
        setSettings(response.data.settings);
      }
    } catch (error) {
      console.error("خطأ في حفظ الإعدادات:", error);
      setError(error.response?.data?.message || "فشل في حفظ الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = async () => {
    if (!token) return;
    if (!window.confirm("هل أنت متأكد من إعادة تعيين جميع الإعدادات؟")) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/system-settings/reset`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSettings(response.data.settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("خطأ في إعادة تعيين الإعدادات:", error);
      setError(error.response?.data?.message || "فشل في إعادة تعيين الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  const handleExportSettings = async () => {
    if (!token) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/system-settings/export`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // تحميل الملف
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "system-settings.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("خطأ في تصدير الإعدادات:", error);
      setError("فشل في تصدير الإعدادات");
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
      title: "إعدادات العمل",
      icon: FiClock,
      fields: [
        {
          key: "workingHours.start",
          label: "بداية الدوام",
          type: "time",
        },
        {
          key: "workingHours.end",
          label: "نهاية الدوام",
          type: "time",
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
          description: "إرسال إشعارات عبر الرسائل النصية (قيد التطوير)",
          disabled: true,
          developmentNote: true,
        },
      ],
    },
    {
      title: "إعدادات النسخ الاحتياطي",
      icon: FiDatabase,
      developmentSection: true,
      fields: [
        {
          key: "backupFrequency",
          label: "تكرار النسخ الاحتياطي",
          type: "select",
          disabled: true,
          developmentNote: true,
          options: [
            { value: "disabled", label: "معطل" },
            { value: "hourly", label: "كل ساعة" },
            { value: "daily", label: "يومياً" },
            { value: "weekly", label: "أسبوعياً" },
            { value: "monthly", label: "شهرياً" },
          ],
        },
      ],
    },
  ];

  const renderField = (field) => {
    const getValue = (key) => {
      if (key.includes(".")) {
        const [parent, child] = key.split(".");
        return settings[parent]?.[child] || "";
      }
      return settings[key];
    };

    const fieldProps = {
      value: getValue(field.key),
      onChange: (e) => handleSettingChange(field.key, e.target.value),
      disabled: field.disabled || loading,
      className: `w-full px-4 py-2 rounded-lg border transition-colors ${
        field.disabled ? "opacity-50 cursor-not-allowed " : ""
      }${
        darkMode
          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`,
    };

    switch (field.type) {
      case "text":
        return (
          <div className="relative">
            <input
              type="text"
              {...fieldProps}
              placeholder={field.placeholder}
            />
            {field.developmentNote && (
              <span className="absolute left-2 top-2 text-xs text-orange-500 bg-orange-100 px-2 py-1 rounded">
                قيد التطوير
              </span>
            )}
          </div>
        );

      case "textarea":
        return (
          <div className="relative">
            <textarea
              {...fieldProps}
              placeholder={field.placeholder}
              rows={3}
              className={fieldProps.className + " resize-none"}
            />
          </div>
        );

      case "select":
        return (
          <div className="relative">
            <select {...fieldProps}>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.developmentNote && (
              <span className="absolute left-2 top-2 text-xs text-orange-500 bg-orange-100 px-2 py-1 rounded">
                قيد التطوير
              </span>
            )}
          </div>
        );

      case "number":
        return (
          <input
            type="number"
            {...fieldProps}
            onChange={(e) =>
              handleSettingChange(field.key, parseInt(e.target.value))
            }
            min={field.min}
            max={field.max}
          />
        );

      case "time":
        return <input type="time" {...fieldProps} />;

      case "toggle":
        return (
          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={() =>
                handleSettingChange(field.key, !getValue(field.key))
              }
              disabled={field.disabled || loading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                field.disabled ? "opacity-50 cursor-not-allowed " : ""
              }${
                getValue(field.key)
                  ? "bg-blue-600"
                  : darkMode
                  ? "bg-gray-600"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  getValue(field.key) ? "translate-x-1" : "translate-x-6"
                }`}
              />
            </button>
            {field.description && (
              <div className="flex items-center space-x-2 space-x-reverse">
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {field.description}
                </span>
                {field.developmentNote && (
                  <span className="text-xs text-orange-500 bg-orange-100 px-2 py-1 rounded">
                    قيد التطوير
                  </span>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loadingSettings) {
    return (
      <div
        className={`p-6 ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        } min-h-screen flex items-center justify-center`}
      >
        <div className="text-center">
          <FiRefreshCw className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className={`text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
            جاري تحميل الإعدادات...
          </p>
        </div>
      </div>
    );
  }

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

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4 flex items-center justify-between space-x-3 space-x-reverse"
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              <FiX className="text-red-600 dark:text-red-400" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
            >
              <FiX />
            </button>
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
              } rounded-xl shadow-lg p-6 ${
                section.developmentSection
                  ? "border-2 border-orange-200 dark:border-orange-800"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div
                    className={`p-2 rounded-lg ${
                      section.developmentSection
                        ? "bg-orange-100 dark:bg-orange-900/20"
                        : darkMode
                        ? "bg-gray-700"
                        : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`text-xl ${
                        section.developmentSection
                          ? "text-orange-600 dark:text-orange-400"
                          : darkMode
                          ? "text-blue-400"
                          : "text-blue-600"
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

                {section.developmentSection && (
                  <div className="flex items-center space-x-2 space-x-reverse bg-orange-100 dark:bg-orange-900/20 px-3 py-1 rounded-full">
                    <FiInfo className="text-orange-600 dark:text-orange-400" />
                    <span className="text-sm text-orange-800 dark:text-orange-200">
                      جاري التطوير
                    </span>
                  </div>
                )}
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
              onClick={handleResetSettings}
              disabled={loading}
              className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-lg font-medium border transition-colors ${
                loading
                  ? "border-gray-400 text-gray-400 cursor-not-allowed"
                  : darkMode
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
              onClick={handleExportSettings}
              disabled={loading}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg text-sm font-medium ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white`}
            >
              <FiDownload />
              <span>تصدير الإعدادات</span>
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <button
                disabled={true}
                className="flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg text-sm font-medium bg-gray-400 cursor-not-allowed text-white opacity-50"
              >
                <FiUpload />
                <span>استيراد الإعدادات</span>
              </button>
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded whitespace-nowrap">
                قيد التطوير
              </span>
            </motion.div>
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
                تغيير هذه الإعدادات سيؤثر على سلوك النظام فور الحفظ. الإعدادات
                المميزة بـ "قيد التطوير" ستكون متاحة في الإصدارات القادمة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsTab;
