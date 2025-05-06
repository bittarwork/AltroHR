import React, { useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
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
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div
        className={`${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        } rounded-lg shadow-lg max-w-md w-full relative p-6`}
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-500 hover:text-red-500 text-lg"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold text-center mb-4 text-red-600">
          تأكيد حذف المستخدم
        </h2>

        {/* معلومات المستخدم */}
        <div className="text-sm space-y-2">
          <p>
            <span className="font-semibold">الاسم:</span> {user.name}
          </p>
          <p>
            <span className="font-semibold">البريد الإلكتروني:</span>{" "}
            {user.email}
          </p>
          <p>
            <span className="font-semibold">الدور:</span> {user.role}
          </p>
          <p>
            <span className="font-semibold">القسم:</span>{" "}
            {user.department?.name || "-"}
          </p>
        </div>

        {/* أزرار التحكم */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            disabled={loading}
          >
            إلغاء
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`px-4 py-2 rounded text-sm text-white ${
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

export default ConfirmDeleteUserModal;
