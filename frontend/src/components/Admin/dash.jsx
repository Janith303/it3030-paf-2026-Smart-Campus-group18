import React, { useState, useEffect } from 'react';
import { Layers, CalendarCheck, Clock, FileWarning } from 'lucide-react';
import { Sidebar, Topbar } from './navbar'; 
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export default function Home() {
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, rejected: 0 });
  const [timelineData, setTimelineData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/bookings')
      .then(res => res.json())
      .then(data => {
        
        // 1. Calculate Card Metrics
        const pending = data.filter(b => b.status === 'PENDING').length;
        const approved = data.filter(b => b.status === 'APPROVED').length;
        const rejected = data.filter(b => b.status === 'REJECTED' || b.status === 'CANCELLED').length;
        
        setStats({
          total: data.length,
          active: approved,
          pending: pending,
          rejected: rejected
        });

        // 2. Prepare Data for Bar Chart
        setStatusData([
          { name: 'Approved', count: approved, fill: '#10B981' }, // Emerald
          { name: 'Pending', count: pending, fill: '#F59E0B' },  // Amber
          { name: 'Rejected/Canceled', count: rejected, fill: '#EF4444' } // Red
        ]);

        // 3. Prepare Data for Area Chart (Group by Date)
        const dateCounts = {};
        data.forEach(booking => {
          // Format date to "Apr 21" style
          const dateStr = new Date(booking.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        });

        const formattedTimeline = Object.keys(dateCounts).map(date => ({
          date: date,
          requests: dateCounts[date]
        }));
        
        setTimelineData(formattedTimeline);
      })
      .catch(err => console.error("Error fetching admin stats:", err));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col ml-64">
        <Topbar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-500">Overview of campus operations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Metric Cards mapped to real data */}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Timeline Area Chart */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 h-96 shadow-sm flex flex-col">
              <h4 className="text-sm font-semibold text-gray-900">Booking Volume</h4>
              <p className="text-xs text-gray-500 mb-6">Daily requests over time</p>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
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
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} allowDecimals={false} />
                    <Tooltip 
                      cursor={{ fill: '#f9fafb' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={60} />
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