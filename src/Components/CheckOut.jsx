import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CheckoutFooter = () => {
  const { user } = useAuth();
  const { cart, updateCart } = useCart();
  const navigate = useNavigate();
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [address, setAddress] = useState("");

  const handlePlaceOrderClick = () => {
    if (!user) {
      toast.error("Please log in first.");
      return;
    }

    if (!cart || cart.length === 0) {
      toast.warn("Your cart is empty.");
      return;
    }

    setShowAddressInput(true);
  };

  const handleConfirmOrder = async () => {
    if (!address.trim()) {
      toast.warn("Please enter your address.");
      return;
    }

    try {
      const res = await API.get(`/users/${user.id}`);
      const existingOrders = res.data.orders || [];

      const timestamp = new Date().toISOString();

      const ordersWithDetails = cart.map((item) => ({
        ...item,
        orderedAt: timestamp,
        address,
        status: "Pending",
      }));

      const updatedOrders = [...existingOrders, ...ordersWithDetails];

      await API.patch(`/users/${user.id}`, {
        orders: updatedOrders,
        cart: [],
      });

      updateCart([]);
      toast.success("Order placed successfully! 🎉");
      navigate("/orders");
    } catch (err) {
      toast.error("Something went wrong while placing the order.");
      console.error(err);
    }
  };

  return (
    <div className="text-center w-full sm:w-auto mt-6 sm:mt-0">
      {!showAddressInput ? (
        <button
          onClick={handlePlaceOrderClick}
          className="w-full sm:w-auto bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-black border border-black transition duration-300 ease-in-out"
        >
          Place Order
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <textarea
            rows={3}
            placeholder="Enter your delivery address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-gray-400 rounded-lg px-4 py-2 w-full resize-none"
          />
          <button
            onClick={handleConfirmOrder}
            className="w-full sm:w-auto bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition"
          >
            Confirm Order
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutFooter;
