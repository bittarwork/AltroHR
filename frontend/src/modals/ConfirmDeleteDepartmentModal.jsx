import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiTrash2,
  FiAlertTriangle,
  FiHome,
  FiFileText,
  FiToggleLeft,
  FiToggleRight,
  FiUsers,
} from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const ConfirmDeleteDepartmentModal = ({
  department,
  onClose,
  setDepartments,
  onSuccess,
}) => {
  const { darkMode } = useTheme();
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!department || !authUser?.token) return;

    setLoading(true);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/departments/${department._id}`,
        {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        }
      );

      // تحديث القائمة محلياً
      setDepartments((prev) => prev.filter((d) => d._id !== department._id));

      toast.success("تم حذف القسم بنجاح! 🗑️");
      onSuccess?.();
      onClose();
    } catch (err) {
      const message = err.response?.data?.message || "حدث خطأ أثناء حذف القسم";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

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
          className={`w-full max-w-md mx-4 rounded-2xl shadow-2xl ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
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
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20"
                >
                  <FiTrash2
                    className="text-red-600 dark:text-red-400"
                    size={20}
                  />
                </motion.div>
                <h2 className="text-xl font-bold">حذف القسم</h2>
              </div>

              <button
                onClick={onClose}
                disabled={loading}
                className={`p-2 rounded-lg transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                } ${
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
          <div className="p-6">
            {/* Warning Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 mb-6`}
            >
              <div className="flex items-center space-x-3 space-x-reverse mb-3">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <FiAlertTriangle
                    className="text-red-600 dark:text-red-400"
                    size={24}
                  />
                </motion.div>
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">
                  تحذير: حذف دائم
                </h3>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">
                سيتم حذف هذا القسم نهائياً ولا يمكن التراجع عن هذا الإجراء. تأكد
                من أن هذا القسم لا يحتوي على موظفين.
              </p>
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
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <FiHome className="text-red-500" size={20} />
                <h3 className="text-lg font-semibold">
                  معلومات القسم المراد حذفه
                </h3>
              </div>

              <div className="space-y-4">
                {/* Department Name */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 flex-shrink-0">
                    <FiHome
                      className="text-red-600 dark:text-red-400"
                      size={16}
                    />
                  </div>
                  <div>
                    <div
                      className={`text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      اسم القسم
                    </div>
                    <div className="text-base font-bold text-red-600 dark:text-red-400">
                      {department.name}
                    </div>
                  </div>
                </div>

                {/* Department Description */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 flex-shrink-0">
                    <FiFileText
                      className="text-red-600 dark:text-red-400"
                      size={16}
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className={`text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      وصف القسم
                    </div>
                    <div className="text-sm">
                      {department.description || "لا يوجد وصف"}
                    </div>
                  </div>
                </div>

                {/* Department Status & Employee Count */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                      {department.isActive ? (
                        <FiToggleRight
                          className="text-red-600 dark:text-red-400"
                          size={16}
                        />
                      ) : (
                        <FiToggleLeft
                          className="text-red-600 dark:text-red-400"
                          size={16}
                        />
                      )}
                    </div>
                    <div>
                      <div
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        الحالة
                      </div>
                      <div className="text-sm font-medium">
                        {department.isActive ? "نشط" : "غير نشط"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                      <FiUsers
                        className="text-red-600 dark:text-red-400"
                        size={16}
                      />
                    </div>
                    <div>
                      <div
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        الموظفين
                      </div>
                      <div className="text-sm font-medium">
                        {department.employeeCount || 0} موظف
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`flex justify-end gap-3 pt-6 border-t ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } mt-6`}
            >
              <button
                onClick={onClose}
                disabled={loading}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                إلغاء
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 space-x-reverse ${
                  loading
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                } text-white`}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiTrash2 size={16} />
                )}
                <span>{loading ? "جاري الحذف..." : "تأكيد الحذف"}</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmDeleteDepartmentModal;
