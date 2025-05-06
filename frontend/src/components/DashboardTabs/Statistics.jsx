import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

// Components
import UserStatistics from "../Statistics/UserStatistics";

const StatisticsPage = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 
      ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-slate-100 to-slate-200 text-gray-900"
      }`}
      dir="rtl"
    >
      <section className="px-4 py-6 sm:px-6 md:px-10 max-w-7xl mx-auto">
        {/* العنوان والوصف */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-1">📊 لوحة الاحصائيات</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            استعراض بيانات شاملة عن كامل النظام
          </p>
        </header>

        {/* قسم إحصائيات المستخدمين */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-r-4 pr-4 border-blue-500">
            إحصائيات المستخدمين
          </h2>
          <UserStatistics />
        </section>
      </section>
    </div>
  );
};

export default StatisticsPage;
