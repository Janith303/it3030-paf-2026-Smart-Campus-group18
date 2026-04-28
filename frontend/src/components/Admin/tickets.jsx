import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Clock, Loader, CheckCircle, XCircle, 
  Search, Filter, Eye, UserPlus, Edit 
} from "lucide-react";
import { Sidebar, Topbar } from "./navbar";

const tickets = [
  {
    id: "TKT-1001",
    user: "John Smith",
    category: "HVAC",
    location: "Engineering Building - Lab 204",
    priority: "High",
    status: "In Progress",
    assigned: "Mike Johnson",
    created: "2026-04-06"
  },
  {
    id: "TKT-0998",
    user: "Sarah Johnson",
    category: "Electrical",
    location: "Science Building - Room 301",
    priority: "Medium",
    status: "Open",
    assigned: "-",
    created: "2026-04-05"
  },
  {
    id: "TKT-0995",
    user: "David Lee",
    category: "Projector",
    location: "Main Building - Lecture Hall A",
    priority: "High",
    status: "Resolved",
    assigned: "Tom Wilson",
    created: "2026-04-03"
  },
  {
    id: "TKT-0992",
    user: "Emily Brown",
    category: "Plumbing",
    location: "Library - Restroom 2",
    priority: "Urgent",
    status: "Rejected",
    assigned: "-",
    created: "2026-04-02"
  },
  {
    id: "TKT-0989",
    user: "Michael Chen",
    category: "Network",
    location: "IT Lab - Computer Lab 2",
    priority: "Medium",
    status: "In Progress",
    assigned: "John Davis",
    created: "2026-04-01"
  }
];

const getPriorityBadge = (priority) => {
  const styles = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-blue-100 text-blue-700",
    Urgent: "bg-orange-100 text-orange-700",
    Low: "bg-green-100 text-green-700"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[priority]}`}>
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, Loader, CheckCircle, XCircle, 
  Search, Eye, UserPlus, Edit 
} from "lucide-react";
import { Sidebar, Topbar } from "./navbar";

const getPriorityBadge = (priority) => {
  const styles = {
    HIGH: "bg-red-100 text-red-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    LOW: "bg-green-100 text-green-700",
    Urgent: "bg-orange-100 text-orange-700"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[priority] || "bg-gray-100 text-gray-700"}`}>
      {priority}
    </span>
  );
};

const getStatusBadge = (status) => {
  const styles = {
    Open: "bg-blue-100 text-blue-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Resolved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");

  const statCards = [
    { label: "Open", value: 15, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "In Progress", value: 8, icon: Loader, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Resolved", value: 42, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Rejected", value: 3, icon: XCircle, color: "text-red-600", bg: "bg-red-50" }
  ];

  return (
    <div className="flex main-h-screen bg-gray-50">
  const [technician, setTechnician] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/tickets");
      const data = await res.json();
      console.log("Fetched tickets:", data);
      setTickets(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
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
        alert("Technician assigned successfully");
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
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        alert("Status updated successfully");
        setShowUpdateModal(false);
        setNewStatus("");
        fetchTickets();
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
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
            <div className="flex justify-between items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">All Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
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
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Urgent">Urgent</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-indigo-600">{ticket.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.user}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{ticket.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{ticket.location}</td>
                    <td className="px-4 py-3">{getPriorityBadge(ticket.priority)}</td>
                    <td className="px-4 py-3">{getStatusBadge(ticket.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{ticket.assigned}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{ticket.created}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-indigo-600 hover:text-indigo-800" title="View">
                          <Eye size={16} />
                        </button>
                        <button 
                          className="text-blue-600 hover:text-blue-800" 
                          title="Assign"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowModal(true);
                          }}
                        >
                          <UserPlus size={16} />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-800" 
                          title="Update"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowUpdateModal(true);
                          }}
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading tickets...</div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No tickets found</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-indigo-600">{ticket.ticketCode}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ticket.category}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ticket.location}</td>
                      <td className="px-4 py-3">{getPriorityBadge(ticket.priority)}</td>
                      <td className="px-4 py-3">{getStatusBadge(ticket.status)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ticket.assignedTo}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(ticket.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button 
                            className="text-indigo-600 hover:text-indigo-800" 
                            title="View"
                            onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="text-blue-600 hover:text-blue-800" 
                            title="Assign"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowModal(true);
                            }}
                          >
                            <UserPlus size={16} />
                          </button>
                          <button 
                            className="text-gray-600 hover:text-gray-800" 
                            title="Update"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setNewStatus("");
                              setShowUpdateModal(true);
                            }}
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Assign Technician</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-black text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-600">Ticket ID</p>
            <p className="mb-5 text-gray-900 font-medium">{selectedTicket?.id}</p>

            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Technician</label>
            <select className="w-full border border-gray-300 rounded-lg py-2.5 px-3 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">Choose a technician</option>
              <option>Mike Johnson</option>
              <option>Tom Anderson</option>
              <option>John Davis</option>
              <option>Tom Wilson</option>
            </select>

            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity">
            <p className="mb-5 text-gray-900 font-medium">{selectedTicket?.ticketCode}</p>

            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Technician</label>
            <select 
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2.5 px-3 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Choose a technician</option>
              <option value="Mike Johnson">Mike Johnson</option>
              <option value="Tom Anderson">Tom Anderson</option>
              <option value="John Davis">John Davis</option>
              <option value="Tom Wilson">Tom Wilson</option>
            </select>

            <div className="flex gap-3">
              <button 
                onClick={handleAssign}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Assign
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowUpdateModal(false);
          }}
        >
          <div className="bg-white w-[460px] rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Update Ticket Status
              </h2>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-500">Ticket ID</p>
            <p className="mb-4 font-medium text-gray-900">
              {selectedTicket?.id}
              {selectedTicket?.ticketCode}
            </p>

            <p className="text-sm text-gray-600 mb-1">Current Status</p>
            <div className="mb-4 border border-blue-200 bg-blue-50 rounded-lg p-3">
              <span className="px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded">
                {selectedTicket?.status || "Open"}
              </span>
              {getStatusBadge(selectedTicket?.status)}
            </div>

            <label className="text-sm text-gray-600">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select new status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <label className="text-sm text-gray-600">Optional Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any additional notes..."
              rows={3}
            />

            <div className="flex gap-2">
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition duration-200"
                onClick={() => {
                  setShowUpdateModal(false);
                }}
                onClick={handleUpdateStatus}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition duration-200"
              >
                Update Status
              </button>

              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}