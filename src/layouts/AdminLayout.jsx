import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaBars } from "react-icons/fa";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#f9f9f9]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col ">
        <header className="md:hidden flex items-center justify-between p-4 bg-white shadow">
          <button onClick={() => setIsSidebarOpen(true)}>
            <FaBars className="text-xl text-purple-700" />
          </button>
          <h1 className="text-xl font-semibold text-purple-700">
            Admin Dashboard
          </h1>
          <div style={{ width: "24px" }} />
        </header>
        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
