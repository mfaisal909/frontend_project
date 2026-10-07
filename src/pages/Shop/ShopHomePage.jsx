
import React from "react";
import ShopInfo from "../../components/Shop/ShopInfo.jsx";
import ShopProfileData from "../../components/Shop/ShopProfileData.jsx";

const ShopHomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          {/* Shop Sidebar */}
          <aside className="w-full lg:w-[28%] xl:w-[25%] lg:sticky lg:top-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="max-h-[calc(100vh-3rem)] overflow-y-auto">
                <ShopInfo isOwner={true} />
              </div>
            </div>
          </aside>

          {/* Shop Profile Content */}
          <main className="w-full lg:w-[72%] xl:w-[75%]">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <ShopProfileData isOwner={true} />
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default ShopHomePage;