import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import StatusStepper from "../components/Status";

const FoodOrders = () => {
  const [groupedOrders, setGroupedOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await API.get("/users");
        const tempMap = new Map();

        res.data.forEach((user) => {
          user.orders?.forEach((order, index) => {
            const groupKey = `${user.id}-${order.orderedAt}`;
            if (!tempMap.has(groupKey)) {
              tempMap.set(groupKey, {
                userId: user.id,
                userName: user.name,
                address: order.address,
                orderedAt: order.orderedAt,
                status: order.status,
                items: [],
                orderIndexes: [],
              });
            }
            tempMap.get(groupKey).items.push(order);
            tempMap.get(groupKey).orderIndexes.push(index);
          });
        });

        setGroupedOrders(Array.from(tempMap.values()));
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchAllOrders();
  }, []);

  const handleStatusChange = async (userId, orderIndexes, newStatus) => {
    try {
      const userRes = await API.get(`/users/${userId}`);
      const user = userRes.data;
      const updatedOrders = [...user.orders];

      orderIndexes.forEach((i) => (updatedOrders[i].status = newStatus));

      await API.patch(`/users/${userId}`, { orders: updatedOrders });

      setGroupedOrders((prev) =>
        prev.map((group) =>
          group.userId === userId &&
          JSON.stringify(group.orderIndexes) === JSON.stringify(orderIndexes)
            ? { ...group, status: newStatus }
            : group
        )
      );

      toast.success(`Order status updated to "${newStatus}"`);
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update status");
    }
  };

  const filteredGroups =
    filter === "All"
      ? groupedOrders
      : groupedOrders.filter((g) => g.status === filter);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-purple-100 text-purple-700 border border-purple-300";
      case "Processing":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "Delivered":
        return "bg-green-100 text-green-700 border border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Food Orders</h2>

      {/* 🔵 Filter Buttons */}
      <div className="flex gap-2 mb-6">
        {["All", "Pending", "Processing", "Delivered"].map((status) => (
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

      {/* 🟣 Order Cards */}
      {filteredGroups.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        filteredGroups.map((group, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 mb-6"
          >
            {/* 🔘 Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-bold text-lg">{group.userName}</h4>
                <p className="text-sm text-gray-500">
                  Address: {group.address} | Ordered at:{" "}
                  {new Date(group.orderedAt).toLocaleString()}
                </p>
              </div>

              <select
                value={group.status}
                onChange={(e) =>
                  handleStatusChange(
                    group.userId,
                    group.orderIndexes,
                    e.target.value
                  )
                }
                className={`px-3 py-1 rounded text-sm transition ${getStatusClass(
                  group.status
                )}`}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            {/* 🟢 Step Progress UI */}
            <StatusStepper currentStatus={group.status} />

            {/* 🧾 Order Details */}
            <div className="border rounded-lg p-4">
              <h5 className="font-semibold mb-3">Order Menu</h5>
              <div className="space-y-4">
                {group.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.defaultImg}
                        alt={item.title}
                        className="w-30 h-30 rounded border border-purple-400 p-1"
                      />
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">
                          x{item.quantity}
                        </p>
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
                  ₹
                  {group.items.reduce(
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
