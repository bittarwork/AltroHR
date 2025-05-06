import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import DepartmentsToolbar from "../DepartmentManagement/DepartmentsToolbar";
import DepartmentsTable from "../DepartmentManagement/DepartmentsTable";

const DepartmentTab = () => {
  const { darkMode } = useTheme();

  const [filters, setFilters] = useState({
    search: "",
    status: "", // active / inactive / all
  });
  const [departments, setDepartments] = useState([]);

  const [reloadDepartments, setReloadDepartments] = useState(false);

  const triggerReloadDepartments = () => {
    setReloadDepartments((prev) => !prev);
  };
  const handleAddDepartment = (newDepartment) => {
    setDepartments((prev) => [newDepartment, ...prev]); // إضافة القسم الجديد إلى الأعلى
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
        <h1 className="text-3xl font-bold mb-1">🏢 إدارة الأقسام</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          قم بإدارة الأقسام، إضافة قسم جديد، عرض الموظفين، وتعديل الحالة.
        </p>
      </header>

      {/* شريط الأدوات */}
      <DepartmentsToolbar
        onSearch={(val) => setFilters((prev) => ({ ...prev, search: val }))}
        onStatusFilter={(val) =>
          setFilters((prev) => ({ ...prev, status: val }))
        }
        onAddDepartment={handleAddDepartment}
      />

      {/* جدول عرض الأقسام */}
      <DepartmentsTable
        filters={filters}
        reloadTrigger={reloadDepartments}
        departments={departments}
        setDepartments={setDepartments}
      />
    </section>
  );
};

export default DepartmentTab;
