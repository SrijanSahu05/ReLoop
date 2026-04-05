import React from "react";

const FilterSidebar = ({
  allProducts,
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
  city,
  setCity,
  state,
  setState,
  priceRange,
  setPriceRange,
  onClose,
}) => {
  const Categories = allProducts.map((p) => p.category);
  const UniqueCategory = ["All", ...new Set(Categories)];
  const Brands = allProducts.map((p) => p.brand);
  const UniqueBrand = ["All", ...new Set(Brands)];
  const City = allProducts.map((p) => p.city);
  const UniqueCity = ["All", ...new Set(City)];
  const State = allProducts.map((p) => p.state);
  const UniqueState = ["All", ...new Set(State)];

  const handleCategoryClick = (val) => {
    setCategory(val);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
  };

  const handleMinChange = (e) => {
    const val = e.target.value;

    if (val === "") {
      setPriceRange(["", priceRange[1]]);
      return;
    }

    const value = Number(val);
    if (value <= priceRange[1]) setPriceRange([value, priceRange[1]]);
  };

  const handleMaxChange = (e) => {
    const val = e.target.value;

    if (val === "") {
      setPriceRange([priceRange[0], ""]);
      return;
    }

    const value = Number(val);
    if (value >= priceRange[0]) setPriceRange([priceRange[0], value]);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, 10000000]);
    setCity("All");
    setState("All");
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md h-full md:h-max w-72">
      {/* Mobile Header */}
      <div className="flex justify-between items-center mb-4 md:hidden">
        <h2 className="font-semibold text-lg">Filters</h2>

        <button onClick={onClose} className="text-xl">
          ✕
        </button>
      </div>
      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-white p-2 rounded-md border-gray-400 border-2 w-full"
      />

      {/* Category */}
      <h1 className="mt-5 font-semibold text-xl">Category</h1>
      <div className="flex flex-col gap-2 mt-3">
        {UniqueCategory.map((item, idx) => (
          <label key={idx} className="flex items-center gap-2">
            <input
              type="radio"
              checked={category === item}
              onChange={() => handleCategoryClick(item)}
            />
            {item}
          </label>
        ))}
      </div>

      {/* Brand */}
      <h1 className="mt-5 font-semibold text-xl">Brand</h1>
      <select
        className="bg-white w-full p-2 border-gray-200 border-2 rounded-md"
        value={brand}
        onChange={handleBrandChange}
      >
        {UniqueBrand.map((item, idx) => (
          <option key={idx} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>

      {/* State */}
      <h1 className="mt-5 font-semibold text-xl">State</h1>
      <select
        className="bg-white w-full p-2 border-gray-200 border-2 rounded-md"
        value={state}
        onChange={handleStateChange}
      >
        {UniqueState.map((item, idx) => (
          <option key={idx} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>

      {/* City */}
      <h1 className="mt-5 font-semibold text-xl">City</h1>
      <select
        className="bg-white w-full p-2 border-gray-200 border-2 rounded-md"
        value={city}
        onChange={handleCityChange}
      >
        {UniqueCity.map((item, idx) => (
          <option key={idx} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>

      {/* Price range */}
      <h1 className="mt-5 font-semibold text-xl mb-3">Price Range</h1>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center mt-1">
          <input
            type="number"
            min="0"
            max="10000"
            value={priceRange[0]}
            onChange={handleMinChange}
            disabled
            className="bg-white w-full p-2 border rounded"
          />
          <span>-</span>
          <input
            type="number"
            min="0"
            max="10000000"
            value={priceRange[1]}
            onChange={handleMaxChange}
            disabled
            className="bg-white w-full p-2 border rounded"
          />
        </div>
        <input
          type="range"
          min="0"
          max="10000"
          className="w-full mt-2"
          value={priceRange[0]}
          onChange={handleMinChange}
        />
        <input
          type="range"
          min="0"
          max="10000000"
          className="w-full mt-2"
          value={priceRange[1]}
          onChange={handleMaxChange}
        />
      </div>

      {/* Reset Button */}
      <button
        className="bg-teal-600 text-white font-semibold mt-5 cursor-pointer w-full p-2 rounded-md 
        hover:bg-teal-700"
        onClick={resetFilters}
      >
        Reset Filter
      </button>
    </div>
  );
};

export default FilterSidebar;