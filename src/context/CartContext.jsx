import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        const res = await API.get(`/users/${user.id}`);
        setCart(res.data.cart || []);
      } else {
        setCart([]);
      }
    };
    fetchCart();
  }, [user]);

  const addToCart = async (item) => {
    if (!user) {
      toast.error("Please log in to add to cart");
      return;
    }
    try {
      const res = await API.get(`/users/${user.id}`);
      const current = res.data.cart || [];
      const exists = current.find((p) => p.id === item.id);
      const updated = exists
        ? current.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p))
        : [...current, { ...item, quantity: 1 }];

      await API.patch(`/users/${user.id}`, { cart: updated });
      setCart(updated);
      toast.success("Added to cart 🎉");
    } catch {
      toast.error("Cart update failed");
    }
  };

  const updateCart = async (newCart) => {
    if (!user) return;
    setCart(newCart);
    try {
      await API.patch(`/users/${user.id}`, { cart: newCart });
    } catch {
      toast.error("Failed to update cart");
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCart }}>
      {children}
    </CartContext.Provider>
  );
};
