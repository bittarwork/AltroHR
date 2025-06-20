import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiUser,
  FiBriefcase,
  FiDollarSign,
  FiMail,
  FiShield,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiActivity,
  FiEye,
} from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const ViewUserDetailsModal = ({ userId, onClose }) => {
  const { darkMode } = useTheme();
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !authUser?.token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authUser.token}`,
            },
          }
        );
        setUserData(res.data);
      } catch (err) {
        console.error("فشل في جلب معلومات المستخدم:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, authUser?.token]);

  const formatDate = (isoDate) =>
    isoDate ? new Date(isoDate).toLocaleDateString("ar-EG") : "-";

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

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "مدير النظام";
      case "hr":
        return "موارد بشرية";
      case "employee":
        return "موظف";
      default:
        return role;
    }
  };

  const getSalaryTypeLabel = (type) => {
    switch (type) {
      case "monthly":
        return "راتب شهري";
      case "hourly":
        return "راتب بالساعة";
      default:
        return type || "-";
    }
  };

  if (!userId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <FiEye
                    className="text-blue-600 dark:text-blue-400"
                    size={20}
                  />
                </div>
                <h2 className="text-xl font-bold">تفاصيل المستخدم</h2>
              </div>

              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  جاري تحميل بيانات المستخدم...
                </p>
              </div>
            ) : !userData ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <FiX className="text-red-500" size={24} />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  تعذر تحميل البيانات
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  حدث خطأ أثناء تحميل معلومات المستخدم
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* User Header Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-xl border ${
                    darkMode
                      ? "border-gray-700 bg-gray-900/50"
                      : "border-gray-200 bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center bg-${getRoleColor(
                        userData.role
                      )}-100 dark:bg-${getRoleColor(userData.role)}-900/20`}
                    >
                      <FiUser
                        className={`text-${getRoleColor(
                          userData.role
                        )}-600 dark:text-${getRoleColor(userData.role)}-400`}
                        size={24}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">
                        {userData.name}
                      </h3>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${getRoleColor(
                            userData.role
                          )}-100 dark:bg-${getRoleColor(
                            userData.role
                          )}-900/20 text-${getRoleColor(
                            userData.role
                          )}-600 dark:text-${getRoleColor(userData.role)}-400`}
                        >
                          <FiShield className="ml-1 mr-0" size={14} />
                          {getRoleLabel(userData.role)}
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            userData.isActive
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          <FiActivity className="ml-1 mr-0" size={14} />
                          {userData.isActive ? "نشط" : "غير نشط"}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Personal Information */}
                <SectionCard
                  icon={<FiUser className="text-blue-500" />}
                  title="المعلومات الشخصية"
                  delay={0.1}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DataField
                      icon={<FiUser />}
                      label="الاسم الكامل"
                      value={userData.name}
                    />
                    <DataField
                      icon={<FiMail />}
                      label="البريد الإلكتروني"
                      value={userData.email}
                    />
                    <DataField
                      icon={<FiShield />}
                      label="الدور"
                      value={getRoleLabel(userData.role)}
                    />
                    <DataField
                      icon={<FiActivity />}
                      label="حالة الحساب"
                      value={
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            userData.isActive
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {userData.isActive ? "نشط" : "غير نشط"}
                        </span>
                      }
                    />
                  </div>
                </SectionCard>

                {/* Work Information */}
                <SectionCard
                  icon={<FiBriefcase className="text-green-500" />}
                  title="المعلومات الوظيفية"
                  delay={0.2}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DataField
                      icon={<FiBriefcase />}
                      label="المسمى الوظيفي"
                      value={userData.position || "-"}
                    />
                    <DataField
                      icon={<FiMapPin />}
                      label="القسم"
                      value={userData.department?.name || "-"}
                    />
                    <DataField
                      icon={<FiCalendar />}
                      label="تاريخ التوظيف"
                      value={formatDate(userData.hireDate)}
                    />
                    <DataField
                      icon={<FiClock />}
                      label="آخر تسجيل دخول"
                      value={formatDate(userData.lastLogin)}
                    />
                    <DataField
                      icon={<FiClock />}
                      label="ساعات العمل اليومية"
                      value={
                        userData.workHoursPerDay
                          ? `${userData.workHoursPerDay} ساعة`
                          : "-"
                      }
                    />
                    <DataField
                      icon={<FiDollarSign />}
                      label="نوع الراتب"
                      value={getSalaryTypeLabel(userData.salaryType)}
                    />
                  </div>
                </SectionCard>

                {/* Financial Information */}
                <SectionCard
                  icon={<FiDollarSign className="text-yellow-500" />}
                  title="المعلومات المالية"
                  delay={0.3}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userData.baseSalary && (
                      <DataField
                        icon={<FiDollarSign />}
                        label="الراتب الأساسي"
                        value={`${userData.baseSalary?.toLocaleString()} ل.س`}
                      />
                    )}
                    {userData.hourlyRate && (
                      <DataField
                        icon={<FiClock />}
                        label="الأجر بالساعة"
                        value={`${userData.hourlyRate?.toLocaleString()} ل.س`}
                      />
                    )}
                    {userData.overtimeRate && (
                      <DataField
                        icon={<FiClock />}
                        label="أجر الساعات الإضافية"
                        value={`${userData.overtimeRate?.toLocaleString()} ل.س`}
                      />
                    )}
                  </div>
                </SectionCard>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const SectionCard = ({ icon, title, children, delay = 0 }) => {
  const { darkMode } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-6 rounded-xl border ${
        darkMode
          ? "border-gray-700 bg-gray-900/50"
          : "border-gray-200 bg-gray-50/50"
      }`}
    >
      <div className="flex items-center space-x-3 space-x-reverse mb-6">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
};

const DataField = ({ icon, label, value }) => {
  const { darkMode } = useTheme();

  return (
    <div className="space-y-2">
      <div
        className={`flex items-center space-x-2 space-x-reverse text-sm ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {icon &&
          React.cloneElement(icon, { size: 14, className: "text-current" })}
        <span>{label}</span>
      </div>
      <div
        className={`text-base font-medium ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
};

export default ViewUserDetailsModal;
