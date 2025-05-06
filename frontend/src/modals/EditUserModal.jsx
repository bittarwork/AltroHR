import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

// خيارات الدور
const roleOptions = [
  { value: "admin", label: "مدير" },
  { value: "hr", label: "موارد بشرية" },
  { value: "employee", label: "موظف" },
];

// أنواع الرواتب
const salaryTypes = [
  { value: "monthly", label: "شهري (ثابت)" },
  { value: "hourly", label: "بالساعة (مرن)" },
];

const EditUserModal = ({ userId, isOpen, onClose, onSuccess }) => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const token = user?.token;

  const [form, setForm] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: darkMode ? "#1f2937" : "#fff",
      borderColor: state.isFocused
        ? "#6366f1"
        : darkMode
        ? "#4b5563"
        : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : "none",
      color: darkMode ? "#fff" : "#000",
    }),
    singleValue: (base) => ({
      ...base,
      color: darkMode ? "#fff" : "#000",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: darkMode ? "#1f2937" : "#fff",
    }),
  };

  // جلب بيانات المستخدم
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const userData = res.data;
        setForm({
          name: userData.name,
          email: userData.email,
          position: userData.position || "",
          role: roleOptions.find((r) => r.value === userData.role),
          department: userData.department
            ? {
                value: userData.department._id,
                label: userData.department.name,
              }
            : null,
          hireDate: new Date(userData.hireDate),
          salaryType: salaryTypes.find((s) => s.value === userData.salaryType),
          baseSalary: userData.baseSalary || "",
          hourlyRate: userData.hourlyRate || "",
          overtimeRate: userData.overtimeRate || "",
          workHoursPerDay: userData.workHoursPerDay || "",
        });
      } catch (err) {
        toast.error("فشل في جلب بيانات المستخدم");
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) fetchUser();
  }, [userId, token]);

  // جلب الأقسام
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/departments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDepartments(res.data.map((d) => ({ value: d._id, label: d.name })));
      } catch (err) {
        toast.error("فشل في تحميل الأقسام");
      }
    };

    if (token) fetchDepartments();
  }, [token]);

  // تنظيف الحقول بناءً على نوع الراتب
  useEffect(() => {
    if (!form) return;

    if (form.salaryType?.value === "monthly") {
      setForm((prev) => ({
        ...prev,
        hourlyRate: "",
        overtimeRate: "",
        workHoursPerDay: "",
      }));
    } else if (form.salaryType?.value === "hourly") {
      setForm((prev) => ({
        ...prev,
        baseSalary: "",
      }));
    }
  }, [form?.salaryType]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        role: form.role?.value,
        department: form.department?.value,
        salaryType: form.salaryType?.value,
        hireDate: form.hireDate,
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/${userId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("تم تعديل بيانات المستخدم بنجاح");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل في تعديل المستخدم");
    }
  };

  if (!isOpen || loading || !form) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div
        className={`w-full max-w-3xl overflow-auto max-h-[90vh] p-6 rounded-xl shadow-xl transition-all duration-300
        ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-indigo-600">
            تعديل معلومات المستخدم
          </h2>
          <button
            onClick={onClose}
            className="text-red-500 text-2xl font-bold hover:text-red-600 rounded-full px-2"
            title="إغلاق"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* الحساب */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-5 border border-gray-300 dark:border-gray-700 p-4 rounded-md">
            <legend className="text-lg font-semibold mb-2 text-indigo-600">
              معلومات الحساب
            </legend>

            <div>
              <label className="block mb-1 font-medium">الاسم الكامل</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="form-input w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="form-input w-full"
              />
            </div>
          </fieldset>

          {/* الوظيفية */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-5 border border-gray-300 dark:border-gray-700 p-4 rounded-md">
            <legend className="text-lg font-semibold mb-2 text-indigo-600">
              المعلومات الوظيفية
            </legend>

            <div>
              <label className="block mb-1 font-medium">المنصب</label>
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
                className="form-input w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">الدور</label>
              <Select
                placeholder="اختر الدور"
                options={roleOptions}
                styles={selectStyles}
                value={form.role}
                onChange={(val) => setForm({ ...form, role: val })}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">القسم</label>
              <Select
                placeholder="اختر القسم"
                options={departments}
                styles={selectStyles}
                value={form.department}
                onChange={(val) => setForm({ ...form, department: val })}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">تاريخ التوظيف</label>
              <DatePicker
                selected={form.hireDate}
                onChange={(date) => setForm({ ...form, hireDate: date })}
                className="form-input w-full"
                dateFormat="yyyy/MM/dd"
              />
            </div>
          </fieldset>

          {/* الراتب */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-5 border border-gray-300 dark:border-gray-700 p-4 rounded-md">
            <legend className="text-lg font-semibold mb-2 text-indigo-600">
              تفاصيل الراتب
            </legend>

            <div>
              <label className="block mb-1 font-medium">نوع الراتب</label>
              <Select
                placeholder="شهري أو بالساعة"
                options={salaryTypes}
                styles={selectStyles}
                value={form.salaryType}
                onChange={(val) => setForm({ ...form, salaryType: val })}
              />
            </div>

            {form.salaryType?.value === "monthly" && (
              <div>
                <label className="block mb-1 font-medium">الراتب الشهري</label>
                <input
                  type="number"
                  name="baseSalary"
                  value={form.baseSalary}
                  onChange={handleChange}
                  required
                  className="form-input w-full"
                />
              </div>
            )}

            {form.salaryType?.value === "hourly" && (
              <>
                <div>
                  <label className="block mb-1 font-medium">أجر الساعة</label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={form.hourlyRate}
                    onChange={handleChange}
                    className="form-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    أجر الساعة الإضافية
                  </label>
                  <input
                    type="number"
                    name="overtimeRate"
                    value={form.overtimeRate}
                    onChange={handleChange}
                    className="form-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    عدد ساعات العمل
                  </label>
                  <input
                    type="number"
                    name="workHoursPerDay"
                    value={form.workHoursPerDay}
                    onChange={handleChange}
                    className="form-input w-full"
                    required
                  />
                </div>
              </>
            )}
          </fieldset>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
            >
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
