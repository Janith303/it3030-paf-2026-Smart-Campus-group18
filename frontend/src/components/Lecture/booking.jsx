import React, { useState } from 'react';
import { UserSidebar, UserTopbar } from './navbar';
import { Calendar, Users, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BookResource() {
  const [formData, setFormData] = useState({
    resourceId: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: ''
  });

  const [message, setMessage] = useState(null); // For success/error messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Prepare data for Spring Boot
    const payload = {
      userId: 1, // Hardcoded for now until OAuth is implemented
      resourceId: parseInt(formData.resourceId),
      startTime: formData.startTime, // datetime-local format works perfectly with Spring's LocalDateTime
      endTime: formData.endTime,
      purpose: formData.purpose,
      expectedAttendees: parseInt(formData.expectedAttendees)
    };

    try {
      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Booking request submitted successfully! Awaiting Admin approval.' });
        setFormData({ resourceId: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' }); // Clear form
      } else {
        const errorText = await response.text();
        setMessage({ type: 'error', text: errorText }); // Will display the "Conflict" message from the backend!
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to connect to the server.' });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar />
      
      <div className="flex-1 flex flex-col ml-64">
        <UserTopbar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Book a Resource</h2>
              <p className="text-gray-500">Request a lecture hall, lab, or equipment.</p>
            </div>

            {/* Notification Banner */}
            {message && (
              <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <p className="font-medium">{message.text}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Resource Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resource ID</label>
                  <input 
                    type="number" 
                    name="resourceId"
                    value={formData.resourceId}
                    onChange={handleChange}
                    required
                    placeholder="Enter Resource ID (e.g. 101)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  />
                </div>

                {/* Date & Time Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Calendar size={16}/> Start Time</label>
                    <input 
                      type="datetime-local" 
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Calendar size={16}/> End Time</label>
                    <input 
                      type="datetime-local" 
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                    />
                  </div>
                </div>

                {/* Purpose & Attendees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><FileText size={16}/> Purpose</label>
                  <input 
                    type="text" 
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                    placeholder="E.g., Software Engineering Group Meeting"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Users size={16}/> Expected Attendees</label>
                  <input 
                    type="number" 
                    name="expectedAttendees"
                    value={formData.expectedAttendees}
                    onChange={handleChange}
                    required
                    placeholder="Number of people"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 text-white font-medium rounded-xl px-4 py-3 hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Submit Booking Request
                </button>

              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}