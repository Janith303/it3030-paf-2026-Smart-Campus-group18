import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, Loader, CheckCircle, XCircle, 
  Search, Filter, Eye, UserPlus, Edit 
} from "lucide-react";
import { Sidebar, Topbar } from "./navbar";

// Cleaned up badge functions using Backend Enums
const getPriorityBadge = (priority) => {
  if (!priority) return <span className="text-gray-400">-</span>;
  const styles = {
    HIGH: "bg-red-100 text-red-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    LOW: "bg-green-100 text-green-700",
    URGENT: "bg-orange-100 text-orange-700"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[priority.toUpperCase()] || "bg-gray-100 text-gray-700"}`}>
      {priority}
    </span>
  );
};

const getStatusBadge = (status) => {
  if (!status) return <span className="text-gray-400">-</span>;
  const styles = {
    OPEN: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    RESOLVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    CLOSED: "bg-gray-100 text-gray-700"
  };
  const labels = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    REJECTED: "Rejected",
    CLOSED: "Closed"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {labels[status] || status}
    </span>
  );
};

export default function AdminTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [technician, setTechnician] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/tickets");
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !searchTerm || 
      ticket.ticketCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openCount = tickets.filter(t => t.status === "OPEN").length;
  const inProgressCount = tickets.filter(t => t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter(t => t.status === "RESOLVED").length;
  const rejectedCount = tickets.filter(t => t.status === "REJECTED").length;

  const statCards = [
    { label: "Open", value: openCount, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "In Progress", value: inProgressCount, icon: Loader, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Resolved", value: resolvedCount, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Rejected", value: rejectedCount, icon: XCircle, color: "text-red-600", bg: "bg-red-50" }
  ];

  const handleAssign = async () => {
    if (!technician) {
      alert("Please select a technician");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/api/tickets/${selectedTicket.id}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: technician })
      });
      if (res.ok) {
        setShowModal(false);
        setTechnician("");
        fetchTickets();
      }
    } catch (err) {
      console.error("Assign error:", err);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      alert("Please select a status");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/api/tickets/${selectedTicket.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, note: note }) 
      });
      if (res.ok) {
        setShowUpdateModal(false);
        setNewStatus("");
        setNote("");
        fetchTickets();
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric"
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        <Topbar />
        
        <main className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">All Tickets Management</h2>
            <p className="text-gray-500">Maintenance & Incident Ticketing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">{card.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`${card.bg} ${card.color} p-2 rounded-lg`}>
                    <card.icon size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative flex-1 w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">All Status</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CLOSED">Closed</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">All Priority</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden w-full">
            <div className="overflow-x-auto w-full pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {loading ? (
                <div className="p-12 text-center text-gray-500">Loading tickets...</div>
              ) : filteredTickets.length === 0 ? (
                <div className="p-12 text-center text-gray-500">No tickets found.</div>
              ) : (
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Ticket ID</th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Priority</th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Created</th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-indigo-600">{ticket.ticketCode || ticket.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{ticket.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{ticket.location}</td>
                        <td className="px-6 py-4">{getPriorityBadge(ticket.priority)}</td>
                        <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{ticket.assignedTo || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(ticket.createdAt)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                              title="View"
                              onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                              title="Assign Technician"
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setShowModal(true);
                              }}
                            >
                              <UserPlus size={18} />
                            </button>
                            <button 
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                              title="Update Status"
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setNewStatus("");
                                setNote("");
                                setShowUpdateModal(true);
                              }}
                            >
                              <Edit size={18} />
                            </button>
                          </div>
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

      {/* --- Assign Technician Modal --- */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Assign Technician</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900">✕</button>
            </div>

            <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ticket ID</p>
              <p className="text-gray-900 font-mono font-medium">{selectedTicket?.ticketCode || selectedTicket?.id}</p>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">Select Technician</label>
            <select 
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-xl py-3 px-4 mb-8 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
            >
              <option value="">Choose a technician...</option>
              <option value="Mike Johnson">Mike Johnson</option>
              <option value="Tom Anderson">Tom Anderson</option>
              <option value="John Davis">John Davis</option>
              <option value="Tom Wilson">Tom Wilson</option>
            </select>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAssign}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Update Status Modal --- */}
      {showUpdateModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowUpdateModal(false); }}
        >
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Update Ticket Status</h2>
              <button onClick={() => setShowUpdateModal(false)} className="text-gray-400 hover:text-gray-900">✕</button>
            </div>

            <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ticket ID</p>
                <p className="font-mono font-medium text-gray-900">{selectedTicket?.ticketCode || selectedTicket?.id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current</p>
                {getStatusBadge(selectedTicket?.status)}
              </div>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
            >
              <option value="">Select new status...</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CLOSED">Closed</option>
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Internal Note (Optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 mb-8 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
              placeholder="Add details about this update..."
              rows={3}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-colors shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}