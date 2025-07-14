import { useState, useEffect } from "react";

const EditModal = ({ product, onClose, onSubmit }) => {
  const [formValues, setFormValues] = useState({
    title: "",
    price: 0,
    rating: 0,
    defaultImg: "",
    description: "",
    id: null,
  });

  useEffect(() => {
    if (product) {
      setFormValues(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "price" || name === "rating" ? +value : value;

    setFormValues((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValues.id) {
      alert("Product ID is missing. Cannot update.");
      return;
    }
    onSubmit(formValues);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h3 className="text-lg font-bold mb-3">Edit Product</h3>

        {["title", "price", "rating", "defaultImg", "description"].map(
          (field) => (
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
          )
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 border px-3 py-1 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-1 rounded"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditModal;
