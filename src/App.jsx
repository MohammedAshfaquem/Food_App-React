import { ToastContainer } from "react-toastify";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Login from "./features/auth/Login.jsx";
import Register from "./features/auth/Register.jsx";
import AllFoods from "./pages/AllFoods";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import OrdersPage from "./pages/Orders";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import FoodOrders from "./pages/FoodOrders.jsx";
import Favorites from "./pages/Favorites.jsx";
import ProductManagement from "./features/products/ProductManagement..jsx";
import UserDetailsPage from "./features/users/UserDetails.jsx";
import UserPage from "./features/users/UserPage.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import RoleRedirect from "./routes/RoleRedirect.jsx";
import ForgotPassword from "./Components/ForgotPassword.jsx";
import ResetPassword from "./Components/ResetPassword.jsx";
import VerifyEmailPage from "./pages/VerifyEmail.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RoleRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:uid/:token" element={<VerifyEmailPage />} />

        
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/user-dashboard" element={<UserLayout />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

        <Route
          path="/all-foods"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <AllFoods />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <WishlistPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <OrdersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserPage />} />
          <Route path="users/:id" element={<UserDetailsPage />} />
          <Route path="food-orders" element={<FoodOrders />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="product-managment" element={<ProductManagement />} />
        </Route>
        <Route
          path="*"
          element={
            <div className="p-10 text-center text-2xl">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} newestOnTop  />
    </>
  );
}

export default App;
