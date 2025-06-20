import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiUser,
  FiArrowRight,
  FiCheck,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiHome,
  FiUserPlus,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import {
  FaSpinner,
  FaCheckCircle,
  FaShieldAlt,
  FaUserTie,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const AdminRegisterEmployee = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    position: "",
    role: "employee", // Default role
    phoneNumber: "",
    startDate: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [focusedField, setFocusedField] = useState("");

  // Check if user is admin/hr
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.user?.role !== "admin" && user.user?.role !== "hr") {
      setError(
        "غير مصرح لك بالوصول إلى هذه الصفحة. يجب أن تكون مسؤولاً أو من قسم الموارد البشرية."
      );
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    }
  }, [user, navigate]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError("");
  };

  const passwordsMatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };

    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;
    if (/\d/.test(password)) score += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 25;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 25;

    let label, color;
    if (score < 50) {
      label = "ضعيفة";
      color = "bg-red-500";
    } else if (score < 75) {
      label = "متوسطة";
      color = "bg-yellow-500";
    } else if (score < 100) {
      label = "جيدة";
      color = "bg-blue-500";
    } else {
      label = "قوية جداً";
      color = "bg-green-500";
    }

    return { strength: Math.min(score, 100), label, color };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleRegisterEmployee = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    if (passwordStrength.strength < 50) {
      setError("كلمة المرور ضعيفة جداً، يرجى اختيار كلمة مرور أقوى");
      return;
    }

    setLoading(true);

    try {
      // Here you would make API call to create employee
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/create-employee`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            department: formData.department,
            position: formData.position,
            role: formData.role,
            phoneNumber: formData.phoneNumber,
            startDate: formData.startDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("فشل في إنشاء حساب الموظف");
      }

      setSuccess("تم إنشاء حساب الموظف بنجاح!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        department: "",
        position: "",
        role: "employee",
        phoneNumber: "",
        startDate: "",
      });
    } catch (err) {
      setError(
        err.message || "حدث خطأ في إنشاء حساب الموظف. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };

  // Return early if not authorized
  if (!user || (user.user?.role !== "admin" && user.user?.role !== "hr")) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <FaExclamationTriangle className="mx-auto text-6xl text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              غير مصرح بالوصول
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              هذه الصفحة مخصصة للمسؤولين وقسم الموارد البشرية فقط.
            </p>
            <Link
              to="/dashboard"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              العودة إلى لوحة التحكم
            </Link>
          </div>
        </div>
      </>
    );
  }

  const containerBg = darkMode
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    : "bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50";

  const cardBg = darkMode
    ? "bg-gray-800/90 backdrop-blur-xl border border-gray-700/50"
    : "bg-white/90 backdrop-blur-xl shadow-2xl border border-white/20";

  const inputBg = darkMode
    ? "bg-gray-700/50 border-gray-600"
    : "bg-white/50 border-gray-200";

  const textColor = darkMode ? "text-white" : "text-gray-900";
  const subtextColor = darkMode ? "text-gray-300" : "text-gray-600";

  const departments = [
    "الموارد البشرية",
    "التقنية",
    "المبيعات",
    "التسويق",
    "المالية",
    "العمليات",
    "القانونية",
    "الأمن والسلامة",
    "العلاقات العامة",
  ];

  const positions = [
    "موظف",
    "موظف أول",
    "رئيس قسم",
    "مدير",
    "مدير أول",
    "نائب المدير العام",
    "مختص",
    "محلل",
    "منسق",
  ];

  const roles = [
    { value: "employee", label: "موظف" },
    { value: "hr", label: "موارد بشرية" },
    { value: "admin", label: "مسؤول" },
  ];

  return (
    <>
      <Navbar />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div
        className={`min-h-screen flex items-center justify-center ${containerBg} px-4 pt-24 pb-20 relative`}
        dir="rtl"
      >
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-8 rounded-2xl ${cardBg} shadow-2xl`}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaUserTie className="text-white text-2xl" />
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${textColor}`}>
                إنشاء حساب موظف جديد
              </h2>
              <p className={subtextColor}>
                إضافة موظف جديد إلى النظام - للمسؤولين فقط
              </p>

              {/* Admin info */}
              <div
                className={`mt-4 p-3 rounded-lg ${
                  darkMode ? "bg-indigo-900/20" : "bg-indigo-50"
                } border ${
                  darkMode ? "border-indigo-700" : "border-indigo-200"
                }`}
              >
                <p
                  className={`text-sm ${
                    darkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                >
                  مرحباً {user.user?.name} - تسجيل دخول كـ{" "}
                  {user.user?.role === "admin" ? "مسؤول" : "موارد بشرية"}
                </p>
              </div>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-xl flex items-center gap-3"
                >
                  <FaCheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div>
                    <div className="text-green-800 dark:text-green-200 font-medium">
                      نجح العملية
                    </div>
                    <div className="text-green-600 dark:text-green-400 text-sm">
                      {success}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-xl flex items-center gap-3"
                >
                  <FiAlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" />
                  <div>
                    <div className="text-red-800 dark:text-red-200 font-medium">
                      خطأ في العملية
                    </div>
                    <div className="text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleRegisterEmployee} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${textColor}`}>
                    الاسم الكامل *
                  </label>
                  <div className="relative">
                    <div
                      className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300
                      ${
                        focusedField === "name"
                          ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                          : `${inputBg} ${
                              darkMode ? "border-gray-600" : "border-gray-200"
                            }`
                      }
                      ${inputBg}
                    `}
                    >
                      <FiUser
                        className={`text-lg ${
                          focusedField === "name"
                            ? "text-indigo-500"
                            : "text-gray-400"
                        }`}
                      />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField("")}
                        required
                        placeholder="أدخل اسم الموظف الكامل"
                        className={`
                          w-full bg-transparent focus:outline-none placeholder-gray-400
                          ${darkMode ? "text-white" : "text-gray-900"}
                        `}
                      />
                      {formData.name && <FiCheck className="text-green-500" />}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${textColor}`}>
                    البريد الإلكتروني *
                  </label>
                  <div className="relative">
                    <div
                      className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300
                      ${
                        focusedField === "email"
                          ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                          : `${inputBg} ${
                              darkMode ? "border-gray-600" : "border-gray-200"
                            }`
                      }
                      ${inputBg}
                    `}
                    >
                      <FiMail
                        className={`text-lg ${
                          focusedField === "email"
                            ? "text-indigo-500"
                            : "text-gray-400"
                        }`}
                      />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField("")}
                        required
                        placeholder="أدخل البريد الإلكتروني للموظف"
                        className={`
                          w-full bg-transparent focus:outline-none placeholder-gray-400
                          ${darkMode ? "text-white" : "text-gray-900"}
                        `}
                      />
                      {formData.email && <FiCheck className="text-green-500" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${textColor}`}>
                    كلمة المرور *
                  </label>
                  <div className="relative">
                    <div
                      className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300
                      ${
                        focusedField === "password"
                          ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                          : `${inputBg} ${
                              darkMode ? "border-gray-600" : "border-gray-200"
                            }`
                      }
                      ${inputBg}
                    `}
                    >
                      <FiLock
                        className={`text-lg ${
                          focusedField === "password"
                            ? "text-indigo-500"
                            : "text-gray-400"
                        }`}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField("")}
                        required
                        placeholder="أدخل كلمة مرور قوية"
                        className={`
                          w-full bg-transparent focus:outline-none placeholder-gray-400
                          ${darkMode ? "text-white" : "text-gray-900"}
                        `}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-indigo-500 transition-colors"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={subtextColor}>قوة كلمة المرور</span>
                        <span
                          className={`font-medium ${
                            passwordStrength.strength < 50
                              ? "text-red-500"
                              : passwordStrength.strength < 75
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div
                        className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2`}
                      >
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${textColor}`}>
                    تأكيد كلمة المرور *
                  </label>
                  <div className="relative">
                    <div
                      className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300
                      ${
                        focusedField === "confirmPassword"
                          ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                          : `${inputBg} ${
                              darkMode ? "border-gray-600" : "border-gray-200"
                            }`
                      }
                      ${inputBg}
                    `}
                    >
                      <FiLock
                        className={`text-lg ${
                          focusedField === "confirmPassword"
                            ? "text-indigo-500"
                            : "text-gray-400"
                        }`}
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        onFocus={() => setFocusedField("confirmPassword")}
                        onBlur={() => setFocusedField("")}
                        required
                        placeholder="أعد إدخال كلمة المرور"
                        className={`
                          w-full bg-transparent focus:outline-none placeholder-gray-400
                          ${darkMode ? "text-white" : "text-gray-900"}
                        `}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="text-gray-400 hover:text-indigo-500 transition-colors"
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                      {passwordsMatch && <FiCheck className="text-green-500" />}
                    </div>
                  </div>
                  {formData.confirmPassword && !passwordsMatch && (
                    <p className="text-red-500 text-xs mt-1">
                      كلمات المرور غير متطابقة
                    </p>
                  )}
                </div>
              </div>

              {/* Job Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Department */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${textColor}`}>
                    القسم *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    required
                    className={`
                      w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                      ${inputBg} ${
                      darkMode
                        ? "border-gray-600 text-white"
                        : "border-gray-200 text-gray-900"
                    }
                      focus:border-indigo-500 focus:outline-none
                    `}
                  >
                    <option value="">اختر القسم</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${textColor}`}>
                    المنصب *
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) =>
                      handleInputChange("position", e.target.value)
                    }
                    required
                    className={`
                      w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                      ${inputBg} ${
                      darkMode
                        ? "border-gray-600 text-white"
                        : "border-gray-200 text-gray-900"
                    }
                      focus:border-indigo-500 focus:outline-none
                    `}
                  >
                    <option value="">اختر المنصب</option>
                    {positions.map((pos, index) => (
                      <option key={index} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${textColor}`}>
                    الدور في النظام *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    required
                    className={`
                      w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                      ${inputBg} ${
                      darkMode
                        ? "border-gray-600 text-white"
                        : "border-gray-200 text-gray-900"
                    }
                      focus:border-indigo-500 focus:outline-none
                    `}
                  >
                    {roles.map((role, index) => (
                      <option key={index} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Number */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${textColor}`}>
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    placeholder="أدخل رقم الهاتف"
                    className={`
                      w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                      ${inputBg} ${
                      darkMode
                        ? "border-gray-600 text-white"
                        : "border-gray-200 text-gray-900"
                    }
                      focus:border-indigo-500 focus:outline-none
                    `}
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${textColor}`}>
                    تاريخ بداية العمل
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    className={`
                      w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                      ${inputBg} ${
                      darkMode
                        ? "border-gray-600 text-white"
                        : "border-gray-200 text-gray-900"
                    }
                      focus:border-indigo-500 focus:outline-none
                    `}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={
                  loading ||
                  !formData.name ||
                  !formData.email ||
                  !formData.password ||
                  !passwordsMatch
                }
                className={`
                  w-full py-4 rounded-xl font-semibold text-white transition-all duration-300
                  bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800
                  shadow-lg hover:shadow-xl transform hover:scale-105
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  flex items-center justify-center gap-2
                `}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  <>
                    إنشاء حساب الموظف
                    <FiUserPlus className="text-lg" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Navigation Links */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <Link
                to="/dashboard"
                className={`
                  block w-full py-3 rounded-xl font-medium transition-all duration-300 text-center
                  ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }
                `}
              >
                العودة إلى لوحة التحكم
              </Link>

              <p className={`text-xs ${subtextColor}`}>
                يمكن للمسؤولين ومن قسم الموارد البشرية فقط إنشاء حسابات الموظفين
                الجدد
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AdminRegisterEmployee;
