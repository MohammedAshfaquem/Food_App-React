import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CheckoutFooter = () => {
  const { user } = useAuth();
  const { cart, updateCart } = useCart();
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please log in first.");
      return;
    }

    if (!cart || cart.length === 0) {
      toast.warn("Your cart is empty.");
      return;
    }

    try {
      const res = await API.get(`/users/${user.id}`);
      const existingOrders = res.data.orders || [];

      const timestamp = new Date().toISOString();

      const ordersWithDetails = cart.map(item => ({
        ...item,
        orderedAt: timestamp,
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
      <button
        onClick={handlePlaceOrder}
        className="w-full sm:w-auto bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-black border border-black transition duration-300 ease-in-out"
      >
        Place Order
      </button>
    </div>
  );
};

export default CheckoutFooter;
