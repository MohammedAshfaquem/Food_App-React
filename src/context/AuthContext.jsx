import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom"; // Import useNavigate

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Load user from localStorage on page load
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
        } catch (error) {
          console.error("Failed to load user:", error);
          localStorage.removeItem("userId");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false); // Set loading to false after data is fetched
    };

    loadUser();
  }, []);

  // Login function: fetch user based on email/password
  const login = async (email, password) => {
    const res = await API.get(`/users?email=${email}&password=${password}`);
    if (res.data.length > 0) {
      const user = res.data[0];

      if (user.isBlock) throw new Error("User is blocked");

      setUser(user);
      localStorage.setItem("userId", user.id); // Store only userId
      return user;
    } else {
      throw new Error("Invalid credentials");
    }
  };

  // Register function: create a new user
  const register = async (payload) => {
    const res = await API.get(`/users?email=${payload.email}`);
    if (res.data.length > 0) throw new Error("Email already exists");

    const result = await API.post("/users", {
      ...payload,
      role: "user",
      isBlock: false,
      cart: [],
      orders: [],
      wishlist: [],
    });

    return result.data;
  };

  // Logout function: clear user data
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching user data
  }

  if (!user) {
    // Redirect to login page if there's no user data
    navigate("/login"); // Use useNavigate instead of Redirect
    return null; // Make sure to return null to avoid rendering anything else
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
