import React, { useState, useEffect } from 'react';
import { UserSidebar, UserTopbar } from '../Lecture/navbar';
import api from '../../api/axiosInstance';
import { Shield, Wrench, Send, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function RoleRequestPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    requestedRole: 'TECHNICIAN',
    reason: '',
    image: null
  });

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/role-requests/my');
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reason.trim()) return;
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append('requestedRole', formData.requestedRole);
      form.append('reason', formData.reason);
      if (formData.image) form.append('image', formData.image);

      await api.post('/api/role-requests', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessMsg('Your request has been submitted successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
      setFormData({ requestedRole: 'TECHNICIAN', reason: '', image: null });
      fetchMyRequests();
    } catch (err) {
      console.error("Error submitting request:", err);
    } finally {
      setSubmitting(false);
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
      <UserSidebar />
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        <UserTopbar />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Role Request</h2>
              <p className="text-gray-500">Request the admin to change your role</p>
            </div>

            {successMsg && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl font-medium">
                ✅ {successMsg}
              </div>
            )}

            {/* Request Form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-6">Submit a New Request</h3>
              <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requested Role
                  </label>
                  <select
                    value={formData.requestedRole}
                    onChange={(e) => setFormData({ ...formData, requestedRole: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="TECHNICIAN">Technician</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Request
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                    rows={4}
                    placeholder="Explain why you need this role change..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supporting Document / ID (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">Upload an image or document for verification</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-indigo-600 text-white font-medium rounded-xl px-4 py-3 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={16} />
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>

            {/* My Previous Requests */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <Shield size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">My Previous Requests</h3>
                  <p className="text-sm text-gray-500">{requests.length} total</p>
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-gray-500">Loading...</div>
              ) : requests.length === 0 ? (
                <div className="p-12 text-center text-gray-500">No requests submitted yet.</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Requested Role</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Reason</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {requests.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {r.requestedRole === 'TECHNICIAN' ? <Wrench size={16} className="text-blue-600" /> : <Shield size={16} className="text-purple-600" />}
                            <span className="font-medium text-gray-900">{r.requestedRole}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{r.reason}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(r.status)}</td>
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