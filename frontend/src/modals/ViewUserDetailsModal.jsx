import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes, FaUser, FaBriefcase, FaMoneyBill } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const ViewUserDetailsModal = ({ userId, onClose }) => {
  const { darkMode } = useTheme();
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !authUser?.token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authUser.token}`,
            },
          }
        );
        setUserData(res.data);
      } catch (err) {
        console.error("فشل في جلب معلومات المستخدم:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, authUser?.token]);

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div
        className={`${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        } w-full max-w-3xl rounded-xl shadow-2xl p-6 relative animate-fade-in overflow-y-auto max-h-[90vh]`}
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-red-500 text-2xl"
        >
          <FaTimes />
        </button>

        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          تفاصيل المستخدم
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !userData ? (
          <div className="text-center py-10 text-red-400">
            تعذر تحميل البيانات
          </div>
        ) : (
          <div className="space-y-6">
            <SectionCard icon={<FaUser />} title="البيانات العامة">
              <GridTwoCols>
                <DataRow label="الاسم" value={userData.name} />
                <DataRow label="البريد الإلكتروني" value={userData.email} />
                <DataRow label="الدور" value={userData.role} />
                <DataRow
                  label="القسم"
                  value={userData.department?.name || "-"}
                />
                <DataRow label="المنصب" value={userData.position || "-"} />
                <DataRow
                  label="الحالة"
                  value={
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        userData.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {userData.isActive ? "نشط" : "غير نشط"}
                    </span>
                  }
                />
              </GridTwoCols>
            </SectionCard>

            <SectionCard icon={<FaBriefcase />} title="المعلومات الوظيفية">
              <GridTwoCols>
                <DataRow
                  label="تاريخ التوظيف"
                  value={formatDate(userData.hireDate)}
                />
                <DataRow
                  label="آخر تسجيل دخول"
                  value={formatDate(userData.lastLogin)}
                />
                <DataRow
                  label="نوع الراتب"
                  value={
                    userData.salaryType === "fixed"
                      ? "راتب ثابت"
                      : "راتب بالساعة"
                  }
                />
                <DataRow
                  label="عدد ساعات العمل اليومية"
                  value={`${userData.workHoursPerDay} ساعات`}
                />
              </GridTwoCols>
            </SectionCard>

            <SectionCard icon={<FaMoneyBill />} title="البيانات المالية">
              <GridTwoCols>
                <DataRow
                  label="الراتب الأساسي"
                  value={`${userData.baseSalary} ل.س`}
                />
                <DataRow
                  label="أجرة الساعة"
                  value={`${userData.hourlyRate} ل.س`}
                />
                <DataRow
                  label="أجرة الساعة الإضافية"
                  value={`${userData.overtimeRate} ل.س`}
                />
              </GridTwoCols>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
};

const SectionCard = ({ icon, title, children }) => (
  <div className="rounded-lg border p-4 shadow-sm bg-white dark:bg-gray-800">
    <div className="flex items-center gap-2 mb-4">
      <div className="text-indigo-600 text-xl">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);

const GridTwoCols = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
);

const DataRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-base font-medium">{value}</span>
  </div>
);

const formatDate = (isoDate) =>
  isoDate ? new Date(isoDate).toLocaleDateString("ar-EG") : "-";

export default ViewUserDetailsModal;
