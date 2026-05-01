import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Tag, User, Calendar, Phone, 
  Clock, MessageSquare, Send, Paperclip
} from 'lucide-react';
import { UserSidebar, UserTopbar } from '../Lecture/navbar';

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
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {labels[status] || status}
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
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[priority] || 'bg-gray-100 text-gray-700'}`}>
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

const getActivityIcon = (type) => {
  switch (type) {
    case 'CREATED': return Clock;
    case 'ASSIGNED': return User;
    case 'STATUS': return Clock;
    case 'COMMENT': return MessageSquare;
    default: return Clock;
  }
};

export default function UserTicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

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
    fetchTicket();
    fetchComments();
    fetchActivities();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/tickets/${id}`);
      const data = await res.json();
      setTicket(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch ticket error:", err);
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/tickets/${id}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/tickets/${id}/activities`);
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error("Fetch activities error:", err);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      await fetch(`http://localhost:8080/api/tickets/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: newComment,
          author: "User"
        })
      });
      setNewComment("");
      fetchComments();
      fetchActivities();
    } catch (err) {
      console.error("Post comment error:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/tickets/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!res.ok) throw new Error();
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <UserSidebar />
        <div className="flex-1 flex flex-col ml-64">
          <UserTopbar />
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
        <UserSidebar />
        <div className="flex-1 flex flex-col ml-64">
          <UserTopbar />
          <main className="p-8">
            <div className="text-center text-gray-500">Ticket not found</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar />
      <div className="flex-1 flex flex-col ml-64">
        <UserTopbar />
        <main className="p-8">
          <div className="mb-6">
            <Link 
              to="/user/incidents" 
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              Back to My Incidents
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
                  <span className="text-blue-600 font-bold text-lg">{ticket.ticketCode}</span>
                  {getStatusBadge(ticket.status)}
                  {getPriorityBadge(ticket.priority)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{ticket.description}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900">{ticket.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Tag size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="text-sm font-medium text-gray-900">{ticket.category}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <User size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Assigned To</p>
                      <p className="text-sm font-medium text-gray-900">{ticket.assignedTo}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Created Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(ticket.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Preferred Contact</p>
                      <p className="text-sm font-medium text-gray-900">{ticket.preferredContact || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4">Attachments</h4>
                {!ticket.attachments ? (
                  <p className="text-sm text-gray-500">No attachments available</p>
                ) : (
                  <div className="space-y-2">
                    {ticket.attachments.split(",").map((file, i) => (
                      <a 
                        key={i}
                        href={`http://localhost:8080/${file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm text-indigo-600"
                      >
                        <span className="truncate">View File {i + 1}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4">Comments</h4>
                <div className="space-y-4 mb-4">
                  {comments.length === 0 ? (
                    <p className="text-sm text-gray-500">No comments yet</p>
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
                        <p className="text-sm text-gray-700 mb-1">{comment.message}</p>
                        <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
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
                    {ticket.assignedTo ? ticket.assignedTo.split(' ').map(n => n[0]).join('').substring(0, 2) : 'NA'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ticket.assignedTo}</p>
                    <p className="text-xs text-gray-500">Technician</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4">Activity Timeline</h4>
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <p className="text-sm text-gray-500">No activities yet</p>
                  ) : (
                    activities.map((act) => {
                      const Icon = getActivityIcon(act.type);
                      return (
                        <div key={act.id} className="flex items-start gap-3">
                          <div className="bg-indigo-100 p-1.5 rounded-full">
                            <Icon size={12} className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{act.message}</p>
                            <p className="text-xs text-gray-500">{formatDate(act.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}