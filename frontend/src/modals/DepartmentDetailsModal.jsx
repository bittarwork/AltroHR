import React from "react";
import { FaTimesCircle } from "react-icons/fa";

const DepartmentDetailsModal = ({ department, onClose, darkMode }) => {
  if (!department) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-colors duration-300 ${
        darkMode ? "bg-black/60" : "bg-black/30"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-lg shadow-xl p-6 relative mx-4 transition-all duration-300 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        }`}
        dir="rtl"
      >
        {/* زر الإغلاق */}
        <button
          className="absolute top-3 left-3 text-2xl text-red-500 hover:text-red-700"
          onClick={onClose}
          title="إغلاق"
        >
          <FaTimesCircle />
        </button>

        {/* العنوان */}
        <h2 className="text-2xl font-bold mb-6 text-center border-b pb-2">
          تفاصيل القسم
        </h2>

        {/* البيانات */}
        <div className="space-y-4 text-sm">
          <div>
            <span className="font-semibold">اسم القسم:</span> {department.name}
          </div>

          <div>
            <span className="font-semibold">الوصف:</span>{" "}
            {department.description || "—"}
          </div>

          <div>
            <span className="font-semibold">الحالة:</span>{" "}
            <span
              className={`font-medium px-3 py-1 rounded-full text-xs ${
                department.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {department.isActive ? "نشط" : "غير نشط"}
            </span>
          </div>

          <div>
            <span className="font-semibold">تاريخ الإنشاء:</span>{" "}
            {new Date(department.createdAt).toLocaleString("ar-EG")}
          </div>

          <div>
            <span className="font-semibold">آخر تعديل:</span>{" "}
            {new Date(department.updatedAt).toLocaleString("ar-EG")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailsModal;
