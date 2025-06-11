import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiPlus, FiHome } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import CreateDepartmentModal from "../../modals/CreateDepartmentModal";

// ✅ خيارات فلتر الحالة
const statusOptions = [
  { value: "", label: "جميع الحالات", icon: "🔄" },
  { value: "active", label: "نشط", icon: "✅" },
  { value: "inactive", label: "غير نشط", icon: "🚫" },
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
  }, [searchTerm, onSearch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
    >
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <FiSearch
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
            size={20}
          />
          <input
            type="text"
            placeholder="ابحث عن قسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
          />
        </div>

        {/* Status Filter */}
        <div className="relative w-full sm:w-48">
          <FiFilter
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
            size={18}
          />
          <select
            value={selectedStatus}
            onChange={(e) => {
              const selected = e.target.value;
              setSelectedStatus(selected);
              onStatusFilter(selected);
            }}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 appearance-none cursor-pointer ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 w-full sm:w-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex-1 sm:flex-none"
        >
          <FiPlus size={20} />
          <span>إضافة قسم</span>
        </motion.button>
      </div>

      {/* Add Department Modal */}
      <CreateDepartmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={(newDept) => {
          onAddDepartment(newDept);
          setShowAddModal(false);
        }}
      />
    </motion.div>
  );
};

export default DepartmentsToolbar;
