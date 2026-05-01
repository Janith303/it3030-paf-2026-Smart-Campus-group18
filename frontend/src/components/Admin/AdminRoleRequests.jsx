import React, { useState, useEffect } from 'react';
import { Sidebar, Topbar } from './navbar';
import api from '../../api/axiosInstance';
import { Users, Shield, Wrench, CheckCircle, XCircle, Clock, User } from 'lucide-react';

export default function AdminRoleRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/role-requests');
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/api/role-requests/${id}/approve`);
      setSuccessMsg('Request approved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchRequests();
    } catch (err) {
      console.error("Error approving:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/api/role-requests/${id}/reject`);
      setSuccessMsg('Request rejected.');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchRequests();
    } catch (err) {
      console.error("Error rejecting:", err);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
      APPROVED: 'bg-green-100 text-green-700 border-green-200',
      REJECTED: 'bg-red-100 text-red-700 border-red-200',
    };
    const icons = {
      PENDING: <Clock size={12} />,
      APPROVED: <CheckCircle size={12} />,
      REJECTED: <XCircle size={12} />,
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-fit ${styles[status]}`}>
        {icons[status]} {status}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        <Topbar />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">User Role Requests</h2>
              <p className="text-gray-500">Review and manage user role change requests</p>
            </div>

            {successMsg && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl font-medium">
                ✅ {successMsg}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <Users size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">All Requests</h3>
                  <p className="text-sm text-gray-500">{requests.length} total</p>
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-gray-500">Loading requests...</div>
              ) : requests.length === 0 ? (
                <div className="p-12 text-center text-gray-500">No role requests yet.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {requests.map((r) => (
                    <div key={r.id} className="p-6 hover:bg-gray-50/50 transition-colors">

                      {/* Top row: user info + status + actions */}
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          {r.user.pictureUrl ? (
                            <img src={r.user.pictureUrl} alt={r.user.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                              <User size={18} className="text-indigo-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{r.user.name}</p>
                            <p className="text-xs text-gray-500">{r.user.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          {getStatusBadge(r.status)}
                          {r.status === 'PENDING' && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleApprove(r.id)}
                                className="flex items-center gap-1 px-4 py-2 bg-green-50 text-green-700 text-xs font-medium rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                              >
                                <CheckCircle size={14} /> Approve
                              </button>
                              <button
                                onClick={() => handleReject(r.id)}
                                className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom row: request details */}
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 ml-13">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Requested Role</p>
                          <div className="flex items-center gap-1">
                            {r.requestedRole === 'TECHNICIAN'
                              ? <Wrench size={14} className="text-blue-600" />
                              : <Shield size={14} className="text-purple-600" />}
                            <span className="text-sm font-medium text-gray-900">{r.requestedRole}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Date Submitted</p>
                          <p className="text-sm text-gray-700">
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Document</p>
                          {r.imageUrl ? (
                            <button
                              onClick={function() {
                                const parts = r.imageUrl.trim().split("/");
                                const encoded = parts.map(encodeURIComponent).join("/");
                                window.open("http://localhost:8080/" + encoded, "_blank");
                              }}
                              className="text-indigo-600 text-sm font-medium hover:underline"
                            >
                              📎 View File
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">No document</span>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Reason</p>
                          <p className="text-sm text-gray-700">{r.reason}</p>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}