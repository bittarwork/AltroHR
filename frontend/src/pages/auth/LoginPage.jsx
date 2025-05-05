import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { FaUserAlt, FaLock, FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const LoginPage = () => {
  const { login, user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ التوجيه إلى "/dashboard" إذا تم تسجيل الدخول
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password); // يتم التوجيه تلقائياً
    } catch (err) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
    } finally {
      setLoading(false);
    }
  };

  // التنسيقات بناءً على الوضع
  const containerBg = darkMode
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    : "bg-gradient-to-br from-indigo-50 via-white to-gray-100";

  const cardBg = darkMode
    ? "bg-gray-800/80 backdrop-blur-sm border border-gray-700"
    : "bg-white shadow-xl border border-gray-200";

  const labelColor = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode
    ? "bg-gray-700 text-white"
    : "bg-gray-50 text-gray-800";
  const textColor = darkMode ? "text-white" : "text-gray-800";

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen flex items-center justify-center ${containerBg} px-4 pt-32 pb-20`}
        dir="rtl"
      >
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-lg">
          {/* الواجهة الجانبية */}
          <div className="hidden lg:flex flex-col justify-center items-center bg-indigo-600 text-white p-10 relative">
            <div className="z-10">
              <h2 className="text-4xl font-bold mb-4">أهلاً بك 👋</h2>
              <p className="text-lg opacity-90 leading-relaxed">
                قم بتسجيل الدخول للبدء باستخدام منصة <strong>AltroHR</strong>{" "}
                لإدارة الموظفين بذكاء.
              </p>
            </div>
            <div className="absolute inset-0 bg-indigo-800/30 backdrop-blur-sm" />
          </div>

          {/* نموذج تسجيل الدخول */}
          <div className={`p-8 sm:p-10 ${cardBg}`}>
            <h2 className={`text-3xl font-bold mb-6 text-center ${textColor}`}>
              تسجيل الدخول
            </h2>
            {error && (
              <div className="bg-red-100 text-red-700 text-sm rounded px-4 py-2 mb-4 text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  className={`block mb-1 text-sm font-medium ${labelColor}`}
                >
                  البريد الإلكتروني
                </label>
                <div className="flex items-center gap-2 border px-3 py-2 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 bg-opacity-10">
                  <FaUserAlt className="text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full bg-transparent focus:outline-none ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block mb-1 text-sm font-medium ${labelColor}`}
                >
                  كلمة المرور
                </label>
                <div className="flex items-center gap-2 border px-3 py-2 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 bg-opacity-10">
                  <FaLock className="text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full bg-transparent focus:outline-none ${inputBg}`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-md flex justify-center items-center gap-2 transition"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </button>
            </form>

            <p className="text-sm text-center mt-6 text-gray-500 dark:text-gray-400">
              لا تملك حسابًا؟{" "}
              <Link to="/register" className="text-indigo-500 hover:underline">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
