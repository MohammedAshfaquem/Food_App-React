import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const login = async (email, password) => {
    const res = await API.get(`/users?email=${email}&password=${password}`);
    if (res.data.length > 0) {
      if (res.data[0].isBlock) throw new Error("User is blocked");
      setUser(res.data[0]);
      localStorage.setItem("user", JSON.stringify(res.data[0]));
      return res.data[0];
    } else {
      throw new Error("Invalid credentials");
    }
  };

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
