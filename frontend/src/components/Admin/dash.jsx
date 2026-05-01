import React, { useState, useEffect } from "react";
import {
  Layers,
  CalendarCheck,
  Clock,
  FileWarning,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Sidebar, Topbar } from "./navbar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

export default function Home() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    rejected: 0,
  });
  
  const [resourceStats, setResourceStats] = useState({
    total: 0,
    active: 0,
    outOfService: 0,
  });
  
  const [timelineData, setTimelineData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [topResources, setTopResources] = useState([]);
  const [peakHours, setPeakHours] = useState([]);

  useEffect(() => {
    // 1. Fetch Booking Stats & Timeline
    fetch("http://localhost:8080/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        const pending = data.filter((b) => b.status === "PENDING").length;
        const approved = data.filter((b) => b.status === "APPROVED").length;
        const rejected = data.filter((b) => b.status === "REJECTED" || b.status === "CANCELLED").length;

        setStats({
          total: data.length,
          active: approved,
          pending: pending,
          rejected: rejected,
        });

        setStatusData([
          { name: "Approved", count: approved, fill: "#10B981" }, 
          { name: "Pending", count: pending, fill: "#F59E0B" }, 
          { name: "Rejected/Canceled", count: rejected, fill: "#EF4444" },
        ]);

        const dateCounts = {};
        data.forEach((booking) => {
          const dateStr = new Date(booking.startTime).toLocaleDateString("en-US", { 
            month: "short", day: "numeric" 
          });
          dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        });

        const formattedTimeline = Object.keys(dateCounts).map((date) => ({
          date: date,
          requests: dateCounts[date],
        }));

        setTimelineData(formattedTimeline);
      })
      .catch((err) => console.error("Error fetching admin stats:", err));

    // 2. Fetch Resource Stats
    fetch("http://localhost:8080/api/admin/analytics/resource-stats")
      .then((res) => res.json())
      .then((data) => {
        setResourceStats({
          total: data.total || 0,
          active: data.active || 0,
          outOfService: data.outOfService || 0,
        });
      })
      .catch((err) => console.error("Error fetching resource stats:", err));

    // 3. Fetch Top Resources
    fetch("http://localhost:8080/api/admin/analytics/top-resources?limit=5")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item, idx) => ({
          name: item[1] || `Resource ${item[0]}`,
          bookings: parseInt(item[2]) || 0,
          fill: ["#6366f1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"][idx % 5],
        }));
        setTopResources(formatted);
      })
      .catch((err) => console.error("Error fetching top resources:", err));

    // 4. Fetch Peak Hours
    fetch("http://localhost:8080/api/admin/analytics/peak-hours")
      .then((res) => res.json())
      .then((data) => {
        const formatted = Object.entries(data)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([hour, count]) => ({
            hour: `${hour}:00`,
            bookings: count,
            fill: count > 5 ? "#EF4444" : count > 2 ? "#F59E0B" : "#10B981",
          }));
        setPeakHours(formatted);
      })
      .catch((err) => console.error("Error fetching peak hours:", err));
  }, []);

  return (
    // FIXED: overflow-x-hidden and min-w-0 added for clean layout
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        <Topbar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-500">Overview of campus operations</p>
          </div>
          
          {/* Booking Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium">Total Requests</span>
                <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                  <Layers size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</h3>
              <p className="text-xs text-gray-400 font-medium">All time records</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium">Approved Bookings</span>
                <div className="bg-green-50 p-2 rounded-lg text-green-600">
                  <CalendarCheck size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.active}</h3>
              <p className="text-xs text-gray-400 font-medium">Successfully processed</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium">Action Required</span>
                <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                  <Clock size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.pending}</h3>
              <p className="text-xs text-gray-400 font-medium">Awaiting review</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium">Rejected/Canceled</span>
                <div className="bg-red-50 p-2 rounded-lg text-red-600">
                  <FileWarning size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.rejected}</h3>
              <p className="text-xs text-gray-400 font-medium">Unsuccessful requests</p>
            </div>
          </div>

          {/* Resource Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium">Total Resources</span>
                <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                  <Layers size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{resourceStats.total}</h3>
              <p className="text-xs text-gray-400 font-medium">All resources</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium">Active Resources</span>
                <div className="bg-green-50 p-2 rounded-lg text-green-600">
                  <CheckCircle size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{resourceStats.active}</h3>
              <p className="text-xs text-gray-400 font-medium">Available</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium">Out of Service</span>
                <div className="bg-red-50 p-2 rounded-lg text-red-600">
                  <AlertCircle size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{resourceStats.outOfService}</h3>
              <p className="text-xs text-gray-400 font-medium">Unavailable</p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* Chart 1: Timeline Area Chart */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 h-96 shadow-sm flex flex-col">
              <h4 className="text-sm font-semibold text-gray-900">Booking Volume</h4>
              <p className="text-xs text-gray-500 mb-6">Daily requests over time</p>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                    <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Status Breakdown Bar Chart */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 h-96 shadow-sm flex flex-col">
              <h4 className="text-sm font-semibold text-gray-900">Status Distribution</h4>
              <p className="text-xs text-gray-500 mb-6">Current state of all bookings</p>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} allowDecimals={false} />
                    <Tooltip cursor={{ fill: "#f9fafb" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={60}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* Chart 3: Top Resources */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 h-96 shadow-sm flex flex-col">
              <h4 className="text-sm font-semibold text-gray-900">Top Resources</h4>
              <p className="text-xs text-gray-500 mb-6">Most booked resources</p>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topResources} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                    <Bar dataKey="bookings" radius={[6, 6, 0, 0]} barSize={50}>
                      {topResources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Peak Booking Hours */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 h-96 shadow-sm flex flex-col">
              <h4 className="text-sm font-semibold text-gray-900">Peak Booking Hours</h4>
              <p className="text-xs text-gray-500 mb-6">Busiest booking times</p>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                    <Bar dataKey="bookings" radius={[6, 6, 0, 0]} barSize={40}>
                      {peakHours.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}