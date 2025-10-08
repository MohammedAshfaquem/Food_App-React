import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const OrderHistory = () => {
  const { access } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!access) return;
    try {
      setLoading(true);
      const res = await API.get("/orders/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      setOrders(res.data || []);
    } catch (e) {

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [access]);

  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-IN");
  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const getStatusBadge = (status) => {
    const base = "text-xs font-semibold px-2 py-1 rounded-full";
    const s = String(status || "").toLowerCase();
    if (s === "paid") return `${base} bg-green-100 text-green-700`;
    if (s === "pending") return `${base} bg-yellow-100 text-yellow-700`;
    if (s === "failed") return `${base} bg-red-100 text-red-700`;
    if (s === "cancelled") return `${base} bg-gray-200 text-gray-700`;
    return `${base} bg-gray-100 text-gray-700`;
  };

  const formatStatus = (raw) => {
    if (!raw) return "";
    const s = String(raw).toUpperCase();
    if (s === "PAID") return "Paid";
    if (s === "PENDING") return "Pending";
    if (s === "FAILED") return "Failed";
    if (s === "CANCELLED") return "Cancelled";
    return String(raw).charAt(0).toUpperCase() + String(raw).slice(1).toLowerCase();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Order History</h2>
        <button
          onClick={fetchHistory}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-gray-500">No past orders.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="bg-white p-4 rounded shadow border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">Order #{order.id}</p>
                <span className={getStatusBadge(order.status)}>
                  {formatStatus(order.status)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                Address: {order.address}, {order.city}, {order.state} - {order.pincode} |
                {" "}
                Ordered at: {formatDate(order.created_at)} {formatTime(order.created_at)}
              </p>
              <div className="flex justify-between text-sm">
                <span>Total</span>
                <span>₹{Number(order.total_amount).toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;