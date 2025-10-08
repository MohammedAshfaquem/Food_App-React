import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import { toast } from "react-toastify";

const WishlistContext = createContext();

const getImageUrl = (img) => {
  if (!img) return "/default-food.png";
  return img.startsWith("http") ? img : `http://127.0.0.1:8000${img}`;
};

export const WishlistProvider = ({ children }) => {
  const { user, access } = useAuth(); 
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user || !access) {
        setWishlist([]);
        return;
      }

      try {
        const res = await API.get("/wishlist/", {
          headers: { Authorization: `Bearer ${access}` },
        });

        const products = res.data.data.map((item) => ({
          ...item.product,
          defaultImg: getImageUrl(item.product.image),
        }));

        setWishlist(products);
      } catch (err) {
        console.error("Wishlist fetch failed:", err);
        setWishlist([]);
      }
    };

    fetchWishlist();
  }, [user, access]);

  const addToWishlist = async (product) => {
    if (!user || !access) {
      toast.error("Please log in to add items to wishlist");
      return;
    }

    try {
      const res = await API.post(
        "/wishlist/add/",
        { product_id: product.id },
        { headers: { Authorization: `Bearer ${access}` } }
      );

      if (res.data.success) {
        const newItem = { ...product, defaultImg: getImageUrl(product.image) };
        setWishlist((prev) => [...prev, newItem]);
        toast.success("Added to wishlist ❤️");
      } else {
        toast.info("Item already in wishlist");
      }
    } catch (err) {
      console.error("Add to wishlist failed:", err.response?.data || err.message);
      toast.error("Failed to add to wishlist");
    }
  };

  const removeFromWishlist = async (product_id) => {
    if (!user || !access) return;

    try {
      await API.delete(`/wishlist/item/${product_id}/delete/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      setWishlist((prev) => prev.filter((item) => item.id !== product_id));
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error("Remove failed:", err.response?.data || err.message);
      toast.error("Failed to remove from wishlist");
    }
  };

  const moveToCart = async (item) => {
    if (!user || !access) {
      toast.error("Please log in to move item to cart");
      return;
    }

    try {
      await API.post(
        "/wishlist/move-to-cart/",
        { product_id: item.id },
        { headers: { Authorization: `Bearer ${access}` } }
      );

      addToCart(item);
      setWishlist((prev) => prev.filter((w) => w.id !== item.id));
    } catch (err) {
      console.error("Move to cart failed:", err.response?.data || err.message);
      toast.error("Failed to move item to cart");
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, moveToCart }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
