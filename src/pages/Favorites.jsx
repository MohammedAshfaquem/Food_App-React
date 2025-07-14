import { useEffect, useState } from "react";
import API from "../services/api";

const Favorites = () => {
  const [foodCounts, setFoodCounts] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const res = await API.get("/users");
      const favCount = {};
      res.data.forEach((user) => {
        user.wishlist?.forEach((food) => {
          favCount[food.id] = (favCount[food.id] || 0) + 1;
        });
      });

      const foodRes = await API.get("/products");
      const final = foodRes.data.map((food) => ({
        ...food,
        count: favCount[food.id] || 0,
      }));
      setFoodCounts(final);
    };
    fetchFavorites();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Most Favorited Foods</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {foodCounts
          .filter((f) => f.count > 0)
          .sort((a, b) => b.count - a.count)
          .map((food) => (
            <div
              key={food.id}
              className="relative bg-purple-100 shadow rounded-[16px] overflow-hidden h-80 flex flex-col justify-between  "
            >
              {/* Round count badge at top-right */}
              <span className="absolute top-2 right-2 bg-purple-600 text-white text-sm font-semibold h-10 w-10 rounded-full z-10 flex items-center justify-center">
                {food.count}
              </span>

              {/* Centered Image */}
              <div className="flex justify-center items-center flex-1">
                <img
                  src={food.defaultImg}
                  alt={food.title}
                  className="w-50 h-50 object-cover"
                />
              </div>

              {/* Title at bottom */}
              <div className="p-3 text-center border-t">
                <h3 className="text-lg font-medium">{food.title}</h3>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Favorites;
