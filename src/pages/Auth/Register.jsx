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

      // Wait 3 seconds (default toast duration) before navigating
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left - Image and welcome */}
      <div className="w-1/2 bg-purple-200 flex items-center justify-center">
        <img src="/Reg.png" alt="welcome" className="w-[600px]" />
      </div>

      {/* Right - Form */}
      <div className="w-1/2 bg-white flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-[550px] bg-white p-8 ">
          <h2 className="text-3xl font-bold text-center mb-2">Hello Again!</h2>
          <p className="text-center text-gray-500 mb-6 text-2xl">
            Welcome back you’ve been missed!
          </p>

          <Input
            label=""
            placeholder="Enter your name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={error.name}
          />
          <Input
            label=""
            placeholder="Enter email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={error.email}
          />
          <Input
            label=""
            placeholder="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={error.password}
          />

          <div className="flex justify-end text-sm text-blue-500 cursor-pointer mb-4 mr-12 ">
            Recovery Password?
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              color: "white",
              fontWeight: "bold",
              fontSize: "120%",
              backgroundColor: "rgba(125, 63, 212, 0.47)",
              height: "60px",
              borderRadius: "20px",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>

          <p className="text-center mt-6 text-sm">
            Not a member?{" "}
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
