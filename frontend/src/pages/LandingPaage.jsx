// src/pages/LandingPage.jsx
import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/Main/HeroSection";
import FeaturesSection from "../components/Main/FeaturesSection";
import UserRolesSection from "../components/Main/UserRolesSection";
import WhyUsSection from "../components/Main/WhyUsSection";
import FAQSection from "../components/Main/FAQSection";
import CallToActionSection from "../components/Main/CallToActionSection";
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
