import { FaShoppingCart, FaTrash } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import { useWishlist } from "../context/Wishlistcontext";
import { useCart } from "../context/CartContext";
import Empty from "../Components/Empty";

const WishlistPage = () => {
  const wishlist = useWishlist();
  const cart = useCart();

  return (
    <>
      <Navbar />
      <section className="p-6 sm:p-10 min-h-screen bg-[#f7f5f1] ">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

        {wishlist.wishlist.length === 0 ? (
          <Empty message="Your wishlist is empty." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.wishlist.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg shadow-md text-center text-white bg-cover bg-center"
                style={{
                  backgroundImage: "url('Hover.jpg')", // ⬅️ Replace this with your desired background
                }}
              >
                <img
                  src={item.defaultImg}
                  alt={item.title}
                  className="h-42 mx-auto mb-4 rounded-full border-4 border-white"
                />
                <h2 className="font-bold text-lg text-black">{item.title}</h2>
                <p className="text-sm mb-2 text-black">₹{item.price}</p>
                <div className="flex justify-center gap-3 mt-2">
                  <button
                    onClick={() => wishlist.moveToCart(item, cart)}
                    className="bg-purple-700 text-white px-4 py-1 rounded-full flex items-center gap-2"
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button
                    onClick={() => wishlist.removeFromWishlist(item.id)}
                    className="text-red-500 hover:text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default WishlistPage;
