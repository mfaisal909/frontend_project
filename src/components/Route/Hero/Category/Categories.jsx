import React from "react";
import { brandingData, categoriesData } from "../../../../static/data";
import { AiFillGift, AiOutlineShoppingCart } from "react-icons/ai";
import { MdLocalOffer } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const icons = {
  TbTruckDelivery: <TbTruckDelivery size={30} className="text-blue-600" />,
  AiFillGift: <AiFillGift size={30} className="text-blue-600" />,
  MdLocalOffer: <MdLocalOffer size={30} className="text-blue-600" />,
  AiOutlineShoppingCart: (
    <AiOutlineShoppingCart size={30} className="text-blue-600" />
  ),
};

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section className="py-14 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {brandingData.map((feature) => (
            <div
              key={feature.id}
              className="group flex items-center gap-4 rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition">
                {icons[feature.icon]}
              </div>

              <div>
                <h3 className="font-semibold text-base text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Categories Heading */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Shop by Categories
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Explore our most popular shopping categories
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {categoriesData &&
            categoriesData.map((category) => {
              const handleClick = () => {
                navigate(`/products?category=${category.title}`);
              };

              return (
                <div
                  key={category.id}
                  onClick={handleClick}
                  className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer p-5 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4 overflow-hidden">
                    <img
                      src={category.image_Url}
                      alt={category.title}
                      className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://cdn-icons-png.flaticon.com/512/3081/3081559.png";
                      }}
                    />
                  </div>

                  <h5 className="text-gray-800 font-semibold text-sm sm:text-base">
                    {category.title}
                  </h5>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
