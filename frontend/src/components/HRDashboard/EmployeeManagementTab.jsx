import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import AddUserModal from "../../modals/AddUserModal";
import ViewUserDetailsModal from "../../modals/ViewUserDetailsModal";
import EditUserModal from "../../modals/EditUserModal";
import ConfirmDeleteUserModal from "../../modals/ConfirmDeleteUserModal";
import {
  FiUsers,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiUserCheck,
  FiUserX,
  FiMail,
  FiPhone,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
} from "react-icons/fi";

const EmployeeManagementTab = ({ onStatsUpdate }) => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadEmployees();
    loadDepartments();
  }, []);

  useEffect(() => {
    const filteredEmployees = filterEmployees();
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment, selectedRole]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const token = user?.token;
      if (!token) return;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEmployees(response.data || []);
      onStatsUpdate?.();
    } catch (error) {
      console.error("خطأ في تحميل الموظفين:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const token = user?.token;
      if (!token) return;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/departments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDepartments(response.data || []);
    } catch (error) {
      console.error("خطأ في تحميل الأقسام:", error);
    }
  };

  const filterEmployees = () => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        !selectedDepartment || employee.department?.name === selectedDepartment;
      const matchesRole = !selectedRole || employee.role === selectedRole;

      return matchesSearch && matchesDepartment && matchesRole;
    });
  };

  const toggleEmployeeStatus = async (employeeId, currentStatus) => {
    try {
      const token = user?.token;
      if (!token) return;

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${employeeId}/toggle-active`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === employeeId ? { ...emp, isActive: !currentStatus } : emp
        )
      );

      onStatsUpdate?.();
    } catch (error) {
      console.error("خطأ في تغيير حالة الموظف:", error);
    }
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleDeleteEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };

  const filteredEmployees = filterEmployees();
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            إدارة الموظفين
          </h2>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            إجمالي الموظفين: {filteredEmployees.length}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <FiPlus />
          إضافة موظف جديد
        </button>
      </div>

      {/* Filters */}
      <div
        className={`${
          darkMode ? "bg-gray-700" : "bg-gray-50"
        } rounded-lg p-4 mb-6`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder="البحث بالاسم أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pr-10 pl-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode
                ? "bg-gray-600 border-gray-500 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="">جميع الأقسام</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode
                ? "bg-gray-600 border-gray-500 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="">جميع الأدوار</option>
            <option value="admin">مدير</option>
            <option value="hr">موارد بشرية</option>
            <option value="employee">موظف</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={loadEmployees}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            تحديث
          </button>
        </div>
      </div>

      {/* Employees Table */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow overflow-hidden`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th
                  className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  الموظف
                </th>
                <th
                  className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  الدور
                </th>
                <th
                  className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  القسم
                </th>
                <th
                  className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  الحالة
                </th>
                <th
                  className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                darkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : currentEmployees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <FiUsers
                      className={`mx-auto h-12 w-12 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      } mb-4`}
                    />
                    <p
                      className={`text-lg font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      لا توجد موظفين
                    </p>
                  </td>
                </tr>
              ) : (
                currentEmployees.map((employee, index) => (
                  <motion.tr
                    key={employee._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`hover:${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    } transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-10 w-10 rounded-full ${
                            darkMode ? "bg-gray-600" : "bg-gray-200"
                          } flex items-center justify-center`}
                        >
                          <FiUsers
                            className={`h-5 w-5 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                        </div>
                        <div className="mr-4">
                          <div
                            className={`text-sm font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {employee.name}
                          </div>
                          <div
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.role === "admin"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : employee.role === "hr"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {employee.role === "admin"
                          ? "مدير"
                          : employee.role === "hr"
                          ? "موارد بشرية"
                          : "موظف"}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {employee.department?.name || "غير محدد"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          toggleEmployeeStatus(employee._id, employee.isActive)
                        }
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          employee.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800"
                        }`}
                      >
                        {employee.isActive ? (
                          <>
                            <FiUserCheck className="mr-1" size={12} />
                            نشط
                          </>
                        ) : (
                          <>
                            <FiUserX className="mr-1" size={12} />
                            غير نشط
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleViewEmployee(employee)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="عرض التفاصيل"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => handleEditEmployee(employee)}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                          title="تعديل"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="حذف"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className={`px-6 py-3 border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } flex items-center justify-between`}
          >
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              عرض {indexOfFirstEmployee + 1} إلى{" "}
              {Math.min(indexOfLastEmployee, filteredEmployees.length)} من{" "}
              {filteredEmployees.length} موظف
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                السابق
              </button>
              <span
                className={`px-3 py-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {currentPage} من {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <AddUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newUser) => {
            loadEmployees();
            setShowCreateModal(false);
          }}
        />
      )}

      {showDetailsModal && selectedEmployee && (
        <ViewUserDetailsModal
          userId={selectedEmployee._id}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedEmployee(null);
          }}
        />
      )}

      {showEditModal && selectedEmployee && (
        <EditUserModal
          userId={selectedEmployee._id}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEmployee(null);
          }}
          onSuccess={() => {
            loadEmployees();
            setShowEditModal(false);
            setSelectedEmployee(null);
          }}
        />
      )}

      {showDeleteModal && selectedEmployee && (
        <ConfirmDeleteUserModal
          user={selectedEmployee}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedEmployee(null);
          }}
          setUsers={setEmployees}
          showAlert={(message, type) => {
            console.log(message);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeManagementTab;
