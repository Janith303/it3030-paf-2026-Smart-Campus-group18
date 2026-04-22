// src/components/Admin/dash.jsx
import React from 'react';
import { Layers, CalendarCheck, Clock, FileWarning } from 'lucide-react';

// Import BOTH components from the local navbar file
import { Sidebar, Topbar } from './navbar'; 

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      
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
          
          

        </main>
      </div>
    </div>
  );
}