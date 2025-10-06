import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import Navbar from "../Components/Navbar";
import { toast } from "react-toastify";
import Empty from "../Components/Empty";

const OrdersPage = () => {
  const { access } = useAuth(); // use access token
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user orders
  const fetchOrders = async () => {
    if (!access) return;

    try {
      setLoading(true);
      const res = await API.get("/orders/", {
        headers: { Authorization: `Bearer ${access}` },
      });

      // Backend returns a plain array
      setOrders(res.data || []);
    } catch (err) {
      toast.error("Error fetching orders.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [access]);

  // Format date & time
  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-IN");
  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  // Status badge style
  const getStatusBadge = (status) => {
    const base = "text-xs font-semibold px-2 py-1 rounded-full";
    if (status.toLowerCase() === "paid") return `${base} bg-green-100 text-green-700`;
    if (status.toLowerCase() === "pending") return `${base} bg-yellow-100 text-yellow-700`;
    if (status.toLowerCase() === "processing") return `${base} bg-blue-100 text-blue-700`;
    return `${base} bg-gray-100 text-gray-700`;
  };

  // Normalize backend status (e.g., "PAID", "PENDING") to human-friendly label
  const formatStatus = (raw) => {
    if (!raw) return "";
    const s = String(raw).toUpperCase();
    if (s === "PAID") return "Paid";
    if (s === "PENDING") return "Pending";
    if (s === "FAILED") return "Failed";
    if (s === "CANCELLED") return "Cancelled";
    // Fallback: capitalize first letter, rest lowercase
    return String(raw).charAt(0).toUpperCase() + String(raw).slice(1).toLowerCase();
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
          <Empty message="You haven’t placed any orders yet." />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white shadow rounded-xl p-6 border border-gray-200">
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Address: {order.address}, {order.city}, {order.state} - {order.pincode} | Ordered at: {formatDate(order.created_at)} {formatTime(order.created_at)}
                    </p>
                  </div>
                  <span className={getStatusBadge(String(order.status).toLowerCase())}>
                    {formatStatus(order.status)}
                  </span>
                </div>

                {/* Order Items */}
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold mb-3">Order Items</h5>
                  {order.items.length > 0 ? (
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={item.product.image}
                              alt={item.product.title}
                              className="w-20 h-20 object-cover rounded border border-purple-400 p-1"
                            />
                            <div>
                              <p className="font-medium">{item.product.title}</p>
                              <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                              <p className="text-sm text-gray-500">Price per item: ₹{Number(item.price).toFixed(2)}</p>
                              <p className="text-sm text-gray-500">Subtotal: ₹{(Number(item.price) * Number(item.qty)).toFixed(2)}</p>
                            </div>
                          </div>
                          <span className="text-purple-500 font-semibold">
                            ₹{(Number(item.price) * Number(item.qty)).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No items in this order</p>
                  )}

                  {/* Total Amount */}
                  <hr className="my-4" />
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total</span>
                    <span>₹{Number(order.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersPage;
