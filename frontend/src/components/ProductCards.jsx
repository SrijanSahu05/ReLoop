import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCards = ({ product, loading, mode = "public" }) => {
  const navigate = useNavigate();

  const navigateToViewProduct = () => {
    if (mode === "owner") {
      navigate(`/user/myitems/${product._id}`);
    } else {
      navigate(`/product/${product._id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-teal-600 shadow-sm mb-4" />
        <p className="text-sm text-gray-500 font-medium tracking-wide">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={navigateToViewProduct}
      className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden 
    cursor-pointer flex sm:flex-col hover:scale-110 hover:border-2 hover:border-green-500"
    >
      {/* Image */}
      <div className="w-32 h-32 sm:w-full sm:h-48 shrink-0 bg-gray-100">
        <img
          src={product?.productImg?.[0]?.url}
          alt={product?.productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col justify-between p-3 flex-1">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
            {product?.productName}
          </h3>
        </div>

        {/* Price + Location */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-green-600 font-bold text-sm sm:text-lg">
            ₹{product?.productPrice}
          </span>

          <span className="text-xs sm:text-xs rounded-md text-gray-800">
            {product?.city}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCards;