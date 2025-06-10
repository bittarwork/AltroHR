import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  HomeIcon,
  ComputerDesktopIcon,
  ArrowRightOnRectangleIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // تتبع حالة التمرير لتغيير مظهر الشريط العلوي
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // إغلاق القائمة عند تغيير الصفحة
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinkStyle = (isActive = false) => `
    relative px-3 py-2 rounded-lg transition-all duration-300 group
    ${
      isActive
        ? `${
            darkMode
              ? "text-indigo-400 bg-indigo-900/20"
              : "text-indigo-600 bg-indigo-50"
          }`
        : `${
            darkMode
              ? "text-gray-200 hover:text-indigo-400 hover:bg-gray-800"
              : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
          }`
    }
  `;

  const buttonStyle = (variant = "primary") => {
    const variants = {
      primary: `bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 
                text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`,
      success: `bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
                text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`,
      danger: `bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
               text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`,
    };
    return `px-4 py-2 rounded-lg font-medium ${variants[variant]}`;
  };

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  const isCurrentPage = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`
          ${
            darkMode
              ? `bg-gray-900/95 ${
                  isScrolled ? "bg-gray-900/98" : ""
                } text-gray-200`
              : `bg-white/95 ${isScrolled ? "bg-white/98" : ""} text-gray-800`
          } 
          ${
            isScrolled
              ? "shadow-xl backdrop-blur-md"
              : "shadow-lg backdrop-blur-sm"
          }
          transition-all duration-300 fixed top-0 w-full z-50 font-tajawal border-b
          ${darkMode ? "border-gray-800" : "border-gray-100"}
        `}
        dir="rtl"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* اللوجو */}
            <Link
              to="/"
              className={`
                text-2xl font-extrabold tracking-tight flex items-center gap-2 group
                ${darkMode ? "text-indigo-400" : "text-indigo-600"}
                hover:scale-105 transition-transform duration-300
              `}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              AltroHR
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </Link>

            {/* القائمة الرئيسية - شاشة كبيرة */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Link to="/" className={navLinkStyle(isCurrentPage("/"))}>
                  <HomeIcon className="w-4 h-4 inline-block ml-1" />
                  الرئيسية
                </Link>

                {user && (
                  <Link
                    to="/dashboard"
                    className={navLinkStyle(isCurrentPage("/dashboard"))}
                  >
                    <ComputerDesktopIcon className="w-4 h-4 inline-block ml-1" />
                    لوحة التحكم
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-3 border-r border-gray-300 dark:border-gray-700 pr-4">
                {/* زر تبديل الوضع */}
                <button
                  onClick={toggleTheme}
                  className={`
                    p-2 rounded-lg transition-all duration-300 group
                    ${
                      darkMode
                        ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    }
                  `}
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <SunIcon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  ) : (
                    <MoonIcon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300" />
                  )}
                </button>

                {/* معلومات المستخدم أو أزرار تسجيل الدخول */}
                {user ? (
                  <div className="flex items-center gap-3">
                    {/* معلومات المستخدم */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold`}
                      >
                        {user?.user?.name?.charAt(0) || "U"}
                      </div>
                      <div className="hidden lg:block">
                        <p
                          className={`text-sm font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {user?.user?.name}
                        </p>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {user?.user?.position || "موظف"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsLogoutModalOpen(true)}
                      className={buttonStyle("danger")}
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 inline-block ml-1" />
                      خروج
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className={buttonStyle("primary")}>
                    <UserCircleIcon className="w-4 h-4 inline-block ml-1" />
                    تسجيل الدخول
                  </Link>
                )}
              </div>
            </div>

            {/* زر القائمة - الهاتف */}
            <button
              className={`
                md:hidden p-2 rounded-lg transition-all duration-300
                ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }
              `}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* القائمة المنسدلة - الهاتف */}
          {isMenuOpen && (
            <div
              className={`
                md:hidden mt-4 p-4 rounded-lg border
                ${
                  darkMode
                    ? "bg-gray-800/95 border-gray-700 text-gray-200"
                    : "bg-white/95 border-gray-200 text-gray-800"
                }
                backdrop-blur-sm shadow-xl
              `}
            >
              <div className="flex flex-col gap-3">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                    isCurrentPage("/")
                      ? `${
                          darkMode
                            ? "bg-indigo-900/30 text-indigo-400"
                            : "bg-indigo-50 text-indigo-600"
                        }`
                      : `${
                          darkMode
                            ? "hover:bg-gray-700 text-gray-200"
                            : "hover:bg-gray-50 text-gray-700"
                        }`
                  }`}
                >
                  <HomeIcon className="w-5 h-5" />
                  الرئيسية
                </Link>

                {user && (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                      isCurrentPage("/dashboard")
                        ? `${
                            darkMode
                              ? "bg-indigo-900/30 text-indigo-400"
                              : "bg-indigo-50 text-indigo-600"
                          }`
                        : `${
                            darkMode
                              ? "hover:bg-gray-700 text-gray-200"
                              : "hover:bg-gray-50 text-gray-700"
                          }`
                    }`}
                  >
                    <ComputerDesktopIcon className="w-5 h-5" />
                    لوحة التحكم
                  </Link>
                )}

                <button
                  onClick={() => {
                    toggleTheme();
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                    darkMode
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  {darkMode ? (
                    <SunIcon className="w-5 h-5" />
                  ) : (
                    <MoonIcon className="w-5 h-5" />
                  )}
                  {darkMode ? "الوضع الفاتح" : "الوضع الداكن"}
                </button>

                {user ? (
                  <>
                    <div
                      className={`border-t pt-3 ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {user?.user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {user?.user?.name}
                          </p>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {user?.user?.position || "موظف"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsLogoutModalOpen(true)}
                      className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300"
                  >
                    <UserCircleIcon className="w-5 h-5" />
                    تسجيل الدخول
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* مودال تأكيد تسجيل الخروج */}
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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
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
                className={`
                  ${
                    darkMode
                      ? "bg-gray-800 text-gray-200 border-gray-700"
                      : "bg-white text-gray-800 border-gray-200"
                  } 
                  w-full max-w-md rounded-2xl p-6 shadow-2xl border backdrop-blur-sm
                `}
                dir="rtl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <Dialog.Title className="text-lg font-semibold">
                      تأكيد تسجيل الخروج
                    </Dialog.Title>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      هل أنت متأكد من رغبتك في الخروج؟
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    نعم، تسجيل الخروج
                  </button>
                  <button
                    onClick={() => setIsLogoutModalOpen(false)}
                    className={`
                      flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300
                      ${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }
                    `}
                  >
                    إلغاء
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
