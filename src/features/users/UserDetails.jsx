import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";

const fallbackImg = "https://empty.placeholder.com/64";

const UserDetailsPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get(`/users/${id}`);
        setUser(res.data);
      } catch (err) {
        toast.error("Failed to load user");
      }
    };
    if (id) fetchUser();
  }, [id]);

  if (!user)
    return <div className="p-4 text-center">Loading user details...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">👤 User Details: {user.name}</h2>
      <p className="text-lg mb-1">📧 Email: {user.email}</p>
      <p className="text-md mb-4">
        🔐 Status: {user.isBlock ? "Blocked" : "Active"}
      </p>
      <hr className="my-4" />

      <h3 className="font-semibold text-xl mb-2">🛒 Cart Items</h3>
      {user.cart?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {user.cart.map((item, i) => (
            <div
              key={i}
              className="flex gap-3 items-center border p-3 rounded bg-white"
            >
              <img
                src={item.defaultImg || fallbackImg}
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-4">No cart items</p>
      )}

      <h3 className="font-semibold text-xl mt-8 mb-2">❤️ Wishlist</h3>
      {user.wishlist?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {user.wishlist.map((item, i) => (
            <div
              key={i}
              className="flex gap-3 items-center border p-3 rounded bg-white"
            >
              <img
                src={item.defaultImg || fallbackImg}
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
              />
              <p className="font-semibold">{item.title}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-4">No wishlist items</p>
      )}

      <h3 className="font-semibold text-xl mt-8 mb-2">📦 Orders</h3>
      {user.orders?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user.orders.map((order, i) => (
            <div key={i} className="border p-4 rounded bg-white shadow">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={order.defaultImg || fallbackImg}
                  alt={order.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-semibold text-purple-700">{order.title}</p>
                  <p className="text-sm text-gray-600">Qty: {order.quantity}</p>
                  <p className="text-sm text-gray-600">
                    Status: {order.status}
                  </p>
                </div>
              </div>
              <p className="text-sm">📍 Address: {order.address || "N/A"}</p>
              <p className="text-sm">
                🗓️ Ordered At: {new Date(order.orderedAt).toLocaleString()}
              </p>
              <p className="text-sm font-semibold mt-2">
                💰 Total: ₹{order.price * order.quantity}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No orders found</p>
      )}
    </div>
  );
};

export default UserDetailsPage;
