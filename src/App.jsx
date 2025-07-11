import { ToastContainer } from "react-toastify";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

// Public/User pages
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import AllFoods from "./pages/AllFoods";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import OrdersPage from "./pages/Orders";
import PrivateRoute from "./Components/PrivateRoute";

// Admin pages and layout
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import FoodOrders from "./admin/pages/FoodOrders";
import Favorites from "./admin/pages/Favorites";
import OrderHistory from "./admin/pages/OrderHistory";
import ProductManagement from "./admin/pages/ProductManagement.jsx";
import UserDetailsPage from "./admin/pages/UserDetails.jsx";
import UserPage from "./admin/pages/UserPage.jsx";

function App() {
  return (
    <>
      <Routes>
        {/* 🔁 Redirect root to user dashboard */}
        <Route path="/" element={<Navigate to="/user-dashboard" />} />

        {/* 🌐 Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-dashboard" element={<Home />} />

        {/* 🔐 Private User Routes */}
        <Route
          path="/all-foods"
          element={
            <PrivateRoute>
              <AllFoods />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <PrivateRoute>
              <WishlistPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />

        {/* 🧑‍💼 Admin Routes (Nested inside AdminLayout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserPage />} />
          <Route path="users/:id" element={<UserDetailsPage />} /> {/* ✅ FIXED */}
          <Route path="food-orders" element={<FoodOrders />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="order-history" element={<ProductManagement />} />
        </Route>

        {/* ❓ Optional: 404 Page */}
        <Route
          path="*"
          element={
            <div className="p-10 text-center text-2xl">404 - Page Not Found</div>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} newestOnTop />
    </>
  );
}

export default App;
