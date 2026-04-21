import React, { useState, useEffect } from 'react';
import { UserSidebar, UserTopbar } from './navbar';
import { Calendar, Users, FileText, CheckCircle2, AlertCircle, Layers } from 'lucide-react';

export default function BookResource() {
  const [formData, setFormData] = useState({
    resourceId: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: ''
  });

  const [message, setMessage] = useState(null); 
  const [resources, setResources] = useState([]); 
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Fetch live resources
  useEffect(() => {
    fetch('http://localhost:8080/api/resources')
      .then(response => response.json())
      .then(data => setResources(data))
      .catch(error => console.error("Error loading resources:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // 2. Year Validation
    const startYear = new Date(formData.startTime).getFullYear();
    const endYear = new Date(formData.endTime).getFullYear();

    if (startYear > 2099 || endYear > 2099) {
      setErrorMessage('Invalid date. Please enter a year between 2024 and 2099.');
      setShowErrorPopup(true);
      return; 
    }

    // 3. Prepare Payload
    const payload = {
      userId: 1, 
      resourceId: parseInt(formData.resourceId),
      startTime: formData.startTime,
      endTime: formData.endTime,
      purpose: formData.purpose,
      expectedAttendees: parseInt(formData.expectedAttendees)
    };

    // 4. Single Clean Fetch Call
    try {
      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Booking request submitted successfully! Awaiting Admin approval.' });
        setFormData({ resourceId: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' }); 
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText); // This catches the "Conflict" message from backend
        setShowErrorPopup(true);
      }
    } catch (error) {
      setErrorMessage('Failed to connect to the server. Please check if the backend is running.');
      setShowErrorPopup(true);
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <UserSidebar />
        
        <div className="flex-1 flex flex-col ml-64">
          <UserTopbar />
          
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Book a Resource</h2>
                <p className="text-gray-500">Select a facility or equipment and reserve your slot.</p>
              </div>

              {/* Success Banner */}
              {message && message.type === 'success' && (
                <div className="p-4 rounded-xl mb-6 flex items-center gap-3 bg-green-50 text-green-700 border border-green-100">
                  <CheckCircle2 size={20} />
                  <p className="font-medium">{message.text}</p>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Dynamic Resource Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Layers size={16}/> Select Resource
                    </label>
                    <select 
                      name="resourceId"
                      value={formData.resourceId}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all cursor-pointer"
                    >
                      <option value="" disabled>-- Choose an available resource --</option>
                      {resources.map((resource) => (
                        <option key={resource.id} value={resource.id}>
                          {resource.name} ({resource.location})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date & Time Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar size={16}/> Start Time
                      </label>
                      <input 
                        type="datetime-local" 
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                        max="2099-12-31T23:59"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar size={16}/> End Time
                      </label>
                      <input 
                        type="datetime-local" 
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                        max="2099-12-31T23:59"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                      />
                    </div>
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FileText size={16}/> Purpose
                    </label>
                    <input 
                      type="text" 
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      required
                      placeholder="E.g., Final Year Project Presentation"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                    />
                  </div>

                  {/* Attendees */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Users size={16}/> Expected Attendees
                    </label>
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
                    className="w-full bg-indigo-600 text-white font-medium rounded-xl px-4 py-3 hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-md"
                  >
                    Submit Booking Request
                  </button>

                </form>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* --- Error Popup Modal (Now safely inside the Fragment) --- */}
      {showErrorPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 p-4 rounded-full text-red-600 mb-4">
                <AlertCircle size={40} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Issue</h3>
              <p className="text-gray-600 mb-6 font-medium">
                {errorMessage}
              </p>
              
              <button 
                onClick={() => setShowErrorPopup(false)}
                className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
              >
                Close & Modify
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}