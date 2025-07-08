import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(4, "Min 4 characters").required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await login(values.email, values.password);
        toast.success("Login successful 🎉");
        navigate("/");
      } catch (err) {
        toast.error(err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="hidden md:flex w-1/2 bg-[#f4f7ff] flex-col justify-center items-center p-10">
        <h1 className="text-3xl font-bold mb-2 text-center">Sign In to Recharge Direct</h1>
        <p className="text-gray-600 mb-4 text-center">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => navigate("/register")}
          >
            Register here!
          </span>
        </p>
        <img src="/Intro.png" alt="Login visual" className="max-w-[300px] mt-4" />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6 py-10">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-sm p-8 rounded shadow-md bg-white"
        >
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className="w-full px-4 py-2 border rounded outline-blue-500"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded outline-blue-500"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full text-white py-2 rounded hover:opacity-80 transition bg-violet-600 cursor-pointer"
          >
            {formik.isSubmitting ? "Signing In..." : "Sign In"}
          </button>

          <p className="text-center text-sm mt-4 md:hidden">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer underline"
              onClick={() => navigate("/register")}
            >
              Register here!
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
