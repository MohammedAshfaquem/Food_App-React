import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { handleRazorpayPayment } from "../features/payment/razorpay";

const CheckoutFooter = () => {
  const { cart, clearCart } = useCart();
  const { access, user } = useAuth();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // ₹

  const validateFields = () => {
    if (!address.trim()) {
      toast.error("Address is required");
      return false;
    }
    if (!city.trim()) {
      toast.error("City is required");
      return false;
    }
    if (!state.trim()) {
      toast.error("State is required");
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Pincode must be exactly 6 digits");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number is required and must be 10 digits");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateFields()) return;

    if (!access) {
      toast.error("Please login first");
      return;
    }

    await handleRazorpayPayment({
      totalAmount: total,
      token: access,
      cart,
      userInfo: { name: user?.username || "", email: user?.email || "", phone, address, city, state, pincode },
      clearCart,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="p-2 rounded border"
      />
      <input
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="p-2 rounded border"
      />
      <input
        placeholder="State"
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="p-2 rounded border"
      />
      <input
        placeholder="Pincode"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
        className="p-2 rounded border"
        maxLength={6}
      />
      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="p-2 rounded border"
        maxLength={10}
      />
      <button
        onClick={handlePayment}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        Place & Pay ₹{total.toFixed(2)}
      </button>
    </div>
  );
};

export default CheckoutFooter;
