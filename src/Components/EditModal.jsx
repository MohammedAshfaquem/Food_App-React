import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../services/api";

const EditModal = ({ product, onClose, onSubmit }) => {
  const [formValues, setFormValues] = useState({
    title: "",
    price: 0,
    rating: 0,
    description: "",
    id: null,
  });
  const [preview, setPreview] = useState("/default-food.png");
  const [newImageFile, setNewImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormValues({
        title: product.title,
        price: product.price,
        rating: product.rating,
        description: product.description,
        id: product.id,
      });
      setPreview(product.image || "/default-food.png");
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === "price" || name === "rating" ? +value : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setNewImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", formValues.title);
      formData.append("price", formValues.price);
      formData.append("rating", formValues.rating);
      formData.append("description", formValues.description);

      if (newImageFile) {
        formData.append("image", newImageFile);
      }

      // ✅ Call parent onSubmit (ProductDashboard)
      await onSubmit(formData, formValues.id);

      toast.success("✅ Product updated successfully!");
      onClose();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("❌ Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h3 className="text-lg font-bold mb-3">Edit Product</h3>

        {/* Image Preview */}
        <div className="mb-3 text-center">
          <img
            src={preview}
            alt={formValues.title}
            className="w-32 h-32 object-cover rounded mb-2 mx-auto"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-food.png";
            }}
          />
          <label className="cursor-pointer text-blue-600 hover:underline">
            Change Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Other Fields */}
        {["title", "price", "rating", "description"].map((field) => (
          <input
            key={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            name={field}
            type={field === "price" || field === "rating" ? "number" : "text"}
            value={formValues[field]}
            onChange={handleChange}
            className="border p-2 w-full mb-3 rounded"
            required
          />
        ))}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 border px-3 py-1 rounded"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-1 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditModal;
