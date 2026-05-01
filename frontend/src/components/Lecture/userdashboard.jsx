import React, { useState, useEffect } from 'react';
import { UserSidebar, UserTopbar } from './navbar';
import { 
  LayoutDashboard, Calendar, CheckCircle, Clock, 
  AlertCircle, ArrowRight, PlusCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';

export default function UserDashboard() {
  const [stats, setStats] = useState({ TOTAL: 0, PENDING: 0, APPROVED: 0, REJECTED: 0 });
  const [upcoming, setUpcoming] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch logged in user first
    api.get('/api/users/me')
      .then(res => setUser(res.data))
      .catch(err => console.error("Error fetching user:", err));
  }, []);

  // Fetch stats and bookings only after user is loaded
  useEffect(() => {
    if (!user) return;

    // Fetch Stats using real user ID
    api.get(`/api/bookings/user/${user.id}/stats`)
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching stats:", err));

    // Fetch Bookings using real user ID
    api.get(`/api/bookings/user/${user.id}`)
      .then(res => setUpcoming(res.data.slice(0, 3)))
      .catch(err => console.error("Error fetching bookings:", err));
  }, [user]);

  const statCards = [
    { label: 'Total Requests', value: stats.TOTAL, icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Approved', value: stats.APPROVED, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending', value: stats.PENDING, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Rejected', value: stats.REJECTED, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar />
      <div className="flex-1 flex flex-col ml-64">
        <UserTopbar />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome Back, {user ? user.name.split(' ')[0] : ''}!
              </h2>
              <p className="text-gray-500">Here's what's happening with your resource bookings.</p>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {statCards.map((card, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                    <card.icon size={24} />
                  </div>
                  <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 text-lg">Recent Bookings</h3>
                    <Link to="/user/bookings" className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:underline">
                      View all <ArrowRight size={14}/>
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {upcoming.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">No bookings yet.</p>
                    ) : (
                      upcoming.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600">
                              <Calendar size={20}/>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{item.purpose}</p>
                              <p className="text-xs text-gray-500">Resource #{item.resourceId} • {new Date(item.startTime).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-md ${item.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {item.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 mb-6">
                  <h3 className="font-bold text-lg mb-2">Need a Room?</h3>
                  <p className="text-indigo-100 text-sm mb-6">Quickly reserve lecture halls, labs, or equipment for your sessions.</p>
                  <Link to="/user/book" className="bg-white text-indigo-600 block text-center font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                    <PlusCircle size={18}/> New Booking
                  </Link>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Support</h3>
                  <p className="text-sm text-gray-500 mb-4">Having trouble with a resource? Contact the IT helpdesk.</p>
                  <button className="w-full border border-gray-200 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Get Help
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}