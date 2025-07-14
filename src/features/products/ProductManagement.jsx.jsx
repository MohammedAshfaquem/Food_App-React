import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ProductForm from "../../components/ProductForm";
import ProductRow from "../../components/ProductRow";
import ProductViewModal from "../../components/ProductViewModal";
import EditModal from "../../components/EditModal";
import ProductCard from "../../components/productCard";

const MySwal = withReactContent(Swal);
const ITEMS_PER_PAGE = 8;

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      toast.error("Failed to load products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (values, { resetForm }) => {
    try {
      await API.post("/products", values);
      toast.success("Product added!");
      resetForm();
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

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      if (!updatedProduct.id) {
        toast.error("Update failed: Product ID missing.");
        return;
      }

      await API.put(`/products/${updatedProduct.id}`, updatedProduct);
      toast.success("Product updated");
      setEditingProduct(null);
      fetchProducts();
    } catch {
      toast.error("Update failed");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

      {showAddForm && <ProductForm onSubmit={handleAddProduct} />}

      {/* Mobile cards view */}
      <div className="block sm:hidden space-y-4">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onView={() => setViewProduct(product)}
            onEdit={() => setEditingProduct(product)}
            onDelete={() => handleDelete(product.id)}
          />
        ))}
      </div>

      {/* Desktop table view */}
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
            {paginatedProducts.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onView={() => setViewProduct(product)}
                onEdit={() => setEditingProduct(product)}
                onDelete={() => handleDelete(product.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {viewProduct && (
        <ProductViewModal product={viewProduct} onClose={() => setViewProduct(null)} />
      )}

      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={handleUpdateProduct}
        />
      )}
    </div>
  );
};

export default ProductDashboard;
