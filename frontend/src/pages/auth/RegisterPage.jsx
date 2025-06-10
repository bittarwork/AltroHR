import React, { useState } from "react";
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
} from "react-icons/fi";
import {
  FaSpinner,
  FaCheckCircle,
  FaShieldAlt,
  FaGoogle,
  FaFacebookF,
  FaApple,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const RegisterPage = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    position: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [step, setStep] = useState("form");

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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStep("success");
    } catch (err) {
      setError("حدث خطأ في إنشاء الحساب. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

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
          {step === "form" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`p-8 rounded-2xl ${cardBg} shadow-2xl`}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiUserPlus className="text-white text-2xl" />
                </div>
                <h2 className={`text-3xl font-bold mb-2 ${textColor}`}>
                  إنشاء حساب جديد
                </h2>
                <p className={subtextColor}>
                  انضم إلى فريقنا واستمتع بتجربة إدارة أفضل
                </p>
              </div>

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
                        خطأ في التسجيل
                      </div>
                      <div className="text-red-600 dark:text-red-400 text-sm">
                        {error}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${textColor}`}>
                      الاسم الكامل
                    </label>
                    <div
                      className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300
                      ${
                        focusedField === "name"
                          ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                          : `${inputBg} ${
                              darkMode ? "border-gray-600" : "border-gray-200"
                            }`
                      } ${inputBg}
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
                        placeholder="أدخل اسمك الكامل"
                        className={`w-full bg-transparent focus:outline-none placeholder-gray-400 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      />
                      {formData.name && <FiCheck className="text-green-500" />}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${textColor}`}>
                      البريد الإلكتروني
                    </label>
                    <div
                      className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300
                      ${
                        focusedField === "email"
                          ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                          : `${inputBg} ${
                              darkMode ? "border-gray-600" : "border-gray-200"
                            }`
                      } ${inputBg}
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
                        placeholder="أدخل بريدك الإلكتروني"
                        className={`w-full bg-transparent focus:outline-none placeholder-gray-400 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      />
                      {formData.email && <FiCheck className="text-green-500" />}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${textColor}`}>
                      القسم
                    </label>
                    <div
                      className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300
                      ${
                        focusedField === "department"
                          ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                          : `${inputBg} ${
                              darkMode ? "border-gray-600" : "border-gray-200"
                            }`
                      } ${inputBg}
                    `}
                    >
                      <FiHome
                        className={`text-lg ${
                          focusedField === "department"
                            ? "text-indigo-500"
                            : "text-gray-400"
                        }`}
                      />
                      <select
                        value={formData.department}
                        onChange={(e) =>
                          handleInputChange("department", e.target.value)
                        }
                        onFocus={() => setFocusedField("department")}
                        onBlur={() => setFocusedField("")}
                        required
                        className={`w-full bg-transparent focus:outline-none ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        <option
                          value=""
                          className={darkMode ? "bg-gray-800" : "bg-white"}
                        >
                          اختر القسم
                        </option>
                        {departments.map((dept, index) => (
                          <option
                            key={index}
                            value={dept}
                            className={darkMode ? "bg-gray-800" : "bg-white"}
                          >
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${textColor}`}>
                      المنصب
                    </label>
                    <div
                      className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300
                      ${
                        focusedField === "position"
                          ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                          : `${inputBg} ${
                              darkMode ? "border-gray-600" : "border-gray-200"
                            }`
                      } ${inputBg}
                    `}
                    >
                      <FiUser
                        className={`text-lg ${
                          focusedField === "position"
                            ? "text-indigo-500"
                            : "text-gray-400"
                        }`}
                      />
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) =>
                          handleInputChange("position", e.target.value)
                        }
                        onFocus={() => setFocusedField("position")}
                        onBlur={() => setFocusedField("")}
                        required
                        placeholder="أدخل منصبك"
                        className={`w-full bg-transparent focus:outline-none placeholder-gray-400 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      />
                      {formData.position && (
                        <FiCheck className="text-green-500" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${textColor}`}>
                      كلمة المرور
                    </label>
                    <div
                      className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300
                      ${
                        focusedField === "password"
                          ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                          : `${inputBg} ${
                              darkMode ? "border-gray-600" : "border-gray-200"
                            }`
                      } ${inputBg}
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
                        placeholder="أدخل كلمة المرور"
                        className={`w-full bg-transparent focus:outline-none placeholder-gray-400 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-indigo-500 transition-colors"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>

                    {formData.password && (
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.strength}%` }}
                          ></div>
                        </div>
                        <div className={`text-xs ${subtextColor}`}>
                          قوة كلمة المرور:{" "}
                          <span className="font-medium">
                            {passwordStrength.label}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${textColor}`}>
                      تأكيد كلمة المرور
                    </label>
                    <div
                      className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300
                      ${
                        focusedField === "confirmPassword"
                          ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                          : `${inputBg} ${
                              darkMode ? "border-gray-600" : "border-gray-200"
                            }`
                      } ${inputBg}
                      ${
                        formData.confirmPassword && !passwordsMatch
                          ? "border-red-500"
                          : ""
                      }
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
                        className={`w-full bg-transparent focus:outline-none placeholder-gray-400 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
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

                    {formData.confirmPassword && !passwordsMatch && (
                      <div className="text-red-500 text-xs flex items-center gap-1">
                        <FiAlertCircle />
                        كلمات المرور غير متطابقة
                      </div>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={
                    loading ||
                    !formData.name ||
                    !formData.email ||
                    !formData.password ||
                    !formData.confirmPassword ||
                    !passwordsMatch
                  }
                  className={`
                    w-full py-4 rounded-xl font-semibold text-white transition-all duration-300
                    bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700
                    shadow-lg hover:shadow-xl transform hover:scale-105
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    btn-hover-effect press-effect
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
                      إنشاء الحساب
                      <FiArrowRight className="text-lg" />
                    </>
                  )}
                </motion.button>

                <div className="relative flex items-center justify-center my-6">
                  <div className={`absolute inset-0 flex items-center`}>
                    <div
                      className={`w-full border-t ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    ></div>
                  </div>
                  <div
                    className={`relative px-4 text-sm ${subtextColor} ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    أو التسجيل باستخدام
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      icon: FaGoogle,
                      name: "Google",
                      color:
                        "hover:bg-red-50 hover:border-red-200 hover:text-red-600",
                    },
                    {
                      icon: FaFacebookF,
                      name: "Facebook",
                      color:
                        "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600",
                    },
                    {
                      icon: FaApple,
                      name: "Apple",
                      color:
                        "hover:bg-gray-50 hover:border-gray-200 hover:text-gray-600",
                    },
                  ].map((social, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`
                        flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all duration-300
                        ${
                          darkMode
                            ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                            : "border-gray-200 text-gray-600"
                        } ${social.color}
                        transform hover:scale-105
                      `}
                    >
                      <social.icon className="text-lg" />
                      <span className="hidden sm:inline text-sm">
                        {social.name}
                      </span>
                    </button>
                  ))}
                </div>
              </form>

              <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className={`text-sm ${subtextColor}`}>
                  تملك حساباً بالفعل؟{" "}
                  <Link
                    to="/login"
                    className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
                  >
                    تسجيل الدخول
                  </Link>
                </p>
              </div>

              <div
                className={`mt-6 p-4 rounded-xl ${
                  darkMode ? "bg-gray-700/30" : "bg-blue-50"
                } border ${darkMode ? "border-gray-600" : "border-blue-200"}`}
              >
                <div className="flex items-start gap-3">
                  <FaShieldAlt className="text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`font-medium mb-1 ${textColor}`}>
                      حماية بياناتك
                    </h4>
                    <p className={`text-xs ${subtextColor}`}>
                      نحن نحترم خصوصيتك ونحمي بياناتك الشخصية بأعلى معايير
                      الأمان.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-8 rounded-2xl ${cardBg} shadow-2xl text-center`}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-white text-3xl" />
              </div>

              <h2 className={`text-3xl font-bold mb-4 ${textColor}`}>
                مرحباً بك في الفريق! 🎉
              </h2>

              <p className={`${subtextColor} mb-8`}>
                تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول والبدء باستخدام
                النظام.
              </p>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/login")}
                  className={`
                    w-full py-4 rounded-xl font-semibold text-white transition-all duration-300
                    bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800
                    shadow-lg hover:shadow-xl transform hover:scale-105
                    btn-hover-effect press-effect
                    flex items-center justify-center gap-2
                  `}
                >
                  تسجيل الدخول الآن
                  <FiArrowRight />
                </motion.button>

                <Link
                  to="/"
                  className={`
                    block w-full py-3 rounded-xl font-medium transition-all duration-300 text-center
                    ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }
                  `}
                >
                  العودة إلى الصفحة الرئيسية
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RegisterPage;
