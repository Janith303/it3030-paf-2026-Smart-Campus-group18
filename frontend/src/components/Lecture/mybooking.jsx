import React, { useState, useEffect } from 'react';
import { UserSidebar, UserTopbar } from './navbar';
import { 
  Calendar, 
  Clock, 
  XCircle, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Trash2 
} from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch user's bookings on load
  const fetchBookings = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/bookings/user/1') // Using placeholder ID 1
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 2. Handle Cancellation (PATCH)
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${id}/cancel?reason=Cancelled by user`, {
        method: 'PATCH'
      });

      if (response.ok) {
        alert("Booking cancelled successfully.");
        fetchBookings(); // Refresh list
      }
    } catch (error) {
      alert("Failed to cancel booking.");
    }
  };

  // 3. Handle Permanent Deletion (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this record? This cannot be undone.")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert("Record deleted from history.");
        fetchBookings(); // Refresh list
      } else {
        alert("Failed to delete the record.");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Server error.");
    }
  };

  // Helper for status badges
  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      case 'CANCELLED': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar />
      <div className="flex-1 flex flex-col ml-64">
        <UserTopbar />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
              <p className="text-gray-500">Track and manage your resource reservations.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resource</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">ID: #{booking.resourceId}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-sm">
                          <span className="flex items-center gap-1.5 text-gray-700">
                            <Calendar size={14} className="text-gray-400" /> 
                            {new Date(booking.startTime).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5 text-gray-500 mt-0.5">
                            <Clock size={14} className="text-gray-400" /> 
                            {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(booking.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{booking.purpose}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {/* Cancel Button (Only if Pending or Approved) */}
                          {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                            <button 
                              onClick={() => handleCancel(booking.id)}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Cancel Booking"
                            >
                              <XCircle size={20} />
                            </button>
                          )}

                          {/* Delete Button (Always Available) */}
                          <button 
                            onClick={() => handleDelete(booking.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Permanently"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {bookings.length === 0 && !loading && (
                <div className="p-12 text-center">
                  <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info className="text-gray-400" size={30} />
                  </div>
                  <h3 className="text-gray-900 font-medium">No bookings found</h3>
                  <p className="text-gray-500 text-sm mt-1">You haven't made any resource requests yet.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}