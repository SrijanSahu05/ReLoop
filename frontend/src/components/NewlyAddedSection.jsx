import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCards from "./ProductCards";
import BASE_URL from "../config/api";

const NewlyAddedSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Changed initial state to true for a smoother initial load
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${BASE_URL}/product/allProducts`
        );

        if (data.success) {
          setProducts(data.products.slice(0, 12));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Newly Added Products
          </h2>

          <button
            onClick={() => navigate("/products")}
            className="text-teal-600 font-semibold hover:underline transition-all"
          >
            View More &rarr;
          </button>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center min-h-[30vh]">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-teal-600 shadow-sm mb-4" />
              <p className="text-sm text-gray-500 font-medium tracking-wide">
                Loading latest products...
              </p>
            </div>
          ) : products && products.length > 0 ? (
            products.map((product) => (
              <ProductCards
                key={product._id}
                product={product}
                loading={loading}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center min-h-[30vh]">
              <p className="text-gray-500 font-medium text-lg">
                No products found.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Be the first to publish an item!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewlyAddedSection;
