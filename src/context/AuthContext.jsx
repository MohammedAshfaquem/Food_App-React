import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

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
    const res = await API.post("/auth/login/", {
      username: email, // <-- SimpleJWT expects "username"
      password,
    });
    // login endpoint
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
  };

  const register = async (newUser) => {
    const res = await API.post("/auth/register/", newUser); // fixed endpoint
    const userData = {
      id: res.data.data.id,
      username: res.data.data.username,
      email: res.data.data.email,
      role: res.data.data.role || "user",
    };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
