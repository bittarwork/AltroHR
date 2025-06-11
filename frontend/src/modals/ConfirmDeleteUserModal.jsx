import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiTrash2,
  FiAlertTriangle,
  FiUser,
  FiMail,
  FiShield,
  FiMapPin,
} from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const ConfirmDeleteUserModal = ({ user, onClose, setUsers, showAlert }) => {
  const { darkMode } = useTheme();
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user || !authUser?.token) return;

    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        }
      );

      // تحديث القائمة بدون إعادة جلب من السيرفر
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
      showAlert("تم حذف المستخدم بنجاح ✅");

      onClose(); // إغلاق المودال
    } catch (err) {
      console.error("فشل حذف المستخدم:", err);
      showAlert("فشل في حذف المستخدم ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "مدير النظام";
      case "hr":
        return "موارد بشرية";
      case "employee":
        return "موظف";
      default:
        return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "red";
      case "hr":
        return "blue";
      case "employee":
        return "green";
      default:
        return "gray";
    }
  };

  if (!user) return null;

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
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                  <FiTrash2
                    className="text-red-600 dark:text-red-400"
                    size={20}
                  />
                </div>
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
                  تأكيد حذف المستخدم
                </h2>
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
            {/* Warning Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <FiAlertTriangle className="text-red-500 text-2xl" />
              </div>
            </motion.div>

            {/* Warning Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6"
            >
              <h3 className="text-lg font-semibold mb-2">
                هل أنت متأكد من حذف هذا المستخدم؟
              </h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بيانات المستخدم
                نهائياً.
              </p>
            </motion.div>

            {/* User Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`p-4 rounded-xl border ${
                darkMode
                  ? "border-gray-700 bg-gray-900/50"
                  : "border-gray-200 bg-gray-50"
              } mb-6`}
            >
              <div className="flex items-center space-x-3 space-x-reverse mb-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center bg-${getRoleColor(
                    user.role
                  )}-100 dark:bg-${getRoleColor(user.role)}-900/20`}
                >
                  <FiUser
                    className={`text-${getRoleColor(
                      user.role
                    )}-600 dark:text-${getRoleColor(user.role)}-400`}
                    size={20}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{user.name}</h4>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getRoleColor(
                      user.role
                    )}-100 dark:bg-${getRoleColor(
                      user.role
                    )}-900/20 text-${getRoleColor(
                      user.role
                    )}-600 dark:text-${getRoleColor(user.role)}-400`}
                  >
                    <FiShield className="ml-1 mr-0" size={12} />
                    {getRoleLabel(user.role)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div
                  className={`flex items-center space-x-2 space-x-reverse ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <FiMail size={14} />
                  <span>{user.email}</span>
                </div>
                {user.department?.name && (
                  <div
                    className={`flex items-center space-x-2 space-x-reverse ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <FiMapPin size={14} />
                    <span>{user.department.name}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex space-x-3 space-x-reverse"
            >
              <button
                onClick={onClose}
                disabled={loading}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
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
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse ${
                  loading
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                } text-white`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  <>
                    <FiTrash2 size={16} />
                    <span>تأكيد الحذف</span>
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmDeleteUserModal;
