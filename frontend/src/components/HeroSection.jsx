// src/components/HeroSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const HeroSection = () => {
  const { darkMode } = useTheme();

  const bgColor = darkMode ? "bg-gray-900" : "bg-gray-100";
  const headingColor = darkMode ? "text-white" : "text-gray-900";
  const paragraphColor = darkMode ? "text-gray-300" : "text-gray-700";

  return (
    <section className={`${bgColor} py-20 mt-17`} dir="rtl">
      <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        {/* النص */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-right"
        >
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6 ${headingColor}`}
          >
            إدارة الموظفين بسهولة وذكاء مع{" "}
            <span className="text-indigo-600">AltroHR</span>
          </h1>
          <p
            className={`text-base sm:text-lg mb-8 max-w-lg mx-auto lg:mx-0 ${paragraphColor}`}
          >
            تتبّع الحضور، إدارة الإجازات، وتحليل الأداء — كل ذلك في منصة واحدة
            مرنة وسهلة الاستخدام لتبسيط عمل الموارد البشرية.
          </p>
          <div className="flex justify-center lg:justify-start">
            <Link
              to="/login"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm sm:text-base px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              ابدأ الآن
            </Link>
          </div>
        </motion.div>

        {/* الصورة */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 flex justify-center"
        >
          <img
            src="https://static.vecteezy.com/system/resources/previews/011/860/492/non_2x/business-management-innovation-management-software-time-and-attendance-tracking-system-hr-software-working-time-tracker-set-flat-modern-illustration-vector.jpg"
            alt="نظرة على النظام"
            className="w-full max-w-md sm:max-w-lg rounded-xl shadow-2xl transition-transform hover:scale-105 duration-300"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
