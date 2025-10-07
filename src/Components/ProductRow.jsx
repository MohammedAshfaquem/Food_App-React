const ProductRow = ({ product, onView, onEdit, onDelete }) => (
  <tr className="border-t hover:bg-gray-50 h-24">
    <td className="py-3 px-3">
      <div className="flex items-center gap-3">
        <img
          src={product.image}
          alt={product.title}
          className="w-16 h-16 object-cover rounded"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-food.png"; // fallback image
          }}
        />
        <div>
          <p className="font-semibold">{product.title}</p>
          <p className="text-sm text-gray-500">
            {product.description.length > 40
              ? product.description.slice(0, 40) + "..."
              : product.description}
          </p>
        </div>
      </div>
    </td>
    <td className="py-3 px-3">₹{product.price} to ₹{+product.price + 300}</td>
    <td className="py-3 px-3">#{product.id}</td>
    <td className="py-3 px-3">{product.inStock ? "Available" : "Out of Stock"}</td>
    <td className="py-3 px-3">
      <div className="flex gap-2">
        <button
          onClick={onView}
          title="View"
          className="bg-gray-200 p-2 rounded w-10 hover:bg-gray-300 transition"
        >
          👁️
        </button>
        <button
          onClick={onEdit}
          title="Edit"
          className="bg-yellow-100 p-2 rounded w-10 text-yellow-700 hover:bg-yellow-200 transition"
        >
          ✏️
        </button>
        <button
          onClick={onDelete}
          title="Delete"
          className="bg-red-100 p-2 rounded w-10 text-red-700 hover:bg-red-200 transition"
        >
          🗑️
        </button>
      </div>
    </td>
  </tr>
);

export default ProductRow;
