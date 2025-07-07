import React, { useEffect, useState } from "react";
import axios from "axios";
import FoodCard from "../Components/FoodCard";
import Navbar from "../Components/Navbar";

const AllFoods = () => {
  const [foods, setFoods] = useState([]); // All foods fetched from API
  const [search, setSearch] = useState(""); // Search query
  const [filter, setFilter] = useState(null); // Filter state (price, rating, stock)

  useEffect(() => {
    axios
      .get("http://localhost:3000/products") // Fetching data from API
      .then((res) => setFoods(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Filtering and sorting logic directly in the render
  const getFilteredFoods = () => {
    let result = foods.slice(); // Create a fresh copy of the foods array

    // Search filtering
    if (search.trim()) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sorting
    if (filter === "price") {
      result = result.sort((a, b) => a.price - b.price);
    } else if (filter === "rating") {
      result = result.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
    } else if (filter === "stock") {
      result = result.filter((item) => item.inStock);
    }

    return result;
  };

  const handleFilterReset = () => {
    setFilter(null); // Reset filter to "No Filter"
    setSearch(""); // Optional: Clear search as well
  };

  const filteredFoods = getFilteredFoods(); // Directly call the function to get the filtered foods

  return (
    <>
      <Navbar />
      <section className="bg-[#f7f5f1] min-h-screen px-8 py-10">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">All Foods</h1>

          {/* Search & Filter UI */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <input
              type="text"
              placeholder="Search food by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2"
            />
            <div className="flex flex-wrap gap-3">
              {[
                { key: null, label: "No Filter" },
                { key: "price", label: "Sort by Price" },
                { key: "rating", label: "Sort by Rating" },
                { key: "stock", label: "In Stock" },
              ].map(({ key, label }) => (
                <button
                  key={key ?? "nofilter"}
                  onClick={() => (key ? setFilter(key) : handleFilterReset())}
                  className={`px-4 py-2 rounded text-sm font-semibold ${
                    filter === key ? "bg-purple-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Food Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredFoods.length > 0 ? (
              filteredFoods.map((item) => (
                <FoodCard key={item.id} item={item} viewMode="detailed" />
              ))
            ) : (
              <p className="text-gray-500">No food items found.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AllFoods;
