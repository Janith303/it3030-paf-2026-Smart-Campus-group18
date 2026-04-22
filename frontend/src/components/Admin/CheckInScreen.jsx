import React, { useState } from 'react';
import { Sidebar, Topbar } from './navbar'; // Adjust based on your setup
import { ScanLine, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export default function CheckInScreen() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState(null); // 'success', 'error', 'warning'
  const [message, setMessage] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;

    setStatus(null);
    setBookingDetails(null);

    try {
      const response = await fetch(`http://localhost:8080/api/bookings/verify?token=${token}`, {
        method: 'PATCH'
      });

      if (response.ok) {
        const data = await response.json();
        setStatus('success');
        setMessage('Check-in Successful!');
        setBookingDetails(data);
      } else {
        const errorText = await response.text();
        setStatus('error');
        setMessage(errorText);
      }
    } catch (error) {
      setStatus('error');
      setMessage("Server connection failed.");
    }
    
    setToken(''); // Clear the input for the next scan
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Optional: You can hide the sidebar here to make it look like a dedicated security tablet */}
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="max-w-md w-full">
            
            <div className="text-center mb-10">
              <div className="bg-indigo-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ScanLine size={40} className="text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Resource Check-in</h2>
              <p className="text-gray-400">Scan QR Code or enter token manually</p>
            </div>

            <form onSubmit={handleScan} className="mb-8">
              <input 
                type="text" 
                autoFocus
                placeholder="Awaiting scanner input..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-gray-800 border-2 border-gray-700 text-center text-xl rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-colors shadow-2xl"
              />
              <button type="submit" className="hidden">Submit</button>
            </form>

            {/* --- Status Display --- */}
            {status === 'success' && bookingDetails && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center animate-in fade-in zoom-in">
                <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-400 mb-4">{message}</h3>
                <div className="bg-gray-800 rounded-xl p-4 text-left space-y-2 text-sm text-gray-300">
                  <p><span className="text-gray-500">Resource ID:</span> #{bookingDetails.resourceId}</p>
                  <p><span className="text-gray-500">User ID:</span> {bookingDetails.userId}</p>
                  <p><span className="text-gray-500">Purpose:</span> {bookingDetails.purpose}</p>
                  <p><span className="text-gray-500">Time:</span> {new Date(bookingDetails.startTime).toLocaleTimeString()} - {new Date(bookingDetails.endTime).toLocaleTimeString()}</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center animate-in shake">
                <XCircle size={48} className="text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-400 mb-2">Access Denied</h3>
                <p className="text-gray-300">{message}</p>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}