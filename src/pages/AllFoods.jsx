import React, { useEffect, useState } from "react";
import FoodCard from "../Components/FoodCard";
import Navbar from "../Components/Navbar";
import API from "../services/api";

const ITEMS_PER_PAGE = 8;

const AllFoods = () => {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    API.get("/products/")
      .then((res) => setFoods(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const getFilteredFoods = () => {
    // Always hide out-of-stock items
    let result = foods.filter((f) => f.in_stock !== false && (typeof f.inventory !== "number" || f.inventory > 0));

    // Search filter
    if (search.trim()) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sorting / filtering
    if (filter === "price") {
      result = result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (filter === "rating") {
      result = result.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
    } else if (filter === "stock") {
      result = result.filter((item) => item.in_stock); // explicit stock filter retained for UI button
    }

    return result;
  };

  const handleFilterReset = () => {
    setFilter(null);
    setSearch("");
    setCurrentPage(1);
  };

  const filteredFoods = getFilteredFoods();

  // Pagination logic
  const totalPages = Math.ceil(filteredFoods.length / ITEMS_PER_PAGE);
  const paginatedFoods = filteredFoods.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar />
      <section className="bg-[#f7f5f1] min-h-screen px-8 py-10">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">All Foods</h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <input
              type="text"
              placeholder="Search food by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
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
                  onClick={() => {
                    if (key) setFilter(key);
                    else handleFilterReset();
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded text-sm font-semibold ${
                    filter === key ? "bg-purple-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {paginatedFoods.length > 0 ? (
              paginatedFoods.map((item) => (
                <FoodCard
                  key={item.id}
                  item={{
                    ...item,
                    defaultImg: item.image || "/default-food.png",
                  }}
                  viewMode="detailed"
                />
              ))
            ) : (
              <p className="text-gray-500">No food items found.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-10 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AllFoods;
