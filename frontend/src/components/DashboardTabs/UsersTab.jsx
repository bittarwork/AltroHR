import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import UsersToolbar from "../UserManagment components/UsersToolbar";
import UsersTable from "../UserManagment components/UsersTable";
import { FiUsers, FiUserPlus, FiFilter, FiSearch } from "react-icons/fi";

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
    <div
      className={`p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg p-6`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div
                className={`p-3 rounded-xl ${
                  darkMode ? "bg-blue-900/20" : "bg-blue-100"
                }`}
              >
                <FiUsers className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  إدارة المستخدمين
                </h1>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  إدارة حسابات المستخدمين والصلاحيات والأقسام
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-6 space-x-reverse">
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  <FiUsers className="text-xl" />
                </div>
                <div
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  المستخدمين
                </div>
              </div>

              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  <FiUserPlus className="text-xl" />
                </div>
                <div
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  إضافة جديد
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Toolbar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg p-6`}
        >
          <div className="flex items-center space-x-3 space-x-reverse mb-4">
            <FiFilter
              className={`text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            />
            <h3
              className={`text-lg font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              البحث والفلترة
            </h3>
          </div>

          <UsersToolbar
            onSearch={(val) => setFilters((prev) => ({ ...prev, search: val }))}
            onRoleFilter={(val) =>
              setFilters((prev) => ({ ...prev, role: val }))
            }
            onDepartmentFilter={(val) =>
              setFilters((prev) => ({ ...prev, department: val }))
            }
            onStatusFilter={(val) =>
              setFilters((prev) => ({ ...prev, status: val }))
            }
            onAddUser={triggerReloadUsers}
          />
        </motion.div>

        {/* Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg overflow-hidden`}
        >
          <div
            className={`px-6 py-4 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              <FiSearch
                className={`text-lg ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <h3
                className={`text-lg font-medium ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                نتائج البحث
              </h3>
            </div>
          </div>

          <div className="p-0">
            <UsersTable filters={filters} reloadTrigger={reloadUsers} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UsersTab;
