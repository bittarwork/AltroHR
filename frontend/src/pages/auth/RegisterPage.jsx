import React, { useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import { FiArrowRight, FiHome } from "react-icons/fi";
import { FaShieldAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const RegisterPage = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // إعادة توجيه فورية إلى صفحة تسجيل الدخول بعد 5 ثوانٍ
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

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

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div
        className={`min-h-screen flex items-center justify-center ${containerBg} px-4 pt-24 pb-20 relative`}
        dir="rtl"
      >
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-8 rounded-2xl ${cardBg} shadow-2xl text-center`}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaShieldAlt className="text-white text-2xl" />
            </div>

            <h2 className={`text-3xl font-bold mb-4 ${textColor}`}>
              صفحة غير متاحة للعموم
            </h2>

            <p className={`text-lg ${subtextColor} mb-6`}>
              إنشاء حسابات الموظفين الجدد يتم حصرياً من خلال المسؤولين المعتمدين
              في النظام
            </p>

            <div
              className={`p-6 rounded-lg ${
                darkMode ? "bg-amber-900/20" : "bg-amber-50"
              } border ${
                darkMode ? "border-amber-600" : "border-amber-200"
              } mb-6`}
            >
              <h3 className={`font-semibold mb-3 ${textColor}`}>
                لماذا لا يمكن التسجيل المباشر؟
              </h3>
              <ul className={`text-sm ${subtextColor} space-y-2 text-right`}>
                <li>• ضمان الأمان وسرية المعلومات</li>
                <li>• التحكم في الصلاحيات والأدوار</li>
                <li>• التحقق من صحة بيانات الموظفين</li>
                <li>• اتباع السياسات الداخلية للشركة</li>
              </ul>
            </div>

            <div className="space-y-4">
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
                تسجيل الدخول
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
                <FiHome className="inline ml-2" />
                العودة إلى الصفحة الرئيسية
              </Link>
            </div>

            <p className={`text-xs ${subtextColor} mt-6`}>
              سيتم إعادة توجيهك إلى صفحة تسجيل الدخول خلال 5 ثوانٍ...
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RegisterPage;
