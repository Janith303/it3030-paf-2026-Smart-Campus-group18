import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserSidebar, UserTopbar } from './navbar';
import { Layers, MapPin, Users, Clock, Search, Calendar } from 'lucide-react';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    minCapacity: '',
    location: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/resources')
      .then(res => res.json())
      .then(data => {
        setResources(data);
        setFilteredResources(data);
      })
      .catch(err => console.error('Error loading resources:', err));
  }, []);

  useEffect(() => {
    let filtered = resources;

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
  }, [filters, resources]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleBook = (resource) => {
    navigate('/user/book', { state: { resource } });
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
    <>
      <div className="flex min-h-screen bg-gray-50">
        <UserSidebar />
        
        <div className="flex-1 flex flex-col ml-64">
          <UserTopbar />
          
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Resources Catalogue</h2>
                <p className="text-gray-500">Browse available facilities and equipment</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
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
                      onClick={() => setFilters({ type: '', minCapacity: '', location: '' })}
                      className="w-full bg-gray-100 text-gray-700 font-medium rounded-xl px-4 py-2.5 hover:bg-gray-200 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map(resource => (
                  <div key={resource.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-indigo-100 p-3 rounded-xl">
                        <Layers size={24} className="text-indigo-600" />
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        {getTypeLabel(resource.type)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.name}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin size={16} />
                        <span>{resource.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Users size={16} />
                        <span>Capacity: {resource.capacity}</span>
                      </div>
                      {resource.availabilityWindows && (
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Clock size={16} />
                          <span className="truncate">{resource.availabilityWindows}</span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => handleBook(resource)}
                      className="w-full bg-indigo-600 text-white font-medium rounded-xl px-4 py-2.5 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Calendar size={18} />
                      Book Now
                    </button>
                  </div>
                ))}
              </div>

              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <Layers size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No resources match your filters</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}