// src/components/Footer.jsx
import React from "react";
import { FaFacebookF, FaEnvelope, FaPhone } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";

const Footer = () => {
  const { darkMode } = useTheme();

  const textColor = darkMode ? "text-gray-300" : "text-gray-600";
  const headingColor = darkMode ? "text-white" : "text-gray-900";
  const bgColor = darkMode ? "bg-gray-900" : "bg-gray-100";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";

  return (
    <footer className={`${bgColor} border-t ${borderColor} py-10 px-5`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* عن النظام */}
        <div>
          <h3
            className={`text-lg sm:text-xl font-semibold mb-4 ${headingColor}`}
          >
            عن AltroHR
          </h3>
          <p className={`text-sm sm:text-base leading-relaxed ${textColor}`}>
            AltroHR هو نظام ذكي وشامل لإدارة حضور الموظفين، الإجازات وتتبع
            الأداء، مصمم لتبسيط عمل الموارد البشرية وتحسين الإنتاجية.
          </p>
        </div>

        {/* روابط سريعة */}
        <div>
          <h3
            className={`text-lg sm:text-xl font-semibold mb-4 ${headingColor}`}
          >
            روابط سريعة
          </h3>
          <ul className="space-y-3 text-sm sm:text-base">
            {[
              { label: "المزايا", href: "#features" },
              { label: "الأسئلة الشائعة", href: "#faq" },
              { label: "تسجيل الدخول", href: "/login" },
            ].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`block transition hover:text-indigo-600 ${textColor}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* تواصل معنا */}
        <div>
          <h3
            className={`text-lg sm:text-xl font-semibold mb-4 ${headingColor}`}
          >
            تواصل معنا
          </h3>
          <ul className="space-y-4 text-sm sm:text-base">
            <li className="flex items-center gap-3 justify-start sm:justify-end">
              <FaEnvelope className="text-indigo-500 text-lg sm:text-xl" />
              <span className={textColor}>support@altrohr.com</span>
            </li>
            <li className="flex items-center gap-3 justify-start sm:justify-end">
              <FaPhone className="text-indigo-500 text-lg sm:text-xl" />
              <span className={textColor}>+963 987 654 321</span>
            </li>
            <li className="flex items-center gap-3 justify-start sm:justify-end">
              <FaFacebookF className="text-indigo-500 text-lg sm:text-xl" />
              <span className={textColor}>/AltroHR</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={`mt-10 text-xs sm:text-sm text-center ${textColor}`}>
        © {new Date().getFullYear()} جميع الحقوق محفوظة - AltroHR
      </div>
    </footer>
  );
};

export default Footer;
