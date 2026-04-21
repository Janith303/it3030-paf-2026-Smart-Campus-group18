import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Clock, CheckCircle, Plus, Eye } from "lucide-react";
import { Sidebar, Topbar } from "./navbar";

const tickets = [
  {
    id: "TKT-1001",
    status: "IN_PROGRESS",
    priority: "HIGH",
    title: "Air conditioning not working in Lab 204",
    location: "Engineering Building - Lab 204",
    date: "2026-04-06",
  },
  {
    id: "TKT-0998",
    status: "OPEN",
    priority: "MEDIUM",
    title: "Broken window in Classroom 301",
    location: "Science Building - Room 301",
    date: "2026-04-05",
  },
  {
    id: "TKT-0995",
    status: "RESOLVED",
    priority: "URGENT",
    title: "Projector display issue",
    location: "Main Building - Lecture Hall A",
    date: "2026-04-03",
  },
];

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
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
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
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[priority]}`}
    >
      {priority}
    </span>
  );
};

export default function Incidents() {
  return (
    <div className="flex main-h-screen bg-gray-50">
      {/* 1. Fixed Sidebar */}
      <Sidebar />
      {/* 2. Main Content Wrapper (Pushed right by ml-64) */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Topbar stays at the top of this section */}
        <Topbar />
        <main className="p-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Welcome back!</p>
              <h2 className="text-2xl font-bold text-gray-900">Incidents</h2>
              <p className="text-gray-500">Maintenance & Incident Ticketing</p>
            </div>
            <Link
              to="/incidents/create"
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
              <h3 className="text-3xl font-bold text-gray-900 mb-1">12</h3>
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
              <h3 className="text-3xl font-bold text-gray-900 mb-1">4</h3>
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
              <h3 className="text-3xl font-bold text-gray-900 mb-1">3</h3>
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
              <h3 className="text-3xl font-bold text-gray-900 mb-1">5</h3>
              <p className="text-xs text-green-600 font-medium">Completed</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Recent Tickets
            </h3>

            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-blue-600 font-semibold text-sm">
                        {ticket.id}
                      </span>
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {ticket.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {ticket.location} • {ticket.date}
                    </p>
                  </div>
                  <Link
                    to={`/incidents/${ticket.id}`}
                    className="mt-4 md:mt-0 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                  >
                    <Eye size={16} />
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
