import React, { useEffect, useState } from "react";
import Select from "react-select";
import { FiSearch } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import axios from "axios";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import AddUserModal from "../../modals/AddUserModal";

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "hr", label: "HR" },
  { value: "employee", label: "Employee" },
];

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
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
          { value: "", label: "All Departments" },
          ...res.data.map((dep) => ({
            value: dep._id,
            label: dep.name,
          })),
        ];
        setDepartments(options);
      } catch (err) {
        console.error("Failed to fetch departments", err);
      }
    };

    if (token) fetchDepartments();
  }, [token]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(searchTerm.trim());
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // ✅ تنسيق خاص لـ react-select حسب الوضع الليلي
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
    <section className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      {/* 🔍 الفلاتر */}
      <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
        {/* Search input */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email"
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

        {/* Role filter */}
        <Select
          options={roleOptions}
          placeholder="Role"
          className="w-40 text-sm"
          styles={selectStyles}
          isClearable
          onChange={(selected) => {
            setSelectedRole(selected);
            onRoleFilter(selected?.value || "");
          }}
          value={selectedRole}
        />

        {/* Department filter */}
        <Select
          options={departments}
          placeholder="Department"
          className="w-48 text-sm"
          styles={selectStyles}
          isClearable
          onChange={(selected) => {
            setSelectedDepartment(selected);
            onDepartmentFilter(selected?.value || "");
          }}
          value={selectedDepartment}
        />

        {/* Status filter */}
        <Select
          options={statusOptions}
          placeholder="Status"
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

      {/* ➕ زر إضافة مستخدم */}
      <button
        onClick={() => setShowAddModal(true)}
        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 
                   text-white px-5 py-2 rounded-md shadow-sm transition-all duration-200"
      >
        <FaUserPlus className="text-base" />
        <span className="hidden sm:inline-block font-medium">Add User</span>
      </button>
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          // إعادة تحميل المستخدمين أو تحديث الجدول حسب الحاجة
        }}
      />
    </section>
  );
};

export default UsersToolbar;
