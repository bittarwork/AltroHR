import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiSave,
  FiHome,
  FiFileText,
  FiPlus,
  FiBuilding,
} from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const CreateDepartmentModal = ({ isOpen, onClose, onSuccess }) => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const token = user?.token;

  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("اسم القسم مطلوب");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/departments`,
        {
          name: form.name.trim(),
          description: form.description.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("تم إنشاء القسم بنجاح! 🎉");
      onSuccess(response.data);
      onClose();

      // إعادة تعيين النموذج
      setForm({
        name: "",
        description: "",
      });
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("يوجد قسم بهذا الاسم مسبقاً");
      } else {
        toast.error("فشل في إنشاء القسم");
      }
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon: Icon, label, children, required = false }) => (
    <div className="space-y-2">
      <label
        className={`flex items-center space-x-2 space-x-reverse text-sm font-medium ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        <Icon className="text-green-500" size={16} />
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
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
            className={`w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
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
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <FiPlus
                      className="text-green-600 dark:text-green-400"
                      size={20}
                    />
                  </div>
                  <h2 className="text-xl font-bold">إنشاء قسم جديد</h2>
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
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Department Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-xl border ${
                    darkMode
                      ? "border-gray-700 bg-gray-900/50"
                      : "border-gray-200 bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse mb-6">
                    <FiBuilding className="text-green-500" size={20} />
                    <h3 className="text-lg font-semibold">معلومات القسم</h3>
                  </div>

                  <div className="space-y-6">
                    <InputField icon={FiBuilding} label="اسم القسم" required>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                        placeholder="مثال: قسم التطوير"
                      />
                    </InputField>

                    <InputField icon={FiFileText} label="وصف القسم">
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                        placeholder="وصف مختصر عن القسم ومسؤولياته..."
                      />
                    </InputField>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`flex justify-end gap-3 pt-6 border-t ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <button
                    type="button"
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
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 space-x-reverse ${
                      loading
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white`}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiSave size={16} />
                    )}
                    <span>{loading ? "جاري الإنشاء..." : "إنشاء القسم"}</span>
                  </button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateDepartmentModal;
