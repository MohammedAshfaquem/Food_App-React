import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import Inputfield from "../../Components/InputField";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(4, "Min 4 characters").required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        // Send username instead of email, because SimpleJWT expects 'username'
        const user = await login(values.email, values.password);

        toast.success(`Welcome back, ${user.username} 🎉`);

        // Redirect based on superuser/staff
        if (user.is_superuser || user.is_staff) {
          navigate("/admin/dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } catch (err) {
        // Handle API errors
        if (err.response && err.response.data) {
          toast.error(err.response.data.message || "Invalid credentials");
        } else {
          toast.error(err.message || "Something went wrong");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Panel */}
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

      {/* Right Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6 py-10">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-sm p-8 rounded shadow-md bg-white"
        >
          <Inputfield
            placeholder="Enter your email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
          />

          <Inputfield
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
            className="w-full text-white py-2 rounded hover:opacity-80 transition bg-violet-600 cursor-pointer mt-4"
          >
            {formik.isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
