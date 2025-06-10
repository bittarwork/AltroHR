// src/pages/LandingPage.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import Navbar from "../components/Navbar";
import HeroSection from "../components/Main/HeroSection";
import FeaturesSection from "../components/Main/FeaturesSection";
import UserRolesSection from "../components/Main/UserRolesSection";
import WhyUsSection from "../components/Main/WhyUsSection";
import FAQSection from "../components/Main/FAQSection";
import CallToActionSection from "../components/Main/CallToActionSection";
import Footer from "../components/Footer";

// مكون Loading Screen متطور
const LoadingScreen = ({ isLoading }) => {
  const { darkMode } = useTheme();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <div className="text-center">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
              }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center"
            >
              <span className="text-white font-bold text-xl">A</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              AltroHR
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              جاري التحميل...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// مكون خلفية متحركة متطورة
const AnimatedBackground = () => {
  const { darkMode } = useTheme();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* دوائر متحركة كبيرة */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500/3 rounded-full blur-2xl"
      />

      {/* خط متوهج متحرك */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        className={`absolute inset-0 opacity-30 ${
          darkMode
            ? "bg-gradient-to-br from-transparent via-indigo-900/5 to-transparent"
            : "bg-gradient-to-br from-transparent via-indigo-100/5 to-transparent"
        }`}
        style={{
          backgroundSize: "200% 200%",
        }}
      />
    </div>
  );
};

// مكون زر العودة للأعلى
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className={`
            fixed bottom-8 left-8 z-40 p-3 rounded-full shadow-lg transition-all duration-300
            ${
              darkMode
                ? "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700"
                : "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50"
            }
          `}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// مكون شريط التقدم
const ProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (currentProgress / scrollHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 z-50 origin-left"
      style={{ scaleX: scrollProgress / 100 }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: scrollProgress / 100 }}
      transition={{ duration: 0.1 }}
    />
  );
};

const LandingPage = () => {
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [sectionsInView, setSectionsInView] = useState({});

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setSectionsInView((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1, rootMargin: "-10% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Loading Screen */}
      <LoadingScreen isLoading={isLoading} />

      {/* Progress Bar */}
      <ProgressBar />

      {/* Animated Background */}
      <AnimatedBackground />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Navbar />

        {/* Hero Section with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <HeroSection />
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: sectionsInView.features ? 1 : 0,
            y: sectionsInView.features ? 0 : 50,
          }}
          transition={{ duration: 0.6 }}
        >
          <FeaturesSection />
        </motion.div>

        {/* User Roles Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: sectionsInView.roles ? 1 : 0,
            y: sectionsInView.roles ? 0 : 50,
          }}
          transition={{ duration: 0.6 }}
        >
          <UserRolesSection />
        </motion.div>

        {/* Why Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: sectionsInView.whyus ? 1 : 0,
            y: sectionsInView.whyus ? 0 : 50,
          }}
          transition={{ duration: 0.6 }}
        >
          <WhyUsSection />
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: sectionsInView.faq ? 1 : 0,
            y: sectionsInView.faq ? 0 : 50,
          }}
          transition={{ duration: 0.6 }}
        >
          <FAQSection />
        </motion.div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: sectionsInView.cta ? 1 : 0,
            y: sectionsInView.cta ? 0 : 50,
          }}
          transition={{ duration: 0.6 }}
        >
          <CallToActionSection />
        </motion.div>

        <Footer />
      </motion.div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default LandingPage;
