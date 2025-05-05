// src/components/CallToActionSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const CallToActionSection = () => {
  const { darkMode } = useTheme();

  const bgColor = darkMode ? "bg-indigo-700" : "bg-indigo-600";
  const titleColor = "text-white";
  const textColor = "text-indigo-100";
  const buttonBg = "bg-white";
  const buttonText = "text-indigo-700";
  const buttonHover = "hover:bg-gray-100";

  return (
    <section className={`${bgColor} py-20 text-center`} dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4"
      >
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${titleColor}`}>
          جاهز لتحسين إدارة فريقك؟
        </h2>
        <p className={`text-lg mb-8 leading-relaxed ${textColor}`}>
          ابدأ الآن مع <span className="font-semibold">WorkTrack</span> وسهّل
          عملية الإدارة، المتابعة، والتقارير باحترافية.
        </p>
        <Link
          to="/login"
          className={`${buttonBg} ${buttonText} ${buttonHover} font-semibold px-7 py-3 rounded-lg shadow-md transition duration-300`}
        >
          ابدأ الآن
        </Link>
      </motion.div>
    </section>
  );
};

export default CallToActionSection;
