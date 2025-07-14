import { useFormik } from "formik";
import * as Yup from "yup";

const defaultForm = {
  title: "",
  price: "",
  rating: "",
  inStock: true,
  defaultImg: "",
  description: "",
};

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  price: Yup.number().positive("Price must be positive").required("Price is required"),
  rating: Yup.number().min(0).max(5).required("Rating is required"),
  defaultImg: Yup.string().url("Invalid URL").required("Image URL is required"),
  description: Yup.string().required("Description is required"),
});

const ProductForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: defaultForm,
    validationSchema,
    onSubmit,
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="mb-6 p-4 bg-gray-100 rounded grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    >
      {[
        { name: "title", type: "text", placeholder: "Title" },
        { name: "price", type: "number", placeholder: "Price" },
        { name: "rating", type: "number", placeholder: "Rating", step: "0.1" },
      ].map((field) => (
        <div key={field.name}>
          <input
            {...field}
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border p-2 rounded w-full"
          />
          {formik.touched[field.name] && formik.errors[field.name] && (
            <p className="text-red-500 text-sm">{formik.errors[field.name]}</p>
          )}
        </div>
      ))}

      <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
        {["defaultImg", "description"].map((name) => (
          <div className="w-full" key={name}>
            <input
              name={name}
              placeholder={name === "defaultImg" ? "Image URL" : "Description"}
              value={formik.values[name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border p-2 rounded w-full"
            />
            {formik.touched[name] && formik.errors[name] && (
              <p className="text-red-500 text-sm">{formik.errors[name]}</p>
            )}
          </div>
        ))}
      </div>

      <button type="submit" className="bg-purple-600 text-white rounded px-4 py-2">
        Submit
      </button>
    </form>
  );
};

export default ProductForm;