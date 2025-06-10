import React, { useState, useEffect } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiInfo,
  FiX,
} from "react-icons/fi";

const ToastNotification = ({
  message,
  type = "info",
  isVisible,
  onClose,
  duration = 5000,
  position = "top-right",
}) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);

      // إخفاء التنبيه تلقائياً بعد المدة المحددة
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      setIsShowing(false);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsShowing(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // انتظار انتهاء animation الإخفاء
  };

  if (!isVisible && !isShowing) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="text-green-500" />;
      case "error":
        return <FiXCircle className="text-red-500" />;
      case "warning":
        return <FiAlertCircle className="text-yellow-500" />;
      default:
        return <FiInfo className="text-blue-500" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-center":
        return "top-4 left-1/2 transform -translate-x-1/2";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-center":
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      case "bottom-right":
        return "bottom-4 right-4";
      default:
        return "top-4 right-4";
    }
  };

  return (
    <div
      className={`fixed z-50 max-w-sm w-full transition-all duration-300 ease-in-out ${getPositionClasses()} ${
        isShowing ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
      dir="rtl"
    >
      <div
        className={`
        relative rounded-lg border p-4 shadow-lg backdrop-blur-sm
        ${getColorClasses()}
      `}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 ml-3">{getIcon()}</div>

          <div className="flex-1 mr-2">
            <p className="text-sm font-medium">{message}</p>
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 mr-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* شريط التقدم */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
            <div
              className={`h-full transition-all linear ${
                type === "success"
                  ? "bg-green-500"
                  : type === "error"
                  ? "bg-red-500"
                  : type === "warning"
                  ? "bg-yellow-500"
                  : "bg-blue-500"
              }`}
              style={{
                animation: `shrink ${duration}ms linear`,
                width: "100%",
              }}
            />
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        `,
        }}
      />
    </div>
  );
};

// Hook مخصص لاستخدام التنبيهات
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info", duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      duration,
      isVisible: true,
    };

    setToasts((prev) => [...prev, toast]);

    // إزالة التنبيه بعد المدة المحددة
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message, duration) =>
    showToast(message, "success", duration);
  const error = (message, duration) => showToast(message, "error", duration);
  const warning = (message, duration) =>
    showToast(message, "warning", duration);
  const info = (message, duration) => showToast(message, "info", duration);

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
};

// مكون container للتنبيهات
export const ToastContainer = ({ toasts, removeToast }) => {
  // التحقق من وجود البيانات
  if (!toasts || !Array.isArray(toasts)) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            transform: `translateY(${index * 80}px)`,
          }}
        >
          <ToastNotification
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={() => removeToast(toast.id)}
            duration={0} // التحكم في المدة من useToast
          />
        </div>
      ))}
    </div>
  );
};

// مكون container مبسط يستخدم useToast داخلياً
export const SimpleToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return <ToastContainer toasts={toasts} removeToast={removeToast} />;
};

export default ToastNotification;
