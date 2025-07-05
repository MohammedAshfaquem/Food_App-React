import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import Navbar from "../Components/Navbar";
import { toast } from "react-toastify";

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  const handlePlaceOrder = async () => {
    if (!user) return;

    try {
      const res = await API.get(`/users/${user.id}`);
      const currentCart = res.data.cart || [];
      const existingOrders = res.data.orders || [];

      if (currentCart.length === 0) {
        toast.info("Your cart is empty.");
        return;
      }

      const timestamp = new Date().toISOString();

      const ordersWithTime = currentCart.map((item) => ({
        ...item,
        orderedAt: timestamp,
        status: "Processing", // default status
      }));

      const updatedOrders = [...existingOrders, ...ordersWithTime];

      await API.patch(`/users/${user.id}`, {
        cart: [],
        orders: updatedOrders,
      });

      toast.success("Order placed successfully!");
      setOrders(updatedOrders);
    } catch (err) {
      toast.error("Failed to place order");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const res = await API.get(`/users/${user.id}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [user]);

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const base = "text-xs font-semibold px-2 py-1 rounded-full";
    if (status === "Delivered") {
      return `${base} bg-green-100 text-green-700`;
    } else {
      return `${base} bg-yellow-100 text-yellow-700`;
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">You haven’t placed any orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow rounded-xl p-4 border border-gray-200"
              >
                <img
                  src={item.defaultImg}
                  alt={item.title}
                  className="w-full h-40 object-contain mb-4"
                />
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-gray-700 mt-1">₹{item.price}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity || 1}
                </p>

                {item.orderedAt && (
                  <div className="mt-3 text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>📅 Date:</strong> {formatDate(item.orderedAt)}
                    </p>
                    <p>
                      <strong>⏰ Time:</strong> {formatTime(item.orderedAt)}
                    </p>
                  </div>
                )}

                {item.status && (
                  <div className="mt-4">
                    <span className={getStatusBadge(item.status)}>
                      {item.status}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersPage;
