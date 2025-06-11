import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaUsers,
  FaChartBar,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import {
  FiMail,
  FiLock,
  FiUser,
  FiArrowRight,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const LoginPage = () => {
  const { login, user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // ✅ التوجيه إلى "/dashboard" إذا تم تسجيل الدخول
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // معالج تغيير البيانات
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // إزالة الخطأ عند بدء الكتابة
    if (error) setError("");
  };

  // معالج تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      // حفظ Remember Me إذا تم تفعيله
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("lastEmail", formData.email);
      }
    } catch (err) {
      setLoginAttempts((prev) => prev + 1);
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
    } finally {
      setLoading(false);
    }
  };

  // استرداد Remember Me
  useEffect(() => {
    const savedEmail = localStorage.getItem("lastEmail");
    const rememberMeStatus = localStorage.getItem("rememberMe");

    if (savedEmail && rememberMeStatus === "true") {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  // التنسيقات بناءً على الوضع
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

  // معايير قوة كلمة المرور (للعرض فقط)
  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 4)
      return { strength: 25, label: "ضعيفة", color: "bg-red-500" };
    if (password.length < 6)
      return { strength: 50, label: "متوسطة", color: "bg-yellow-500" };
    if (password.length < 8)
      return { strength: 75, label: "جيدة", color: "bg-blue-500" };
    return { strength: 100, label: "قوية", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <>
      <Navbar />

      {/* خلفية متحركة */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div
        className={`min-h-screen flex items-center justify-center ${containerBg} px-4 pt-24 pb-20 relative`}
        dir="rtl"
      >
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* الجانب الأيسر - معلومات وإحصائيات */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-8"
          >
            {/* العنوان الرئيسي */}
            <div className="text-center lg:text-right">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${textColor}`}
              >
                مرحباً بعودتك! 👋
                <div className="text-indigo-600 text-shimmer">AltroHR</div>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-lg md:text-xl ${subtextColor} max-w-2xl mx-auto lg:mx-0`}
              >
                نظام إدارة الموارد البشرية الذكي والشامل - ادخل وابدأ رحلتك نحو
                إدارة أفضل لفريقك
              </motion.p>
            </div>

            {/* بطاقات الميزات */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[
                {
                  icon: FaUsers,
                  title: "إدارة الموظفين",
                  desc: "متابعة شاملة لكامل الفريق",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  icon: FaClock,
                  title: "تتبع الحضور",
                  desc: "نظام دقيق لحضور الموظفين",
                  color: "from-green-500 to-green-600",
                },
                {
                  icon: FaChartBar,
                  title: "تقارير ذكية",
                  desc: "إحصائيات مفصلة وتحليلات",
                  color: "from-purple-500 to-purple-600",
                },
                {
                  icon: FaShieldAlt,
                  title: "أمان متقدم",
                  desc: "حماية عالية لبياناتك",
                  color: "from-red-500 to-red-600",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={`
                    p-4 rounded-xl backdrop-blur-sm border border-white/10 card-hover
                    ${darkMode ? "bg-gray-800/50" : "bg-white/50"}
                  `}
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-3`}
                  >
                    <feature.icon className="text-white text-xl" />
                  </div>
                  <h3 className={`font-semibold mb-1 ${textColor}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm ${subtextColor}`}>{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* رسالة ترحيبية للمسؤولين */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className={`p-6 rounded-xl ${
                darkMode ? "bg-gray-800/50" : "bg-white/50"
              } backdrop-blur-sm border ${
                darkMode ? "border-gray-700/50" : "border-white/20"
              }`}
            >
              <h3
                className={`font-semibold mb-4 flex items-center gap-2 ${textColor}`}
              >
                <FaShieldAlt className="text-indigo-500" />
                للمسؤولين والإداريين
              </h3>
              <p className={`text-sm ${subtextColor} mb-3`}>
                إذا كنت مسؤولاً أو إدارياً، يمكنك تسجيل الدخول هنا لإدارة النظام
                وإنشاء حسابات الموظفين الجدد.
              </p>
              <div
                className={`text-xs ${subtextColor} bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border-r-4 border-amber-400`}
              >
                <div className="font-medium text-amber-700 dark:text-amber-300 mb-1">
                  ملاحظة هامة:
                </div>
                <div className="text-amber-600 dark:text-amber-400">
                  إنشاء حسابات الموظفين الجدد يتم حصرياً من خلال المسؤولين
                  المعتمدين في النظام.
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* نموذج تسجيل الدخول */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5"
          >
            <div className={`p-8 rounded-2xl ${cardBg} shadow-2xl`}>
              {/* رأس النموذج */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiUser className="text-white text-2xl" />
                </div>
                <h2 className={`text-3xl font-bold mb-2 ${textColor}`}>
                  تسجيل الدخول
                </h2>
                <p className={subtextColor}>ادخل بياناتك للوصول إلى حسابك</p>
              </div>

              {/* رسالة الخطأ */}
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
                        خطأ في تسجيل الدخول
                      </div>
                      <div className="text-red-600 dark:text-red-400 text-sm">
                        {error}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* النموذج */}
              <form onSubmit={handleLogin} className="space-y-6">
                {/* حقل البريد الإلكتروني */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${textColor}`}>
                    البريد الإلكتروني
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
                        placeholder="أدخل بريدك الإلكتروني"
                        className={`
                          w-full bg-transparent focus:outline-none placeholder-gray-400
                          ${darkMode ? "text-white" : "text-gray-900"}
                        `}
                      />
                      {formData.email && <FiCheck className="text-green-500" />}
                    </div>
                  </div>
                </div>

                {/* حقل كلمة المرور */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${textColor}`}>
                    كلمة المرور
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
                        placeholder="أدخل كلمة المرور"
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
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* مؤشر قوة كلمة المرور */}
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

                {/* تذكرني */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className={`text-sm ${subtextColor}`}>تذكرني</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>

                {/* زر تسجيل الدخول */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !formData.email || !formData.password}
                  className={`
                    w-full py-4 rounded-xl font-semibold text-white transition-all duration-300
                    bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800
                    shadow-lg hover:shadow-xl transform hover:scale-105
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    btn-hover-effect press-effect
                    flex items-center justify-center gap-2
                  `}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    <>
                      تسجيل الدخول
                      <FiArrowRight className="text-lg" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* رابط للمسؤولين */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className={`text-sm ${subtextColor}`}>
                  هل أنت مسؤول في النظام؟{" "}
                  <Link
                    to="/admin/register-employee"
                    className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
                  >
                    إدارة حسابات الموظفين
                  </Link>
                </p>
                <p className={`text-xs ${subtextColor} mt-2`}>
                  يمكن للمسؤولين فقط إنشاء حسابات جديدة للموظفين
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LoginPage;
