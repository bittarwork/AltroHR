import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import DepartmentsToolbar from "../DepartmentManagement/DepartmentsToolbar";
import DepartmentsTable from "../DepartmentManagement/DepartmentsTable";
import axios from "axios";

// Icons
import { FaSitemap, FaToggleOn, FaToggleOff, FaUsers } from "react-icons/fa";

const DepartmentTab = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const token = user?.token;

  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [reloadDepartments, setReloadDepartments] = useState(0);

  // استخدام useRef لتتبع إذا تم تحميل البيانات من قبل
  const hasLoadedStatsRef = useRef(false);

  // جلب الإحصائيات
  const fetchStats = useCallback(async () => {
    if (!token || hasLoadedStatsRef.current) return;

    setStatsLoading(true);
    hasLoadedStatsRef.current = true; // منع التحميل المتكرر

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/departments/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(res.data);
    } catch (err) {
      console.error("فشل في جلب إحصائيات الأقسام:", err);
      hasLoadedStatsRef.current = false; // السماح بإعادة المحاولة في حالة الخطأ
    } finally {
      setStatsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // تحميل الإحصائيات مرة واحدة فقط عند توفر التوكن
    if (token && !hasLoadedStatsRef.current) {
      fetchStats();
    }
  }, [token, fetchStats]);

  const handleDepartmentChange = useCallback(() => {
    setReloadDepartments((prev) => prev + 1);
    // إعادة تحميل الإحصائيات
    if (stats) {
      hasLoadedStatsRef.current = false; // السماح بإعادة التحميل
      fetchStats();
    }
  }, [stats, fetchStats]);

  return (
    <div className="space-y-6">
      {/* إحصائيات الأقسام */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-lg shadow-lg border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            إحصائيات الأقسام
          </h3>
        </div>

        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                } animate-pulse`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className={`h-4 w-24 rounded ${
                        darkMode ? "bg-gray-600" : "bg-gray-300"
                      } mb-2`}
                    ></div>
                    <div
                      className={`h-8 w-16 rounded ${
                        darkMode ? "bg-gray-600" : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                  <div
                    className={`w-8 h-8 rounded ${
                      darkMode ? "bg-gray-600" : "bg-gray-300"
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-blue-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    إجمالي الأقسام
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.total || 0}
                  </p>
                </div>
                <FaSitemap className="text-blue-500" size={24} />
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-green-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    الأقسام النشطة
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.active || 0}
                  </p>
                </div>
                <FaToggleOn className="text-green-500" size={24} />
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    الأقسام المعطلة
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.inactive || 0}
                  </p>
                </div>
                <FaToggleOff className="text-red-500" size={24} />
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-purple-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    إجمالي الموظفين
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.totalEmployees || 0}
                  </p>
                </div>
                <FaUsers className="text-purple-500" size={24} />
              </div>
            </div>
          </div>
        ) : null}
      </motion.div>

      {/* أدوات إدارة الأقسام */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DepartmentsToolbar
          onSearch={(val) => setFilters((prev) => ({ ...prev, search: val }))}
          onStatusFilter={(val) =>
            setFilters((prev) => ({ ...prev, status: val }))
          }
          onAddDepartment={(newDept) => {
            setDepartments((prev) => [newDept, ...prev]);
            handleDepartmentChange();
          }}
        />
      </motion.div>

      {/* جدول الأقسام */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DepartmentsTable
          filters={filters}
          reloadTrigger={reloadDepartments}
          departments={departments}
          setDepartments={setDepartments}
          onUpdate={handleDepartmentChange}
        />
      </motion.div>
    </div>
  );
};

export default DepartmentTab;
