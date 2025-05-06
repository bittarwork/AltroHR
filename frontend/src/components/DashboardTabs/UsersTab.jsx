import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import UsersToolbar from "../UserManagment components/UsersToolbar";
import UsersTable from "../UserManagment components/UsersTable";

const UsersTab = () => {
  const { darkMode } = useTheme();

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    department: "",
    status: "",
  });

  // ✅ دوال التحكم الأساسية
  const handleViewUser = (user) => console.log("View", user);
  const handleEditUser = (user) => console.log("Edit", user);
  const handleDeleteUser = (userId) => console.log("Delete", userId);
  const handleToggleActive = (userId, isActive) =>
    console.log("Toggle Active", userId, isActive);

  return (
    <section
      className={`min-h-screen px-4 py-6 sm:px-6 md:px-10 transition-colors duration-300 
      ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-slate-100 to-slate-200"
      }`}
    >
      {/* العنوان والوصف */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1">👥 User Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage users, filter by roles or departments, and control status
          easily.
        </p>
      </header>

      {/* شريط التحكم */}

      <UsersToolbar
        onSearch={(val) => setFilters((prev) => ({ ...prev, search: val }))}
        onRoleFilter={(val) => setFilters((prev) => ({ ...prev, role: val }))}
        onDepartmentFilter={(val) =>
          setFilters((prev) => ({ ...prev, department: val }))
        }
        onStatusFilter={(val) =>
          setFilters((prev) => ({ ...prev, status: val }))
        }
        onAddUser={() => console.log("Open Add Modal")}
      />

      {/* جدول المستخدمين */}
      <UsersTable
        filters={filters}
        onViewUser={handleViewUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onToggleActive={handleToggleActive}
      />
    </section>
  );
};

export default UsersTab;
