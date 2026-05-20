import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import { Calendar, Filter, Search, Loader2, MapPin, Grid, Flame } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const localFallbackEvents: Event[] = [
  {
    id: 'fallback-evt-1',
    title: 'Free Cardiovascular Consultation Camp',
    date: '2026-04-15',
    location: 'Shah Faisal Colony, Karachi',
    category: 'Health',
    image_url: '/Assets/assets_events/medical_camp_1.jpg',
    description: 'Conducted in strategic collaboration with Tabba Heart Institute. Offered free ECGs, sugar tests, specialist cardiac checkups, and critical heart care medicines to 500+ locals.'
  },
  {
    id: 'fallback-evt-2',
    title: 'Mangroves & Neem Plantation Drive',
    date: '2026-05-10',
    location: 'Clifton Beach, Karachi',
    category: 'Community Service',
    image_url: '/Assets/assets_events/plantation_drive1.jpeg',
    description: 'Mobilized 80+ volunteers to plant mangrove saplings along the coastal lines and neem trees in local parks to proactively combat the Karachi summer heatwaves.'
  },
  {
    id: 'fallback-evt-3',
    title: 'Modern Teacher Training Seminar',
    date: '2026-02-18',
    location: 'Shah Faisal Girls School, Karachi',
    category: 'Awareness',
    image_url: '/Assets/assets_events/Workshop.jpg',
    description: 'Empowered female teachers with modern pedagogies, active social learning techniques, and structures to deconstruct stereotypes within local classrooms.'
  },
  {
    id: 'fallback-evt-4',
    title: 'Ramadan Free Iftar & Ration Drive',
    date: '2026-03-24',
    location: 'Orangi Town, Karachi',
    category: 'Community Service',
    image_url: '/Assets/assets_events/iftar_drive_1.jpg',
    description: 'Distributed 500+ high-nutrition Iftar boxes and monthly ration packets containing essential supplies to daily-wage laborer families in need.'
  },
  {
    id: 'fallback-evt-5',
    title: 'Arid Clean Water Pump Commissioning',
    date: '2026-01-12',
    location: 'Mithi, Tharparkar, Sindh',
    category: 'Infrastructure',
    image_url: '/Assets/assets_events/project_jal_2.jpg',
    description: 'Formally inaugurated two heavy-duty solar water pumps under Project Jal, successfully granting safe, clean drinking water access to 250 local households.'
  }
];

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getEvents();
      if (data && data.length > 0) {
        setEvents(data);
      } else {
        setEvents(localFallbackEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents(localFallbackEvents);
    } finally {
      setLoading(false);
    }
  };

  // Dynamically extract unique categories present in the loaded dataset
  const dynamicCategories = ['All', ...Array.from(new Set(events.map(event => event.category)))];

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="events" className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm font-medium mb-4">
            <Flame className="w-4 h-4" />
            <span>NGO Campaigns & Events</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            Our Historic Campaigns
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Take a look at our on-ground efforts. From medical relief to infrastructure developments, we actively serve communities.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative w-full lg:max-w-md shrink-0">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search campaigns by name, location, or pitch..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-start lg:items-center gap-3 w-full overflow-x-auto pb-2 lg:pb-0">
            <Filter className="text-gray-400 h-5 w-5 shrink-0 mt-2 lg:mt-0" />
            <div className="flex gap-2 whitespace-nowrap">
              {dynamicCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300
                    ${selectedCategory === category
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/10'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-rose-600 animate-spin" />
              <p className="text-gray-500 font-medium animate-pulse">Loading campaigns log...</p>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center text-gray-500 py-16 bg-white rounded-2xl border border-gray-100 shadow-inner">
            <Grid className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-medium text-lg text-gray-600">No campaigns found matching your filters.</p>
            <p className="text-sm text-gray-400 mt-1">Try broadening your search or switching categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div 
                key={event.id} 
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="relative h-56 bg-gray-200 overflow-hidden shrink-0">
                  <img
                    src={event.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-rose-500">
                      {event.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between text-left">
                  <div>
                    <div className="flex flex-wrap items-center justify-between text-gray-400 text-xs font-semibold gap-2 mb-3">
                      <div className="flex items-center text-rose-500 bg-rose-50 border border-rose-100 rounded-lg px-2 py-1">
                        <Calendar className="h-4.5 w-4.5 mr-1.5 shrink-0" />
                        <span>
                          {new Date(event.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-blue-500 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1">
                        <MapPin className="h-4.5 w-4.5 mr-1.5 shrink-0" />
                        <span>{event.location.split(',')[0]}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors mb-3 leading-tight">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 text-justify line-clamp-4">
                      {event.description}
                    </p>
                  </div>
                  
                  {/* Subtle map coordinates details */}
                  <div className="text-xs text-gray-400 font-medium flex items-center border-t border-gray-50 pt-4 mt-auto">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-300" />
                    <span>Venue: {event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-16 text-center">
          <a
            href="#book"
            className="inline-flex items-center justify-center bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-md shadow-rose-600/10 hover:shadow-lg hover:-translate-y-0.5 group/btn"
          >
            <span>Inquire About Volunteering</span>
            <Search className="ml-2 w-4.5 h-4.5 transition-transform duration-300 group-hover/btn:scale-110" />
          </a>
        </div>
      </div>
    </section>
  );
}