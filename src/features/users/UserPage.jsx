// src/pages/admin/UserPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        const filtered = res.data.filter((u) => u.role === "user");
        setUsers(filtered);
      } catch {
        toast.error("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  const toggleBlock = async (id, isBlock) => {
    const action = isBlock ? "unblock" : "block";

    const result = await MySwal.fire({
      title: `Are you sure you want to ${action} this user?`,
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

    try {
      await API.patch(`/users/${id}`, { isBlock: !isBlock });
      toast.success(`User ${!isBlock ? "blocked" : "unblocked"}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isBlock: !isBlock } : u))
      );
    } catch {
      toast.error("Failed to toggle user block");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold ml-6 mt-6 ">Users </h2>

      <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-4 rounded-xl shadow border hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="text-sm">Email: {user.email}</p>
                <p className="text-xs text-gray-400">
                  {user.isBlock ? "Blocked" : "Active"}
                </p>
              </div>
              <button
                onClick={() => toggleBlock(user.id, user.isBlock)}
                className={`px-3 py-1 rounded text-white text-sm ${
                  user.isBlock ? "bg-green-600" : "bg-red-500"
                }`}
              >
                {user.isBlock ? "Unblock" : "Block"}
              </button>
            </div>

            <hr className="my-2" />

            <div className="text-sm space-y-1">
              <p>
                🛒 Cart: {user.cart?.length || 0} | ❤️ Wishlist:{" "}
                {user.wishlist?.length || 0}
              </p>
              <p>📦 Orders: {user.orders?.length || 0}</p>
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
