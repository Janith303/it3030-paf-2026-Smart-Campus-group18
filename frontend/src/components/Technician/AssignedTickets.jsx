import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, AlertTriangle, CheckCircle, Eye, MessageSquare } from "lucide-react";
import { TechnicianSidebar, TechnicianTopbar } from "./navbar";
import api from "../../api/axiosInstance";

export default function AssignedTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const technicianId = localStorage.getItem("userId");
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionText, setResolutionText] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const fetchTickets = async () => {
    try {
      const res = await api.get(`/api/tickets/technician/id/${technicianId}`);
      console.log("TECHNICIAN TICKETS:", res.data);
      setTickets(res.data);
    } catch (err) {
      console.error("ERROR:", err);
    }
  };

  useEffect(() => {
    if (!technicianId) return;
    console.log("Logged-in Technician ID:", technicianId);
    fetchTickets();
  }, [technicianId]);

  const assignedCount = tickets.length;
  const inProgressCount = tickets.filter(t => t.status === "IN_PROGRESS").length;
  const completedTodayCount = tickets.filter(t =>
    t.status === "RESOLVED" &&
    t.createdAt &&
    new Date(t.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const handleViewDetails = (id) => {
    console.log("VIEW CLICKED:", id);
    navigate(`/technician/tickets/${id}`);
  };

  const openResolutionModal = (id) => {
    setSelectedTicketId(id);
    setShowResolutionModal(true);
  };

  const handleSubmitResolution = async () => {
    if (!resolutionText.trim()) {
      alert("Please enter resolution notes");
      return;
    }
    try {
      const res = await api.put(`/api/tickets/${selectedTicketId}/resolve`, { notes: resolutionText });
      if (!res.data) throw new Error("Failed to resolve ticket");
      alert("Ticket resolved successfully");
      setShowResolutionModal(false);
      setResolutionText("");
      fetchTickets();
    } catch (err) {
      console.error("ERROR:", err);
      alert("Error updating resolution");
    }
  };

  console.log("Tickets:", tickets);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64">
        <TechnicianSidebar />
      </div>
      <div className="flex-1">
        <TechnicianTopbar />
        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Assigned Tickets
        </h1>
        <p className="text-gray-500 text-sm">
          Maintenance & Incident Ticketing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Assigned to Me</p>
            <h2 className="text-2xl font-bold text-gray-800">{assignedCount}</h2>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Clock className="text-blue-600" size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">In Progress</p>
            <h2 className="text-2xl font-bold text-gray-800">{inProgressCount}</h2>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <AlertTriangle className="text-yellow-600" size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Completed Today</p>
            <h2 className="text-2xl font-bold text-gray-800">{completedTodayCount}</h2>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <CheckCircle className="text-green-600" size={20} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {tickets.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No assigned tickets</p>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-indigo-600 font-bold text-sm">{ticket.ticketCode || ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-700' :
                      ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                      ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                      ticket.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {ticket.status === 'OPEN' ? 'Open' :
                       ticket.status === 'IN_PROGRESS' ? 'In Progress' :
                       ticket.status === 'RESOLVED' ? 'Resolved' :
                       ticket.status === 'REJECTED' ? 'Rejected' :
                       ticket.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      ticket.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                      ticket.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-700' :
                      ticket.priority === 'LOW' ? 'bg-green-100 text-green-700' :
                      ticket.priority === 'URGENT' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>

                  <h3 className="text-gray-800 font-medium leading-tight">{ticket.description}</h3>

                  <p className="text-sm text-gray-500 mt-1">Location: {ticket.location}</p>
                  <p className="text-sm text-gray-500">Category: {ticket.category}</p>

                  <div className="flex gap-2 mt-3">
                    <button
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      onClick={() => handleViewDetails(ticket.id)}
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => openResolutionModal(ticket.id)}
                      title="Add Resolution Notes"
                    >
                      <MessageSquare size={18} />
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-500 whitespace-nowrap">
                  Created: {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
        </div>
      </div>

      {showResolutionModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowResolutionModal(false); }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add Resolution Notes</h2>
              <button onClick={() => setShowResolutionModal(false)} className="text-gray-400 hover:text-gray-900">✕</button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Ticket ID</label>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <span className="text-gray-900 font-mono font-medium">{selectedTicketId}</span>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-500 mb-1">Resolution Notes</label>
              <textarea
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="Describe how the issue was resolved..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowResolutionModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmitResolution}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md">
                Submit Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}