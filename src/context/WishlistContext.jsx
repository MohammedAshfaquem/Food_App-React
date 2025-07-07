import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const res = await API.get(`/users/${user.id}`);
          setWishlist(res.data.wishlist || []);
        } catch (err) {
          console.error("Wishlist load failed", err);
        }
      } else {
        setWishlist([]);
      }
    };
    fetchWishlist();
  }, [user]);

  const addToWishlist = async (item) => {
    try {
      const updated = [...wishlist, item];
      await API.patch(`/users/${user.id}`, { wishlist: updated });
      setWishlist(updated);
      toast.success("Added to wishlist ❤️");
    } catch {
      toast.error("Failed to add to wishlist");
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      const updated = wishlist.filter((i) => i.id !== id);
      await API.patch(`/users/${user.id}`, { wishlist: updated });
      setWishlist(updated);
      toast.info("Removed from wishlist 💔");
    } catch {
      toast.error("Failed removal from wishlist");
    }
  };

  const moveToCart = async (item, cartContext) => {
    await removeFromWishlist(item.id);
    await cartContext.addToCart(item);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, moveToCart }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
