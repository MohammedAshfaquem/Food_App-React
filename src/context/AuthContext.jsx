import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const res = await API.get(`/users/${userId}`);
          if (res.data) {
            setUser(res.data);
          } else {
            localStorage.removeItem("userId");
            setUser(null);
          }
        } catch (err) {
          console.error("Failed to load user:", err);
          localStorage.removeItem("userId");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await API.get(
      `users?email=${email}&password=${password}`
    );
    const users = res.data;
    if (users.length === 0) {
      throw new Error("Invalid credentials");
    }
    const user = users[0];
    setUser(user);
    localStorage.setItem("userId", user.id);
    return user;
  };

  const register = async (newUser) => {
    const res = await API.get(`/users?email=${newUser.email}`);
    if (res.data.length > 0) throw new Error("Email already exists");

    const result = await API.post("/users", {
      ...newUser,
      role: "user",
      isBlock: false,
      cart: [],
      orders: [],
      wishlist: [],
    });

    return result.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
