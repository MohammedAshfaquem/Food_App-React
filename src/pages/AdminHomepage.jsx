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
    status_data: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  // Fetch initial stats (current week + initial total revenue)
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);

        // 1. Fetch current week + overall stats
        const response = await API.get("/admin/stats/");
        if (response.data.success) {
          const initialStats = response.data.data;

          // Past 5 years dropdown
          const currentYear = new Date().getFullYear();
          const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
          setAvailableYears(years);

          // 2. Fetch yearly total revenue for selectedYear (2025)
          const resYear = await API.get(`/admin/stats/?year=${selectedYear}`);
          const yearlyRevenue = resYear.data.success
            ? resYear.data.data.total_revenue
            : initialStats.total_revenue;

          setStats({
            ...initialStats,
            total_revenue: yearlyRevenue, // show 2025 revenue by default
          });
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  // Update total revenue when year changes (weekly chart stays current week)
  const handleYearChange = async (year) => {
    setSelectedYear(year);
    try {
      setLoading(true);
      const res = await API.get(`/admin/stats/?year=${year}`);
      if (res.data.success) {
        const data = res.data.data;
        setStats((prev) => ({
          ...prev,
          total_revenue: data.total_revenue, // update revenue summary only
          // weekly_revenue remains current week
        }));
      }
    } catch (err) {
      console.error("Failed to fetch yearly revenue:", err);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Summary Cards */}
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
          extra={
            <select
              className="ml-2 p-1 border rounded text-sm"
              value={selectedYear}
              onChange={(e) => handleYearChange(Number(e.target.value))}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          }
        />
      </div>

      {/* Charts */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        {/* Order Status Pie Chart */}
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
              const total = stats.status_data.reduce(
                (acc, cur) => acc + cur.value,
                0
              );
              const percent =
                total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
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

        {/* Weekly Revenue Bar Chart */}
        <div className="bg-white shadow rounded p-6 w-full md:w-full">
          <h3 className="text-lg font-bold mb-4 text-center">
            Current Week Revenue
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={stats.weekly_revenue.map((item) => ({
                ...item,
                revenue: Number(item.revenue),
              }))}
              barCategoryGap={20}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
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

const SummaryCard = ({
  icon,
  label,
  value,
  color,
  cardBgClass,
  extra,
  isCurrency,
}) => (
  <div
    className={`shadow rounded p-4 flex items-center gap-4 ${cardBgClass} 
      transform transition-transform duration-300 hover:scale-105 hover:shadow-xl`}
  >
    <div className="bg-white p-3 rounded-full">
      {React.cloneElement(icon, { className: `text-${color}-600 text-xl` })}
    </div>
    <div>
      <p className="text-sm text-black">{label}</p>
      <p className="text-2xl font-bold text-black">
        <CountUp
          end={Number(value) || 0}
          prefix={isCurrency ? "₹" : ""}
          duration={3.2}
          separator=","
        />
      </p>
      {extra && <div className="mt-1">{extra}</div>}
    </div>
  </div>
);

export default AdminHome;
