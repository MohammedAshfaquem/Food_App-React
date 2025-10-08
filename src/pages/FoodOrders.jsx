import React, { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import StatusStepper from "../Components/Status";

const FoodOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/orders/");
        const data = res.data.success ? res.data.data : [];

        const mappedOrders = data.map((order) => ({
          ...order,
          items: order.items.map((item) => ({
            ...item,
            image: item.product?.image || "/default-food.png",
            title: item.product?.title || "N/A",
          })),
        }));

        setOrders(mappedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.patch(`/admin/orders/${orderId}/status/`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success(`Order status updated to "${newStatus}"`);
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update status");
    }
  };

  const filteredOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Food Orders</h2>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["All", "PENDING", "PROCESSING", "DELIVERED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1 rounded-full border text-sm font-medium transition ${
              filter === status
                ? "bg-purple-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-bold text-lg">{order.name}</h4>
                <p className="text-sm text-gray-500">
                  Address: {order.address}, {order.city} | Ordered at:{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className={`px-3 py-1 rounded text-sm transition ${getStatusClass(
                  order.status
                )}`}
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>

            <StatusStepper currentStatus={order.status} />

            <div className="border rounded-lg p-4">
              <h5 className="font-semibold mb-3">Order Items</h5>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image} 
                        alt={item.title || "Item"}
                        className="w-30 h-30 rounded border border-purple-400 p-1"
                      />
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">x{item.qty}</p>
                      </div>
                    </div>
                    <span className="text-purple-500 font-semibold">
                      +₹{item.price}
                    </span>
                  </div>
                ))}
              </div>
              <hr className="my-4" />
              <div className="flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span>
                  ₹{order.items.reduce(
                    (acc, item) => acc + Number(item.price),
                    0
                  )}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FoodOrders;
