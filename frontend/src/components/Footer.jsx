// src/components/Footer.jsx
import React, { useState } from "react";
import {
  FaFacebookF,
  FaEnvelope,
  FaPhone,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaMapMarkerAlt,
  FaGlobe,
  FaHeart,
  FaArrowUp,
} from "react-icons/fa";
import {
  FiClock,
  FiMail,
  FiPhone,
  FiMapPin,
  FiExternalLink,
  FiArrowUp,
} from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext";

const Footer = () => {
  const { darkMode } = useTheme();
  const [emailFocused, setEmailFocused] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // إظهار زر العودة للأعلى عند التمرير
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  const textColor = darkMode ? "text-gray-300" : "text-gray-600";
  const headingColor = darkMode ? "text-white" : "text-gray-900";
  const bgColor = darkMode
    ? "bg-gradient-to-b from-gray-900 to-gray-950"
    : "bg-gradient-to-b from-gray-50 to-white";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
  const accentColor = darkMode ? "text-indigo-400" : "text-indigo-600";

  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "https://facebook.com/altrohr",
      label: "Facebook",
      color: "hover:text-blue-600",
    },
    {
      icon: FaTwitter,
      href: "https://twitter.com/altrohr",
      label: "Twitter",
      color: "hover:text-blue-400",
    },
    {
      icon: FaLinkedinIn,
      href: "https://linkedin.com/company/altrohr",
      label: "LinkedIn",
      color: "hover:text-blue-700",
    },
    {
      icon: FaInstagram,
      href: "https://instagram.com/altrohr",
      label: "Instagram",
      color: "hover:text-pink-600",
    },
  ];

  const quickLinks = [
    { label: "الرئيسية", href: "/" },
    { label: "المزايا", href: "#features" },
    { label: "الأسئلة الشائعة", href: "#faq" },
    { label: "تسجيل الدخول", href: "/login" },
    { label: "سياسة الخصوصية", href: "/privacy" },
    { label: "شروط الاستخدام", href: "/terms" },
  ];

  const contactInfo = [
    {
      icon: FiMail,
      text: "support@altrohr.com",
      href: "mailto:support@altrohr.com",
      color: "text-blue-500",
    },
    {
      icon: FiPhone,
      text: "+963 987 654 321",
      href: "tel:+963987654321",
      color: "text-green-500",
    },
    {
      icon: FiMapPin,
      text: "دمشق، سوريا",
      href: "https://maps.google.com",
      color: "text-red-500",
    },
    {
      icon: FiClock,
      text: "الأحد - الخميس، 9:00 - 17:00",
      href: null,
      color: "text-orange-500",
    },
  ];

  return (
    <footer
      className={`${bgColor} border-t ${borderColor} relative overflow-hidden`}
      dir="rtl"
    >
      {/* خلفية تفاعلية */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* المحتوى الرئيسي */}
        <div className="max-w-7xl mx-auto py-12 px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* عن النظام */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <h3 className={`text-2xl font-bold ${headingColor}`}>
                  AltroHR
                </h3>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>

              <p
                className={`text-base leading-relaxed mb-6 ${textColor} max-w-md`}
              >
                AltroHR هو نظام ذكي وشامل لإدارة حضور الموظفين، الإجازات وتتبع
                الأداء، مصمم لتبسيط عمل الموارد البشرية وتحسين الإنتاجية.
              </p>

              {/* الشبكات الاجتماعية */}
              <div className="mb-6">
                <h4 className={`text-sm font-semibold mb-3 ${headingColor}`}>
                  تابعنا على
                </h4>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110
                        ${
                          darkMode
                            ? "bg-gray-800 hover:bg-gray-700 text-gray-400"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                        } ${social.color}
                      `}
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* النشرة الإخبارية */}
              <div>
                <h4 className={`text-sm font-semibold mb-3 ${headingColor}`}>
                  اشترك في النشرة الإخبارية
                </h4>
                <div className="flex gap-2 max-w-sm">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      placeholder="البريد الإلكتروني"
                      className={`
                        w-full px-4 py-2 rounded-lg border transition-all duration-300
                        ${
                          emailFocused
                            ? `border-indigo-500 ${
                                darkMode ? "bg-gray-700" : "bg-white"
                              }`
                            : `${
                                darkMode
                                  ? "bg-gray-800 border-gray-700"
                                  : "bg-gray-50 border-gray-300"
                              }`
                        }
                        ${darkMode ? "text-white" : "text-gray-900"}
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                      `}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-1">
                    <FiMail className="w-4 h-4" />
                    <span className="hidden sm:inline">اشتراك</span>
                  </button>
                </div>
              </div>
            </div>

            {/* روابط سريعة */}
            <div>
              <h3
                className={`text-lg font-semibold mb-6 ${headingColor} flex items-center gap-2`}
              >
                <FiExternalLink className="w-4 h-4" />
                روابط سريعة
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className={`
                        group flex items-center gap-2 transition-all duration-300 hover:translate-x-1
                        ${textColor} hover:text-indigo-600
                      `}
                    >
                      <div className="w-2 h-2 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* تواصل معنا */}
            <div>
              <h3
                className={`text-lg font-semibold mb-6 ${headingColor} flex items-center gap-2`}
              >
                <FiPhone className="w-4 h-4" />
                تواصل معنا
              </h3>
              <ul className="space-y-4">
                {contactInfo.map((contact, index) => (
                  <li key={index}>
                    {contact.href ? (
                      <a
                        href={contact.href}
                        className={`
                          group flex items-center gap-3 transition-all duration-300 hover:translate-x-1
                          ${textColor} hover:text-indigo-600
                        `}
                        target={
                          contact.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          contact.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        <div
                          className={`
                          w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                          ${
                            darkMode
                              ? "bg-gray-800 group-hover:bg-gray-700"
                              : "bg-gray-100 group-hover:bg-gray-200"
                          }
                        `}
                        >
                          <contact.icon
                            className={`w-4 h-4 ${contact.color}`}
                          />
                        </div>
                        <span className="text-sm">{contact.text}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                          w-8 h-8 rounded-lg flex items-center justify-center
                          ${darkMode ? "bg-gray-800" : "bg-gray-100"}
                        `}
                        >
                          <contact.icon
                            className={`w-4 h-4 ${contact.color}`}
                          />
                        </div>
                        <span className={`text-sm ${textColor}`}>
                          {contact.text}
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* الخط الفاصل */}
        <div className={`border-t ${borderColor} mx-5`}></div>

        {/* الجزء السفلي */}
        <div className="max-w-7xl mx-auto py-6 px-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className={`text-sm ${textColor} flex items-center gap-2`}>
              © {currentYear} جميع الحقوق محفوظة - AltroHR
              <FaHeart className="text-red-500 w-3 h-3 animate-pulse" />
              <span>صُنع بحب في سوريا</span>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className={`${textColor} flex items-center gap-1`}>
                <FaGlobe className="w-3 h-3" />
                الإصدار 2.1.0
              </span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-xs ${textColor}`}>متصل</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* زر العودة للأعلى */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`
            fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110
            bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white
            flex items-center justify-center
          `}
          aria-label="العودة للأعلى"
        >
          <FiArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
};

export default Footer;
