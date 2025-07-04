import Navbar from "../Components/Navbar";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { useEffect, useState } from "react";

const CartPage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Load cart
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        const res = await API.get(`/users/${user.id}`);
        setCart(res.data.cart || []);
      }
    };
    fetchCart();
  }, [user]);

  const updateCart = async (updatedCart) => {
    setCart(updatedCart);
    await API.patch(`/users/${user.id}`, { cart: updatedCart });
  };

  const increment = (id) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  };

  const decrement = (id) => {
    const updated = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(updated);
  };

  const remove = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    updateCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <div className="flex p-6 gap-6">
        {/* Cart Items */}
        <div className="flex-1 grid grid-cols-3 gap-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="border rounded p-4 bg-white text-center shadow"
            >
              <img
                src={item.defaultImg}
                alt={item.title}
                className="h-28 mx-auto"
              />
              <h3 className="font-bold">{item.title}</h3>
              <p>Price: ₹{item.price}</p>
              <div className="flex items-center justify-center gap-3 my-2">
                <button onClick={() => decrement(item.id)}>
                  <FaMinus />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => increment(item.id)}>
                  <FaPlus />
                </button>
              </div>
              <button
                className="text-red-500"
                onClick={() => remove(item.id)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {/* Checkout Summary */}
        <div className="w-1/4 bg-purple-600 text-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Checkout</h2>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm">₹{item.price}</p>
              </div>
              <span>x {item.quantity}</span>
            </div>
          ))}
          <hr className="my-4 border-white" />
          <div className="text-right font-bold text-lg">
            Total: ₹{total.toFixed(2)}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
