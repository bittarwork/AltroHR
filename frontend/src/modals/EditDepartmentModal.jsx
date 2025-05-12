import React, { useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { HiExclamationCircle } from "react-icons/hi";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const EditDepartmentModal = ({ department, onClose, setDepartments }) => {
  const { darkMode } = useTheme();
  const { user: authUser } = useAuth();

  const [name, setName] = useState(department.name || "");
  const [description, setDescription] = useState(department.description || "");
  const [isActive, setIsActive] = useState(department.isActive ?? true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdate = async () => {
    if (!name.trim()) {
      setErrorMessage("❌ الاسم مطلوب");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/departments/${department._id}`,
        { name, description, isActive },
        {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        }
      );

      setDepartments((prev) =>
        prev.map((dept) => (dept._id === department._id ? response.data : dept))
      );

      onClose();
    } catch (error) {
      const message = error.response?.data?.message || "❌ فشل تعديل القسم";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-colors duration-300 ${
        darkMode ? "bg-black/60" : "bg-black/30"
      }`}
    >
      <div
        className={`relative w-full max-w-md mx-auto rounded-xl shadow-xl transition-all p-6 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
        dir="rtl"
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-xl text-gray-400 hover:text-red-500"
        >
          <FaTimes />
        </button>

        {/* العنوان */}
        <h2 className="text-center text-2xl font-bold text-indigo-600 mb-6">
          تعديل بيانات القسم
        </h2>

        {/* رسالة الخطأ */}
        {errorMessage && (
          <div
            className={`mb-4 flex items-start gap-2 text-sm px-4 py-3 rounded-md border ${
              darkMode
                ? "bg-red-900 text-red-100 border-red-700"
                : "bg-red-50 text-red-800 border-red-300"
            }`}
          >
            <HiExclamationCircle className="text-xl mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* النموذج */}
        <div className="space-y-4 text-sm">
          <div>
            <label className="block mb-1 font-semibold">اسم القسم</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded px-3 py-2 text-sm border focus:outline-none ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">الوصف</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full rounded px-3 py-2 text-sm border focus:outline-none ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">الحالة</label>
            <select
              value={isActive ? "active" : "inactive"}
              onChange={(e) => setIsActive(e.target.value === "active")}
              className={`w-full rounded px-3 py-2 text-sm border focus:outline-none ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>
        </div>

        {/* الأزرار */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            إلغاء
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`px-4 py-2 rounded text-sm font-medium text-white ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "جاري التحديث..." : "حفظ التعديلات"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDepartmentModal;
