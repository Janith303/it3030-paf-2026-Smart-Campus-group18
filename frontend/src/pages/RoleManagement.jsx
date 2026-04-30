import React, { useState, useEffect } from 'react';
import { Sidebar, Topbar } from '../components/Admin/navbar';
import api from '../api/axiosInstance';
import { Users, Shield, User, Wrench, Search } from 'lucide-react';

export default function RoleManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId);
    try {
      await api.put(`/api/users/${userId}/role`, { role: newRole });
      setSuccessMsg(`Role updated successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchUsers();
    } catch (err) {
      console.error("Error updating role:", err);
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadge = (role) => {
    const styles = {
      ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
      TECHNICIAN: 'bg-blue-100 text-blue-700 border-blue-200',
      USER: 'bg-green-100 text-green-700 border-green-200',
    };
    const icons = {
      ADMIN: <Shield size={12} />,
      TECHNICIAN: <Wrench size={12} />,
      USER: <User size={12} />,
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-fit ${styles[role] || 'bg-gray-100 text-gray-700'}`}>
        {icons[role]} {role}
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
              <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
              <p className="text-gray-500">Manage user roles and permissions</p>
            </div>

            {/* Success Message */}
            {successMsg && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl font-medium">
                ✅ {successMsg}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <Users size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">All Users</h3>
                    <p className="text-sm text-gray-500">{filteredUsers.length} of {users.length} users</p>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-gray-500">Loading users...</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Current Role</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Change Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                          No users found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {user.pictureUrl ? (
                                <img 
                                  src={user.pictureUrl} 
                                  alt={user.name}
                                  className="w-9 h-9 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <User size={18} className="text-indigo-600" />
                                </div>
                              )}
                              <span className="font-medium text-gray-900">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              disabled={updating === user.id}
                              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
                            >
                              <option value="USER">USER</option>
                              <option value="ADMIN">ADMIN</option>
                              <option value="TECHNICIAN">TECHNICIAN</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
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