import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import CreateDepartmentModal from "../../modals/CreateDepartmentModal";

// ✅ خيارات فلتر الحالة
const statusOptions = [
  { value: "", label: "كل الحالات" },
  { value: "active", label: "✅ فعال" },
  { value: "inactive", label: "🚫 غير فعال" },
];

const DepartmentsToolbar = ({ onSearch, onStatusFilter, onAddDepartment }) => {
  const { darkMode } = useTheme();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // ✅ تنفيذ البحث بتأخير لتقليل عدد الطلبات
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(searchTerm.trim());
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // ✅ تنسيق الإدخال
  const inputClass = `px-3 py-2 rounded-md border text-sm w-40 
    ${
      darkMode
        ? "bg-gray-800 text-white border-gray-600"
        : "bg-white text-gray-800 border-gray-300"
    }`;

  return (
    <section className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      {/* 🔍 الفلاتر */}
      <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
        {/* مربع البحث */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="ابحث باسم القسم"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 rounded-md border w-64 shadow-sm transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                  : "bg-white text-gray-800 border-gray-300 placeholder-gray-500"
              }`}
          />
        </div>

        {/* فلتر الحالة */}
        <select
          className={inputClass}
          onChange={(e) => {
            const selected = e.target.value;
            setSelectedStatus(selected);
            onStatusFilter(selected);
          }}
          value={selectedStatus}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* ➕ زر إضافة قسم جديد */}
      <button
        onClick={() => setShowAddModal(true)}
        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 
                   text-white px-5 py-2 rounded-md shadow-sm transition-all duration-200"
      >
        <FaBuilding className="text-base" />
        <span className="hidden sm:inline-block font-medium">إضافة قسم</span>
      </button>

      {/* نافذة إنشاء القسم */}
      <CreateDepartmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={(newDept) => {
          onAddDepartment(newDept); // نمرر بيانات القسم الجديد
          setShowAddModal(false);
        }}
      />
    </section>
  );
};

export default DepartmentsToolbar;
