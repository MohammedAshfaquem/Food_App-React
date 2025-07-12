import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const defaultForm = {
  title: "",
  price: "",
  rating: "",
  inStock: true,
  defaultImg: "",
  description: "",
};

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(defaultForm);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post("/products", newProduct);
      toast.success("Product added!");
      setNewProduct(defaultForm);
      setShowAddForm(false);
      fetchProducts();
    } catch {
      toast.error("Add failed");
    }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/products/${id}`);
        toast.success("Product deleted");
        fetchProducts();
      } catch {
        toast.error("Delete failed");
      }
    } else {
      MySwal.fire("Cancelled", "Product not deleted", "info");
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/products/${editingProduct.id}`, editingProduct);
      toast.success("Product updated");
      setEditingProduct(null);
      fetchProducts();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-2xl font-bold">All Products List</h3>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Close Form" : "Add Product"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="mb-6 p-4 bg-gray-100 rounded grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          <input
            placeholder="Title"
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            placeholder="Price"
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: +e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            placeholder="Rating"
            type="number"
            step="0.1"
            value={newProduct.rating}
            onChange={(e) => setNewProduct({ ...newProduct, rating: +e.target.value })}
            className="border p-2 rounded w-full"
            required
          />

          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
            <input
              placeholder="Image URL"
              value={newProduct.defaultImg}
              onChange={(e) => setNewProduct({ ...newProduct, defaultImg: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
            <input
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <button type="submit" className="bg-purple-600 text-white rounded px-4 py-2">
            Submit
          </button>
        </form>
      )}

      {/* Cards on mobile */}
      <div className="block sm:hidden space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow-sm p-4 flex items-center justify-between"
          >
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
              <button
                title="View"
                onClick={() => setViewProduct(product)}
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
              >
                👁️
              </button>
              <button
                onClick={() => startEdit(product)}
                title="Edit"
                className="bg-yellow-100 hover:bg-yellow-200 p-2 rounded text-yellow-700"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                title="Delete"
                className="bg-red-100 hover:bg-red-200 p-2 rounded text-red-700"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Table on desktop */}
      <div className="overflow-x-auto border rounded hidden sm:block">
        <table className="min-w-[700px] w-full text-sm sm:text-base text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr className="h-14">
              <th className="py-3 px-3">Products</th>
              <th className="py-3 px-3">Starting Price</th>
              <th className="py-3 px-3">ID</th>
              <th className="py-3 px-3">Stock</th>
              <th className="py-3 px-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50 h-24">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.defaultImg}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex flex-col justify-center">
                      <p className="font-semibold">{product.title}</p>
                      <p className="text-gray-500 text-sm">
                        {product.description.slice(0, 40)}...
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3">₹{product.price} to ₹{+product.price + 300}</td>
                <td className="py-3 px-3">#{product.id}</td>
                <td className="py-3 px-3">
                  {product.inStock ? "Available" : "Out of Stock"}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <button
                      title="View"
                      onClick={() => setViewProduct(product)}
                      className="bg-gray-200 hover:bg-gray-300 p-2 rounded w-10"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => startEdit(product)}
                      title="Edit"
                      className="bg-yellow-100 hover:bg-yellow-200 p-2 rounded text-yellow-700 w-10"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      title="Delete"
                      className="bg-red-100 hover:bg-red-200 p-2 rounded text-red-700 w-10"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded shadow w-full max-w-md"
          >
            <h3 className="text-lg font-bold mb-3">Edit Product</h3>
            <input
              placeholder="Title"
              value={editingProduct.title}
              onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              placeholder="Price"
              type="number"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: +e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              placeholder="Rating"
              type="number"
              step="0.1"
              value={editingProduct.rating}
              onChange={(e) => setEditingProduct({ ...editingProduct, rating: +e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              placeholder="Image URL"
              value={editingProduct.defaultImg}
              onChange={(e) => setEditingProduct({ ...editingProduct, defaultImg: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <textarea
              placeholder="Description"
              value={editingProduct.description}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-gray-500 border px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="bg-purple-600 text-white px-4 py-1 rounded">
                Update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Modal */}
      {viewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Product Details</h3>
            <img
              src={viewProduct.defaultImg}
              alt={viewProduct.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <p className="mb-2"><strong>Title:</strong> {viewProduct.title}</p>
            <p className="mb-2"><strong>Description:</strong> {viewProduct.description}</p>
            <p className="mb-2"><strong>Price:</strong> ₹{viewProduct.price}</p>
            <p className="mb-2"><strong>Rating:</strong> {viewProduct.rating}</p>
            <p className="mb-4">
              <strong>Status:</strong> {viewProduct.inStock ? "Available" : "Out of Stock"}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setViewProduct(null)}
                className="text-white bg-blue-600 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDashboard;
