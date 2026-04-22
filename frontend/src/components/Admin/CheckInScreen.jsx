import React, { useState } from 'react';
import { Sidebar, Topbar } from './navbar'; 
import { ScanLine, CheckCircle2, AlertCircle, XCircle, Camera, Keyboard } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function CheckInScreen() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState(null); 
  const [message, setMessage] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  
  const [useCamera, setUseCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const [cameras, setCameras] = useState([]);
  const [activeCameraId, setActiveCameraId] = useState('');

  const processToken = async (scannedToken) => {
    if (!scannedToken || !scannedToken.trim()) return;

    setStatus(null);
    setBookingDetails(null);

    try {
      const response = await fetch(`http://localhost:8080/api/bookings/verify?token=${scannedToken}`, {
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
    
    setToken(''); 
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    processToken(token);
  };

  const toggleCamera = async (state) => {
    setCameraError('');
    setUseCamera(state);

    if (state && cameras.length === 0) {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        setCameras(videoDevices);
        
        // Make sure we actually grab a valid string ID
        if (videoDevices.length > 0 && videoDevices[0].deviceId) {
          setActiveCameraId(videoDevices[0].deviceId);
        } else {
          setCameraError("Camera found, but ID is missing. Check permissions.");
        }
      } catch (err) {
        console.error(err);
        setCameraError("Camera permission denied by browser.");
      }
    }
  };

  // Build the safest possible camera constraints to prevent OverconstrainedError
  const getSafeConstraints = () => {
    const baseConstraints = activeCameraId 
      ? { deviceId: { exact: activeCameraId } } 
      : { facingMode: "user" };

    return {
      ...baseConstraints,
      width: { ideal: 640 }, // Keep resolution requests low and flexible
      height: { ideal: 480 },
      advanced: [] // This strips out Auto-Focus requests that crash laptop webcams!
    };
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="max-w-md w-full">
            
            <div className="text-center mb-8">
              <div className="bg-indigo-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                <ScanLine size={40} className="text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Resource Check-in</h2>
              <p className="text-gray-400">Verify approved entry passes</p>
            </div>

            <div className="flex bg-gray-800 rounded-xl p-1 mb-8 border border-gray-700">
              <button 
                onClick={() => toggleCamera(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${useCamera ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
              >
                <Camera size={16} /> Live Camera
              </button>
              <button 
                onClick={() => toggleCamera(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${!useCamera ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
              >
                <Keyboard size={16} /> Manual Entry
              </button>
            </div>

            {useCamera ? (
              <div className="flex flex-col gap-4 mb-8">
                
                {cameras.length > 1 && (
                  <select 
                    value={activeCameraId}
                    onChange={(e) => setActiveCameraId(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
                  >
                    {cameras.map((cam, index) => (
                      <option key={cam.deviceId} value={cam.deviceId}>
                        {cam.label || `Camera ${index + 1}`}
                      </option>
                    ))}
                  </select>
                )}

                <div className="bg-black rounded-2xl overflow-hidden border-2 border-gray-700 shadow-2xl relative aspect-square flex items-center justify-center">
                  {cameraError ? (
                    <div className="text-center p-6">
                      <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
                      <p className="text-red-400 font-bold mb-2">Hardware Error</p>
                      <p className="text-gray-400 text-sm">{cameraError}</p>
                    </div>
                  ) : (
                    <>
                     {/* FIXED: Using the new 'onScan' syntax for the latest library version */}
                      <Scanner 
                        constraints={getSafeConstraints()}
                        onScan={(detectedCodes) => {
                          // The new library returns an array of detected codes
                          if (detectedCodes && detectedCodes.length > 0) {
                            toggleCamera(false); 
                            // Extract the actual string value from the first detected code
                            processToken(detectedCodes[0].rawValue); 
                          }
                        }}
                        onError={(error) => setCameraError(error?.message || "Scanner failed to load.")}
                      />
                      <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none"></div>
                      <div className="absolute top-4 left-0 right-0 text-center text-xs font-bold text-white/70 tracking-widest uppercase z-10">
                        Point at QR Code
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleManualSubmit} className="mb-8">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Enter Pass ID..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full bg-gray-800 border-2 border-gray-700 text-center text-xl rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-colors shadow-2xl"
                />
                <button type="submit" className="hidden">Submit</button>
              </form>
            )}

            {/* Status Views */}
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
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center animate-in shake duration-300">
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