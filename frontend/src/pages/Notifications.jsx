import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { Bell, BookOpen, Wrench, MessageSquare } from 'lucide-react';

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

  const getTypeBadge = (type) => {
    const styles = {
      BOOKING_APPROVED: 'bg-green-100 text-green-700',
      BOOKING_REJECTED: 'bg-red-100 text-red-700',
      BOOKING_CANCELLED: 'bg-orange-100 text-orange-700',
      TICKET_STATUS_CHANGED: 'bg-blue-100 text-blue-700',
      NEW_COMMENT: 'bg-purple-100 text-purple-700',
    };
    const labels = {
      BOOKING_APPROVED: 'Booking Approved',
      BOOKING_REJECTED: 'Booking Rejected',
      BOOKING_CANCELLED: 'Booking Cancelled',
      TICKET_STATUS_CHANGED: 'Ticket Updated',
      NEW_COMMENT: 'New Comment',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[type] || 'bg-gray-100 text-gray-700'}`}>
        {labels[type] || type}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <SidebarComponent />
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        <TopbarComponent />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
              <p className="text-gray-500">All your recent activity and updates</p>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Card Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <Bell size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">All Notifications</h3>
                    <p className="text-sm text-gray-500">{notifications.length} total</p>
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              {loading ? (
                <div className="p-12 text-center text-gray-500">Loading notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell size={28} className="text-gray-400" />
                  </div>
                  <h3 className="text-gray-900 font-medium text-lg">No notifications yet</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    You'll see notifications here when something happens.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Message</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {notifications.map((n) => (
                      <tr key={n.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                              {getTypeIcon(n.type)}
                            </div>
                            {getTypeBadge(n.type)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                          {n.message}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-right whitespace-nowrap">
                          {new Date(n.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}