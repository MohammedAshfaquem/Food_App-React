import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, access } = useAuth(); // ✅ use access token
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Fetch cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      if (!user || !access) {
        setCart([]);
        return;
      }

      try {
        const res = await API.get("/cart/", {
          headers: { Authorization: `Bearer ${access}` },
        });

        const items = res.data.data.items.map((i) => ({
          id: i.id,
          quantity: i.qty,
          title: i.product.title,
          price: parseFloat(i.product.price),
          defaultImg: i.product.image || "/default-food.png",
          productId: i.product.id,
          inventory: typeof i.product.inventory === "number" ? i.product.inventory : undefined,
        }));

        setCart(items);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setCart([]);
      }
    };

    fetchCart();
  }, [user, access]);

  // Add item to cart
  const addToCart = async (item) => {
    if (!user || !access) {
      toast.error("Please log in to add to cart");
      return;
    }

    try {
      await API.post(
        "/cart/add/",
        { product_id: item.productId || item.id, qty: 1 },
        { headers: { Authorization: `Bearer ${access}` } }
      );

      // fetch updated cart
      const cartRes = await API.get("/cart/", {
        headers: { Authorization: `Bearer ${access}` },
      });

      const updatedItems = cartRes.data.data.items.map((i) => ({
        id: i.id,
        quantity: i.qty,
        title: i.product.title,
        price: parseFloat(i.product.price),
        defaultImg: i.product.image || "/default-food.png",
        productId: i.product.id,
        inventory: typeof i.product.inventory === "number" ? i.product.inventory : undefined,
      }));

      setCart(updatedItems);
      toast.success("Item added to cart");
    } catch (err) {
      console.error("Add to cart failed:", err.response || err.message);
      toast.error("Failed to add to cart");
    }
  };

  // Increment item quantity
  const incrementItem = async (cartItemId) => {
    const item = cart.find((i) => i.id === cartItemId);
    if (!item) return;

    // Optimistic guard: prevent going beyond inventory if known
    if (typeof item.inventory === "number" && item.quantity >= item.inventory) {
      toast.info(`Only ${item.inventory} items available`);
      return;
    }

    try {
      const res = await API.post(
        `/cart/item/${cartItemId}/update/`,
        { qty: item.quantity + 1 },
        { headers: { Authorization: `Bearer ${access}` } }
      );

      if (res.data.success) {
        setCart((prev) =>
          prev.map((i) =>
            i.id === cartItemId ? { ...i, quantity: res.data.data.qty } : i
          )
        );
      } else {
        toast.info(res.data.message || "Quantity update failed");
      }
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.detail || "Failed to increment item";
      toast.error(message);
    }
  };

  // Decrement item quantity
  const decrementItem = async (cartItemId) => {
    const item = cart.find((i) => i.id === cartItemId);
    if (!item) return;

    try {
      const res = await API.post(
        `/cart/item/${cartItemId}/update/`,
        { qty: item.quantity - 1 },
        { headers: { Authorization: `Bearer ${access}` } }
      );

      if (res.data.success) {
        if (res.data.message === "Item removed from cart") {
          setCart((prev) => prev.filter((i) => i.id !== cartItemId));
          toast.success("Item removed from cart");
        } else {
          setCart((prev) =>
            prev.map((i) =>
              i.id === cartItemId ? { ...i, quantity: res.data.data.qty } : i
            )
          );
        }
      } else {
        toast.info(res.data.message || "Quantity update failed");
      }
    } catch (err) {
      console.error("Decrement failed:", err);
      toast.error("Failed to decrement item");
    }
  };

  // Remove single item from cart
  const removeFromCart = async (id) => {
    try {
      await API.delete(`/cart/item/${id}/delete/`, {
        headers: { Authorization: `Bearer ${access}` },
      });

      setCart((prev) => prev.filter((i) => i.id !== id));
      toast.success("Removed from cart");
    } catch (err) {
      console.error("Remove failed:", err);
      toast.error("Failed to remove item");
    }
  };

  // Clear cart completely
  const clearCart = async () => {
    try {
      await API.post(
        "/cart/clear/",
        {},
        { headers: { Authorization: `Bearer ${access}` } }
      );
    } catch (err) {
      console.error("Failed to clear cart in backend:", err);
    }

    setCart([]); // clear local state
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        incrementItem,
        decrementItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
