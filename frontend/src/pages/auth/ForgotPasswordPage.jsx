import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
  FiAlertCircle,
  FiKey,
  FiSend,
} from "react-icons/fi";
import { FaSpinner, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const ForgotPasswordPage = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [step, setStep] = useState("email"); // email, verification, success
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // معالج إرسال رابط استعادة كلمة المرور
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // محاكاة استدعاء API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess("تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني");
      setStep("success");
    } catch (err) {
      setError(
        "حدث خطأ في إرسال رابط استعادة كلمة المرور. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };

  // التنسيقات بناءً على الوضع
  const containerBg = darkMode
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    : "bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50";

  const cardBg = darkMode
    ? "bg-gray-800/90 backdrop-blur-xl border border-gray-700/50"
    : "bg-white/90 backdrop-blur-xl shadow-2xl border border-white/20";

  const textColor = darkMode ? "text-white" : "text-gray-900";
  const subtextColor = darkMode ? "text-gray-300" : "text-gray-600";

  return (
    <>
      <Navbar />

      {/* خلفية متحركة */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div
        className={`min-h-screen flex items-center justify-center ${containerBg} px-4 pt-24 pb-20 relative`}
        dir="rtl"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-8 rounded-2xl ${cardBg} shadow-2xl`}
          >
            {/* المرحلة: إدخال البريد الإلكتروني */}
            {step === "email" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* رأس الصفحة */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiKey className="text-white text-2xl" />
                  </div>
                  <h2 className={`text-3xl font-bold mb-2 ${textColor}`}>
                    نسيت كلمة المرور؟
                  </h2>
                  <p className={`${subtextColor} text-center`}>
                    لا تقلق! أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين
                    كلمة المرور
                  </p>
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
                      <div className="text-red-600 dark:text-red-400 text-sm">
                        {error}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* النموذج */}
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${textColor}`}>
                      البريد الإلكتروني
                    </label>
                    <div
                      className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300
                      ${
                        darkMode
                          ? "bg-gray-700/50 border-gray-600"
                          : "bg-white/50 border-gray-200"
                      }
                      focus-within:border-indigo-500 focus-within:shadow-lg focus-within:shadow-indigo-500/20
                    `}
                    >
                      <FiMail className="text-lg text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError("");
                        }}
                        required
                        placeholder="أدخل بريدك الإلكتروني"
                        className={`
                          w-full bg-transparent focus:outline-none placeholder-gray-400
                          ${darkMode ? "text-white" : "text-gray-900"}
                        `}
                      />
                      {email && <FiCheck className="text-green-500" />}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || !email}
                    className={`
                      w-full py-4 rounded-xl font-semibold text-white transition-all duration-300
                      bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700
                      shadow-lg hover:shadow-xl transform hover:scale-105
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      btn-hover-effect press-effect
                      flex items-center justify-center gap-2
                    `}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        إرسال رابط الاستعادة
                        <FiSend className="text-lg" />
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="text-center mt-6">
                  <Link
                    to="/login"
                    className={`text-sm ${subtextColor} hover:text-indigo-600 transition-colors flex items-center justify-center gap-2`}
                  >
                    <FiArrowLeft className="text-lg" />
                    العودة إلى تسجيل الدخول
                  </Link>
                </div>
              </motion.div>
            )}

            {/* المرحلة: تم الإرسال بنجاح */}
            {step === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle className="text-white text-3xl" />
                </div>

                <h2 className={`text-3xl font-bold mb-4 ${textColor}`}>
                  تم الإرسال بنجاح! ✅
                </h2>

                <div className={`space-y-4 mb-8 ${subtextColor}`}>
                  <p>تم إرسال رابط استعادة كلمة المرور إلى:</p>
                  <div
                    className={`p-4 rounded-xl ${
                      darkMode ? "bg-gray-700/50" : "bg-gray-50"
                    } font-medium ${textColor}`}
                  >
                    {email}
                  </div>
                  <p className="text-sm">
                    يرجى التحقق من صندوق الوارد (وصندوق الرسائل المرفوضة أيضاً)
                  </p>
                </div>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.open("https://gmail.com", "_blank")}
                    className={`
                      w-full py-3 rounded-xl font-medium transition-all duration-300
                      bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                      text-white shadow-lg hover:shadow-xl transform hover:scale-105
                      btn-hover-effect press-effect
                      flex items-center justify-center gap-2
                    `}
                  >
                    <FiMail />
                    فتح البريد الإلكتروني
                  </motion.button>

                  <Link
                    to="/login"
                    className={`
                      block w-full py-3 rounded-xl font-medium transition-all duration-300 text-center
                      ${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }
                    `}
                  >
                    العودة إلى تسجيل الدخول
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className={`text-xs ${subtextColor}`}>
                    لم تستلم الرسالة؟{" "}
                    <button
                      onClick={() => setStep("email")}
                      className="text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                      إعادة الإرسال
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* معلومات الأمان */}
            <div
              className={`mt-8 p-4 rounded-xl ${
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
                    رابط استعادة كلمة المرور صالح لمدة 24 ساعة فقط ولا يمكن
                    استخدامه إلا مرة واحدة لضمان أمان حسابك.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ForgotPasswordPage;
