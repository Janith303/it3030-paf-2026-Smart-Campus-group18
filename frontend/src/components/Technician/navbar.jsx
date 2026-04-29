import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import NotificationBell from '../Notification/NotificationBell';
import { 
  Building2, ClipboardList, 
  Search, User, Bell
} from 'lucide-react';


export const TechnicianSidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Assigned Tickets', icon: ClipboardList, path: '/technician/tickets' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl text-white flex-shrink-0">
          <Building2 size={24} />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-bold text-gray-900 leading-none mb-1 mt-1">Smart Campus</h1>
          <p className="text-xs text-gray-500 leading-none">Technician Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-5 space-y-1 overflow-y-auto pb-8">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-200' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-500'} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export const TechnicianTopbar = () => {
  const today = new Date();
  const currentDate = today.toLocaleDateString('en-US', {
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search tickets..." 
            className="w-full bg-gray-50 text-sm text-gray-900 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-100 border border-gray-200 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-500 hidden md:block">
          {currentDate}
        </span>

        {/* Member 4 — Real notification bell replaces the old static button */}
        <NotificationBell />

        <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
          <Bell size={20} />
        </button>
        <button className="bg-indigo-600 text-white h-9 w-9 rounded-full flex items-center justify-center shadow-sm">
          <User size={18} />
        </button>
      </div>
    </div>
  );
};