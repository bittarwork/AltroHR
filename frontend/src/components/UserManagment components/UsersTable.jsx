import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import ConfirmDeleteUserModal from "../../modals/ConfirmDeleteUserModal";
import AlertMessage from "../AlertMessage";
import ViewUserDetailsModal from "../../modals/ViewUserDetailsModal";
import EditUserModal from "../../modals/EditUserModal";
const USERS_PER_PAGE = 10;

const UsersTable = ({ filters, reloadTrigger }) => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const token = user?.token;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState(null);
  const [alert, setAlert] = useState(null);
  const [viewUserId, setViewUserId] = useState(null);
  const [editUserId, setEditUserId] = useState(null);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (filters.search) params.append("q", filters.search);
    if (filters.role) params.append("role", filters.role);
    if (filters.department) params.append("departmentId", filters.department);
    if (filters.status) {
      params.append("isActive", filters.status === "active" ? "true" : "false");
    }
    return params.toString();
  };
  const showAlert = (msg, type = "success") => {
    setAlert({ message: msg, type });
  };
  const onToggleActive = async (userId, currentStatus) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/user/${userId}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: !currentStatus } : u
        )
      );

      showAlert(`تم ${currentStatus ? "تعطيل" : "تفعيل"} المستخدم بنجاح ✅`);
    } catch (err) {
      console.error("فشل التبديل:", err);
      showAlert("فشل في تحديث حالة المستخدم ❌", "error");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user?${buildQuery()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(res.data);
        setCurrentPage(1);
      } catch (err) {
        console.error("فشل في جلب المستخدمين:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUsers();
  }, [
    token,
    filters.search,
    filters.role,
    filters.department,
    filters.status,
    reloadTrigger,
  ]);

  // تحديد البيانات المعروضة في الصفحة الحالية
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div
      className={`w-full rounded-xl p-4 shadow-lg overflow-x-auto ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h2 className="text-lg text-center font-semibold mb-4">
        جدول كامل المستخدمين
      </h2>

      {loading ? (
        <div className="text-center py-10 text-gray-400">جاري التحميل...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-10 text-gray-400">لا يوجد مستخدمين.</div>
      ) : (
        <>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-indigo-600 text-white text-sm">
                <th className="py-2 px-4 text-right">الاسم</th>
                <th className="py-2 px-4 text-right">البريد الإلكتروني</th>
                <th className="py-2 px-4 text-right">الدور</th>
                <th className="py-2 px-4 text-right">القسم</th>
                <th className="py-2 px-4 text-right">المنصب</th>
                <th className="py-2 px-4 text-right">الحالة</th>
                <th className="py-2 px-4 text-right">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, idx) => (
                <tr
                  key={user._id}
                  className={`text-sm ${
                    idx % 2 === 0
                      ? darkMode
                        ? "bg-gray-800"
                        : "bg-slate-50"
                      : ""
                  }`}
                >
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4 capitalize">{user.role}</td>
                  <td className="py-2 px-4">{user.department?.name || "-"}</td>
                  <td className="py-2 px-4">{user.position || "-"}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        user.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {user.isActive ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="py-2 px-4 flex gap-2 justify-end">
                    <IconButton
                      color="blue"
                      onClick={() => setViewUserId(user._id)}
                      icon={<FaEye />}
                      title="عرض"
                    />

                    <IconButton
                      color="yellow"
                      onClick={() => setEditUserId(user._id)}
                      icon={<FaEdit />}
                      title="تعديل"
                    />

                    <IconButton
                      color="red"
                      onClick={() => setUserToDelete(user)}
                      icon={<FaTrash />}
                      title="حذف"
                    />

                    <IconButton
                      color="indigo"
                      onClick={() => onToggleActive(user._id, user.isActive)}
                      icon={user.isActive ? <FaToggleOn /> : <FaToggleOff />}
                      title={user.isActive ? "تعطيل" : "تفعيل"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-4 text-center">
            عرض {indexOfFirstUser + 1} -{" "}
            {Math.min(indexOfLastUser, users.length)} من أصل {users.length}{" "}
            مستخدم
          </div>

          {/* ✅ أزرار التصفح */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-1 flex-wrap">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1 rounded border text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                disabled={currentPage === 1}
              >
                السابق
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded border text-sm ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1 rounded border text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                disabled={currentPage === totalPages}
              >
                التالي
              </button>
            </div>
          )}
        </>
      )}
      {userToDelete && (
        <ConfirmDeleteUserModal
          user={userToDelete}
          onClose={() => setUserToDelete(null)}
          setUsers={setUsers}
          showAlert={showAlert}
        />
      )}
      {viewUserId && (
        <ViewUserDetailsModal
          userId={viewUserId}
          onClose={() => setViewUserId(null)}
        />
      )}
      {editUserId && (
        <EditUserModal
          userId={editUserId}
          isOpen={true}
          onClose={() => setEditUserId(null)}
          onSuccess={(updatedUser) => {
            showAlert("تم تعديل المستخدم بنجاح ✅");
            setEditUserId(null);
          }}
        />
      )}

      {alert && (
        <div className="flex justify-center mb-4">
          <AlertMessage
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        </div>
      )}
    </div>
  );
};

export default UsersTable;

// ✅ زر الأيقونة
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
