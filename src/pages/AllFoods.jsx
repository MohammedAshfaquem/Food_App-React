import React, { useEffect, useState } from "react";
import axios from "axios";
import FoodCard from "../Components/FoodCard";
import Navbar from "../Components/Navbar";

const AllFoods = () => {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(null); // 'price' | 'rating' | 'stock'

  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((res) => setFoods(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const applyFilter = () => {
    let filtered = [...foods];

    if (search.trim()) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === "price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filter === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (filter === "stock") {
      filtered = filtered.filter((item) => item.inStock);
    }

    return filtered;
  };

  const filteredFoods = applyFilter();

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
              <button
                onClick={() => setFilter(null)}
                className={`px-4 py-2 rounded text-sm font-semibold ${
                  filter === null ? "bg-purple-600 text-white" : "bg-gray-200"
                }`}
              >
                No Filter
              </button>
              <button
                onClick={() => setFilter("price")}
                className={`px-4 py-2 rounded text-sm font-semibold ${
                  filter === "price" ? "bg-purple-600 text-white" : "bg-gray-200"
                }`}
              >
                Sort by Price
              </button>
              <button
                onClick={() => setFilter("rating")}
                className={`px-4 py-2 rounded text-sm font-semibold ${
                  filter === "rating" ? "bg-purple-600 text-white" : "bg-gray-200"
                }`}
              >
                Sort by Rating
              </button>
              <button
                onClick={() => setFilter("stock")}
                className={`px-4 py-2 rounded text-sm font-semibold ${
                  filter === "stock" ? "bg-purple-600 text-white" : "bg-gray-200"
                }`}
              >
                In Stock
              </button>
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
