import { Car, LayoutGrid, Shirt, Smartphone, Sofa, Tv } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const CategorySection = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "All", icon: <LayoutGrid size={34} /> },
    { name: "Vehicles", icon: <Car size={34} /> },
    { name: "Electronics", icon: <Tv size={34} /> },
    { name: "Mobile", icon: <Smartphone size={34} /> },
    { name: "Furniture", icon: <Sofa size={34} /> },
    { name: "Clothes", icon: <Shirt size={34} /> },
  ];

  const handleNavigate = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Popular Categories
          </h2>

          <p className="mt-4 text-gray-500 text-lg">
            Explore the most searched categories on Store4U
          </p>

          <div className="w-24 h-1 bg-teal-600 mx-auto mt-5 rounded-full"></div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => handleNavigate(cat.name)}
              className="group cursor-pointer bg-white 
              rounded-3xl p-10 text-center 
              shadow-sm hover:shadow-2xl 
              transition-all duration-300 hover:-translate-y-2"
            >
              {/* ICON */}
              <div className="flex justify-center mb-5">
                <div
                  className="w-20 h-20 flex items-center justify-center 
                  rounded-full bg-teal-100 text-teal-600 
                  group-hover:bg-teal-600 group-hover:text-white 
                  transition-all duration-300"
                >
                  {cat.icon}
                </div>
              </div>

              {/* TEXT */}
              <p className="text-lg font-semibold text-gray-700 group-hover:text-teal-600">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
