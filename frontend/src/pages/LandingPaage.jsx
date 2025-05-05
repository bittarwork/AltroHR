// src/pages/LandingPage.jsx
import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import UserRolesSection from "../components/UserRolesSection";
import WhyUsSection from "../components/WhyUsSection";
import FAQSection from "../components/FAQSection";
import CallToActionSection from "../components/CallToActionSection";
import Footer from "../components/Footer";
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 ">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <UserRolesSection />
      <WhyUsSection></WhyUsSection>
      <FAQSection></FAQSection>
      <CallToActionSection></CallToActionSection>
      <Footer></Footer>
    </div>
  );
};

export default LandingPage;
