import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import {
  FiEye,
  FiTrash2,
  FiEdit3,
  FiUsers,
  FiCalendar,
  FiLoader,
} from "react-icons/fi";
import DepartmentDetailsModal from "../../modals/DepartmentDetailsModal";
import EditDepartmentModal from "../../modals/EditDepartmentModal";
import ConfirmDeleteDepartmentModal from "../../modals/ConfirmDeleteDepartmentModal";

const DepartmentsTable = ({
  filters,
  reloadTrigger,
  departments,
  setDepartments,
  onUpdate,
}) => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const token = user?.token;

  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  const handleView = (dept) => {
    setSelectedDepartment(dept);
  };

  const closeModal = () => {
    setSelectedDepartment(null);
  };

  const handleDeleteSuccess = () => {
    onUpdate?.();
    toast.success("تم حذف القسم بنجاح! 🗑️");
  };

  const handleEditSuccess = () => {
    onUpdate?.();
    toast.success("تم تعديل القسم بنجاح! ✏️");
  };

  const fetchDepartments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/departments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            search: filters.search,
            status: filters.status,
          },
        }
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("فشل تحميل الأقسام", error);
      toast.error("فشل في تحميل الأقسام");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [filters.search, filters.status, reloadTrigger]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // مكون زر الإجراء
  const ActionButton = ({ icon, onClick, color, tooltip }) => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={tooltip}
      className={`p-2 rounded-lg transition-all duration-200 ${
        color === "blue"
          ? "text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
          : color === "yellow"
          ? "text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
          : color === "red"
          ? "text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
          : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      {icon}
    </motion.button>
  );

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div
        className={`rounded-xl border overflow-hidden ${
          darkMode
            ? "border-gray-700 bg-gray-800/50"
            : "border-gray-200 bg-white"
        } shadow-lg`}
      >
        {/* Table Header */}
        <div
          className={`px-6 py-4 border-b ${
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FiUsers className="text-green-500" />
            جدول الأقسام
            {departments.length > 0 && (
              <span
                className={`text-sm px-2 py-1 rounded-full ${
                  darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {departments.length} قسم
              </span>
            )}
          </h3>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <FiLoader className="w-8 h-8 text-green-500" />
              </motion.div>
              <span
                className={`ml-3 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                جاري تحميل الأقسام...
              </span>
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <FiUsers className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">لا توجد أقسام</h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                لم يتم العثور على أقسام مطابقة للبحث
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-medium">
                    اسم القسم
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium">
                    الوصف
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium">
                    عدد الموظفين
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium">
                    تاريخ الإنشاء
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {departments.map((dept, index) => (
                    <motion.tr
                      key={dept._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b transition-colors duration-200 hover:bg-opacity-50 ${
                        darkMode
                          ? "border-gray-700 hover:bg-gray-700"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                            <FiUsers className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="font-medium">{dept.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {dept.description || "لا يوجد وصف"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FiUsers className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">
                            {dept.employeeCount || 0} موظف
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            dept.isActive
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {dept.isActive ? "نشط" : "غير نشط"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <FiCalendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(dept.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <ActionButton
                            icon={<FiEye size={16} />}
                            onClick={() => handleView(dept)}
                            color="blue"
                            tooltip="عرض التفاصيل"
                          />
                          <ActionButton
                            icon={<FiEdit3 size={16} />}
                            onClick={() => setEditTarget(dept)}
                            color="yellow"
                            tooltip="تعديل القسم"
                          />
                          <ActionButton
                            icon={<FiTrash2 size={16} />}
                            onClick={() => setDeleteTarget(dept)}
                            color="red"
                            tooltip="حذف القسم"
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      <ConfirmDeleteDepartmentModal
        department={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        setDepartments={setDepartments}
        onSuccess={handleDeleteSuccess}
      />

      <EditDepartmentModal
        department={editTarget}
        onClose={() => setEditTarget(null)}
        setDepartments={setDepartments}
        onSuccess={handleEditSuccess}
      />

      <DepartmentDetailsModal
        department={selectedDepartment}
        onClose={closeModal}
      />
    </div>
  );
};

export default DepartmentsTable;
