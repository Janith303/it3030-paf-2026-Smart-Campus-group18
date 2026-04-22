import React, { useState, useEffect } from 'react';
import { Sidebar, Topbar } from './navbar'; 
import { CheckCircle, XCircle, Filter, Info, MessageSquare, UserCheck } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null); 
  const [adminReason, setAdminReason] = useState('');
  const [actionType, setActionType] = useState(''); 

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    fetch('http://localhost:8080/api/bookings')
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error("Error:", err));
  };

  const handleStatusUpdate = async () => {
    if (!adminReason && actionType === 'REJECTED') {
      alert("Please provide a reason for rejection.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/${selectedBooking.id}/status?status=${actionType}&reason=${adminReason}`,
        { method: 'PATCH' }
      );

      if (response.ok) {
        setSelectedBooking(null);
        setAdminReason('');
        fetchBookings(); 
      }
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const filteredBookings = filter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Topbar />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Manage Bookings</h2>
                <p className="text-gray-500">Review and respond to resource requests.</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
                <Filter size={18} className="text-gray-400" />
                <select 
                  className="text-sm font-medium focus:outline-none bg-transparent"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="ALL">All Requests</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                {/* FIXED: Exactly 6 Headers in the correct order */}
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Resource ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Purpose</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Entry Status</th> 
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">User {booking.userId}</td>
                      <td className="px-6 py-4 text-gray-600">{booking.resourceId}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[200px]">{booking.purpose}</td>
                      
                      {/* FIXED: Status Column */}
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border 
                          ${booking.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-100' : 
                            booking.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                            'bg-red-50 text-red-700 border-red-100'}`}>
                          {booking.status}
                        </span>
                      </td>

                      {/* FIXED: Entry Status Column (No nested <td> tags) */}
                      <td className="px-6 py-4">
                        {booking.status === 'APPROVED' ? (
                          booking.isCheckedIn ? (
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <UserCheck size={14}/> Checked In
                              </span>
                              <span className="text-xs text-gray-500 mt-0.5">
                                {booking.checkInTime ? new Date(booking.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Time unknown'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs font-medium text-amber-600 border border-amber-200 bg-amber-50 px-2 py-1 rounded-md">
                              Awaiting Arrival
                            </span>
                          )
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      
                      {/* FIXED: Actions Column */}
                      <td className="px-6 py-4 text-right">
                        {booking.status === 'PENDING' ? (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => { setSelectedBooking(booking); setActionType('APPROVED'); }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve"
                            >
                              <CheckCircle size={20} />
                            </button>
                            <button 
                              onClick={() => { setSelectedBooking(booking); setActionType('REJECTED'); }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Reject"
                            >
                              <XCircle size={20} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredBookings.length === 0 && (
                <div className="p-12 text-center text-gray-500">No requests found in this category.</div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* --- Action Modal --- */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {actionType === 'APPROVED' ? 'Approve Booking' : 'Reject Booking'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Booking for Resource #{selectedBooking.resourceId} by User {selectedBooking.userId}
            </p>
            
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MessageSquare size={16} /> Provide a Reason
            </label>
            <textarea 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-600 focus:outline-none mb-6"
              rows="3"
              placeholder={actionType === 'APPROVED' ? "e.g. Approved for student meet" : "e.g. Resource unavailable"}
              value={adminReason}
              onChange={(e) => setAdminReason(e.target.value)}
            ></textarea>

            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedBooking(null)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleStatusUpdate}
                className={`flex-1 px-4 py-3 rounded-xl font-medium text-white shadow-lg 
                  ${actionType === 'APPROVED' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                Confirm {actionType === 'APPROVED' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}