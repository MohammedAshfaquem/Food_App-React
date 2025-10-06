import { toast } from "react-toastify";
import API from "../../services/api";

export const handleRazorpayPayment = async ({
  totalAmount, // in ₹
  token,
  cart,
  userInfo, // { name, email, phone, address, city, state, pincode }
  clearCart, // function to clear cart after success
}) => {
  if (!token) return toast.error("Please login first");

  // Load Razorpay SDK
  const loaded = await new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  if (!loaded) return toast.error("Razorpay SDK failed to load");

  try {
    // Create order on backend (amount in paise)
    const orderRes = await API.post(
      "/razorpay/create-order/",
      { amount: Number(Number(totalAmount).toFixed(2)) }, // backend converts to paise
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!orderRes.data.success) {
      console.error("Create order failed:", orderRes.data);
      return toast.error(orderRes.data.message || "Failed to create order");
    }

    const { order_id, amount, currency } = orderRes.data.data; // amount in paise

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount, // in paise
      currency,
      name: "My Food Store",
      description: "Order Payment",
      order_id,
      display_currency: "INR",
      display_amount: (Number(amount) / 100).toFixed(2), // ensure correct display in ₹

      handler: async (response) => {
        try {
          const items = cart.map((item) => ({
            product_id: Number(item.productId),
            qty: Number(item.quantity),
            // send price in rupees with 2 decimals; backend will validate totals and convert as needed
            price: Number(Number(item.price).toFixed(2)),
          }));

          const payload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            ...userInfo,
            items,
            // send rupees value; backend compares rupees and verifies Razorpay paise amount
            amount: Number(Number(totalAmount).toFixed(2)),
          };

          const verifyRes = await API.post("/razorpay/verify-payment/", payload, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (verifyRes.data.success) {
            toast.success("Payment Successful! Order Placed.");
            if (clearCart) clearCart();
            window.location.href = "/orders";
          } else {
            toast.error(verifyRes.data.message || "Payment verification failed");
          }
        } catch (err) {
          console.error("Payment verification error:", err.response?.data || err.message);
          toast.error("Payment verification error");
        }
      },

      prefill: {
        name: userInfo.name,
        email: userInfo.email,
        contact: userInfo.phone || "",
      },

      theme: { color: "#6b46c1" },
    };

    new window.Razorpay(options).open();
  } catch (err) {
    console.error("Razorpay payment error:", err.response?.data || err.message);
    toast.error("Payment error");
  }
};
