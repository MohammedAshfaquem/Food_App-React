const ProductCard = ({ product, onView, onEdit, onDelete }) => (
  <div className="border rounded-lg shadow-sm p-4 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <img
        src={product.defaultImg}
        alt={product.title}
        className="w-16 h-16 object-cover rounded"
      />
      <div>
        <h4 className="font-semibold">{product.title}</h4>
      </div>
    </div>
    <div className="flex gap-2">
      <button onClick={onView} title="View" className="bg-gray-200 p-2 rounded">👁️</button>
      <button onClick={onEdit} title="Edit" className="bg-yellow-100 p-2 rounded text-yellow-700">✏️</button>
      <button onClick={onDelete} title="Delete" className="bg-red-100 p-2 rounded text-red-700">🗑️</button>
    </div>
  </div>
);

export default ProductCard;