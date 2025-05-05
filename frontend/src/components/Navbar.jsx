import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navLinkStyle = `transition hover:text-indigo-600 ${
    darkMode ? "text-gray-200" : "text-gray-700"
  }`;

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav
        className={`${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
        } shadow-md transition-all duration-300 fixed top-0 w-full z-50`}
        dir="rtl"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className={`text-2xl font-extrabold tracking-tight ${
              darkMode ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            AltroHR
          </div>

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

            {user && (
              <Link
                to="/dashboard"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow transition duration-300"
              >
                لوحة التحكم
              </Link>
            )}

            {user ? (
              <button
                onClick={() => setIsLogoutModalOpen(true)}
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

            {user && (
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow transition duration-300"
              >
                لوحة التحكم
              </Link>
            )}

            {user ? (
              <button
                onClick={() => setIsLogoutModalOpen(true)}
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

      {/* Logout Confirmation Modal */}
      <Transition appear show={isLogoutModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsLogoutModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`${
                  darkMode
                    ? "bg-gray-800 text-gray-200"
                    : "bg-white text-gray-800"
                } w-full max-w-md rounded-lg p-6 shadow-xl`}
              >
                <Dialog.Title className="flex items-center gap-2 text-lg font-medium">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                  تأكيد تسجيل الخروج
                </Dialog.Title>
                <div className="mt-2">
                  هل أنت متأكد من أنك تريد تسجيل الخروج؟
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
                    onClick={() => setIsLogoutModalOpen(false)}
                  >
                    إلغاء
                  </button>
                  <button
                    className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                    onClick={handleLogout}
                  >
                    تسجيل الخروج
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Navbar;
