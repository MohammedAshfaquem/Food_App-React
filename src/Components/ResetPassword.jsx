import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validLink, setValidLink] = useState(true);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return toast.error("Please enter a new password.");

    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/auth/password-reset-confirm/${uid}/${token}/`, 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Password reset successful!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(data.error || data.message || "Invalid or expired link.");
        setValidLink(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!validLink) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid or Expired Link</h2>
          <p>Please request a new password reset link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-4"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-violet-600 text-white rounded hover:opacity-80 transition flex justify-center items-center"
        >
          {loading ? "Submitting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
