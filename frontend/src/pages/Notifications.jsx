import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { Bell, CheckCheck, BookOpen, Wrench, MessageSquare } from 'lucide-react';

export default function NotificationsPage({ SidebarComponent, TopbarComponent }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/notifications');
      setNotifications(res.data);
      // Mark all as read when page is opened
      await api.put('/api/notifications/mark-all-read');
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'BOOKING_APPROVED':
      case 'BOOKING_REJECTED':
      case 'BOOKING_CANCELLED':
        return <BookOpen size={18} className="text-indigo-600" />;
      case 'TICKET_STATUS_CHANGED':
        return <Wrench size={18} className="text-blue-600" />;
      case 'NEW_COMMENT':
        return <MessageSquare size={18} className="text-purple-600" />;
      default:
        return <Bell size={18} className="text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'BOOKING_APPROVED': return 'bg-green-50 border-green-100';
      case 'BOOKING_REJECTED': return 'bg-red-50 border-red-100';
      case 'BOOKING_CANCELLED': return 'bg-orange-50 border-orange-100';
      case 'TICKET_STATUS_CHANGED': return 'bg-blue-50 border-blue-100';
      case 'NEW_COMMENT': return 'bg-purple-50 border-purple-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <SidebarComponent />
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        <TopbarComponent />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                <p className="text-gray-500">All your recent notifications</p>
              </div>
              {notifications.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <CheckCheck size={16} />
                  All caught up!
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell size={32} className="text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-medium text-lg">No notifications yet</h3>
                <p className="text-gray-500 text-sm mt-1">You'll see notifications here when something happens.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-4 p-4 rounded-2xl border ${getTypeColor(n.type)} transition-all`}
                  >
                    <div className="bg-white p-2 rounded-xl shadow-sm flex-shrink-0">
                      {getTypeIcon(n.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium text-sm">{n.message}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}