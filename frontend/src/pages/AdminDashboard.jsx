// لوحة التحكم الخاصة بالمدير
import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// استيراد التابات (الأقسام)
import UsersTab from "../components/DashboardTabs/UsersTab";
import DepartmentTab from "../components/DashboardTabs/DepartmentTab";
import Statistics from "../components/DashboardTabs/Statistics";
// ربط أسماء التابات بالمكونات الخاصة بها
const DashboardTabs = {
  users: UsersTab,
  department: DepartmentTab, // من الأفضل إبقاء المفاتيح بحروف صغيرة
};

const AdminDashboard = () => {
  const { darkMode } = useTheme();

  // التاب النشط حاليًا
  const [activeTab, setActiveTab] = useState("users");

  // تحديد الكومبوننت المناسب بناءً على التاب المختار
  const ActiveTabComponent = DashboardTabs[activeTab];

  return (
    <div
      dir="rtl"
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } min-h-screen flex flex-col mt-17`}
    >
      {/* الشريط العلوي */}
      <Navbar />

      {/* محتوى الصفحة */}
      <main className="flex-grow container mx-auto px-4 py-10 flex flex-col items-center">
        <h1 className="text-3xl font-semibold mb-8">لوحة تحكم المدير</h1>

        {/* أزرار التنقل بين التابات */}
        <nav className="flex space-x-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md">
          {Object.keys(DashboardTabs).map((tabKey) => (
            <button
              key={tabKey}
              className={`px-5 py-2 rounded-full transition-all duration-200 font-medium ${
                activeTab === tabKey
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab(tabKey)}
            >
              {/* تحويل الاسم لعرضه بشكل مقروء */}
              {tabKey === "users"
                ? "المستخدمون"
                : tabKey === "department"
                ? "الأقسام"
                : tabKey}
            </button>
          ))}
        </nav>

        {/* عرض محتوى التاب النشط */}
        <section className="w-full max-w-5xl mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          <ActiveTabComponent />
        </section>
      </main>

      {/* التذييل */}
      <Footer />
    </div>
  );
};

export default AdminDashboard;
