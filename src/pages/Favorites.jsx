import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const getImageUrl = (img) => {
  if (!img) return "/default-food.png"; 
  return img.startsWith("http") ? img : `http://127.0.0.1:8000${img}`;
};

const TopFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopFavorites = async () => {
      if (!user) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/admin/reports/top-favorites/");
        console.log("Top favorites API response:", res.data);

        if (res.data.success && Array.isArray(res.data.data)) {
          const products = res.data.data.map((item) => ({
            id: item.id,
            title: item.title,
            image: getImageUrl(item.image),
            count: item.favorites_count || 0, 
          }));
          setFavorites(products);
        } else {
          setFavorites([]);
          setError("No data returned from server.");
        }
      } catch (err) {
        console.error("Failed to fetch top favorited products:", err.response || err);
        setError(err.response?.data?.message || "Failed to fetch top favorited products.");
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopFavorites();
  }, [user]);

  if (!user) {
    return (
      <p className="text-gray-500 text-center mt-20">
        Please log in to view this section.
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-gray-500 text-center mt-20">Loading top favorites...</p>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-20">{error}</p>;
  }

  if (favorites.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-20">
        No favorites data available.
      </p>
    );
  }

  return (
    <div className="px-8 py-10 min-h-screen bg-[#f7f5f1]">
      <h2 className="text-2xl font-bold mb-6">Top Favorited Foods</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {favorites.map((food) => (
          <div
            key={food.id}
            className="relative bg-purple-100 shadow rounded-[16px] overflow-hidden flex flex-col justify-center items-center p-4 h-70" 
            // Increased height to h-80 (~20rem)
          >
            <div className="absolute top-2 right-2 bg-purple-700 text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full shadow">
              {food.count}
            </div>

            <img
              src={food.image}
              alt={food.title}
              className="w-32 h-32 object-cover rounded"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-food.png";
              }}
            />

            <h3 className="mt-4 text-center font-semibold">{food.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopFavorites;
