import React, { useState, useEffect } from 'react';
import { UserSidebar, UserTopbar } from './navbar';
import { Calendar, Users, FileText, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import api from '../../api/axiosInstance';

export default function BookResource() {
  const [formData, setFormData] = useState({
    resourceId: '',
    resourceName: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: ''
  });

  const [resources, setResources] = useState([]); 
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    // Member 4 fix: use axiosInstance so JWT token is attached
    api.get('/api/resources')
      .then(response => setResources(response.data))
      .catch(error => console.error("Error loading resources:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'resourceId') {
      const selectedResource = resources.find(r => r.id.toString() === value);
      setFormData({ 
        ...formData, 
        resourceId: value,
        resourceName: selectedResource ? selectedResource.name : ''
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startYear = new Date(formData.startTime).getFullYear();
    const endYear = new Date(formData.endTime).getFullYear();

    if (startYear > 2099 || endYear > 2099) {
      setErrorMessage('Invalid date. Please enter a year between 2024 and 2099.');
      setShowErrorPopup(true);
      return; 
    }

    const payload = {
      userId: 1, 
      resourceId: parseInt(formData.resourceId),
      resourceName: formData.resourceName,
      startTime: formData.startTime,
      endTime: formData.endTime,
      purpose: formData.purpose,
      expectedAttendees: parseInt(formData.expectedAttendees)
    };

    try {
      // Member 4 fix: use axiosInstance so JWT token is attached
      await api.post('/api/bookings', payload);
      setShowSuccessPopup(true);
      setFormData({ resourceId: '', resourceName: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' }); 
    } catch (error) {
      const errorText = error.response?.data || 'Failed to connect to the server. Please check if the backend is running.';
      setErrorMessage(errorText); 
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

              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
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

      {/* Error Popup Modal */}
      {showErrorPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 p-4 rounded-full text-red-600 mb-4">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Issue</h3>
              <p className="text-gray-600 mb-6 font-medium">{errorMessage}</p>
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

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Requested!</h3>
              <p className="text-gray-600 mb-6 font-medium">
                Your request has been successfully submitted and is now awaiting Admin approval.
              </p>
              <button 
                onClick={() => setShowSuccessPopup(false)}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                Awesome
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}