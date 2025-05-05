// src/components/UserRolesSection.jsx
import React, { useState } from "react";
import { FaUser, FaUserCog, FaUserShield } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";

const roles = {
  employee: {
    title: "الموظف",
    icon: <FaUser className="text-3xl text-indigo-500 mb-4" />,
    description: [
      "تسجيل الحضور والانصراف اليومي.",
      "تقديم طلبات الإجازة.",
      "عرض سجل الإجازات وساعات العمل.",
      "استعراض التقييمات الشهرية.",
    ],
  },
  hr: {
    title: "مدير الموارد البشرية",
    icon: <FaUserCog className="text-3xl text-indigo-500 mb-4" />,
    description: [
      "مراجعة طلبات الإجازات والموافقة عليها.",
      "إدارة بيانات الموظفين (إضافة، تعديل، حذف).",
      "عرض تقارير الحضور والإنتاجية.",
      "تنظيم الجداول الزمنية وتوزيع الأدوار.",
    ],
  },
  admin: {
    title: "المدير العام",
    icon: <FaUserShield className="text-3xl text-indigo-500 mb-4" />,
    description: [
      "إشراف كامل على النظام والبيانات.",
      "الوصول لجميع التقارير والإحصائيات.",
      "إدارة الصلاحيات وتوزيع المهام.",
      "تحليل الأداء العام وتصدير التقارير.",
    ],
  },
};

const UserRolesSection = () => {
  const [activeRole, setActiveRole] = useState("employee");
  const { darkMode } = useTheme();

  const sectionBg = darkMode ? "bg-gray-900" : "bg-white";
  const headingColor = darkMode ? "text-white" : "text-gray-800";
  const cardBg = darkMode ? "bg-gray-800" : "bg-gray-50";
  const cardText = darkMode ? "text-gray-300" : "text-gray-700";
  const buttonBase = darkMode
    ? "bg-gray-700 text-gray-200"
    : "bg-gray-200 text-gray-700";
  const activeButton = "bg-indigo-600 text-white";

  return (
    <section className={`${sectionBg} py-20`} dir="rtl">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className={`text-3xl md:text-4xl font-bold mb-10 ${headingColor}`}>
          ماذا يقدم النظام لكل دور؟
        </h2>

        {/* أزرار الأدوار */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {Object.keys(roles).map((key) => (
            <button
              key={key}
              onClick={() => setActiveRole(key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeRole === key ? activeButton : buttonBase
              }`}
            >
              {roles[key].title}
            </button>
          ))}
        </div>

        {/* بطاقة الدور */}
        <div
          className={`${cardBg} p-8 max-w-2xl mx-auto rounded-xl shadow-md text-right`}
        >
          <div className="flex items-center justify-center mb-4">
            {roles[activeRole].icon}
          </div>
          <ul className={`list-disc pr-5 space-y-2 ${cardText}`}>
            {roles[activeRole].description.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default UserRolesSection;
