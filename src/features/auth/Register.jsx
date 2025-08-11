import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Inputfeild from "../../Components/Input";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await register(values);
        toast.success("Registered successfully 🎉");
        navigate("/login");
      } catch (err) {
        toast.error(err.message || "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="hidden md:flex w-1/2 bg-purple-200 items-center justify-center">
        <img src="/Reg.png" alt="welcome" className="w-[500px] max-w-full" />
      </div>

      <div className="w-full md:w-1/2 bg-white flex items-center justify-center px-6 py-10">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-md p-8 bg-white shadow rounded"
        >
          <h2 className="text-3xl font-bold text-center mb-2">Hello Again!</h2>
          <p className="text-center text-gray-500 mb-6 text-lg">
            Welcome back you’ve been missed!
          </p>

          <Inputfeild
            placeholder="Enter your name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
          />

          <Inputfeild
            placeholder="Enter email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
          />

          <Inputfeild
            placeholder="Password"
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
          />

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full text-white font-bold text-lg py-3 rounded mt-4 transition hover:opacity-90 bg-violet-600 cursor-pointer"
          >
            {formik.isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="text-center mt-6 text-sm">
            Already a member?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login now
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
