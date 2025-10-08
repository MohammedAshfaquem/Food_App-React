import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/password-reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.error || "Something went wrong");
      }
      setEmail("");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <p className="mb-4 text-sm text-gray-600 text-center">
          Enter your email to receive a password reset link.
        </p>
        <input
          type="email"
          placeholder="Enter your email"
          className="border p-2 rounded w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-violet-600 text-white rounded hover:opacity-80 transition"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p
          className="mt-4 text-sm text-center text-blue-600 cursor-pointer underline"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
