import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaShoppingCart, FaTrash } from "react-icons/fa";

const WishlistPage = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // 🔁 Load wishlist on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const res = await API.get(`/users/${user.id}`);
          setWishlist(res.data.wishlist || []);
        } catch (err) {
          toast.error("Failed to load wishlist");
        }
      }
    };
    fetchWishlist();
  }, [user]);

  // ➕ Move to Cart & Remove from Wishlist
  const handleAddToCart = async (item) => {
    try {
      const userRes = await API.get(`/users/${user.id}`);
      const currentCart = userRes.data.cart || [];
      const currentWishlist = userRes.data.wishlist || [];

      const alreadyInCart = currentCart.find((p) => p.id === item.id);
      const updatedCart = alreadyInCart
        ? currentCart.map((p) =>
            p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
          )
        : [...currentCart, { ...item, quantity: 1 }];

      const updatedWishlist = currentWishlist.filter((w) => w.id !== item.id);

      await API.patch(`/users/${user.id}`, {
        cart: updatedCart,
        wishlist: updatedWishlist,
      });

      setWishlist(updatedWishlist);
      toast.success("Moved to cart 🎉");
    } catch (err) {
      toast.error("Failed to move item to cart");
    }
  };

  // ❌ Remove from Wishlist
  const handleRemove = async (id) => {
    try {
      const updatedWishlist = wishlist.filter((item) => item.id !== id);
      await API.patch(`/users/${user.id}`, { wishlist: updatedWishlist });
      setWishlist(updatedWishlist);
      toast.info("Removed from wishlist");
    } catch (err) {
      toast.error("Error removing item");
    }
  };

  return (
    <>
      <Navbar />
      <section className="p-10 min-h-screen bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <p className="text-gray-600">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow-md text-center"
              >
                <img
                  src={item.defaultImg}
                  alt={item.title}
                  className="h-40 mx-auto mb-4"
                />
                <h2 className="font-bold text-lg">{item.title}</h2>
                <p className="text-sm text-gray-600 mb-2">₹{item.price}</p>
                <div className="flex justify-center gap-3 mt-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-green-600 text-white px-4 py-1 rounded-full flex items-center gap-2"
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default WishlistPage;
