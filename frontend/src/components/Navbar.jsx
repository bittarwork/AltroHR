import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkStyle = `transition hover:text-indigo-600 ${
    darkMode ? "text-gray-200" : "text-gray-700"
  }`;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={`${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
      } shadow-md transition-all duration-300 fixed top-0 w-full z-50`}
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* شعار الموقع */}
        <div
          className={`text-2xl font-extrabold tracking-tight ${
            darkMode ? "text-indigo-400" : "text-indigo-600"
          }`}
        >
          AltroHR
        </div>

        {/* القائمة الأساسية - سطح المكتب */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className={navLinkStyle}>
            الرئيسية
          </Link>

          <button
            onClick={toggleTheme}
            className={`transition hover:text-indigo-500 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>

          {/* زر لوحة التحكم - فقط للمستخدم المسجل */}
          {user && (
            <Link
              to="/dashboard"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow transition duration-300"
            >
              لوحة التحكم
            </Link>
          )}

          {/* تسجيل الدخول أو الخروج */}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition duration-300"
            >
              تسجيل الخروج
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow transition duration-300"
            >
              تسجيل الدخول
            </Link>
          )}
        </div>

        {/* زر القائمة - الهاتف */}
        <button
          className="md:hidden text-gray-600 dark:text-gray-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* القائمة الجانبية - الجوال */}
      {isMenuOpen && (
        <div
          className={`md:hidden px-4 pb-4 flex flex-col gap-3 text-sm font-medium ${
            darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
          }`}
        >
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={navLinkStyle}
          >
            الرئيسية
          </Link>

          <button
            onClick={() => {
              toggleTheme();
              setIsMenuOpen(false);
            }}
            className={`transition hover:text-indigo-500 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {darkMode ? "الوضع الفاتح" : "الوضع الداكن"}
          </button>

          {/* زر لوحة التحكم - للمستخدم المسجل */}
          {user && (
            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow transition duration-300"
            >
              لوحة التحكم
            </Link>
          )}

          {/* تسجيل الدخول أو الخروج - موبايل */}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition duration-300"
            >
              تسجيل الخروج
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow transition duration-300"
            >
              تسجيل الدخول
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
