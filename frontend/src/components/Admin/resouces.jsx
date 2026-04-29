import React, { useState, useEffect } from "react";
import { Sidebar, Topbar } from "./navbar";
import {
  Layers, MapPin, Users, Plus, Edit, Trash2, X, AlertCircle, CheckCircle,
} from "lucide-react";
import api from "../../api/axiosInstance";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    type: "LECTURE_HALL",
    name: "",
    capacity: "",
    location: "",
    availabilityWindows: [],
    status: "ACTIVE",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [filters, setFilters] = useState({
    type: "",
    minCapacity: "",
    location: "",
  });

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, resources]);

  const fetchResources = () => {
    // Member 4 fix: use axiosInstance so JWT token is attached
    api.get("/api/resources/all")
      .then((res) => {
        setResources(res.data);
        setFilteredResources(res.data);
      })
      .catch((err) => console.error("Error loading resources:", err));
  };

  const applyFilters = () => {
    let filtered = [...resources];
    if (filters.type) {
      filtered = filtered.filter((r) => r.type === filters.type);
    }
    if (filters.minCapacity) {
      filtered = filtered.filter((r) => r.capacity >= parseInt(filters.minCapacity));
    }
    if (filters.location) {
      filtered = filtered.filter((r) =>
        r.location.toLowerCase().includes(filters.location.toLowerCase()),
      );
    }
    setFilteredResources(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ type: "", minCapacity: "", location: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Resource name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    if (!formData.capacity || formData.capacity === '') {
      newErrors.capacity = 'Capacity is required';
    } else if (!/^\d+$/.test(formData.capacity)) {
      newErrors.capacity = 'Capacity must be a number';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.trim().length < 3) {
      newErrors.location = 'Location must be at least 3 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const openAddModal = () => {
    setEditingResource(null);
    setFormData({
      type: "LECTURE_HALL",
      name: "",
      capacity: "",
      location: "",
      availabilityWindows: [],
      status: "ACTIVE",
    });
    setShowModal(true);
  };

  const openEditModal = (resource) => {
    setEditingResource(resource);
    setFormData({
      type: resource.type,
      name: resource.name,
      capacity: resource.capacity.toString(),
      location: resource.location,
      availabilityWindows: resource.availabilityWindows || [],
      status: resource.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateForm()) return;

    const payload = {
      type: formData.type,
      name: formData.name.trim(),
      capacity: parseInt(formData.capacity),
      location: formData.location.trim(),
      availabilityWindows: formData.availabilityWindows,
      status: formData.status,
    };

    try {
      // Member 4 fix: use axiosInstance so JWT token is attached
      if (editingResource) {
        await api.put(`/api/resources/${editingResource.id}`, payload);
      } else {
        await api.post("/api/resources", payload);
      }
      setShowModal(false);
      fetchResources();
    } catch (error) {
      if (error.response?.status === 400) {
        setSubmitError(error.response.data || 'Invalid data provided');
      } else if (error.response?.status === 404) {
        setSubmitError('Resource not found');
      } else {
        setSubmitError('Failed to save resource');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      // Member 4 fix: use axiosInstance so JWT token is attached
      await api.delete(`/api/resources/${id}`);
      setDeleteConfirm(null);
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  const toggleStatus = async (resource) => {
    const newStatus = resource.status === "ACTIVE" ? "OUT_OF_SERVICE" : "ACTIVE";
    try {
      // Member 4 fix: use axiosInstance so JWT token is attached
      await api.put(`/api/resources/${resource.id}`, {
        ...resource,
        capacity: resource.capacity,
        status: newStatus,
      });
      fetchResources();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      LECTURE_HALL: "Lecture Hall",
      LAB: "Lab",
      MEETING_ROOM: "Meeting Room",
      EQUIPMENT: "Equipment",
    };
    return labels[type] || type;
  };

  const addAvailabilityWindow = () => {
    setFormData((prev) => ({
      ...prev,
      availabilityWindows: [...prev.availabilityWindows, { day: "", startTime: "", endTime: "" }],
    }));
  };

  const updateAvailabilityWindow = (index, field, value) => {
    const updated = [...formData.availabilityWindows];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, availabilityWindows: updated }));
  };

  const removeAvailabilityWindow = (index) => {
    const updated = formData.availabilityWindows.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, availabilityWindows: updated }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        <Topbar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Resources Management</h2>
                <p className="text-gray-500">Manage facilities and assets</p>
              </div>
              <button
                onClick={openAddModal}
                className="bg-indigo-600 text-white font-medium rounded-xl px-4 py-2.5 hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus size={18} /> Add Resource
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select name="type" value={filters.type} onChange={handleFilterChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600">
                    <option value="">All Types</option>
                    <option value="LECTURE_HALL">Lecture Hall</option>
                    <option value="LAB">Lab</option>
                    <option value="MEETING_ROOM">Meeting Room</option>
                    <option value="EQUIPMENT">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Capacity</label>
                  <input type="number" name="minCapacity" value={filters.minCapacity}
                    onChange={handleFilterChange} placeholder="Min people"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" name="location" value={filters.location}
                    onChange={handleFilterChange} placeholder="Search location..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div className="flex items-end">
                  <button onClick={clearFilters}
                    className="w-full bg-gray-100 text-gray-700 font-medium rounded-xl px-4 py-2.5 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full">
              <div className="overflow-x-auto w-full pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Resource</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Capacity</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredResources.map((resource) => (
                      <tr key={resource.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                              <Layers size={18} className="text-indigo-600" />
                            </div>
                            <span className="font-bold text-gray-900">{resource.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            {getTypeLabel(resource.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-400" /> {resource.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-gray-400" /> {resource.capacity}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => toggleStatus(resource)}
                            className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors ${
                              resource.status === "ACTIVE"
                                ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                                : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                            }`}>
                            {resource.status === "ACTIVE" ? <><CheckCircle size={14} /> Active</> : <><AlertCircle size={14} /> Out of Service</>}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditModal(resource)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Resource">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => setDeleteConfirm(resource.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Resource">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <Layers size={40} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">No resources match your filters.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingResource ? "Edit Resource" : "Add Resource"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600">
                  <option value="LECTURE_HALL">Lecture Hall</option>
                  <option value="LAB">Lab</option>
                  <option value="MEETING_ROOM">Meeting Room</option>
                  <option value="EQUIPMENT">Equipment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required
                  placeholder="e.g. Main Auditorium"
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required min="1"
                    className={`w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${errors.capacity ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} />
                  {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600">
                    <option value="ACTIVE">Active</option>
                    <option value="OUT_OF_SERVICE">Out of Service</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} required
                  placeholder="e.g. Building A, Floor 2"
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${errors.location ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between mb-3 mt-6">
                  <label className="block text-sm font-bold text-gray-900">Availability Windows</label>
                  <button type="button" onClick={addAvailabilityWindow}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-lg">
                    + Add Time
                  </button>
                </div>
                {formData.availabilityWindows.map((win, index) => (
                  <div key={index} className="flex gap-2 mb-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                    <select value={win.day} onChange={(e) => updateAvailabilityWindow(index, "day", e.target.value)}
                      className="bg-white border border-gray-200 rounded-lg px-2 py-2 flex-1 focus:ring-2 focus:ring-indigo-600 outline-none">
                      <option value="">Day</option>
                      <option value="MONDAY">Mon</option>
                      <option value="TUESDAY">Tue</option>
                      <option value="WEDNESDAY">Wed</option>
                      <option value="THURSDAY">Thu</option>
                      <option value="FRIDAY">Fri</option>
                      <option value="SATURDAY">Sat</option>
                      <option value="SUNDAY">Sun</option>
                    </select>
                    <input type="time" value={win.startTime}
                      onChange={(e) => updateAvailabilityWindow(index, "startTime", e.target.value)}
                      className="bg-white border border-gray-200 rounded-lg px-2 py-2 flex-1 focus:ring-2 focus:ring-indigo-600 outline-none" />
                    <input type="time" value={win.endTime}
                      onChange={(e) => updateAvailabilityWindow(index, "endTime", e.target.value)}
                      className="bg-white border border-gray-200 rounded-lg px-2 py-2 flex-1 focus:ring-2 focus:ring-indigo-600 outline-none" />
                    <button type="button" onClick={() => removeAvailabilityWindow(index)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                  {submitError}
                </div>
              )}
              <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md">
                  {editingResource ? "Save Changes" : "Create Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 p-4 rounded-full text-red-600 mb-4">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Resource?</h3>
              <p className="text-gray-600 mb-8">This action is permanent and cannot be undone.</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors shadow-md">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}