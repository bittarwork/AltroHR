import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "hr", label: "HR" },
  { value: "employee", label: "Employee" },
];

const salaryTypes = [
  { value: "monthly", label: "Monthly (Fixed)" },
  { value: "hourly", label: "Hourly (Flexible)" },
];

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
        toast.error("Failed to load departments");
      }
    };
    if (token) fetchDepartments();
  }, [token]);

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

      await axios.post(`${import.meta.env.VITE_API_URL}/api/user`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("User created successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div
        className={`w-full max-w-3xl p-6 rounded-xl shadow-xl transform transition-all duration-300 scale-100
        ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add New User</h2>
          <button
            onClick={onClose}
            className="text-red-500 text-2xl font-bold hover:text-red-600 rounded-full px-2"
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={form.position}
            onChange={handleChange}
            className="form-input"
          />

          <Select
            placeholder="Role"
            options={roleOptions}
            styles={selectStyles}
            value={form.role}
            onChange={(val) => setForm({ ...form, role: val })}
          />
          <Select
            placeholder="Department"
            options={departments}
            styles={selectStyles}
            value={form.department}
            onChange={(val) => setForm({ ...form, department: val })}
          />
          <DatePicker
            selected={form.hireDate}
            onChange={(date) => setForm({ ...form, hireDate: date })}
            className="form-input"
            placeholderText="Hire Date"
          />

          <Select
            placeholder="Salary Type (Monthly or Hourly)"
            options={salaryTypes}
            styles={selectStyles}
            value={form.salaryType}
            onChange={(val) => setForm({ ...form, salaryType: val })}
          />

          {/* منطق الراتب */}
          {form.salaryType?.value === "monthly" && (
            <input
              type="number"
              name="baseSalary"
              placeholder="Base Monthly Salary"
              className="form-input"
              value={form.baseSalary}
              onChange={handleChange}
              required
            />
          )}

          {form.salaryType?.value === "hourly" && (
            <>
              <input
                type="number"
                name="hourlyRate"
                placeholder="Hourly Rate"
                className="form-input"
                value={form.hourlyRate}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="overtimeRate"
                placeholder="Overtime Rate"
                className="form-input"
                value={form.overtimeRate}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="workHoursPerDay"
                placeholder="Work Hours Per Day"
                className="form-input"
                value={form.workHoursPerDay}
                onChange={handleChange}
                required
              />
            </>
          )}

          {/* زر الإرسال */}
          <div className="col-span-full flex justify-end mt-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition font-semibold"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
