import Navbar from "../Components/Navbar";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import CheckoutFooter from "../Components/CheckOut";
import Empty from "../Components/Empty";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

const CartPage = () => {
  const { cart, incrementItem, decrementItem, removeFromCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 🔶 Confirm delete with SweetAlert2
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this item from the cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(id);
        Swal.fire("Removed!", "Item removed from cart.", "success");
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="p-6 flex flex-col lg:flex-row gap-6 min-h-screen">
        {cart.length === 0 ? (
          <Empty message="Your Cart is empty." />
        ) : (
          <>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 bg-white text-center shadow-sm h-[260px] flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={item.defaultImg}
                      alt={item.title}
                      className="h-24 mx-auto object-contain"
                    />
                    <h3 className="font-bold mt-2 text-base">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      Price: ₹{item.price}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-3 my-2">
                      <button
                        onClick={() => decrementItem(item.id)}
                        className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <FaMinus />
                      </button>
                      <span className="text-lg">{item.quantity}</span>
                      <button
                        onClick={() => incrementItem(item.id)}
                        className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)} // ✅ SweetAlert confirm delete
                      className="text-red-500 hover:text-red-700 mt-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 🔵 Checkout Section */}
            <div className="w-full lg:w-1/4 bg-purple-600 text-white p-6 rounded shadow h-[600px]">
              <h2 className="text-xl font-bold mb-4">Checkout</h2>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between mb-2">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm">₹{item.price}</p>
                  </div>
                  <span>x {item.quantity}</span>
                </div>
              ))}
              <hr className="my-4 border-white" />
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <CheckoutFooter />
                <div className="mt-2 font-bold text-lg">
                  Total: ₹{total.toFixed(2)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;
