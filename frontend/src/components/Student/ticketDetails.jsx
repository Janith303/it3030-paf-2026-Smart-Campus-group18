import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Tag, User, Calendar, Phone, 
  FileText, Clock, CheckCircle, MessageSquare, Send,
  Edit2, Trash2
} from 'lucide-react';

const ticketData = {
  id: "TKT-1001",
  status: "IN_PROGRESS",
  priority: "HIGH",
  title: "Air conditioning not working in Lab 204",
  location: "Engineering Building - Lab 204",
  category: "HVAC / Air Conditioning",
  createdBy: "John Smith",
  createdDate: "2026-04-06",
  contact: "john.smith@campus.edu",
  description: "The air conditioning unit in Lab 204 is not working. The room temperature is very high and uncomfortable for students and staff."
};

const comments = [
  {
    id: 1,
    name: "John Smith",
    role: "USER",
    message: "This issue is affecting our lab sessions. Please prioritize.",
    date: "2026-04-06 10:30 AM"
  },
  {
    id: 2,
    name: "Mike Johnson",
    role: "TECHNICIAN",
    message: "Compressor malfunction identified. Replacement parts ordered. Expected resolution: 2-3 business days.",
    date: "2026-04-06 02:15 PM"
  }
];

const getStatusBadge = (status) => {
  const styles = {
    OPEN: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
    RESOLVED: 'bg-green-100 text-green-700'
  };
  const labels = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved'
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const getPriorityBadge = (priority) => {
  const styles = {
    HIGH: 'bg-red-100 text-red-700',
    MEDIUM: 'bg-blue-100 text-blue-700',
    LOW: 'bg-green-100 text-green-700'
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
      {priority}
    </span>
  );
};

export default function TicketDetails() {
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");

  const timeline = [
    { title: "Ticket created", date: "2026-04-06 10:30 AM", icon: FileText },
    { title: "Technician assigned", date: "2026-04-06 11:00 AM", icon: User },
    { title: "Status updated to In Progress", date: "2026-04-06 02:15 PM", icon: Clock }
  ];

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    console.log("New comment:", newComment);
    setNewComment("");
  };

  return (
    <main className="p-8">
      <div className="mb-6">
        <Link 
          to="/incidents" 
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back to Tickets
        </Link>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ticket Details</h2>
        <p className="text-gray-500">Maintenance & Incident Ticketing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-blue-600 font-bold text-lg">{ticketData.id}</span>
              {getStatusBadge(ticketData.status)}
              {getPriorityBadge(ticketData.priority)}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{ticketData.title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">{ticketData.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Tag size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="text-sm font-medium text-gray-900">{ticketData.category}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Created By</p>
                  <p className="text-sm font-medium text-gray-900">{ticketData.createdBy}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Created Date</p>
                  <p className="text-sm font-medium text-gray-900">{ticketData.createdDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Preferred Contact</p>
                  <p className="text-sm font-medium text-gray-900">{ticketData.contact}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-900">{ticketData.description}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Attachments</h4>
            <p className="text-sm text-gray-500">No attachments available</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Comments</h4>
            <div className="space-y-4 mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-900">{comment.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        comment.role === 'TECHNICIAN' 
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {comment.role}
                      </span>
                    </div>
                    {comment.role === 'USER' && (
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-indigo-600">
                          <Edit2 size={14} />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{comment.message}</p>
                  <p className="text-xs text-gray-500">{comment.date}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
              />
              <button 
                onClick={handlePostComment}
                className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Assigned Technician</h4>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 text-indigo-600 h-10 w-10 rounded-full flex items-center justify-center font-semibold">
                MJ
              </div>
              <div>
                <p className="font-medium text-gray-900">Mike Johnson</p>
                <p className="text-xs text-gray-500">HVAC Specialist</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Resolution Notes</h4>
            <p className="text-sm text-gray-700">
              Compressor malfunction identified. Replacement parts ordered. Expected resolution: 2-3 business days.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Activity Timeline</h4>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-gray-100 p-1.5 rounded-full">
                    <item.icon size={12} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
