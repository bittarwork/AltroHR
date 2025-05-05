// src/components/FAQSection.jsx
import React from "react";
import { Disclosure } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";

const faqs = [
  {
    question: "هل يمكنني تسجيل الحضور من الهاتف؟",
    answer: "نعم، النظام متجاوب بالكامل ويعمل على الهواتف والحواسيب.",
  },
  {
    question: "هل يمكن تصدير التقارير بصيغ PDF أو Excel؟",
    answer: "نعم، يمكنك تصدير تقارير الحضور والأداء بصيغ متعددة.",
  },
  {
    question: "هل يدعم النظام صلاحيات حسب الدور؟",
    answer: "بالتأكيد، كل مستخدم يرى فقط ما يخصه حسب نوع الحساب.",
  },
  {
    question: "هل النظام مجاني؟",
    answer:
      "النظام يمكن تجربته مجانًا لفترة محدودة، ويمكن تخصيص خطة حسب حاجتك.",
  },
];

const FAQSection = () => {
  const { darkMode } = useTheme();

  const sectionBg = darkMode ? "bg-gray-900" : "bg-gray-50";
  const questionBg = darkMode ? "bg-gray-800" : "bg-white";
  const questionText = darkMode ? "text-gray-100" : "text-gray-800";
  const answerBg = darkMode ? "bg-gray-800" : "bg-gray-50";
  const answerText = darkMode ? "text-gray-300" : "text-gray-700";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
  const titleColor = darkMode ? "text-white" : "text-gray-800";

  return (
    <section className={`${sectionBg} py-20`} id="faq" dir="rtl">
      <div className="max-w-3xl mx-auto px-4">
        <h2
          className={`text-3xl md:text-4xl font-bold text-center mb-12 ${titleColor}`}
        >
          الأسئلة الشائعة
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Disclosure key={index}>
              {({ open }) => (
                <div
                  className={`border ${borderColor} rounded-lg overflow-hidden`}
                >
                  <Disclosure.Button
                    className={`w-full flex justify-between items-center px-4 py-3 font-semibold transition ${questionBg} ${questionText}`}
                  >
                    <span>{faq.question}</span>
                    <FaChevronDown
                      className={`w-4 h-4 transform transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel
                    className={`px-4 py-3 text-sm leading-relaxed ${answerText} ${answerBg}`}
                  >
                    {faq.answer}
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
