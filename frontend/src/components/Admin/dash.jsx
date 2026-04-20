// src/components/Admin/dash.jsx
import React from 'react';
import { Layers, CalendarCheck, Clock, FileWarning } from 'lucide-react';

// Import BOTH components from the local navbar file
import { Sidebar, Topbar } from './navbar'; 

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* 1. Sidebar on the left */}
      <Sidebar />
      
      {/* Main Content Area (pushed 64 units to the right to make room for sidebar) */}
      <div className="flex-1 flex flex-col ml-64">
        
        {/* 2. Topbar goes right here! */}
        <Topbar />
        
        {/* 3. The scrollable dashboard content */}
        <main className="flex-1 p-8 overflow-y-auto">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-500">Overview of campus operations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium">Total Resources</span>
                <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                  <Layers size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">487</h3>
              <p className="text-xs text-green-500 font-medium">+12% from last month</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium">Active Bookings</span>
                <div className="bg-green-50 p-2 rounded-lg text-green-600">
                  <CalendarCheck size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">156</h3>
              <p className="text-xs text-green-500 font-medium">+8% from last week</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium">Pending Bookings</span>
                <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                  <Clock size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">23</h3>
              <p className="text-xs text-red-500 font-medium">-5% from yesterday</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium">Open Tickets</span>
                <div className="bg-red-50 p-2 rounded-lg text-red-600">
                  <FileWarning size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">14</h3>
              <p className="text-xs text-green-500 font-medium">-2 from yesterday</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 h-80 shadow-sm flex flex-col">
              <h4 className="text-sm font-semibold text-gray-900">Booking Activity</h4>
              <p className="text-xs text-gray-500 mb-4">Daily bookings over the past week</p>
              <div className="flex-1 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 border border-dashed border-gray-200">
                Chart Area Placeholder
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 p-6 h-80 shadow-sm flex flex-col">
              <h4 className="text-sm font-semibold text-gray-900">Resource Usage Analytics</h4>
              <p className="text-xs text-gray-500 mb-4">Current utilization by category</p>
              <div className="flex-1 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 border border-dashed border-gray-200">
                Chart Area Placeholder
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}