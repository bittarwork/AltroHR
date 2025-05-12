import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

// Icons
import { FaSitemap, FaToggleOn, FaToggleOff } from "react-icons/fa";

const DepartmentStatistics = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const token = user?.token;

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/departments/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDepartments(res.data || []);
    } catch (error) {
      console.error("فشل في جلب بيانات الأقسام:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDepartments();
  }, [token]);

  if (loading) {
    return <p className="text-center">جاري تحميل الإحصائيات...</p>;
  }

  // إحصائيات
  const total = departments.length;
  const active = departments.filter((d) => d.isActive).length;
  const inactive = total - active;

  const statCards = [
    {
      title: "عدد الأقسام",
      value: total,
      icon: <FaSitemap size={26} />,
    },
    {
      title: "الأقسام النشطة",
      value: active,
      icon: <FaToggleOn size={26} />,
    },
    {
      title: "الأقسام المعطلة",
      value: inactive,
      icon: <FaToggleOff size={26} />,
    },
  ];

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-right ${
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

export default DepartmentStatistics;
