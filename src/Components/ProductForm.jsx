import { useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultForm = {
  title: "",
  price: "",
  rating: "",
  description: "",
  image: null,
  inventory: 10,
  in_stock: true,
};

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  price: Yup.number()
    .positive("Price must be positive")
    .required("Price is required"),
  rating: Yup.number()
    .min(0, "Rating must be at least 0")
    .max(5, "Rating cannot exceed 5")
    .required("Rating is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.mixed().required("Image is required"),
});

const ProductForm = () => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSlug = (title) =>
    title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

  const formik = useFormik({
    initialValues: defaultForm,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("slug", generateSlug(values.title));
        formData.append("description", values.description);
        formData.append("price", values.price.toString());
        formData.append("inventory", values.inventory.toString());
        formData.append("in_stock", values.in_stock ? "true" : "false");
        formData.append("rating", values.rating.toString());
        formData.append("image", values.image);

        const response = await API.post("products/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("✅ Product added successfully!");
        console.log("Product added:", response.data);

        resetForm();
        setFileName("");
      } catch (err) {
        console.error("Add product error:", err.response?.data || err);
        const msg =
          err.response?.data?.detail ||
          Object.entries(err.response?.data || {})
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ") ||
          "Failed to add product!";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      setFileName(file.name);
    }
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="mb-6 p-4 bg-gray-100 rounded grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    >
      {/* Title, Price, Rating */}
      {["title", "price", "rating"].map((field) => (
        <div
          key={field}
          className={`w-full ${
            field === "title" ? "sm:col-span-2 lg:col-span-2" : "sm:col-span-1 lg:col-span-1"
          }`}
        >
          <input
            name={field}
            type={field === "price" || field === "rating" ? "number" : "text"}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formik.values[field]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border p-2 rounded w-full"
          />
          {formik.touched[field] && formik.errors[field] && (
            <p className="text-red-500 text-sm">{formik.errors[field]}</p>
          )}
        </div>
      ))}

      {/* Description + File Upload + Submit */}
      <div className="w-full sm:col-span-4 flex gap-3 items-end">
        <div className="flex-1">
          <input
            name="description"
            type="text"
            placeholder="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border p-2 rounded w-full"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm">{formik.errors.description}</p>
          )}
        </div>

        {/* File Upload */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleFileClick}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            {fileName || "+ Choose File"}
          </button>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading || !formik.values.image}
            className="bg-purple-600 text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
