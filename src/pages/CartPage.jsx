import Navbar from "../Components/Navbar";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import CheckoutFooter from "../Components/CheckOut";
import Lottie from "lottie-react";
import Empty from "../Components/Empty";

const CartPage = () => {
  const { cart, updateCart } = useCart();

  const increment = (id) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  };

  const decrement = (id) => {
    const updated = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(updated);
  };

  const remove = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    updateCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <div className="p-6 flex flex-col lg:flex-row gap-6 min-h-screen">
        {cart.length === 0 ? (
          <Empty message="Your Cart is empty." />
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="border rounded p-4 bg-white text-center shadow  h-[300px]"
                >
                  <img
                    src={item.defaultImg}
                    alt={item.title}
                    className="h-28 mx-auto object-contain"
                  />
                  <h3 className="font-bold mt-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">Price: ₹{item.price}</p>

                  <div className="flex items-center justify-center gap-3 my-3">
                    <button
                      onClick={() => decrement(item.id)}
                      className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <FaMinus />
                    </button>
                    <span className="text-lg">{item.quantity}</span>
                    <button
                      onClick={() => increment(item.id)}
                      className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <button
                    onClick={() => remove(item.id)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Checkout Summary */}
            <div className="w-full lg:w-1/4 bg-purple-600 text-white p-6 rounded shadow">
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
