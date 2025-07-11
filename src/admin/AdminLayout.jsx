// 🟡 AdminLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8f8f8] pl-64">
      <Sidebar />
      <div className="p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
