import React, { useEffect, useState } from "react";
import FoodCard from "../Components/FoodCard";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const PopularItems = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/products/") 
      .then((res) => {
        console.log("Products fetched:", res.data);

        const sortedProducts = res.data.sort(
          (a, b) => parseFloat(b.rating) - parseFloat(a.rating)
        );
        setProducts(sortedProducts.slice(0, 4));
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-[#f7f5f1] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <p className="text-purple-600 font-semibold uppercase text-sm sm:text-base mb-2">
          Crispy, Every Bite Taste
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mb-8 sm:mb-10">
          Popular Food Items
        </h2>

        {loading && (
          <p className="text-gray-500 text-center">Loading products...</p>
        )}

        {!loading && products.length === 0 && (
          <p className="text-gray-500 text-center">No products available</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((item) => (
            <FoodCard
              key={item.id}
              item={{
                ...item,
                image: item.image.startsWith("http")
                  ? item.image
                  : `http://127.0.0.1:8000${item.image}`,
              }}
            />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button
            type="button"
            onClick={() => {
              console.log("View More clicked");
              navigate("/all-foods");
            }}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            View More
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularItems;
