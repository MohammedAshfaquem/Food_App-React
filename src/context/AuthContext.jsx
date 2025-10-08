import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccess = localStorage.getItem("access");
    const storedRefresh = localStorage.getItem("refresh");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedAccess) setAccess(storedAccess);
    if (storedRefresh) setRefresh(storedRefresh);

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login/", {
        username: email,
        password,
      });

      if (!res.data.is_active) {
        alert("Please verify your email before logging in.");
        return null;
      }

      const userData = {
        id: res.data.id,
        username: res.data.username,
        email: email,
        role: res.data.role || "user",
        is_staff: !!res.data.is_staff,
        is_superuser: !!res.data.is_superuser,
      };

      setUser(userData);
      setAccess(res.data.access);
      setRefresh(res.data.refresh);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      return userData;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const register = async (newUser) => {
    try {
      const res = await API.post("/auth/register/", newUser);
      if (res.data.success) {
        toast.success(`Verification email sent to ${res.data.email}`);
      }
      return res.data;
    } catch (err) {
      const email = err.response?.data?.email || newUser.email;
      console.error("Registration error:", err.response?.data);
      toast.error(
        `Registration failed for ${email}. Reason: ${JSON.stringify(
          err.response?.data?.errors || "Unknown error"
        )}`
      );
      throw err;
    }
  };

  const verifyEmail = async (uid, token) => {
    try {
      const res = await API.get(`/auth/verify-email/${uid}/${token}/`);
      toast.success("✅ Email verified successfully! You can now log in.");
      return res.data;
    } catch (err) {
      console.error("Email verification failed:", err);
      toast.error("❌ Invalid or expired verification link.");
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setAccess(null);
    setRefresh(null);

    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        access,
        refresh,
        setAccess,
        setRefresh,
        loading,
        login,
        register,
        logout,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
