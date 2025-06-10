import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import LandingPage from "./pages/LandingPaage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";

const App = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.user?.role) {
      case "admin":
        return <AdminDashboard />;
      case "employee":
        return <EmployeeDashboard />;
      case "hr":
        return <TechnicianDashboard />;
      default:
        return <div>Unauthorized Role</div>;
    }
  };

  return (
    <Router>
      <Routes>
        {/* صفحة الهبوط الرئيسية */}
        <Route path="/" element={<LandingPage />} />

        {/* صفحة تسجيل الدخول */}
        <Route path="/login" element={<LoginPage />} />

        {/* صفحة نسيت كلمة المرور */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* صفحة إنشاء حساب جديد */}
        <Route path="/register" element={<RegisterPage />} />

        {/* لوحة التحكم حسب الدور */}
        <Route
          path="/dashboard"
          element={user ? renderDashboard() : <Navigate to="/login" />}
        />

        {/* يمكن لاحقًا إضافة صفحات خطأ أو صلاحيات */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
