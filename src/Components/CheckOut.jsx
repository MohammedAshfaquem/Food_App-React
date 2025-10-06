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

  const handlePayment = async () => {
    if (!address || !city || !state || !pincode) {
      toast.error("Please fill all required address fields");
      return;
    }

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
      <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="p-2 rounded border" />
      <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="p-2 rounded border" />
      <input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="p-2 rounded border" />
      <input placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} className="p-2 rounded border" />
      <input placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} className="p-2 rounded border" />
      <button onClick={handlePayment} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
        Place & Pay ₹{total.toFixed(2)}
      </button>
    </div>
  );
};

export default CheckoutFooter;
