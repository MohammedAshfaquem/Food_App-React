import { ToastContainer } from "react-toastify";
import "./App.css";
import Home from "./Components/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./Components/PrivateRoute";
import PopularItems from "./pages/PopularItems";
import AllFoods from "./pages/AllFoods";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import OrdersPage from "./pages/Orders";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/all-foods"
            element={
              <PrivateRoute>
                <AllFoods />
              </PrivateRoute>
            }
          />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        pauseOnFocusLoss
      />
    </>
  );
}

export default App;
