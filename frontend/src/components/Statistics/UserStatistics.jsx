import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

// أيقونات
import {
  FaUserTie,
  FaUserCheck,
  FaUserTimes,
  FaMoneyBillWave,
  FaClock,
  FaCalendarPlus,
  FaSitemap,
  FaBalanceScale,
} from "react-icons/fa";

const UserStatistics = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const token = user?.token;

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const all = res.data;
      const onlyEmployees = all.filter((u) => u.role === "employee");
      setEmployees(onlyEmployees);
    } catch (error) {
      console.error("خطأ أثناء جلب بيانات المستخدمين:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  if (loading) {
    return <p className="text-center">جاري تحميل الإحصائيات...</p>;
  }

  // إحصائيات
  const now = new Date();
  const activeCount = employees.filter((e) => e.isActive).length;
  const inactiveCount = employees.length - activeCount;
  const recentHires = employees.filter((e) => {
    const hire = new Date(e.hireDate);
    const diffDays = (now - hire) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  }).length;
  const uniqueDepartments = new Set(employees.map((e) => e.department?.name))
    .size;

  const statCards = [
    {
      title: "عدد الموظفين",
      value: employees.length,
      icon: <FaUserTie size={26} />,
    },
    {
      title: "الموظفون النشطون",
      value: activeCount,
      icon: <FaUserCheck size={26} />,
    },
    {
      title: "غير النشطين",
      value: inactiveCount,
      icon: <FaUserTimes size={26} />,
    },
    {
      title: "تم تعيينهم حديثًا",
      value: recentHires,
      icon: <FaCalendarPlus size={26} />,
    },
  ];

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-right ${
        darkMode ? "text-white" : "text-gray-900"
      }`}
      dir="rtl"
    >
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`flex flex-col justify-between rounded-lg p-6 shadow-md transition-transform transform hover:scale-105 ${
            darkMode
              ? "bg-gradient-to-br from-gray-800 to-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium">{card.title}</span>
            <span className="text-blue-500">{card.icon}</span>
          </div>
          <p className="text-3xl font-extrabold text-center">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default UserStatistics;
