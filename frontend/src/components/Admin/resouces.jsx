import React, { useState, useEffect } from 'react';
import { Sidebar, Topbar } from './navbar';
import { Layers, MapPin, Users, Clock, Plus, Edit, Trash2, X, AlertCircle, CheckCircle, Search } from 'lucide-react';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    type: 'LECTURE_HALL',
    name: '',
    capacity: '',
    location: '',
    availabilityWindows: '',
    status: 'ACTIVE'
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    minCapacity: '',
    location: ''
  });

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, resources]);

  const fetchResources = () => {
    fetch('http://localhost:8080/api/resources/all')
      .then(res => res.json())
      .then(data => {
        setResources(data);
        setFilteredResources(data);
      })
      .catch(err => console.error('Error loading resources:', err));
  };

  const applyFilters = () => {
    let filtered = [...resources];

    if (filters.type) {
      filtered = filtered.filter(r => r.type === filters.type);
    }
    if (filters.minCapacity) {
      filtered = filtered.filter(r => r.capacity >= parseInt(filters.minCapacity));
    }
    if (filters.location) {
      filtered = filtered.filter(r => 
        r.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    setFilteredResources(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ type: '', minCapacity: '', location: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingResource(null);
    setFormData({
      type: 'LECTURE_HALL',
      name: '',
      capacity: '',
      location: '',
      availabilityWindows: '',
      status: 'ACTIVE'
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
      availabilityWindows: resource.availabilityWindows || '',
      status: resource.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      type: formData.type,
      name: formData.name,
      capacity: parseInt(formData.capacity),
      location: formData.location,
      availabilityWindows: formData.availabilityWindows,
      status: formData.status
    };

    try {
      const url = editingResource 
        ? `http://localhost:8080/api/resources/${editingResource.id}`
        : 'http://localhost:8080/api/resources';
      const method = editingResource ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowModal(false);
        fetchResources();
      }
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/resources/${id}`, {
        method: 'DELETE'
      });
      setDeleteConfirm(null);
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const toggleStatus = async (resource) => {
    const newStatus = resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
    try {
      await fetch(`http://localhost:8080/api/resources/${resource.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...resource,
          capacity: resource.capacity,
          status: newStatus
        })
      });
      fetchResources();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      LECTURE_HALL: 'Lecture Hall',
      LAB: 'Lab',
      MEETING_ROOM: 'Meeting Room',
      EQUIPMENT: 'Equipment'
    };
    return labels[type] || type;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col ml-64">
        <Topbar />
        
        <main className="flex-1 p-8 overflow-y-auto">
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
                <Plus size={18} />
                Add Resource
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select 
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="">All Types</option>
                    <option value="LECTURE_HALL">Lecture Hall</option>
                    <option value="LAB">Lab</option>
                    <option value="MEETING_ROOM">Meeting Room</option>
                    <option value="EQUIPMENT">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Capacity</label>
                  <input 
                    type="number"
                    name="minCapacity"
                    value={filters.minCapacity}
                    onChange={handleFilterChange}
                    placeholder="Min people"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input 
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Search location..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={clearFilters}
                    className="w-full bg-gray-100 text-gray-700 font-medium rounded-xl px-4 py-2.5 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    
                    Clear
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Resource</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Type</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Location</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Capacity</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredResources.map(resource => (
                    <tr key={resource.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 p-2 rounded-lg">
                            <Layers size={18} className="text-indigo-600" />
                          </div>
                          <span className="font-medium text-gray-900">{resource.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          {getTypeLabel(resource.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          {resource.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Users size={14} />
                          {resource.capacity}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleStatus(resource)}
                          className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                            resource.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {resource.status === 'ACTIVE' 
                            ? <><CheckCircle size={12} /> Active</>
                            : <><AlertCircle size={12} /> Out of Service</>
                          }
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openEditModal(resource)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm(resource.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <Layers size={40} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No resources match your filters</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingResource ? 'Edit Resource' : 'Add Resource'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="LECTURE_HALL">Lecture Hall</option>
                  <option value="LAB">Lab</option>
                  <option value="MEETING_ROOM">Meeting Room</option>
                  <option value="EQUIPMENT">Equipment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input 
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="OUT_OF_SERVICE">Out of Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability Windows</label>
                <input 
                  type="text"
                  name="availabilityWindows"
                  value={formData.availabilityWindows}
                  onChange={handleInputChange}
                  placeholder="e.g., Mon-Fri 9AM-5PM"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white font-medium py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  {editingResource ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 p-4 rounded-full text-red-600 mb-4">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Resource?</h3>
              <p className="text-gray-600 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-red-600 text-white font-medium py-3 rounded-xl hover:bg-red-700 transition-colors"
                >
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