import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../../Components/input";
import { toast } from "react-toastify";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const errors = {};
    if (!form.name) errors.name = "Name is required";
    if (!form.email) errors.email = "Email is required";
    if (!form.password || form.password.length < 4)
      errors.password = "Password must be at least 4 characters";
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await register(form);
      toast.success("Registered successfully 🎉");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left - Image (hidden on small screens) */}
      <div className="hidden md:flex w-1/2 bg-purple-200 items-center justify-center">
        <img src="/Reg.png" alt="welcome" className="w-[500px] max-w-full" />
      </div>

      {/* Right - Form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center px-6 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white shadow rounded">
          <h2 className="text-3xl font-bold text-center mb-2">Hello Again!</h2>
          <p className="text-center text-gray-500 mb-6 text-lg">
            Welcome back you’ve been missed!
          </p>

          <Input
            placeholder="Enter your name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={error.name}
          />
          <Input
            placeholder="Enter email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={error.email}
          />
          <Input
            placeholder="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={error.password}
          />

          <button
            type="submit"
            className="w-full text-white font-bold text-lg py-3 rounded mt-4 transition hover:opacity-90 bg-violet-600 cursor-pointer"
          >
            Sign Up
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
