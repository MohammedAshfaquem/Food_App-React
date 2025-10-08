import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [blockingUserId, setBlockingUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users/");
        if (res.data.success) {
          const filtered = res.data.data.filter((u) => !u.is_staff);
          setUsers(filtered);
        } else {
          toast.error("No users found");
        }
      } catch (err) {
        console.error("Failed to load users:", err.response || err);
        toast.error("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const toggleBlock = async (id, isBlock) => {
    const action = isBlock ? "unblock" : "block";

    const result = await MySwal.fire({
      title: `Are you sure you want to ${action} this user?`,
      input: !isBlock ? "textarea" : null, // Only ask reason when blocking
      inputPlaceholder: "Enter reason for blocking the user",
      inputAttributes: {
        "aria-label": "Enter reason",
      },
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8b5cf6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action}`,
    });

    if (!result.isConfirmed) {
      MySwal.fire("Cancelled", `User ${action} canceled`, "info");
      return;
    }

    // If blocking, ensure reason is provided
    if (!isBlock && !result.value) {
      toast.error("Blocking reason is required");
      return;
    }

    const reason = result.value || ""; // Use empty string for unblock

    try {
      setBlockingUserId(id);
      await API.patch(`/users/${id}/block-toggle/`, { reason }); // Send reason to backend
      toast.success(`User ${!isBlock ? "blocked" : "unblocked"}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isBlock: !isBlock } : u))
      );
    } catch {
      toast.error("Failed to toggle user block");
    } finally {
      setBlockingUserId(null);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold ml-6 mt-6">All Users</h2>
      <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-4 rounded-xl shadow border hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-bold text-lg">{user.username}</h3>
                <p className="text-sm">Email: {user.email}</p>
                <p className="text-xs text-gray-400">
                  {user.isBlock ? "Blocked" : "Active"}
                </p>
              </div>
              <button
                onClick={() => toggleBlock(user.id, user.isBlock)}
                disabled={blockingUserId === user.id}
                className={`px-3 py-1 rounded text-white text-sm ${
                  user.isBlock ? "bg-green-600" : "bg-red-500"
                } ${
                  blockingUserId === user.id
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {blockingUserId === user.id
                  ? "Processing..."
                  : user.isBlock
                  ? "Unblock"
                  : "Block"}
              </button>
            </div>

            <hr className="my-2" />

            <div className="text-sm space-y-1">
              <p>
                🛒 Cart: {user.cart?.items?.length || 0} | ❤️ Wishlist:{" "}
                {user.wishlist?.length || 0}
              </p>
              <p>📦 Orders: {user.orders?.length || 0}</p>

              {/* {user.orders?.length > 0 && (
                <div className="mt-2 max-h-32 overflow-y-auto border rounded p-2 bg-gray-50">
                  {user.orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center text-xs border-b py-1 last:border-b-0"
                    >
                      <span>Order #{order.id}</span>
                      <span className={`px-2 py-0.5 rounded text-white ${order.status === "DELIVERED" ? "bg-green-500" : order.status === "PROCESSING" ? "bg-yellow-500" : "bg-gray-500"}`}>
                        {order.status}
                      </span>
                      <span>₹{order.total_amount}</span>
                    </div>
                  ))}
                </div>
              )} */}
            </div>

            <button
              onClick={() => navigate(`/admin/users/${user.id}`)}
              className="mt-3 bg-purple-600 text-white text-sm py-1 px-3 rounded"
            >
              View More
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserPage;
