import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Upload, X } from 'lucide-react';

const locations = [
  "Engineering Building - Lab 101",
  "Engineering Building - Lab 204",
  "Science Building - Room 301",
  "Main Building - Lecture Hall A",
  "Library - Study Area",
  "IT Lab - Computer Lab 2"
];

const categories = [
  "Electrical Issue",
  "Plumbing Issue",
  "HVAC / Air Conditioning",
  "Projector / Equipment Issue",
  "Network / Internet Issue",
  "Furniture Damage",
  "Cleaning / Maintenance"
];

const priorities = ["LOW", "MEDIUM", "HIGH"];

export default function CreateIncident() {
  const [formData, setFormData] = useState({
    location: "",
    category: "",
    description: "",
    priority: "",
    contact: ""
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (files.length + newFiles.length > 3) {
      alert("Maximum 3 files allowed");
      return;
    }
    const imageFiles = newFiles.filter(file => 
      ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
    );
    if (imageFiles.length !== newFiles.length) {
      alert("Only PNG, JPG, JPEG files are allowed");
      return;
    }
    setFiles(prev => [...prev, ...imageFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.priority) newErrors.priority = "Priority is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Form submitted:", { ...formData, files });
    alert("Ticket submitted successfully!");
  };

  return (
    <main className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link 
            to="/incidents" 
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            ← Back to Incidents
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Ticket</h2>
            <p className="text-gray-500">Maintenance & Incident Ticketing</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resource / Location *
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.location ? 'border-red-500' : 'border-gray-200'
                } focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all`}
              >
                <option value="">Select location</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.category ? 'border-red-500' : 'border-gray-200'
                } focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all`}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the issue in detail..."
                className={`w-full px-4 py-2.5 rounded-lg border resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-200'
                } focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.priority ? 'border-red-500' : 'border-gray-200'
                } focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all`}
              >
                <option value="">Select priority</option>
                {priorities.map(pri => (
                  <option key={pri} value={pri}>{pri}</option>
                ))}
              </select>
              {errors.priority && (
                <p className="text-red-500 text-xs mt-1">{errors.priority}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Contact
              </label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Email or phone number"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachments (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-indigo-300 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB (max 3 files)</p>
                </label>
              </div>
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-600 truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Link
                to="/incidents"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-center font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
