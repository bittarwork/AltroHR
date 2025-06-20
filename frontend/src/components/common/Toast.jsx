import React from "react";
import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";

const Toast = ({ show, message, type = "success", onClose }) => {
  if (!show) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const Icon = type === "success" ? FiCheckCircle : FiAlertCircle;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${bgColor} text-white max-w-sm`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium text-sm">{message}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
