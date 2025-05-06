// components/AlertMessage.jsx
import React, { useEffect } from "react";

const AlertMessage = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseColor =
    type === "success"
      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
      : "bg-red-100 text-red-800 border-red-300";

  return (
    <div
      className={`border px-4 py-2 rounded shadow text-sm ${baseColor} transition`}
    >
      {message}
    </div>
  );
};

export default AlertMessage;
