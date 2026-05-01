import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Tag, Calendar, Phone, 
  Clock, MessageSquare
} from 'lucide-react';
import { TechnicianSidebar, TechnicianTopbar } from './navbar';
import api from '../../api/axiosInstance';

const getStatusBadge = (status) => {
  const styles = {
    OPEN: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
    RESOLVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    CLOSED: 'bg-gray-100 text-gray-700'
  };
  const labels = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
    REJECTED: 'Rejected',
    CLOSED: 'Closed'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {labels[status] || status}
    </span>
  );
};

const getPriorityBadge = (priority) => {
  const styles = {
    HIGH: 'bg-red-100 text-red-700',
    MEDIUM: 'bg-blue-100 text-blue-700',
    LOW: 'bg-green-100 text-green-700',
    URGENT: 'bg-orange-100 text-orange-700'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[priority] || 'bg-gray-100 text-gray-700'}`}>
      {priority}
    </span>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export default function TechnicianTicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionText, setResolutionText] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role || "");
      } catch (e) {
        console.error("Error decoding token", e);
      }
    }

    const fetchTicket = async () => {
      try {
        const res = await api.get(`/api/tickets/${id}`);
        console.log("TICKET DETAILS:", res.data);
        setTicket(res.data);
      } catch (err) {
        console.error("Fetch ticket error:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await api.get(`/api/tickets/${id}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error("Fetch comments error:", err);
      }
    };

    const fetchActivities = async () => {
      try {
        const res = await api.get(`/api/tickets/${id}/activities`);
        console.log("ACTIVITIES:", res.data);
        setActivities(res.data);
      } catch (err) {
        console.error("Fetch activities error:", err);
      }
    };

    fetchTicket();
    fetchComments();
    fetchActivities();
  }, [id]);

  const refreshActivities = () => {
    api.get(`/api/tickets/${id}/activities`)
      .then(res => setActivities(res.data))
      .catch(err => console.error("Fetch activities error:", err));
  };

  const handleSubmitResolution = async () => {
    if (!resolutionText.trim()) {
      alert("Please enter resolution notes");
      return;
    }
    try {
      const res = await api.put(`/api/tickets/${id}/resolve`, { notes: resolutionText });
      if (!res.data) throw new Error("Failed");
      alert("Resolution added successfully");
      setShowResolutionModal(false);
      setResolutionText("");
      refreshActivities();
    } catch (err) {
      console.error(err);
      alert("Error updating resolution");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/api/tickets/${id}/comments`, {
        message: newComment,
        author: "Technician"
      });
      if (!res.data) throw new Error("Failed to add comment");
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Error adding comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const res = await api.delete(`/api/tickets/comments/${commentId}`);
      if (!res.data) throw new Error();
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <TechnicianSidebar />
        <div className="flex-1 flex flex-col">
          <TechnicianTopbar />
          <main className="p-8">
            <div className="text-center text-gray-500">Loading ticket details...</div>
          </main>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <TechnicianSidebar />
        <div className="flex-1 flex flex-col">
          <TechnicianTopbar />
          <main className="p-8">
            <div className="text-center text-gray-500">Ticket not found</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TechnicianSidebar />
      <div className="flex-1 flex flex-col">
        <TechnicianTopbar />
        <main className="p-8">
          <div className="mb-6">
            <Link 
              to="/technician/tickets" 
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              Back to Assigned Tickets
            </Link>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Ticket Details</h2>
            <p className="text-gray-500">Maintenance & Incident Ticketing</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-indigo-600 font-bold text-lg">{ticket.ticketCode}</span>
                  {getStatusBadge(ticket.status)}
                  {getPriorityBadge(ticket.priority)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-5">{ticket.description}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                    <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Location</p>
                      <p className="text-sm font-medium text-gray-900">{ticket.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                    <Tag size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Category</p>
                      <p className="text-sm font-medium text-gray-900">{ticket.category}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                    <Calendar size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Created Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(ticket.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                    <Phone size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Preferred Contact</p>
                      <p className="text-sm font-medium text-gray-900">{ticket.preferredContact || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4">Attachments</h4>
                {!ticket.attachments ? (
                  <p className="text-sm text-gray-400">No attachments available</p>
                ) : (
                  <div className="space-y-2">
                    {ticket.attachments.split(",").map((file, i) => (
                      <a
                        key={i}
                        href={`http://localhost:8080/${file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm text-indigo-600 transition-colors"
                      >
                        <span className="truncate">View File {i + 1}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4">Comments</h4>
                <div className="space-y-3 mb-4">
                  {comments.length === 0 ? (
                    <p className="text-sm text-gray-400">No comments yet</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="p-4 bg-gray-50 rounded-xl relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              comment.author === 'Technician' || comment.author === 'Admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {comment.author === 'Technician' || comment.author === 'Admin' ? 'STAFF' : 'USER'}
                            </span>
                          </div>
                          {userRole === "ADMIN" && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-500 text-xs hover:underline font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{comment.message}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    onClick={handleAddComment}
                    className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    <MessageSquare size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Assigned Technician</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full font-semibold text-purple-700">
                    {ticket.assignedTo ? ticket.assignedTo.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ticket.assignedTo}</p>
                    <p className="text-xs text-gray-500">Technician</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowResolutionModal(true)}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md"
              >
                Add Resolution Notes
              </button>

              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4">Activity Timeline</h4>
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <p className="text-sm text-gray-400">No activity yet</p>
                  ) : (
                    activities.map((a) => (
                      <div key={a.id} className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-full ${
                          a.type === 'RESOLUTION' ? 'bg-green-100' :
                          a.type === 'ASSIGNED' ? 'bg-purple-100' :
                          'bg-indigo-100'
                        }`}>
                          <Clock size={12} className={
                            a.type === 'RESOLUTION' ? 'text-green-600' :
                            a.type === 'ASSIGNED' ? 'text-purple-600' :
                            'text-indigo-600'
                          } />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{a.message}</p>
                          <p className="text-xs text-gray-400">{formatDate(a.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
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
                <span className="text-gray-900 font-mono font-medium">{ticket.ticketCode}</span>
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
  