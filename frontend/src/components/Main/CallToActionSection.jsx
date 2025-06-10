// src/components/CallToActionSection.jsx
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  FiArrowRight,
  FiStar,
  FiPlay,
  FiUsers,
  FiTrendingUp,
  FiShield,
  FiZap,
} from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";

const CallToActionSection = () => {
  const { darkMode } = useTheme();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, threshold: 0.1 });

  const bgGradient = darkMode
    ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900"
    : "bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800";

  const features = [
    { icon: <FiUsers />, text: "إدارة شاملة للموظفين" },
    { icon: <FiTrendingUp />, text: "تحليلات متقدمة" },
    { icon: <FiShield />, text: "أمان عالي المستوى" },
    { icon: <FiZap />, text: "سرعة ومرونة" },
  ];

  return (
    <section
      ref={sectionRef}
      id="cta"
      className={`${bgGradient} py-24 relative overflow-hidden`}
      dir="rtl"
    >
      {/* خلفية متحركة */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-32 -right-32 w-64 h-64 bg-white/5 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 rounded-full blur-2xl"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
        {/* شارة التقييم */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white font-medium mb-8"
        >
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <span>أكثر من 50,000 مستخدم راضي</span>
        </motion.div>

        {/* العنوان الرئيسي */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            ابدأ رحلتك نحو إدارة{" "}
            <motion.span
              animate={{
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-yellow-400"
              style={{ backgroundSize: "200%" }}
            >
              أكثر ذكاءً
            </motion.span>
          </h2>

          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
            انضم إلى آلاف الشركات التي تستخدم{" "}
            <span className="font-bold text-white">AltroHR</span> لتحسين إدارة
            مواردها البشرية
          </p>
        </motion.div>

        {/* الميزات السريعة */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
            >
              <div className="text-2xl text-white">{feature.icon}</div>
              <span className="text-sm text-white font-medium text-center">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* أزرار العمل */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
        >
          <Link to="/login">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.25)",
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 bg-white text-indigo-700 font-bold text-lg px-10 py-5 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
            >
              <span className="relative z-10">ابدأ التجربة المجانية</span>
              <motion.div whileHover={{ x: 5 }} className="relative z-10">
                <FiArrowRight className="w-6 h-6" />
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.05 }}
              />
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-3 text-white font-semibold text-lg px-8 py-4 rounded-2xl border-2 border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
          >
            <FiPlay className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>شاهد العرض التوضيحي</span>
          </motion.button>
        </motion.div>

        {/* ضمان الأمان */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-8 text-indigo-200"
        >
          <div className="flex items-center gap-2">
            <FiShield className="w-5 h-5" />
            <span className="text-sm">تشفير SSL آمن</span>
          </div>
          <div className="flex items-center gap-2">
            <FiZap className="w-5 h-5" />
            <span className="text-sm">إعداد في دقائق</span>
          </div>
          <div className="flex items-center gap-2">
            <FiUsers className="w-5 h-5" />
            <span className="text-sm">دعم فني 24/7</span>
          </div>
        </motion.div>

        {/* عداد تنازلي وهمي للضغط */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
          }
          transition={{ delay: 1.1 }}
          className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-w-md mx-auto"
        >
          <p className="text-white text-sm mb-2">🎉 عرض خاص لفترة محدودة</p>
          <p className="text-yellow-300 font-bold text-lg">
            30 يوماً مجاناً + خصم 50% على الشهر الأول
          </p>
        </motion.div>
      </div>

      {/* تأثير الشعاع */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"
      />
    </section>
  );
};

export default CallToActionSection;
