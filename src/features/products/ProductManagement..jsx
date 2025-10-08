import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ProductForm from "../../Components/ProductForm";
import ProductRow from "../../Components/ProductRow";
import ProductViewModal from "../../Components/ProductViewModal";
import EditModal from "../../Components/EditModal";
import ProductCard from "../../Components/ProductCard";

const MySwal = withReactContent(Swal);
const ITEMS_PER_PAGE = 8;

// Helper function to resolve image URLs
const getImageUrl = (img) => {
  if (!img) return "/default-food.png"; // fallback if no image
  return img; // Already a full URL from API
};

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/"); // trailing slash
      const data = res.data?.data || res.data; // handle api_response wrapper
      // Add proper image URLs
      const productsWithImages = data.map((p) => ({
        ...p,
        image: getImageUrl(p.image),
      }));
      setProducts(productsWithImages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---------------- ADD PRODUCT ----------------
  const handleAddProduct = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => formData.append(key, values[key]));

      await API.post("/products/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added!");
      resetForm();
      setShowAddForm(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product.");
    }
  };

  // ---------------- DELETE PRODUCT ----------------
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
        await API.delete(`/products/${id}/`);
        toast.success("Product deleted");
        fetchProducts();
      } catch (err) {
        console.error(err);
        toast.error("Delete failed");
      }
    }
  };

  // ---------------- UPDATE PRODUCT ----------------
  const handleUpdateProduct = async (formData, productId) => {
    try {
      await API.patch(`/products/${productId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchProducts();
      setEditingProduct(null);
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Update failed");
    }
  };

  // ---------------- PAGINATION ----------------
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

      {showAddForm && (
        <ProductForm
          onSubmit={async (formData) => {
            await API.post("/products/", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Product added!");
            fetchProducts();
          }}
        />
      )}

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

      <div className="overflow-x-auto border rounded hidden sm:block">
        <table className="min-w-[700px] w-full text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr className="h-14">
              <th className="py-3 px-3">Product</th>
              <th className="py-3 px-3">Price</th>
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

      {viewProduct && (
        <ProductViewModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
        />
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
