// src/components/WhyUsSection.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaCloudDownloadAlt,
  FaMobileAlt,
  FaLock,
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";

const reasons = [
  {
    icon: <FaCheckCircle />,
    title: "سهولة الاستخدام",
    description: "واجهة بسيطة، سريعة، وتدعم الوضع الليلي بدون تعقيد.",
  },
  {
    icon: <FaCloudDownloadAlt />,
    title: "تقارير قابلة للتصدير",
    description: "تحميل تقارير الأداء والحضور بصيغ PDF وExcel.",
  },
  {
    icon: <FaMobileAlt />,
    title: "متوافق مع كل الأجهزة",
    description: "تجربة استخدام مثالية من الهاتف أو التابلت أو الحاسوب.",
  },
  {
    icon: <FaLock />,
    title: "أمان البيانات",
    description: "تشفير الجلسات وصلاحيات دقيقة حسب الدور الوظيفي.",
  },
];

const WhyUsSection = () => {
  const { darkMode } = useTheme();

  const sectionBg = darkMode
    ? "bg-gradient-to-br from-gray-800 to-gray-900"
    : "bg-gradient-to-br from-indigo-50 to-white";

  const cardBg = darkMode
    ? "bg-gray-800/80 border-gray-700"
    : "bg-white/80 border-gray-200";
  const textColor = darkMode ? "text-gray-300" : "text-gray-600";
  const titleColor = darkMode ? "text-white" : "text-gray-800";
  const iconColor = darkMode ? "text-indigo-400" : "text-indigo-600";

  return (
    <section className={`relative py-20 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className={`text-3xl md:text-4xl font-bold mb-12 ${titleColor}`}>
          لماذا تختار <span className="text-indigo-600">WorkTrack</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className={`backdrop-blur-xl border ${cardBg} p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300`}
            >
              <div className={`text-4xl mb-4 ${iconColor}`}>{reason.icon}</div>
              <h3
                className={`text-lg sm:text-xl font-semibold mb-2 ${titleColor}`}
              >
                {reason.title}
              </h3>
              <p className={`text-sm leading-relaxed ${textColor}`}>
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
