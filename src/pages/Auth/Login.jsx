import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success("Login successful 🎉 ");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="w-1/2 bg-[#f4f7ff] flex flex-col justify-center items-center p-10">
        <h1 className="text-3xl font-bold mb-2">Sign In to Recharge Direct</h1>
        <p className="text-gray-600 mb-4">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register here!
          </span>
        </p>
        <img src="/Intro.png" alt="Rocket" className="max-w-[300px] mt-4" />
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <form
          onSubmit={handleSubmit}
          className="w-[350px] p-8 rounded shadow-md"
        >
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="w-full px-4 py-2 border rounded outline-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded outline-blue-500"
              required
            />
          </div>
          <div className="text-right text-sm text-blue-500 mb-4 cursor-pointer">
            Recover Password?
          </div>
          <button
            type="submit"
            className="w-full text-white py-2 rounded hover:opacity-80 transition  cursor-pointer"
            style={{ backgroundColor: "rgba(125, 63, 212, 0.47)"}}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
