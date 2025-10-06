// src/pages/admin/AdminHome.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  FaChartBar,
  FaBoxOpen,
  FaClock,
  FaMoneyBillWave,
  FaUserFriends,
  FaThLarge,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import CountUp from "react-countup";

const pieColors = ["#a78bfa", "#c4b5fd", "#ddd6fe"];

const AdminHome = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_products: 0,
    total_orders: 0,
    pending_orders: 0,
    processing_orders: 0,
    delivered_orders: 0,
    total_revenue: 0,
    weekly_revenue: [],
    status_data: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const response = await API.get("/admin/stats/");
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h3 className="text-3xl font-bold mb-6 text-start">Admin Dashboard</h3>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-3xl font-bold mb-6 text-start">Admin Dashboard</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          icon={<FaUserFriends />}
          label="Users"
          value={stats.total_users}
          color="indigo"
          cardBgClass="bg-indigo-200"
        />
        <SummaryCard
          icon={<FaThLarge />}
          label="Products"
          value={stats.total_products}
          color="purple"
          cardBgClass="bg-purple-200"
        />
        <SummaryCard
          icon={<FaChartBar />}
          label="Total Orders"
          value={stats.total_orders}
          color="green"
          extra="+4% (30 days)"
          cardBgClass="bg-green-200"
        />
        <SummaryCard
          icon={<FaBoxOpen />}
          label="Delivered"
          value={stats.delivered_orders}
          color="blue"
          cardBgClass="bg-blue-200"
        />
        <SummaryCard
          icon={<FaClock />}
          label="Processing"
          value={stats.processing_orders}
          color="yellow"
          cardBgClass="bg-yellow-200"
        />
        <SummaryCard
          icon={<FaChartBar />}
          label="Pending"
          value={stats.pending_orders}
          color="orange"
          cardBgClass="bg-orange-200"
        />
        <SummaryCard
          icon={<FaMoneyBillWave />}
          label="Revenue"
          value={stats.total_revenue}
          isCurrency
          color="pink"
          cardBgClass="bg-pink-200"
        />
        {/* Debug info */}
        {console.log("Stats data:", stats)}
      </div>

      {/* 🔷 Charts: Pie + Bar Side-by-Side */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        {/* Pie Chart */}
        <div className="bg-white shadow rounded p-6 w-full md:w-1/2">
          <h3 className="text-lg font-bold mb-4 text-center">
            Order Status Distribution
          </h3>
          <div className="w-full flex justify-center">
            <ResponsiveContainer width={280} height={280}>
              <PieChart>
                <Pie
                  data={stats.status_data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {stats.status_data.map((_, index) => (
                    <Cell
                      key={index}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-2">
            {stats.status_data.map((item, index) => {
              const total = stats.status_data.reduce((acc, cur) => acc + cur.value, 0);
              const percent = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-4 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: pieColors[index % pieColors.length],
                      }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-gray-600">{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white shadow rounded p-6 w-full md:w-full">
          <h3 className="text-lg font-bold mb-4 text-center">Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.weekly_revenue} barCategoryGap={20}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
              <Bar
                dataKey="revenue"
                fill="#a78bfa"
                radius={[10, 10, 0, 0]}
                label={{ position: "top", fill: "#374151", fontSize: 12 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📋 Orders Section */}
      <OrdersSection />
    </div>
  );
};

// 📋 Orders Section Component
const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await API.get("/admin/orders/");
        if (response.data.success) {
          setOrders(response.data.data);
          setFilteredOrders(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [statusFilter, orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.patch(`/admin/orders/${orderId}/status/`, { status: newStatus });
      // Refresh orders after status update
      const response = await API.get("/admin/orders/");
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded p-6">
        <h3 className="text-xl font-bold mb-4">Food Orders</h3>
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-600">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Food Orders</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              statusFilter === 'ALL' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              statusFilter === 'PENDING' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending ({orders.filter(o => o.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setStatusFilter('PROCESSING')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              statusFilter === 'PROCESSING' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Processing ({orders.filter(o => o.status === 'PROCESSING').length})
          </button>
          <button
            onClick={() => setStatusFilter('DELIVERED')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              statusFilter === 'DELIVERED' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Delivered ({orders.filter(o => o.status === 'DELIVERED').length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No orders found for the selected filter.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">Order #{order.id}</h4>
                  <p className="text-sm text-gray-600">{order.name} - {order.email}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-lg">₹{order.total_amount}</span>
                </div>
              </div>

              <div className="mb-3">
                <h5 className="font-medium mb-2">Items:</h5>
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.product.title} x {item.qty}</span>
                      <span>₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <h5 className="font-medium mb-1">Delivery Address:</h5>
                <p className="text-sm text-gray-600">
                  {order.address}, {order.city}, {order.state} - {order.pincode}
                </p>
                {order.phone && <p className="text-sm text-gray-600">Phone: {order.phone}</p>}
              </div>

              <div className="flex gap-2 flex-wrap">
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => handleStatusChange(order.id, 'PROCESSING')}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Mark as Processing
                  </button>
                )}
                {order.status === 'PROCESSING' && (
                  <button
                    onClick={() => handleStatusChange(order.id, 'DELIVERED')}
                    className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Mark as Delivered
                  </button>
                )}
                {order.status === 'DELIVERED' && (
                  <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded text-sm font-medium">
                    Order Completed
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 🧩 Reusable Summary Card Component with CountUp
const SummaryCard = ({ icon, label, value, color, cardBgClass, extra, isCurrency }) => (
  <div
    className={`shadow rounded p-4 flex items-center gap-4 ${cardBgClass} 
      transform transition-transform duration-300 hover:scale-103 hover:shadow-xl`}
  >
    <div className="bg-white p-3 rounded-full">
      {React.cloneElement(icon, { className: `text-${color}-600 text-xl` })}
    </div>
    <div>
      <p className="text-sm text-black">{label}</p>
      <p className="text-2xl font-bold text-black">
        <CountUp
          end={typeof value === "number" ? value : parseInt(value.replace(/[^\d]/g, ""))}
          prefix={isCurrency ? "₹" : ""}
          duration={3.2}
          separator=","
        />
      </p>
      {extra && <p className="text-xs text-grey mt-1">{extra}</p>}
    </div>
  </div>
);

export default AdminHome;
