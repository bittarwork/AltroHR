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
  const [reloadUsers, setReloadUsers] = useState(false);

  const triggerReloadUsers = () => {
    setReloadUsers((prev) => !prev); // يسبب إعادة تحميل المستخدمين
  };

  return (
    <section
      className={`px-4 py-6 sm:px-6 md:px-10 transition-colors duration-300 
      ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-slate-100 to-slate-200"
      }`}
    >
      {/* العنوان والوصف */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-1">👥 إدارة المستخدمين</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          قم بإدارة المستخدمين، الفلترة حسب الدور أو القسم، والتحكم بالحالة
          بسهولة.
        </p>
      </header>

      {/* شريط الأدوات */}
      <UsersToolbar
        onSearch={(val) => setFilters((prev) => ({ ...prev, search: val }))}
        onRoleFilter={(val) => setFilters((prev) => ({ ...prev, role: val }))}
        onDepartmentFilter={(val) =>
          setFilters((prev) => ({ ...prev, department: val }))
        }
        onStatusFilter={(val) =>
          setFilters((prev) => ({ ...prev, status: val }))
        }
        onAddUser={triggerReloadUsers}
      />

      {/* جدول المستخدمين */}
      <UsersTable filters={filters} reloadTrigger={reloadUsers} />
    </section>
  );
};

export default UsersTab;
