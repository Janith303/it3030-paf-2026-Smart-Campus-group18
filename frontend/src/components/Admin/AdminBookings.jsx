import React, { useState, useEffect } from 'react';
import { Sidebar, Topbar } from './navbar'; 
import { CheckCircle, XCircle, Filter, Info, MessageSquare, UserCheck, ArrowUpDown, Calendar, Clock } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NEWEST'); 
  
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

  // UPGRADED: Bulletproof Date Sorting Logic
  const processedBookings = bookings
    .filter(b => filter === 'ALL' || b.status === filter)
    .sort((a, b) => {
      // Safety check: If a date is missing entirely, push it to the bottom
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;

      // Convert to reliable JavaScript timestamps
      const dateA = new Date(a.startTime).getTime();
      const dateB = new Date(b.startTime).getTime();

      // Safety check: If a date is "Invalid Date", ignore the sort for that row
      if (isNaN(dateA) || isNaN(dateB)) return 0;

      // Do the math based on selection
      return sortOrder === 'NEWEST' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Topbar />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Header & Controls Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Manage Bookings</h2>
                <p className="text-gray-500">Review and respond to resource requests.</p>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                
                {/* Status Filter */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm flex-1 md:flex-none">
                  <Filter size={18} className="text-gray-400" />
                  <select 
                    className="text-sm font-medium focus:outline-none bg-transparent cursor-pointer"
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

                {/* UPGRADED: Date Sort Dropdown with clear labels */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm flex-1 md:flex-none">
                  <ArrowUpDown size={18} className="text-gray-400" />
                  <select 
                    className="text-sm font-medium focus:outline-none bg-transparent cursor-pointer"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="OLDEST">Earliest First (Upcoming)</option>
                    <option value="NEWEST">Latest First (Furthest Away)</option>
                  </select>
                </div>

              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Resource Details</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Purpose</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Entry Status</th> 
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {processedBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                      
                      <td className="px-6 py-4 font-medium text-gray-900">User {booking.userId}</td>
                      
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {booking.resourceName || "Resource Name Pending"}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">
                          ID: #{booking.resourceId}
                        </div>
                      </td>

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

                      <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[150px]">{booking.purpose}</td>
                      
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border 
                          ${booking.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-100' : 
                            booking.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                            'bg-red-50 text-red-700 border-red-100'}`}>
                          {booking.status}
                        </span>
                      </td>

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
                            <span className="whitespace-nowrap text-xs font-medium text-amber-600 border border-amber-200 bg-amber-50 px-2 py-1 rounded-md">
                            Awaiting Arrival
                            </span>
                          )
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      
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
              
              {processedBookings.length === 0 && (
                <div className="p-12 text-center text-gray-500">No requests match your current filters.</div>
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
              Booking for {selectedBooking.resourceName || `Resource #${selectedBooking.resourceId}`} by User {selectedBooking.userId}
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