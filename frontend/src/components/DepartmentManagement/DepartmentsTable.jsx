import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { FaInfoCircle, FaTrash, FaEdit } from "react-icons/fa";
import DepartmentDetailsModal from "../../modals/DepartmentDetailsModal";
import EditDepartmentModal from "../../modals/EditDepartmentModal";
import ConfirmDeleteDepartmentModal from "../../modals/ConfirmDeleteDepartmentModal";
const DepartmentsTable = ({
  filters,
  reloadTrigger,
  departments,
  setDepartments,
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
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/departments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // حذف القسم من القائمة محلياً
      setDepartments((prev) => prev.filter((dept) => dept._id !== id));
    } catch (error) {
      console.error("فشل حذف القسم", error);
    }
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [filters.search, filters.status, reloadTrigger]);

  return (
    <div
      className={`w-full rounded-xl p-4 shadow-lg overflow-x-auto transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h2 className="text-lg text-center font-semibold mb-4">
        📋 جدول الأقسام
      </h2>

      {loading ? (
        <div className="text-center py-10 text-gray-400">
          ⏳ جاري التحميل...
        </div>
      ) : departments.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <FaInfoCircle className="inline mb-1 mr-1" /> لا توجد أقسام مطابقة.
        </div>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-indigo-600 text-white text-sm">
              <th className="py-2 px-4 text-right">الاسم</th>
              <th className="py-2 px-4 text-right">الوصف</th>
              <th className="py-2 px-4 text-right">الحالة</th>
              <th className="py-2 px-4 text-right">تاريخ الإنشاء</th>
              <th className="py-2 px-4 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, idx) => (
              <tr
                key={dept._id}
                className={`text-sm ${
                  idx % 2 === 0
                    ? darkMode
                      ? "bg-gray-800"
                      : "bg-slate-50"
                    : ""
                }`}
              >
                <td className="py-2 px-4">{dept.name}</td>
                <td className="py-2 px-4 text-sm text-gray-500 dark:text-gray-300">
                  {dept.description || "—"}
                </td>
                <td className="py-2 px-4">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      dept.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {dept.isActive ? "نشط" : "غير نشط"}
                  </span>
                </td>
                <td className="py-2 px-4">
                  {new Date(dept.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 flex gap-2 justify-end">
                  <IconButton
                    title="عرض"
                    color="blue"
                    icon={<FaInfoCircle />}
                    onClick={() => handleView(dept)}
                  />
                  <IconButton
                    title="حذف"
                    color="red"
                    icon={<FaTrash />}
                    onClick={() => setDeleteTarget(dept)}
                  />
                  <IconButton
                    title="تعديل"
                    color="yellow"
                    icon={<FaEdit />}
                    onClick={() => setEditTarget(dept)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {deleteTarget && (
        <ConfirmDeleteDepartmentModal
          department={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          setDepartments={setDepartments}
          showAlert={(msg) => alert(msg)} // يمكن استبداله بـ toast لاحقاً
        />
      )}

      {editTarget && (
        <EditDepartmentModal
          department={editTarget}
          onClose={() => setEditTarget(null)}
          setDepartments={setDepartments}
          showAlert={(msg) => alert(msg)} // يمكن استبداله بـ toast لاحقاً
        />
      )}

      {selectedDepartment && (
        <DepartmentDetailsModal
          department={selectedDepartment}
          onClose={closeModal}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default DepartmentsTable;

// ✅ زر أيقونة قابل لإعادة الاستخدام
const IconButton = ({ icon, onClick, title, color = "blue" }) => {
  const base = {
    blue: "text-blue-500 hover:text-blue-700",
    yellow: "text-yellow-500 hover:text-yellow-700",
    red: "text-red-500 hover:text-red-700",
    indigo: "text-indigo-500 hover:text-indigo-700",
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-full transition ${base[color]}`}
    >
      {icon}
    </button>
  );
};
