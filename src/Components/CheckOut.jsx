import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CheckoutFooter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please log in first.");
      return;
    }

    try {
      const res = await API.get(`/users/${user.id}`);
      const { cart = [], orders = [] } = res.data;

      if (cart.length === 0) {
        toast.warn("Your cart is empty.");
        return;
      }

      const updatedOrders = [...orders, ...cart];

      await API.patch(`/users/${user.id}`, {
        orders: updatedOrders,
        cart: [],
      });

      toast.success("Order placed successfully! 🎉");
      navigate("/orders"); // Navigate to orders page (if you have one)

    } catch (err) {
      toast.error("Something went wrong while placing the order.");
      console.error(err);
    }
  };

  return (
    <div className="text-center ">
      <button
        className="bg-black text-white  py-3 px-3 rounded hover:bg-white hover:text-black"
        onClick={handlePlaceOrder}
      >
        Place Order
      </button>
    </div>
  );
};

export default CheckoutFooter;
