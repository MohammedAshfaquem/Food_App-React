// src/pages/admin/AdminHome.jsx
import React, { useEffect, useState } from "react";
import API from "../../services/api";
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
import CountUp from "react-countup"; // ✅ Import CountUp

const pieColors = ["#a78bfa", "#c4b5fd", "#ddd6fe"];

const AdminHome = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await API.get("/users");
      const allOrders = [];
      userRes.data.forEach((user) => {
        user.orders?.forEach((o) => allOrders.push({ ...o, userId: user.id }));
      });
      setUsers(userRes.data);
      setOrders(allOrders);

      const productRes = await API.get("/products");
      setProducts(productRes.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const calculateWeeklyRevenue = () => {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const revenueByDay = Array(7).fill(0);

      orders.forEach((order) => {
        if (order.orderedAt && order.status === "Delivered") {
          const dayIndex = new Date(order.orderedAt).getDay();
          revenueByDay[dayIndex] += (order.price || 0) * (order.quantity || 1);
        }
      });

      const result = days.map((day, idx) => ({
        day,
        revenue: revenueByDay[idx],
      }));
      setWeeklyRevenue(result);
    };

    calculateWeeklyRevenue();
  }, [orders]);

  const totalRevenue = orders
    .filter((o) => o.status === "Delivered")
    .reduce((acc, cur) => acc + (cur.price || 0) * (cur.quantity || 1), 0);

  const totalDelivered = orders.filter((o) => o.status === "Delivered").length;
  const totalProcessing = orders.filter((o) => o.status === "Processing").length;

  const statusData = [
    {
      name: "Pending",
      value: orders.filter((o) => o.status === "Pending").length,
    },
    { name: "Processing", value: totalProcessing },
    { name: "Delivered", value: totalDelivered },
  ];

  return (
    <div className="p-6">
      <h3 className="text-3xl font-bold mb-6 text-start">Admin Dashboard</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4 mb-8">
        <SummaryCard
          icon={<FaUserFriends />}
          label="Users"
          value={users.length}
          color="indigo"
          cardBgClass="bg-indigo-200"
        />
        <SummaryCard
          icon={<FaThLarge />}
          label="Products"
          value={products.length}
          color="purple"
          cardBgClass="bg-purple-200"
        />
        <SummaryCard
          icon={<FaChartBar />}
          label="Total Orders"
          value={orders.length}
          color="green"
          extra="+4% (30 days)"
          cardBgClass="bg-green-200"
        />
        <SummaryCard
          icon={<FaBoxOpen />}
          label="Delivered"
          value={totalDelivered}
          color="blue"
          cardBgClass="bg-blue-200"
        />
        <SummaryCard
          icon={<FaClock />}
          label="Processing"
          value={totalProcessing}
          color="yellow"
          cardBgClass="bg-yellow-200"
        />
        <SummaryCard
          icon={<FaMoneyBillWave />}
          label="Revenue"
          value={totalRevenue}
          isCurrency
          color="pink"
          cardBgClass="bg-pink-200"
        />
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
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((_, index) => (
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
            {statusData.map((item, index) => {
              const total = statusData.reduce((acc, cur) => acc + cur.value, 0);
              const percent = ((item.value / total) * 100).toFixed(0);
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
            <BarChart data={weeklyRevenue} barCategoryGap={20}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
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
