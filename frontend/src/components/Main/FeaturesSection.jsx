// src/components/FeaturesSection.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  FaClock,
  FaUserCheck,
  FaFileAlt,
  FaCalendarAlt,
  FaChartLine,
  FaMobile,
  FaShieldAlt,
  FaRocket,
} from "react-icons/fa";
import {
  FiArrowRight,
  FiCheck,
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";

const features = [
  {
    icon: <FaClock />,
    title: "تتبع الحضور الذكي",
    description:
      "نظام متطور لتسجيل الحضور والانصراف بتقنية الـ GPS والتعرف على الوجه",
    highlights: ["GPS tracking", "Face recognition", "Real-time sync"],
    color: "from-blue-500 to-cyan-500",
    bgPattern:
      "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
  },
  {
    icon: <FaCalendarAlt />,
    title: "إدارة الإجازات الشاملة",
    description:
      "تقديم وموافقة طلبات الإجازة مع التكامل مع التقويم وإشعارات فورية",
    highlights: ["Automated approval", "Calendar sync", "Smart notifications"],
    color: "from-green-500 to-emerald-500",
    bgPattern:
      "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
  },
  {
    icon: <FaChartLine />,
    title: "تحليلات الأداء المتقدمة",
    description: "تقارير ذكية وتحليلات بيانات شاملة لتحسين الإنتاجية والكفاءة",
    highlights: ["AI insights", "Custom reports", "Performance metrics"],
    color: "from-purple-500 to-pink-500",
    bgPattern:
      "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
  },
  {
    icon: <FaUserCheck />,
    title: "إدارة الموظفين المتكاملة",
    description:
      "نظام شامل لإدارة بيانات الموظفين والأقسام والمناصب بسهولة مطلقة",
    highlights: [
      "Employee profiles",
      "Department management",
      "Role-based access",
    ],
    color: "from-orange-500 to-red-500",
    bgPattern:
      "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
  },
  {
    icon: <FaMobile />,
    title: "تطبيق موبايل متطور",
    description: "تطبيق جوال عصري يدعم جميع المنصات مع واجهة سهلة ومريحة",
    highlights: ["Cross-platform", "Offline support", "Push notifications"],
    color: "from-indigo-500 to-blue-500",
    bgPattern:
      "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20",
  },
  {
    icon: <FaShieldAlt />,
    title: "أمان عالي المستوى",
    description:
      "حماية متقدمة للبيانات مع تشفير من الطراز العالمي وامتثال للمعايير الدولية",
    highlights: [
      "End-to-end encryption",
      "GDPR compliant",
      "Multi-factor auth",
    ],
    color: "from-gray-600 to-gray-800",
    bgPattern:
      "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20",
  },
];

const stats = [
  { icon: <FiUsers />, number: "50K+", label: "مستخدم نشط" },
  { icon: <FiTrendingUp />, number: "98%", label: "رضا العملاء" },
  { icon: <FiZap />, number: "24/7", label: "دعم فني" },
  { icon: <FiStar />, number: "4.9", label: "تقييم المستخدمين" },
];

const FeatureCard = ({ feature, index, isActive, onHover, onLeave }) => {
  const { darkMode } = useTheme();
  const controls = useAnimation();
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, threshold: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: index * 0.1 },
      });
    }
  }, [isInView, controls, index]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      whileHover={{
        y: -10,
        transition: { duration: 0.3 },
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
      className={`
        group relative overflow-hidden rounded-2xl p-8 h-full cursor-pointer
        transition-all duration-500 transform
        ${
          darkMode
            ? "bg-gray-800/50 border border-gray-700/50"
            : "bg-white border border-gray-100"
        }
        ${isActive ? "shadow-2xl scale-105" : "shadow-lg hover:shadow-xl"}
        ${feature.bgPattern}
      `}
    >
      {/* خلفية متدرجة متحركة */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
        animate={isActive ? { opacity: 0.05 } : { opacity: 0 }}
      />

      {/* أيقونة متحركة */}
      <motion.div
        whileHover={{
          scale: 1.2,
          rotate: 5,
        }}
        className={`
          inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6
          bg-gradient-to-r ${feature.color} text-white shadow-lg
          group-hover:shadow-xl transition-all duration-300
        `}
      >
        <span className="text-2xl">{feature.icon}</span>
      </motion.div>

      {/* المحتوى */}
      <h3
        className={`text-xl font-bold mb-4 ${
          darkMode ? "text-white" : "text-gray-900"
        } group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${
          feature.color
        } transition-all duration-300`}
      >
        {feature.title}
      </h3>

      <p
        className={`text-base leading-relaxed mb-6 ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {feature.description}
      </p>

      {/* النقاط المميزة */}
      <ul className="space-y-2 mb-6">
        {feature.highlights.map((highlight, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.7, x: -10 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-3"
          >
            <FiCheck className={`w-4 h-4 text-green-500 flex-shrink-0`} />
            <span
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {highlight}
            </span>
          </motion.li>
        ))}
      </ul>

      {/* زر تفاعلي */}
      <motion.div
        whileHover={{ x: 5 }}
        className={`
          inline-flex items-center gap-2 text-sm font-medium
          bg-gradient-to-r ${feature.color} text-transparent bg-clip-text
          group-hover:text-white group-hover:bg-clip-text group-hover:bg-gradient-to-r
          transition-all duration-300 cursor-pointer
        `}
      >
        <span>اعرف المزيد</span>
        <FiArrowRight className="w-4 h-4" />
      </motion.div>

      {/* مؤثر الضوء */}
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={isActive ? { opacity: 0.3 } : { opacity: 0 }}
      />
    </motion.div>
  );
};

const FeaturesSection = () => {
  const { darkMode } = useTheme();
  const [activeCard, setActiveCard] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, threshold: 0.1 });
  const controls = useAnimation();

  const sectionBg = darkMode
    ? "bg-gray-900"
    : "bg-gradient-to-b from-gray-50 to-white";
  const textColor = darkMode ? "text-gray-300" : "text-gray-600";
  const headingColor = darkMode ? "text-white" : "text-gray-900";

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8 },
      });
    }
  }, [isInView, controls]);

  return (
    <section
      ref={sectionRef}
      id="features"
      className={`${sectionBg} py-24 relative overflow-hidden`}
      dir="rtl"
    >
      {/* خلفية هندسية */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* العنوان الرئيسي */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 px-6 py-3 rounded-full text-indigo-700 dark:text-indigo-300 font-medium mb-6"
          >
            <FiZap className="w-5 h-5" />
            <span>مزايا النظام</span>
          </motion.div>

          <h2
            className={`text-4xl sm:text-5xl font-extrabold mb-6 ${headingColor}`}
          >
            حلول متكاملة لإدارة{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
              الموارد البشرية
            </span>
          </h2>

          <p
            className={`text-xl max-w-3xl mx-auto leading-relaxed ${textColor}`}
          >
            تجربة فريدة تجمع بين القوة والبساطة لتوفير حلول شاملة ومتطورة تلبي
            جميع احتياجاتك
          </p>
        </motion.div>

        {/* إحصائيات سريعة */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`text-center p-6 rounded-2xl ${
                darkMode
                  ? "bg-gray-800/50 border border-gray-700/50"
                  : "bg-white border border-gray-100"
              } shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="text-3xl text-indigo-600 mb-3">{stat.icon}</div>
              <div className={`text-3xl font-bold mb-2 ${headingColor}`}>
                {stat.number}
              </div>
              <div className={`text-sm ${textColor}`}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* شبكة الميزات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              isActive={activeCard === index}
              onHover={setActiveCard}
              onLeave={() => setActiveCard(null)}
            />
          ))}
        </div>

        {/* دعوة للعمل */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <FaRocket className="w-5 h-5" />
            <span>جرب جميع الميزات مجاناً</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
