import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiEye,
  FiHome,
  FiFileText,
  FiCalendar,
  FiUsers,
  FiToggleLeft,
  FiToggleRight,
  FiLoader,
  FiClock,
} from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const DepartmentDetailsModal = ({ department, onClose }) => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employeesLoaded, setEmployeesLoaded] = useState(false);

  // جلب الموظفين في القسم
  const fetchEmployees = async () => {
    if (!department?._id || employeesLoaded) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/departments/${
          department._id
        }/users`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      setEmployees(response.data);
      setEmployeesLoaded(true);
    } catch (error) {
      console.error("فشل في جلب موظفي القسم:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (department) {
      fetchEmployees();
    }
  }, [department]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const DataField = ({ icon: Icon, label, value, children }) => (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 flex-shrink-0">
        <Icon className="text-green-600 dark:text-green-400" size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-sm font-medium mb-1 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {label}
        </div>
        <div className="text-base font-medium">{children || value}</div>
      </div>
    </div>
  );

  if (!department) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`w-full max-w-2xl mx-4 rounded-2xl shadow-2xl ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          } max-h-[80vh] overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <FiEye
                    className="text-green-600 dark:text-green-400"
                    size={20}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">تفاصيل القسم</h2>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    معلومات شاملة عن القسم
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
            <div className="space-y-6">
              {/* Department Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-xl border ${
                  darkMode
                    ? "border-gray-700 bg-gray-900/50"
                    : "border-gray-200 bg-gray-50/50"
                } text-center`}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <FiHome
                    className="text-green-600 dark:text-green-400"
                    size={32}
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">{department.name}</h3>
                <div className="flex items-center justify-center gap-2">
                  {department.isActive ? (
                    <FiToggleRight className="text-green-500" size={20} />
                  ) : (
                    <FiToggleLeft className="text-red-500" size={20} />
                  )}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      department.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                  >
                    {department.isActive ? "قسم نشط" : "قسم غير نشط"}
                  </span>
                </div>
              </motion.div>

              {/* Department Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-6 rounded-xl border ${
                  darkMode
                    ? "border-gray-700 bg-gray-900/50"
                    : "border-gray-200 bg-gray-50/50"
                }`}
              >
                <div className="flex items-center space-x-3 space-x-reverse mb-6">
                  <FiFileText className="text-green-500" size={20} />
                  <h3 className="text-lg font-semibold">معلومات القسم</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DataField
                    icon={FiHome}
                    label="اسم القسم"
                    value={department.name}
                  />

                  <DataField
                    icon={FiUsers}
                    label="عدد الموظفين"
                    value={`${department.employeeCount || 0} موظف`}
                  />

                  <DataField
                    icon={FiCalendar}
                    label="تاريخ الإنشاء"
                    value={formatDate(department.createdAt)}
                  />

                  <DataField
                    icon={FiClock}
                    label="آخر تحديث"
                    value={formatDate(department.updatedAt)}
                  />

                  <div className="md:col-span-2">
                    <DataField
                      icon={FiFileText}
                      label="وصف القسم"
                      value={department.description || "لا يوجد وصف"}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Employees Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`p-6 rounded-xl border ${
                  darkMode
                    ? "border-gray-700 bg-gray-900/50"
                    : "border-gray-200 bg-gray-50/50"
                }`}
              >
                <div className="flex items-center space-x-3 space-x-reverse mb-6">
                  <FiUsers className="text-green-500" size={20} />
                  <h3 className="text-lg font-semibold">موظفو القسم</h3>
                  {employees.length > 0 && (
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        darkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {employees.length} موظف
                    </span>
                  )}
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <FiLoader className="w-6 h-6 text-green-500 animate-spin" />
                    <span
                      className={`ml-3 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      جاري تحميل الموظفين...
                    </span>
                  </div>
                ) : employees.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <FiUsers className="w-6 h-6 text-gray-400" />
                    </div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      لا يوجد موظفين في هذا القسم حالياً
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {employees.map((employee, index) => (
                      <motion.div
                        key={employee._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-3 rounded-lg border ${
                          darkMode
                            ? "border-gray-600 bg-gray-700/50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                            <FiUsers className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DepartmentDetailsModal;
