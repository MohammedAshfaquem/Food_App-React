import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import Navbar from "../Components/Navbar";
import { toast } from "react-toastify";
import Empty from "../Components/Empty";

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await API.get(`/users/${user.id}`);
      setOrders(res.data.orders || []);
    } catch (err) {
      toast.error("Error fetching orders.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    if (status.toLowerCase() === "delivered") {
      return `${base} bg-green-100 text-green-700`;
    } else if (status.toLowerCase() === "pending") {
      return `${base} bg-yellow-100 text-yellow-700`;
    } else if (status.toLowerCase() === "processing") {
      return `${base} bg-blue-100 text-blue-700`;
    }
    return `${base} bg-gray-100 text-gray-700`;
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Your Orders</h1>
          <button
            onClick={fetchOrders}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <Empty message={"You haven’t placed any orders yet."} />
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

                {item.address && (
                  <div className="mt-3 text-sm text-gray-600">
                    <p>
                      <strong>📍 Address:</strong> {item.address}
                    </p>
                  </div>
                )}

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
