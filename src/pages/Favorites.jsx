import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

// Helper function to resolve image URLs
const getImageUrl = (img) => {
  if (!img) return "/default-food.png"; // fallback if no image
  return img.startsWith("http") ? img : `http://127.0.0.1:8000${img}`;
};

const Favorites = () => {
  const [wishlistFoods, setWishlistFoods] = useState([]);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user || !token) {
        setWishlistFoods([]); // clear wishlist when logged out
        return;
      }

      try {
        const res = await API.get("/wishlist/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const products = res.data.data.map((item) => ({
          ...item.product,
          image: getImageUrl(item.product.image), // ✅ always convert relative → absolute
        }));

        setWishlistFoods(products);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        setWishlistFoods([]); // clear on error too
      }
    };

    fetchWishlist();
  }, [user, token]);

  if (!user)
    return (
      <p className="text-gray-500 text-center mt-20">
        Please log in to view your wishlist.
      </p>
    );

  return (
    <div className="px-8 py-10 min-h-screen bg-[#f7f5f1]">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      {wishlistFoods.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistFoods.map((food) => (
            <div
              key={food.id}
              className="relative bg-purple-100 shadow rounded-[16px] overflow-hidden h-80 flex flex-col justify-between"
            >
              {/* Product Image */}
              <div className="flex justify-center items-center flex-1">
                <img
                  src={food.image}
                  alt={food.title}
                  className="w-50 h-50 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-food.png";
                  }}
                />
              </div>

              {/* Product Title & Price */}
              <div className="p-3 text-center border-t">
                <h3 className="text-lg font-medium">{food.title}</h3>
                <p className="text-red-600 font-bold">₹{food.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
