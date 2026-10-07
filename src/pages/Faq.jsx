import React, { useState } from "react";
import Header from "../components/Login/Layout/Header";
import Footer from "../components/Login/Layout/Footer";

const Faq = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <FAQ />
      <Footer />
    </div>
  );
};

const FAQ = () => {
  const [activeTab, setActiveTab] = useState(0);

  const toggleTab = (tab) => {
    if (activeTab === tab) {
      setActiveTab(0);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="w-full py-12 md:py-16">
      <div className="w-[95%] sm:w-[92%] md:w-[90%] lg:w-[85%] xl:w-[80%] mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base md:text-lg">
            Find answers to the most common questions from our customers.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* FAQ 1 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleTab(1)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition"
            >
              <span>How do I track my orders?</span>
              <span className="text-xl">{activeTab === 1 ? "-" : "+"}</span>
            </button>

            {activeTab === 1 && (
              <div className="px-5 pb-5 border-t border-gray-100">
                <p className="pt-4 text-gray-600 leading-7">
                  You can track your orders from your account dashboard. Go to
                  the orders section and click on the tracking option to see the
                  latest delivery updates.
                </p>
              </div>
            )}
          </div>

          {/* FAQ 2 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleTab(2)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition"
            >
              <span>What payment methods do you accept?</span>
              <span className="text-xl">{activeTab === 2 ? "-" : "+"}</span>
            </button>

            {activeTab === 2 && (
              <div className="px-5 pb-5 border-t border-gray-100">
                <p className="pt-4 text-gray-600 leading-7">
                  We accept debit cards, credit cards, bank transfers, and
                  secure online payment methods for safe and easy checkout.
                </p>
              </div>
            )}
          </div>

          {/* FAQ 3 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleTab(3)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition"
            >
              <span>How long does shipping take?</span>
              <span className="text-xl">{activeTab === 3 ? "-" : "+"}</span>
            </button>

            {activeTab === 3 && (
              <div className="px-5 pb-5 border-t border-gray-100">
                <p className="pt-4 text-gray-600 leading-7">
                  Shipping usually takes 3 to 7 business days depending on your
                  location and product availability.
                </p>
              </div>
            )}
          </div>

          {/* FAQ 4 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleTab(4)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition"
            >
              <span>Can I return or exchange a product?</span>
              <span className="text-xl">{activeTab === 4 ? "-" : "+"}</span>
            </button>

            {activeTab === 4 && (
              <div className="px-5 pb-5 border-t border-gray-100">
                <p className="pt-4 text-gray-600 leading-7">
                  Yes, you can return or exchange eligible products within the
                  return policy period if the item is unused and in original
                  packaging.
                </p>
              </div>
            )}
          </div>

          {/* FAQ 5 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleTab(5)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition"
            >
              <span>How can I contact customer support?</span>
              <span className="text-xl">{activeTab === 5 ? "-" : "+"}</span>
            </button>

            {activeTab === 5 && (
              <div className="px-5 pb-5 border-t border-gray-100">
                <p className="pt-4 text-gray-600 leading-7">
                  You can contact our customer support team through email, live
                  chat, or by using the contact form available on our website.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Faq;
