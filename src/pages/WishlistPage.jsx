import { FaShoppingCart, FaTrash } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Empty from "../Components/Empty";
import Swal from "sweetalert2";
import Navbar from "../Components/Navbar";

const WishlistPage = () => {
  const { moveToCart, wishlist, removeFromWishlist } = useWishlist();
  const cart = useCart();

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this item from your wishlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromWishlist(id);
        Swal.fire("Removed!", "Item removed from wishlist.", "success");
      }
    });
  };

  return (
    <>
      <Navbar />
      <section className="p-6 sm:p-10 min-h-screen bg-[#f7f5f1]">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <Empty message="Your wishlist is empty." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg shadow-md text-center text-white bg-cover bg-center"
                style={{
                  backgroundImage: "url('Hover.jpg')",
                }}
              >
                <img
                  src={item.defaultImg}
                  alt={item.title}
                  className="h-42 mx-auto mb-4 rounded-full border-4 border-white"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-food.png";
                  }}
                />

                <h2 className="font-bold text-lg text-black">{item.title}</h2>
                <p className="text-sm mb-2 text-black">₹{item.price}</p>
                <div className="flex justify-center gap-3 mt-2">
                  <button
                    onClick={() => moveToCart(item, cart)}
                    className="bg-purple-700 text-white px-4 py-1 rounded-full flex items-center gap-2"
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)} 
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
