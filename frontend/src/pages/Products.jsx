import React, { useEffect, useRef, useState } from "react";
import FilterSidebar from "../components/FilterSidebar";
import axios from "axios";
import toast from "react-hot-toast";
import ProductCards from "../components/ProductCards";
import { useSearchParams } from "react-router-dom";
import BASE_URL from "../config/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [city, setCity] = useState("All");
  const [state, setState] = useState("All");

  const [priceRange, setPriceRange] = useState([0, 100000000]);

  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const [sortLabelText, setSortLabelText] = useState("Sort by price");

  const dropdownRef = useRef(null);

  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/product/allProducts`);

      if (res.data.success) {
        setProducts(res.data.products);
        setAllProducts(res.data.products);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];

    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (brand !== "All") {
      filtered = filtered.filter((p) => p.brand === brand);
    }

    if (state !== "All") {
      filtered = filtered.filter((p) => p.state === state);
    }

    if (city !== "All") {
      filtered = filtered.filter((p) => p.city === city);
    }

    filtered = filtered.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]
    );

    setProducts(filtered);
  }, [search, category, brand, state, city, priceRange, allProducts]);

  useEffect(() => {
    if (categoryFromUrl) {
      setCategory(categoryFromUrl === "All" ? "All" : categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const handleSort = (value) => {
    setOpenSort(false);
    let sorted = [...products];

    if (value === "low-high") {
      setSortLabelText("Price: Low → High");
      sorted.sort((a, b) => a.productPrice - b.productPrice);
    } else if (value === "high-low") {
      setSortLabelText("Price: High → Low");
      sorted.sort((a, b) => b.productPrice - a.productPrice);
    }

    setProducts(sorted);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="pt-10 pb-10 bg-[#ffffff]">
      <div className="w-full max-w-[1700px] mx-auto flex gap-8 px-6">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <FilterSidebar
            allProducts={allProducts}
            search={search}
            setSearch={setSearch}
            brand={brand}
            setBrand={setBrand}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            category={category}
            setCategory={setCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </div>

        {/* Product Section */}
        <div className="flex flex-col flex-1">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold hidden sm:block">Products</h2>

            {/* Mobile Filter Button */}
            <button
              className="md:hidden bg-teal-600 text-white px-4 py-2 rounded-lg text-sm"
              onClick={() => setOpenFilter(true)}
            >
              Filters
            </button>

            {/* Sort Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setOpenSort((prev) => !prev)}
                className="bg-white border px-4 py-2 rounded-lg text-sm shadow-sm flex items-center gap-2"
              >
                {sortLabelText}
                <span className={`${openSort ? "rotate-180" : ""} transition`}>
                  ▼
                </span>
              </button>

              {openSort && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-50">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleSort("low-high")}
                  >
                    Price: Low → High
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleSort("high-low")}
                  >
                    Price: High → Low
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-7">
            {/* UPDATED LOGIC HERE: Check loading state first */}
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center min-h-[40vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-teal-600 shadow-sm mb-4" />
                <p className="text-sm text-gray-500 font-medium tracking-wide">
                  Loading products...
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
              <div className="col-span-full flex flex-col items-center justify-center min-h-[40vh]">
                <p className="text-gray-500 text-lg font-medium">
                  No Products Found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {openFilter && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setOpenFilter(false)}
          ></div>

          {/* Sidebar */}
          <div className="relative bg-white w-72 h-full shadow-xl overflow-y-auto transform transition-transform duration-300">
            <FilterSidebar
              allProducts={allProducts}
              search={search}
              setSearch={setSearch}
              brand={brand}
              setBrand={setBrand}
              city={city}
              setCity={setCity}
              state={state}
              setState={setState}
              category={category}
              setCategory={setCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onClose={() => setOpenFilter(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;