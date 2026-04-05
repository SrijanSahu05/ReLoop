import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductCards from "../components/ProductCards";

const SavedProducts = () => {
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSavedProducts = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(
        "http://localhost:8000/user/getsavedProducts",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setSavedProducts(res.data.savedProducts);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSavedProducts();
  }, []);

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-7">
        {savedProducts && savedProducts.length > 0 ? (
          savedProducts.map((product) => (
            <ProductCards
              key={product._id}
              product={product}
              loading={loading}
            />
          ))
        ) : (
          <p className="text-center w-full text-gray-500">Products Not Found</p>
        )}
      </div>
    </div>
  );
};

export default SavedProducts;