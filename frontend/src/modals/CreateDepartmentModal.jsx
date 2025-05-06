import React, { useState } from "react";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const CreateDepartmentModal = ({ isOpen, onClose, onSuccess }) => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const token = user?.token;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("اسم القسم مطلوب");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/departments`,
        { name: name.trim(), description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSuccess(response.data); // تفعيل إعادة تحميل القائمة
      onClose(); // إغلاق المودال
    } catch (err) {
      if (err.response?.status === 400) {
        setError("يوجد قسم بهذا الاسم مسبقاً.");
      } else {
        setError("فشل في إنشاء القسم.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={`w-full max-w-md mx-auto rounded-lg shadow-lg p-6 
        ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}
      >
        <h2 className="text-xl font-semibold mb-4">➕ إنشاء قسم جديد</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* اسم القسم */}
          <div>
            <label className="block mb-1 text-sm font-medium">اسم القسم</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border text-sm 
              ${
                darkMode
                  ? "bg-gray-800 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
              placeholder="مثال: المحاسبة"
            />
          </div>

          {/* وصف القسم */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              الوصف (اختياري)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border text-sm resize-none 
              ${
                darkMode
                  ? "bg-gray-800 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
              rows={3}
              placeholder="مثال: هذا القسم مسؤول عن الشؤون المالية."
            ></textarea>
          </div>

          {/* رسالة الخطأ */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* الأزرار */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-sm rounded-md text-white 
              ${
                loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "جارٍ الحفظ..." : "حفظ القسم"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDepartmentModal;
