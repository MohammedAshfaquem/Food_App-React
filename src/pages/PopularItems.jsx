import React, { useEffect, useState } from "react";
import axios from "axios";
import FoodCard from "../Components/FoodCard";
import { useNavigate } from "react-router-dom";

const PopularItems = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <section className="bg-[#f7f5f1] py-16 px-8">
      <div className="max-w-screen-xl mx-auto">
        <p className="text-purple-600 font-semibold uppercase mb-2">
          Crispy, Every Bite Taste
        </p>
        <h2 className="text-5xl font-extrabold text-black mb-10">
          Popular Food Items
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((item) => (
            <FoodCard item={item} viewMode="simple" />
          ))}
        </div>
        <div
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <button
            onClick={() => navigate("/all-foods")}
            style={{
              cursor: "pointer",
              marginTop: "40px",
              height: "60px",
              width: "200px",
              backgroundColor: "violet",
              fontWeight: "bold",
              borderRadius: "12px",
              color: "white",
            }}
          >
            View More
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularItems;
