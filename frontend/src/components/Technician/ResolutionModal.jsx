import React, { useState } from "react";

export default function ResolutionModal({ isOpen, onClose, ticket }) {
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(ticket?.status || "");

  if (!isOpen || !ticket) return null;

  const handleSave = () => {
    if (!status) {
      alert("Please select a status");
      return;
    }

    if (!notes.trim()) {
      alert("Please enter resolution notes");
      return;
    }

    const payload = {
      ticketId: ticket.id,
      notes,
      status,
    };

    console.log("Submitting:", payload);

    // TODO: connect to backend API here

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative">
        
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Resolution Notes
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="text-sm text-gray-600 space-y-2 mb-4">
          <p><span className="font-medium">Ticket ID</span> <span className="text-blue-600 ml-2">{ticket.id}</span></p>
          <p><span className="font-medium">Category</span> <span className="ml-2">{ticket.category}</span></p>
          <p><span className="font-medium">Location</span> <span className="ml-2">{ticket.location}</span></p>
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium">Current Status</label>
          <div className="mt-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm">
            {ticket.status}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Update Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select status</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Resolution Notes *
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the work performed, parts used, and resolution details..."
            className="w-full border border-blue-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg text-white font-medium"
            style={{
              background: "linear-gradient(90deg, #4f46e5, #6366f1)"
            }}
          >
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}