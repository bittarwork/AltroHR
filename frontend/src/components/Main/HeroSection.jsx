// src/components/HeroSection.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimationControls } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FiPlay,
  FiUsers,
  FiClock,
  FiBarChart2,
  FiShield,
  FiArrowDown,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";

const HeroSection = () => {
  const { darkMode } = useTheme();
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const controls = useAnimationControls();

  const bgColor = darkMode
    ? "bg-gray-900"
    : "bg-gradient-to-br from-gray-50 via-white to-indigo-50";
  const headingColor = darkMode ? "text-white" : "text-gray-900";
  const paragraphColor = darkMode ? "text-gray-300" : "text-gray-700";

  // إحصائيات متحركة
  const stats = [
    { number: "5000+", label: "موظف نشط", icon: <FiUsers /> },
    { number: "99.9%", label: "وقت التشغيل", icon: <FiClock /> },
    { number: "500+", label: "شركة", icon: <FiBarChart2 /> },
    { number: "100%", label: "أمان البيانات", icon: <FiShield /> },
  ];

  // تبديل الإحصائيات تلقائياً
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  // حركة النبضة للإحصائيات
  useEffect(() => {
    controls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.5 },
    });
  }, [currentStatIndex, controls]);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section
      className={`${bgColor} py-20 pt-32 relative overflow-hidden min-h-screen flex items-center`}
      dir="rtl"
      id="hero"
    >
      {/* خلفية هندسية متحركة */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 right-20 w-32 h-32 border-2 border-indigo-600 rounded-full"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 relative z-10">
        {/* النص الرئيسي */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-right"
        >
          {/* شارة "جديد" */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 px-4 py-2 rounded-full text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-6"
          >
            <FiStar className="w-4 h-4" />
            <span>الإصدار الأحدث 2024</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 ${headingColor}`}
          >
            نظام إدارة الموارد البشرية{" "}
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-shimmer"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              الذكي
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className={`text-lg sm:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed ${paragraphColor}`}
          >
            حلول شاملة لإدارة الموارد البشرية تجمع بين التكنولوجيا المتقدمة
            والسهولة في الاستخدام
            <br />
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              تجربة مجانية لمدة 30 يوماً بدون التزامات
            </span>
          </motion.p>

          {/* أزرار العمل */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8"
          >
            <Link
              to="/login"
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 btn-hover-effect press-effect overflow-hidden"
            >
              <span className="relative z-10">ابدأ التجربة المجانية</span>
              <FiTrendingUp className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.05 }}
              />
            </Link>

            <button
              onClick={scrollToFeatures}
              className={`group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 ${
                darkMode
                  ? "bg-gray-800 text-white border-2 border-gray-700 hover:border-indigo-500 hover:bg-gray-700"
                  : "bg-white text-gray-900 border-2 border-gray-200 hover:border-indigo-500 hover:bg-gray-50"
              }`}
            >
              <FiPlay className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span>شاهد العرض التوضيحي</span>
            </button>
          </motion.div>

          {/* الإحصائيات المتحركة */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto lg:mx-0"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                animate={controls}
                className={`text-center p-4 rounded-xl transition-all duration-300 ${
                  index === currentStatIndex
                    ? darkMode
                      ? "bg-indigo-900/50 border-2 border-indigo-500"
                      : "bg-indigo-50 border-2 border-indigo-200"
                    : darkMode
                    ? "bg-gray-800/50 border-2 border-transparent"
                    : "bg-white/50 border-2 border-transparent"
                }`}
              >
                <div
                  className={`text-2xl mb-2 ${
                    index === currentStatIndex
                      ? "text-indigo-600"
                      : paragraphColor
                  }`}
                >
                  {stat.icon}
                </div>
                <div
                  className={`text-2xl font-bold mb-1 ${
                    index === currentStatIndex
                      ? "text-indigo-600"
                      : headingColor
                  }`}
                >
                  {stat.number}
                </div>
                <div className={`text-sm ${paragraphColor}`}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* الصورة التفاعلية */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 flex justify-center relative"
        >
          <div className="relative">
            {/* كارد خلفية متوهجة */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(99, 102, 241, 0.3)",
                  "0 0 0 20px rgba(99, 102, 241, 0)",
                  "0 0 0 0 rgba(99, 102, 241, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 rounded-3xl"
            />

            <motion.img
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
              }}
              transition={{ duration: 0.3 }}
              src="https://static.vecteezy.com/system/resources/previews/011/860/492/non_2x/business-management-innovation-management-software-time-and-attendance-tracking-system-hr-software-working-time-tracker-set-flat-modern-illustration-vector.jpg"
              alt="نظرة على النظام"
              className="w-full max-w-lg rounded-3xl shadow-2xl transform transition-all duration-500 hover:shadow-indigo-500/25"
              style={{
                filter: "drop-shadow(0 25px 25px rgba(0, 0, 0, 0.15))",
              }}
            />

            {/* نوافذ منبثقة تفاعلية */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className={`absolute -top-4 -right-4 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-lg p-3 shadow-lg`}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  متصل الآن
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className={`absolute -bottom-4 -left-4 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-lg p-3 shadow-lg`}
            >
              <div className="flex items-center gap-2">
                <FiTrendingUp className="w-4 h-4 text-green-500" />
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  +25% كفاءة
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* سهم التمرير لأسفل */}
      <motion.button
        onClick={scrollToFeatures}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-indigo-600 hover:text-indigo-700 transition-colors duration-300"
      >
        <FiArrowDown className="w-8 h-8" />
      </motion.button>
    </section>
  );
};

export default HeroSection;
