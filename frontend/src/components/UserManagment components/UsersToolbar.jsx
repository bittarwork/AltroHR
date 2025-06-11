import React, { useEffect, useState } from "react";
import Select from "react-select";
import { FiSearch } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import axios from "axios";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import AddUserModal from "../../modals/AddUserModal";

// ✅ خيارات الفلاتر - الأدوار
const roleOptions = [
  { value: "", label: "جميع الأدوار" },
  { value: "admin", label: "مدير" },
  { value: "hr", label: "الموارد البشرية" },
  { value: "employee", label: "موظف" },
];

// ✅ خيارات الفلاتر - الحالة
const statusOptions = [
  { value: "", label: "كل الحالات" },
  { value: "active", label: "نشط" },
  { value: "inactive", label: "غير نشط" },
];

const UsersToolbar = ({
  onSearch,
  onRoleFilter,
  onDepartmentFilter,
  onStatusFilter,
  onAddUser,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const { darkMode } = useTheme();
  const { user } = useAuth();
  const token = user?.token;

  // ✅ تحميل الأقسام من الخادم
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/departments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const options = [
          { value: "", label: "كل الأقسام" },
          ...res.data.map((dep) => ({
            value: dep._id,
            label: dep.name,
          })),
        ];
        setDepartments(options);
      } catch (err) {
        console.error("فشل في تحميل الأقسام", err);
      }
    };

    if (token) fetchDepartments();
  }, [token]);

  // ✅ تأخير تنفيذ البحث لتقليل عدد الطلبات
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(searchTerm.trim());
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // ✅ تنسيق مخصص للقوائم المنسدلة حسب الوضع الليلي
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: darkMode ? "#1f2937" : "#fff",
      borderColor: state.isFocused
        ? "#6366f1"
        : darkMode
        ? "#374151"
        : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : "none",
      color: darkMode ? "#fff" : "#000",
    }),
    singleValue: (base) => ({
      ...base,
      color: darkMode ? "#fff" : "#000",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: darkMode ? "#1f2937" : "#fff",
      color: darkMode ? "#fff" : "#000",
    }),
  };

  return (
    <div className="w-full space-y-4">
      {/* الفلاتر */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          {/* مربع البحث */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو البريد"
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

          {/* فلتر الدور */}
          <Select
            options={roleOptions}
            placeholder="الدور"
            className="w-40 text-sm"
            styles={selectStyles}
            isClearable
            onChange={(selected) => {
              setSelectedRole(selected);
              onRoleFilter(selected?.value || "");
            }}
            value={selectedRole}
          />

          {/* فلتر القسم */}
          <Select
            options={departments}
            placeholder="القسم"
            className="w-48 text-sm"
            styles={selectStyles}
            isClearable
            onChange={(selected) => {
              setSelectedDepartment(selected);
              onDepartmentFilter(selected?.value || "");
            }}
            value={selectedDepartment}
          />

          {/* فلتر الحالة */}
          <Select
            options={statusOptions}
            placeholder="الحالة"
            className="w-40 text-sm"
            styles={selectStyles}
            isClearable
            onChange={(selected) => {
              setSelectedStatus(selected);
              onStatusFilter(selected?.value || "");
            }}
            value={selectedStatus}
          />
        </div>

        {/* زر إضافة مستخدم جديد */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 
                     text-white px-5 py-2 rounded-lg shadow-sm transition-all duration-200"
        >
          <FaUserPlus className="text-base" />
          <span className="hidden sm:inline-block font-medium">
            إضافة مستخدم
          </span>
        </button>
      </div>

      {/* نافذة إضافة المستخدم */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          onAddUser();
          setShowAddModal(false);
        }}
      />
    </div>
  );
};

export default UsersToolbar;
