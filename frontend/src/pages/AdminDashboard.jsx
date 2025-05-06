// AdminDashboard.jsx
import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// استيراد المكونات بشكل منفصل
import UsersTab from "../components/DashboardTabs/UsersTab";
import DepartmentTab from "../components/DashboardTabs/DepartmentTab";

// ربط التابات مع مكوناتها
const DashboardTabs = {
  users: UsersTab,
  department: DepartmentTab, // الأفضل استخدام lowercase للمفتاح
};

const AdminDashboard = () => {
  const { darkMode } = useTheme();

  // اجعل القيمة الابتدائية مطابقة لأحد المفاتيح
  const [activeTab, setActiveTab] = useState("users");

  // استدعاء المكون المرتبط بالتاب
  const ActiveTabComponent = DashboardTabs[activeTab];

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } min-h-screen flex flex-col mt-17`}
    >
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-10 flex flex-col items-center">
        <h1 className="text-3xl font-semibold mb-8">Admin Dashboard</h1>

        {/* أزرار التابات */}
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
              {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
            </button>
          ))}
        </nav>

        {/* محتوى التاب النشط */}
        <section className="w-full max-w-5xl mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          <ActiveTabComponent />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
