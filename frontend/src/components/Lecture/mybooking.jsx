import React, { useState, useEffect } from 'react';
import { UserSidebar, UserTopbar } from './navbar';
import { 
  Calendar, Clock, XCircle, CheckCircle2, 
  AlertCircle, Info, Trash2, MessageSquare,
  QrCode, Filter, ArrowUpDown      
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../api/axiosInstance';
  Calendar, 
  Clock, 
  XCircle, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Trash2,
  MessageSquare,
  QrCode,
  Filter,          
  ArrowUpDown      
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NEWEST'); 
  
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NEWEST'); 
  
  const [messageModal, setMessageModal] = useState({ isOpen: false, text: '', status: '' });
  const [qrModal, setQrModal] = useState({ isOpen: false, token: '', resourceId: '', resourceName: '' }); 

  const fetchBookings = () => {
    setLoading(true);
    // Member 4 fix: use axiosInstance so JWT token is attached
    api.get('/api/bookings/user/1')
      .then(res => {
        setBookings(res.data);
    fetch('http://localhost:8080/api/bookings/user/1') 
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

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      // Member 4 fix: use axiosInstance so JWT token is attached
      await api.patch(`/api/bookings/${id}/cancel?reason=Cancelled by user`);
      alert("Booking cancelled successfully.");
      fetchBookings(); 
      const response = await fetch(`http://localhost:8080/api/bookings/${id}/cancel?reason=Cancelled by user`, { method: 'PATCH' });
      if (response.ok) {
        alert("Booking cancelled successfully.");
        fetchBookings(); 
      }
    } catch (error) {
      alert("Failed to cancel booking.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this record? This cannot be undone.")) return;
    try {
      // Member 4 fix: use axiosInstance so JWT token is attached
      await api.delete(`/api/bookings/${id}`);
      alert("Record deleted from history.");
      fetchBookings(); 
      const response = await fetch(`http://localhost:8080/api/bookings/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert("Record deleted from history.");
        fetchBookings(); 
      } else {
        alert("Failed to delete the record.");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Server error.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      case 'CANCELLED': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const processedBookings = bookings
    .filter(booking => filterStatus === 'ALL' || booking.status === filterStatus)
    .sort((a, b) => {
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      const dateA = new Date(a.startTime).getTime();
      const dateB = new Date(b.startTime).getTime();
      if (isNaN(dateA) || isNaN(dateB)) return 0;
  // UPGRADED: Bulletproof Date Sorting Logic
  const processedBookings = bookings
    .filter(booking => filterStatus === 'ALL' || booking.status === filterStatus)
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
      <UserSidebar />
      
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        <UserTopbar />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Header Area with Filter and Sort Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
                <p className="text-gray-500">Track and manage your resource reservations.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                
                {/* Filter Dropdown */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm flex-1 md:flex-none">
                  <Filter size={16} className="text-gray-400" />
                  <select 
                    className="text-sm font-medium focus:outline-none bg-transparent w-full cursor-pointer text-gray-700"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm flex-1 md:flex-none">
                  <ArrowUpDown size={16} className="text-gray-400" />
                  <select 
                    className="text-sm font-medium focus:outline-none bg-transparent w-full cursor-pointer text-gray-700"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="OLDEST">Earliest First (Upcoming)</option>
                    <option value="NEWEST">Latest First (Furthest Away)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full">
              <div className="overflow-x-auto w-full pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resource Details</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Purpose</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {processedBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                        
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

                        <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[200px]">{booking.purpose}</td>
                        
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            {booking.status === 'APPROVED' && booking.qrToken && (
                              <button 
                                onClick={() => setQrModal({ 
                                  isOpen: true, 
                                  token: booking.qrToken, 
                                  resourceId: booking.resourceId,
                                  resourceName: booking.resourceName 
                                })}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="View Entry Pass"
                              >
                                <QrCode size={20} />
                              </button>
                            )}

                            {booking.adminReason && (
                              <button 
                                onClick={() => setMessageModal({ isOpen: true, text: booking.adminReason, status: booking.status })}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Admin Message"
                              >
                                <MessageSquare size={20} />
                              </button>
                            )}

                            {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                              <button 
                                onClick={() => handleCancel(booking.id)}
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Cancel Booking"
                              >
                                <XCircle size={20} />
                              </button>
                            )}

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
              </div>

              {processedBookings.length === 0 && !loading && (
                <div className="p-12 text-center">
                  <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info className="text-gray-400" size={30} />
                  </div>
                  <h3 className="text-gray-900 font-medium">No bookings found</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {bookings.length === 0 
                      ? "You haven't made any resource requests yet." 
                      : "No requests match your current filters."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Admin Message Modal */}
      {messageModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className={`p-4 rounded-full mb-4 ${messageModal.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <MessageSquare size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Message from Admin</h3>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 w-full mb-6">
                <p className="text-gray-700 italic">"{messageModal.text}"</p>
              </div>
              <button 
                onClick={() => setMessageModal({ isOpen: false, text: '', status: '' })}
                className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entry Pass Modal */}
      {/* --- Entry Pass Modal --- */}
      {qrModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200 border-t-8 border-indigo-600">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Entry Pass</h3>
              <p className="text-md font-bold text-indigo-600">{qrModal.resourceName || "Resource"}</p>
              <p className="text-xs text-gray-400 mb-6 font-mono">ID: #{qrModal.resourceId}</p>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1">Entry Pass</h3>
              <p className="text-md font-bold text-indigo-600">{qrModal.resourceName || "Resource"}</p>
              <p className="text-xs text-gray-400 mb-6 font-mono">ID: #{qrModal.resourceId}</p>
              
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4 inline-block">
                <QRCodeSVG 
                  value={qrModal.token || "ERROR-NO-TOKEN"} 
                  size={180}
                  level="H"
                />
              </div>
              <p className="text-[10px] text-gray-400 font-mono mb-6 uppercase tracking-wider">
                Token: {qrModal.token ? qrModal.token.split('-')[0] : 'N/A'}
              </p>
              <p className="text-sm font-medium text-gray-600 mb-6 px-4">
                Present this QR code to the security personnel for scanning.
              </p>
              
              <p className="text-[10px] text-gray-400 font-mono mb-6 uppercase tracking-wider">
                Token: {qrModal.token ? qrModal.token.split('-')[0] : 'N/A'}
              </p>

              <p className="text-sm font-medium text-gray-600 mb-6 px-4">
                Present this QR code to the security personnel for scanning.
              </p>

              <button 
                onClick={() => setQrModal({ isOpen: false, token: '', resourceId: '', resourceName: '' })}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
              >
                Close Pass
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}