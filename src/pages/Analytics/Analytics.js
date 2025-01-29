import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import analysisBackground from "../../assets/analysisBackground.jpeg";
import RecentBookings from "./RecentBookings";
import RecentOrders from "./RecentOnlineOrders";
import { fetchNotificationStats, fetchGraphData } from "../../services/NotificationRoutes/restauNotify";
import { useSelector } from "react-redux";

const AnalyticsPage = () => {
  const [data, setData] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 7 Days");
  const [notificationStats, setNotificationStats] = useState({
    notificationCount: 0,
    totalRevenue: 0,
    totalBookings: 0,
  });

  const { user } = useSelector((state) => state.profile);
  const restaurantEmail = user?._id;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleTimeRangeChange = async (event) => {
    const timeRange = event.target.value;
    setSelectedTimeRange(timeRange);

    try {
      const stats = await fetchNotificationStats(
        restaurantEmail,
        timeRange.toLowerCase().replace(" ", "")
      );
      setNotificationStats(stats);

      const graphData = await fetchGraphData(restaurantEmail, timeRange.toLowerCase().replace(" ", ""));
      setData(graphData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await fetchNotificationStats(restaurantEmail, "last7 days");
        setNotificationStats(stats);

        const graphData = await fetchGraphData(restaurantEmail, "last7 days");
        setData(graphData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (restaurantEmail) {
      fetchData();
    }
  }, [restaurantEmail]);

  if (!data || data.length === 0) {
    return <div className="text-center text-gray-600 mt-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 overflow-y-auto bg-cover bg-center"
         style={{ backgroundImage: `url(${analysisBackground})` }}>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <select
          value={selectedTimeRange}
          onChange={handleTimeRangeChange}
          className="bg-white text-gray-700 border border-gray-300 p-2 rounded-lg shadow-sm"
        >
          <option>Last 7 Days</option>
          <option>Last 1 Month</option>
          <option>Last 5 Months</option>
          <option>Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">${notificationStats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">{notificationStats.notificationCount.toLocaleString()}</p>
        </div>
        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">{notificationStats.totalBookings}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {["totalRevenue", "totalOrders", "totalBookings"].map((key, index) => (
          <div key={index} className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {key === "totalRevenue" ? "Sales Trend" :
               key === "totalOrders" ? "Orders Trend" : "Bookings Trend"}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#4a5568" tickFormatter={formatDate} />
                <YAxis stroke="#4a5568" domain={[0, "auto"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={key}
                  stroke={key === "totalRevenue" ? "#4F46E5" :
                          key === "totalOrders" ? "#4CAF50" : "#E53E3E"}
                  strokeWidth={2}
                  dot={{ fill: key === "totalRevenue" ? "#4F46E5" :
                              key === "totalOrders" ? "#4CAF50" : "#E53E3E", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto mb-20">
        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md overflow-y-auto">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Bookings</h3>
          <RecentBookings />
        </div>

        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Orders</h3>
          <RecentOrders />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
