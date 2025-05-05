// src/components/FeaturesSection.jsx
import React from "react";
import { FaClock, FaUserCheck, FaFileAlt, FaCalendarAlt } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";

const features = [
  {
    icon: <FaClock />,
    title: "تسجيل الحضور والانصراف",
    description: "تسجيل دخول وخروج الموظف بدقة وسهولة، مع سجل زمني مفصل.",
  },
  {
    icon: <FaCalendarAlt />,
    title: "إدارة الإجازات",
    description: "تقديم طلبات الإجازة ومتابعة حالتها (موافقة/رفض) عبر النظام.",
  },
  {
    icon: <FaFileAlt />,
    title: "تقارير الأداء الشاملة",
    description: "عرض وتحليل أداء الموظفين بناءً على الحضور والإنتاجية.",
  },
  {
    icon: <FaUserCheck />,
    title: "إدارة بيانات الموظفين",
    description: "إضافة وتعديل بيانات الموظف، وتحديث الأقسام والمناصب بسهولة.",
  },
];

const FeaturesSection = () => {
  const { darkMode } = useTheme();

  const sectionBg = darkMode ? "bg-gray-800" : "bg-gray-50";
  const cardBg = darkMode ? "bg-gray-900" : "bg-white";
  const textColor = darkMode ? "text-gray-300" : "text-gray-600";
  const headingColor = darkMode ? "text-white" : "text-gray-800";
  const iconColor = darkMode ? "text-indigo-400" : "text-indigo-600";

  return (
    <section id="features" className={`${sectionBg} py-20`} dir="rtl">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2
          className={`text-3xl sm:text-4xl font-extrabold mb-14 ${headingColor}`}
        >
          مزايا نظام <span className="text-indigo-600">WorkTrack</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${cardBg} rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-center flex flex-col items-center`}
            >
              <div className={`${iconColor} text-4xl mb-4`}>{feature.icon}</div>
              <h3
                className={`text-lg sm:text-xl font-semibold mb-2 ${headingColor}`}
              >
                {feature.title}
              </h3>
              <p className={`text-sm leading-relaxed ${textColor}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
