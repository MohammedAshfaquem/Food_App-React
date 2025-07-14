// 🟡 OrderHistory.jsx
import { useEffect, useState } from "react";
import API from "../services/api";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await API.get("/orders");
      setOrders(res.data.filter((o) => o.status === "completed"));
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Order History</h2>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">Order #{order.id}</p>
            <p>Total: ${order.total}</p>
            <p>Status: {order.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;