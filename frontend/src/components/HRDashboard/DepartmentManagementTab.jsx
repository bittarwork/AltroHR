import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import CreateDepartmentModal from "../../modals/CreateDepartmentModal";
import EditDepartmentModal from "../../modals/EditDepartmentModal";
import DepartmentDetailsModal from "../../modals/DepartmentDetailsModal";
import ConfirmDeleteDepartmentModal from "../../modals/ConfirmDeleteDepartmentModal";
import {
  FiHome,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiUsers,
  FiFileText,
} from "react-icons/fi";

const DepartmentManagementTab = ({ onStatsUpdate }) => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [departmentsPerPage] = useState(8);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const token = user?.token;
      if (!token) return;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/departments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDepartments(response.data || []);
      onStatsUpdate?.();
    } catch (error) {
      console.error("خطأ في تحميل الأقسام:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDepartment = (department) => {
    setSelectedDepartment(department);
    setShowDetailsModal(true);
  };

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setShowEditModal(true);
  };

  const handleDeleteDepartment = (department) => {
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastDepartment = currentPage * departmentsPerPage;
  const indexOfFirstDepartment = indexOfLastDepartment - departmentsPerPage;
  const currentDepartments = filteredDepartments.slice(
    indexOfFirstDepartment,
    indexOfLastDepartment
  );
  const totalPages = Math.ceil(filteredDepartments.length / departmentsPerPage);

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
            إدارة الأقسام
          </h2>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            إجمالي الأقسام: {filteredDepartments.length}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          <FiPlus />
          إضافة قسم جديد
        </button>
      </div>

      {/* Search and Refresh */}
      <div
        className={`${
          darkMode ? "bg-gray-700" : "bg-gray-50"
        } rounded-lg p-4 mb-6`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative col-span-2">
            <FiSearch
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder="البحث بالاسم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pr-10 pl-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadDepartments}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            تحديث
          </button>
        </div>
      </div>

      {/* Departments Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : currentDepartments.length === 0 ? (
        <div className="text-center py-20">
          <FiHome
            className={`mx-auto h-12 w-12 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            } mb-4`}
          />
          <p
            className={`text-lg font-medium ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            لا توجد أقسام
          </p>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-500" : "text-gray-400"
            } mt-2`}
          >
            {searchTerm ? "لا توجد نتائج للبحث" : "ابدأ بإضافة قسم جديد"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentDepartments.map((department, index) => (
            <motion.div
              key={department._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg border ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } overflow-hidden hover:shadow-xl transition-all duration-300 group`}
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 group-hover:scale-110 transition-transform">
                    <FiHome className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <button
                      onClick={() => handleViewDepartment(department)}
                      className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      title="عرض التفاصيل"
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={() => handleEditDepartment(department)}
                      className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                      title="تعديل"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteDepartment(department)}
                      className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      title="حذف"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3
                  className={`text-xl font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {department.name}
                </h3>

                {department.description && (
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-4 line-clamp-2`}
                  >
                    {department.description}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {department.employeeCount || 0}
                    </div>
                    <div
                      className={`text-xs flex items-center justify-center gap-1 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <FiUsers size={12} />
                      الموظفين
                    </div>
                  </div>

                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {new Date(department.createdAt).getFullYear()}
                    </div>
                    <div
                      className={`text-xs flex items-center justify-center gap-1 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <FiFileText size={12} />
                      سنة الإنشاء
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div
                className={`px-6 py-3 border-t ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                    نشط
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 1
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              السابق
            </button>

            <div className="flex items-center space-x-2 space-x-reverse">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? "bg-green-600 text-white"
                        : darkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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

      {/* Modals */}
      {showCreateModal && (
        <CreateDepartmentModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newDept) => {
            loadDepartments();
            setShowCreateModal(false);
          }}
        />
      )}

      {showDetailsModal && selectedDepartment && (
        <DepartmentDetailsModal
          department={selectedDepartment}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedDepartment(null);
          }}
        />
      )}

      {showEditModal && selectedDepartment && (
        <EditDepartmentModal
          department={selectedDepartment}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedDepartment(null);
          }}
          onSuccess={() => {
            loadDepartments();
            setShowEditModal(false);
            setSelectedDepartment(null);
          }}
        />
      )}

      {showDeleteModal && selectedDepartment && (
        <ConfirmDeleteDepartmentModal
          department={selectedDepartment}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedDepartment(null);
          }}
          setDepartments={setDepartments}
          onSuccess={() => {
            loadDepartments();
            setShowDeleteModal(false);
            setSelectedDepartment(null);
          }}
        />
      )}
    </div>
  );
};

export default DepartmentManagementTab;
