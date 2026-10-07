import React from "react";
import { useNavigate } from "react-router-dom";

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();

  const submitHandle = (category) => {
    navigate(`/products?category=${category.title}`);
    setDropDown(false);
    window.location.reload(); // Optional: consider avoiding full reload
  };

  return (
    <div className="max-h-80 overflow-y-auto">
      {categoriesData &&
        categoriesData.map((category, index) => (
          <div
            key={index}
            onClick={() => submitHandle(category)}
            className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-indigo-100 transition rounded-lg"
          >
            <img
              src={category.image_Url}
              alt={category.title}
              className="w-10 h-10 object-cover rounded-md"
            />
            <h3 className="text-gray-800 font-medium text-sm hover:text-indigo-700 transition">
              {category.title}
            </h3>
          </div>
        ))}
    </div>
  );
};

export default DropDown;
