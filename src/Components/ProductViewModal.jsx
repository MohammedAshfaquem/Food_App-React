const ProductViewModal = ({ product, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
    <div className="bg-white p-6 rounded shadow w-full max-w-md">
      <h3 className="text-xl font-bold mb-4">Product Details</h3>

      {/* Corrected image property */}
      <img
        src={product.image}
        alt={product.title}
        className="w-48 h-48 object-cover rounded mb-4 mx-auto"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/default-food.png"; // fallback image
        }}
      />

      <p className="mb-2">
        <strong>Title:</strong> {product.title}
      </p>
      <p className="mb-2">
        <strong>Description:</strong> {product.description}
      </p>
      <p className="mb-2">
        <strong>Price:</strong> ₹{product.price}
      </p>
      <p className="mb-2">
        <strong>Rating:</strong> {product.rating}
      </p>
      <p className="mb-4">
        <strong>Status:</strong> {product.in_stock ? "Available" : "Out of Stock"}
      </p>

      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="text-white bg-blue-600 px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default ProductViewModal;
