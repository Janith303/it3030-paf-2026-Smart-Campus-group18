import { useState } from "react";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { TechnicianSidebar, TechnicianTopbar } from "./navbar";
import ResolutionModal from "./ResolutionModal";

export default function AssignedTickets() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const tickets = [
    {
      id: "TKT-1001",
      title: "Air conditioning not working properly",
      status: "IN_PROGRESS",
      priority: "HIGH",
      user: "John Smith",
      location: "Engineering Building - Lab 204",
      category: "HVAC",
      date: "2026-04-06"
    },
    {
      id: "TKT-0996",
      title: "Complete AC unit failure",
      status: "OPEN",
      priority: "URGENT",
      user: "Lisa Chen",
      location: "Admin Block - Conference Room",
      category: "HVAC",
      date: "2026-04-05"
    }
  ];

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
            <h2 className="text-2xl font-bold text-gray-800">8</h2>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Clock className="text-blue-600" size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">In Progress</p>
            <h2 className="text-2xl font-bold text-gray-800">3</h2>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <AlertTriangle className="text-yellow-600" size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Completed Today</p>
            <h2 className="text-2xl font-bold text-gray-800">2</h2>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <CheckCircle className="text-green-600" size={20} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm mb-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-600 font-medium">{ticket.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
                    {ticket.status === "IN_PROGRESS" ? "In Progress" : "Open"}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600">
                    {ticket.priority}
                  </span>
                </div>

                <h3 className="text-gray-800 font-medium leading-tight">{ticket.title}</h3>

                <p className="text-sm text-gray-500 mt-1">Reported by: {ticket.user}</p>
                <p className="text-sm text-gray-500">Location: {ticket.location}</p>
                <p className="text-sm text-gray-500">Category: {ticket.category}</p>

                <div className="flex gap-2 mt-3">
                  <button className="border px-3 py-1 rounded-lg text-sm hover:bg-gray-100">
                    View Details
                  </button>
                  <button 
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setShowModal(true);
                    }}
                  >
                    Add Resolution Notes
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-500 whitespace-nowrap">
                Created: {ticket.date}
              </div>
            </div>
          </div>
        ))}
      </div>
        </div>
      </div>

      <ResolutionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        ticket={selectedTicket}
      />
    </div>
  );
}