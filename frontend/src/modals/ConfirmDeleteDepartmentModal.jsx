import React, { useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { HiExclamationCircle } from "react-icons/hi";

const ConfirmDeleteDepartmentModal = ({
  department,
  onClose,
  setDepartments,
}) => {
  const { darkMode } = useTheme();
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = async () => {
    if (!department || !authUser?.token) return;

    setLoading(true);
    setErrorMessage("");

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/departments/${department._id}`,
        {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        }
      );

      setDepartments((prev) => prev.filter((d) => d._id !== department._id));
      onClose();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "حدث خطأ غير متوقع أثناء محاولة حذف القسم.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  if (!department) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-transparent">
      <div
        className={`relative w-full max-w-md mx-auto rounded-xl shadow-xl transition-all p-6 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-xl text-gray-400 hover:text-red-500"
        >
          <FaTimes />
        </button>

        {/* العنوان */}
        <h2 className="text-center text-2xl font-bold text-red-600 mb-6">
          تأكيد حذف القسم
        </h2>

        {/* معلومات القسم */}
        <div className="space-y-4 text-sm">
          <div
            className={`border rounded-lg p-3 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <span className="font-semibold">اسم القسم:</span> {department.name}
          </div>

          <div
            className={`border rounded-lg p-3 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <span className="font-semibold">الوصف:</span>{" "}
            {department.description || "—"}
          </div>

          <div
            className={`border rounded-lg p-3 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <span className="font-semibold">الحالة:</span>{" "}
            {department.isActive ? "نشط" : "غير نشط"}
          </div>
        </div>

        {/* رسالة الخطأ */}
        {errorMessage && (
          <div
            className={`mt-5 flex items-start gap-2 text-sm px-4 py-3 rounded-md border ${
              darkMode
                ? "bg-red-900 text-red-100 border-red-700"
                : "bg-red-50 text-red-800 border-red-300"
            }`}
          >
            <HiExclamationCircle className="text-xl mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* أزرار الإجراءات */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            disabled={loading}
            className={`px-4 py-2 rounded text-sm font-medium ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            إلغاء
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`px-4 py-2 rounded text-sm font-medium text-white ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "جاري الحذف..." : "تأكيد الحذف"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteDepartmentModal;
