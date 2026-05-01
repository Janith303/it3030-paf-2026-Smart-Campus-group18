import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Clock, CheckCircle, Plus, Eye } from "lucide-react";
import { UserSidebar, UserTopbar } from "../Lecture/navbar";

const getStatusBadge = (status) => {
  const styles = {
    OPEN: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    RESOLVED: "bg-green-100 text-green-700",
  };
  const labels = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}
    >
      {labels[status] || status}
    </span>
  );
};

const getPriorityBadge = (priority) => {
  const styles = {
    HIGH: "bg-red-100 text-red-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    LOW: "bg-green-100 text-green-700",
    URGENT: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[priority] || "bg-gray-100 text-gray-700"}`}
    >
      {priority}
    </span>
  );
};

export default function MyIncidents() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/tickets");
      if (!res.ok) throw new Error("API ERROR");
      const data = await res.json();
      
      console.log("Fetched tickets:", data);
      
      const ticketsArray = Array.isArray(data) ? data : [];
      setTickets(ticketsArray);
      setLoading(false);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setTickets([]);
      setLoading(false);
    }
  };

  const recentTickets = [...tickets].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === "OPEN").length;
  const inProgressTickets = tickets.filter(t => t.status === "IN_PROGRESS").length;
  const resolvedTickets = tickets.filter(t => t.status === "RESOLVED").length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar />
      <div className="flex-1 flex flex-col ml-64">
        <UserTopbar />
        <main className="p-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Welcome back!</p>
              <h2 className="text-2xl font-bold text-gray-900">My Incidents</h2>
              <p className="text-gray-500">Maintenance & Incident Ticketing</p>
            </div>
            <Link
              to="/user/incidents/create"
              className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus size={18} />
              <span className="font-medium">Create New Ticket</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium">
                  Total Tickets
                </span>
                <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                  <AlertCircle size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalTickets}</h3>
              <p className="text-xs text-gray-500 font-medium">All time</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium">
                  Open Tickets
                </span>
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <Clock size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{openTickets}</h3>
              <p className="text-xs text-blue-600 font-medium">
                Awaiting action
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium">
                  In Progress
                </span>
                <div className="bg-yellow-50 p-2 rounded-lg text-yellow-600">
                  <AlertCircle size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{inProgressTickets}</h3>
              <p className="text-xs text-yellow-600 font-medium">
                Being worked on
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium">
                  Resolved
                </span>
                <div className="bg-green-50 p-2 rounded-lg text-green-600">
                  <CheckCircle size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{resolvedTickets}</h3>
              <p className="text-xs text-green-600 font-medium">Completed</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Recent Tickets
            </h3>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : recentTickets.length === 0 ? (
              <p className="text-gray-500">No tickets found</p>
            ) : (
              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-blue-600 font-semibold text-sm">
                          {ticket.ticketCode}
                        </span>
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {ticket.description}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {ticket.location} • {ticket.category}
                      </p>
                    </div>
                    <Link
                      to={`/user/incidents/${ticket.id}`}
                      className="mt-4 md:mt-0 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                    >
                      <Eye size={16} />
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}