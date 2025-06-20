import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiBriefcase,
  FiDollarSign,
  FiX,
  FiSave,
  FiMail,
  FiLock,
  FiCalendar,
  FiClock,
} from "react-icons/fi";

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

// مكون InputField خارج المكون الرئيسي لتجنب إعادة التعريف
const InputField = ({
  icon: Icon,
  label,
  children,
  required = false,
  darkMode,
}) => (
  <div className="space-y-2">
    <label
      className={`flex items-center space-x-2 space-x-reverse text-sm font-medium ${
        darkMode ? "text-gray-300" : "text-gray-700"
      }`}
    >
      <Icon className="text-blue-500" size={16} />
      <span>{label}</span>
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const token = user?.token;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: null,
    department: null,
    position: "",
    hireDate: new Date(),
    salaryType: null,
    baseSalary: "",
    hourlyRate: "",
    overtimeRate: "",
    workHoursPerDay: "",
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // تنسيقات الواجهة للقوائم المنسدلة
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: darkMode ? "#374151" : "#fff",
      borderColor: state.isFocused
        ? "#3B82F6"
        : darkMode
        ? "#4B5563"
        : "#D1D5DB",
      borderRadius: "0.75rem",
      boxShadow: state.isFocused
        ? `0 0 0 3px ${
            darkMode ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.1)"
          }`
        : "none",
      color: darkMode ? "#fff" : "#000",
      minHeight: "44px",
      transition: "all 0.2s ease-in-out",
    }),
    singleValue: (base) => ({
      ...base,
      color: darkMode ? "#fff" : "#000",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: darkMode ? "#374151" : "#fff",
      borderRadius: "0.75rem",
      border: `1px solid ${darkMode ? "#4B5563" : "#D1D5DB"}`,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? darkMode
          ? "#4B5563"
          : "#F3F4F6"
        : "transparent",
      color: darkMode ? "#fff" : "#000",
      cursor: "pointer",
    }),
  };

  // تحميل الأقسام من السيرفر
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
  }, [form.salaryType]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        role: form.role?.value,
        department: form.department?.value,
        salaryType: form.salaryType?.value,
        hireDate: form.hireDate,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("تم إنشاء المستخدم بنجاح! 🎉");
      onSuccess?.();
      onClose();
      // إعادة تعيين النموذج
      setForm({
        name: "",
        email: "",
        password: "",
        role: null,
        department: null,
        position: "",
        hireDate: new Date(),
        salaryType: null,
        baseSalary: "",
        hourlyRate: "",
        overtimeRate: "",
        workHoursPerDay: "",
      });
      setCurrentStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل في إنشاء المستخدم");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              step <= currentStep
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                : darkMode
                ? "bg-gray-700 text-gray-400"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-12 h-1 mx-2 transition-all duration-300 ${
                step < currentStep
                  ? "bg-blue-500"
                  : darkMode
                  ? "bg-gray-700"
                  : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
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
            className={`w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
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
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <FiUser
                      className="text-blue-600 dark:text-blue-400"
                      size={20}
                    />
                  </div>
                  <h2 className="text-xl font-bold">إضافة مستخدم جديد</h2>
                </div>

                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
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
              <StepIndicator />

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: معلومات الحساب */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div
                        className={`p-6 rounded-xl border ${
                          darkMode
                            ? "border-gray-700 bg-gray-900/50"
                            : "border-gray-200 bg-gray-50/50"
                        }`}
                      >
                        <div className="flex items-center space-x-3 space-x-reverse mb-6">
                          <FiUser className="text-blue-500" size={20} />
                          <h3 className="text-lg font-semibold">
                            معلومات الحساب
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InputField
                            icon={FiUser}
                            label="الاسم الكامل"
                            required
                            darkMode={darkMode}
                          >
                            <input
                              type="text"
                              name="name"
                              value={form.name}
                              onChange={handleChange}
                              required
                              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                darkMode
                                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                              }`}
                              placeholder="مثال: محمد أحمد علي"
                            />
                          </InputField>

                          <InputField
                            icon={FiMail}
                            label="البريد الإلكتروني"
                            required
                            darkMode={darkMode}
                          >
                            <input
                              type="email"
                              name="email"
                              value={form.email}
                              onChange={handleChange}
                              required
                              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                darkMode
                                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                              }`}
                              placeholder="example@company.com"
                            />
                          </InputField>

                          <div className="md:col-span-2">
                            <InputField
                              icon={FiLock}
                              label="كلمة المرور"
                              required
                              darkMode={darkMode}
                            >
                              <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                  darkMode
                                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                }`}
                                placeholder="••••••••••••"
                              />
                              <p
                                className={`text-xs mt-1 ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                يجب أن تتكون من 6 أحرف على الأقل
                              </p>
                            </InputField>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: المعلومات الوظيفية */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div
                        className={`p-6 rounded-xl border ${
                          darkMode
                            ? "border-gray-700 bg-gray-900/50"
                            : "border-gray-200 bg-gray-50/50"
                        }`}
                      >
                        <div className="flex items-center space-x-3 space-x-reverse mb-6">
                          <FiBriefcase className="text-green-500" size={20} />
                          <h3 className="text-lg font-semibold">
                            المعلومات الوظيفية
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InputField
                            icon={FiBriefcase}
                            label="المسمى الوظيفي"
                            darkMode={darkMode}
                          >
                            <input
                              type="text"
                              name="position"
                              value={form.position}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                darkMode
                                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                              }`}
                              placeholder="مطور، مدير، محاسب..."
                            />
                          </InputField>

                          <InputField
                            icon={FiUser}
                            label="الدور"
                            required
                            darkMode={darkMode}
                          >
                            <Select
                              placeholder="اختر الدور"
                              options={roleOptions}
                              styles={selectStyles}
                              value={form.role}
                              onChange={(val) =>
                                setForm({ ...form, role: val })
                              }
                              isSearchable={false}
                            />
                          </InputField>

                          <InputField
                            icon={FiBriefcase}
                            label="القسم"
                            darkMode={darkMode}
                          >
                            <Select
                              placeholder="اختر القسم"
                              options={departments}
                              styles={selectStyles}
                              value={form.department}
                              onChange={(val) =>
                                setForm({ ...form, department: val })
                              }
                              isSearchable
                            />
                          </InputField>

                          <InputField
                            icon={FiCalendar}
                            label="تاريخ التوظيف"
                            required
                            darkMode={darkMode}
                          >
                            <DatePicker
                              selected={form.hireDate}
                              onChange={(date) =>
                                setForm({ ...form, hireDate: date })
                              }
                              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                darkMode
                                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                              }`}
                              placeholderText="اختر التاريخ"
                              dateFormat="yyyy/MM/dd"
                            />
                          </InputField>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: تفاصيل الراتب */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div
                        className={`p-6 rounded-xl border ${
                          darkMode
                            ? "border-gray-700 bg-gray-900/50"
                            : "border-gray-200 bg-gray-50/50"
                        }`}
                      >
                        <div className="flex items-center space-x-3 space-x-reverse mb-6">
                          <FiDollarSign className="text-yellow-500" size={20} />
                          <h3 className="text-lg font-semibold">
                            تفاصيل الراتب
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <InputField
                              icon={FiDollarSign}
                              label="نوع الراتب"
                              required
                              darkMode={darkMode}
                            >
                              <Select
                                placeholder="اختر نوع الراتب"
                                options={salaryTypes}
                                styles={selectStyles}
                                value={form.salaryType}
                                onChange={(val) =>
                                  setForm({ ...form, salaryType: val })
                                }
                                isSearchable={false}
                              />
                            </InputField>
                          </div>

                          {form.salaryType?.value === "monthly" && (
                            <div className="md:col-span-2">
                              <InputField
                                icon={FiDollarSign}
                                label="الراتب الشهري (ل.س)"
                                required
                                darkMode={darkMode}
                              >
                                <input
                                  type="number"
                                  name="baseSalary"
                                  value={form.baseSalary}
                                  onChange={handleChange}
                                  required
                                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                    darkMode
                                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                  }`}
                                  placeholder="500000"
                                />
                              </InputField>
                            </div>
                          )}

                          {form.salaryType?.value === "hourly" && (
                            <>
                              <InputField
                                icon={FiDollarSign}
                                label="الأجر بالساعة (ل.س)"
                                required
                                darkMode={darkMode}
                              >
                                <input
                                  type="number"
                                  name="hourlyRate"
                                  value={form.hourlyRate}
                                  onChange={handleChange}
                                  required
                                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                    darkMode
                                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                  }`}
                                  placeholder="3000"
                                />
                              </InputField>

                              <InputField
                                icon={FiDollarSign}
                                label="أجر الساعات الإضافية (ل.س)"
                                required
                                darkMode={darkMode}
                              >
                                <input
                                  type="number"
                                  name="overtimeRate"
                                  value={form.overtimeRate}
                                  onChange={handleChange}
                                  required
                                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                    darkMode
                                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                  }`}
                                  placeholder="5000"
                                />
                              </InputField>

                              <div className="md:col-span-2">
                                <InputField
                                  icon={FiClock}
                                  label="عدد ساعات العمل يومياً"
                                  required
                                  darkMode={darkMode}
                                >
                                  <input
                                    type="number"
                                    name="workHoursPerDay"
                                    value={form.workHoursPerDay}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                      darkMode
                                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                    }`}
                                    placeholder="8"
                                    min="1"
                                    max="24"
                                  />
                                </InputField>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div
                  className={`flex items-center justify-between pt-6 border-t ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex space-x-3 space-x-reverse">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        السابق
                      </button>
                    )}
                  </div>

                  <div className="flex space-x-3 space-x-reverse">
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 space-x-reverse"
                      >
                        <span>التالي</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 space-x-reverse ${
                          loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        } text-white`}
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FiSave size={16} />
                        )}
                        <span>
                          {loading ? "جاري الحفظ..." : "حفظ المستخدم"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddUserModal;
