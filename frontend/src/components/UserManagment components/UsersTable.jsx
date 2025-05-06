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

const UsersTable = ({
  filters,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onToggleActive,
}) => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const token = user?.token;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUsers();
  }, [token, filters.search, filters.role, filters.department, filters.status]);

  return (
    <div
      className={`w-full rounded-xl p-4 shadow-lg ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h2 className="text-lg font-semibold mb-4">User Management</h2>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No users found.</div>
      ) : (
        <div
          className={`grid gap-4 transition-all ${
            users.length > 7 ? "max-h-[480px] overflow-y-auto pr-2" : ""
          } grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`}
        >
          {users.map((user) => (
            <div
              key={user._id}
              className={`rounded-xl border p-4 shadow-sm hover:shadow-md transition ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-md font-semibold">{user.name}</h3>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    user.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                📧 {user.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                🧑‍💼 Role: <span className="capitalize">{user.role}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                🏢 Dept: {user.department?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                📌 Position: {user.position || "-"}
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <IconButton
                  color="blue"
                  onClick={() => onViewUser(user)}
                  icon={<FaEye />}
                  title="View"
                />
                <IconButton
                  color="yellow"
                  onClick={() => onEditUser(user)}
                  icon={<FaEdit />}
                  title="Edit"
                />
                <IconButton
                  color="red"
                  onClick={() => onDeleteUser(user._id)}
                  icon={<FaTrash />}
                  title="Delete"
                />
                <IconButton
                  color="indigo"
                  onClick={() => onToggleActive(user._id, user.isActive)}
                  icon={user.isActive ? <FaToggleOn /> : <FaToggleOff />}
                  title={user.isActive ? "Deactivate" : "Activate"}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersTable;

// 🧩 زر أيقونة موحّد بتصميم عصري
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
