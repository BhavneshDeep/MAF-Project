import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { supabase } from '../../services/supabase';
import { Event } from '../../types';
import toast from 'react-hot-toast';
import { Loader2, Plus, Trash2, Edit3, Calendar, Sparkles, X, MapPin, Tag, ArrowUp, ArrowDown } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';
import ImageGalleryUpload from '../../components/ImageGalleryUpload';

export default function ManageEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    category: 'Community Service',
    image_url: '',
    cover_image: '',
    images: [] as string[],
    description: '',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getEvents();
      setEvents(data);
    } catch (error: any) {
      toast.error('Failed to load campaigns/events');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      location: '',
      category: 'Community Service',
      image_url: '',
      cover_image: '',
      images: [] as string[],
      description: '',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEditClick = (event: Event) => {
    setIsEditing(true);
    setEditingId(event.id);
    setFormData({
      title: event.title,
      date: event.date ? event.date.substring(0, 10) : '',
      location: event.location || '',
      category: event.category || 'Community Service',
      image_url: event.image_url || '',
      cover_image: event.cover_image || event.image_url || '',
      images: event.images || [],
      description: event.description || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location || !formData.description) {
      toast.error('Title, Date, Location, and Description are required');
      return;
    }

    const submissionData = {
      ...formData,
      image_url: formData.cover_image || formData.image_url,
      cover_image: formData.cover_image || formData.image_url
    };

    try {
      if (isEditing && editingId) {
        const updated = await api.updateEvent(editingId, submissionData);
        setEvents(events.map(ev => ev.id === editingId ? updated : ev));
        toast.success('Social event updated successfully!');
      } else {
        const created = await api.createEvent(submissionData);
        setEvents([created, ...events]);
        toast.success('New event registered successfully!');
      }
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this event listing?')) return;
    try {
      await api.deleteEvent(id);
      setEvents(events.filter(ev => ev.id !== id));
      toast.success('Event listing deleted');
      if (editingId === id) resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove event card');
    }
  };

  const syncOrdering = async (updatedEvents: Event[]) => {
    try {
      console.log('Initiating bulk events ordering sync. Length:', updatedEvents.length);
      const updates = updatedEvents.map((item, index) => {
        console.log(`Update sync details - Table: events, ID: ${item.id}, Index: ${index}`);
        return supabase
          .from('events')
          .update({ position: index })
          .eq('id', item.id)
          .select();
      });

      const results = await Promise.all(updates);
      
      const failed = results.find(res => res.error);
      if (failed) {
        console.error('Failed to sync a row in events table:', failed.error);
        throw failed.error;
      }
      
      toast.success('Ordering updated successfully!');
    } catch (err: any) {
      console.error('Supabase update failed for events ordering:', err);
      const errMsg = err?.message || err?.details || JSON.stringify(err);
      toast.error(`Failed to save ordering in database: ${errMsg}`);
      loadEvents();
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= events.length) return;

    const newEvents = [...events];
    const temp = newEvents[index];
    newEvents[index] = newEvents[newIndex];
    newEvents[newIndex] = temp;

    const updatedEvents = newEvents.map((e, idx) => ({
      ...e,
      position: idx
    }));

    setEvents(updatedEvents);
    await syncOrdering(updatedEvents);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const reorderedEvents = [...events];
    const [draggedItem] = reorderedEvents.splice(draggedIndex, 1);
    reorderedEvents.splice(targetIndex, 0, draggedItem);

    const updatedEvents = reorderedEvents.map((e, idx) => ({
      ...e,
      position: idx
    }));

    setEvents(updatedEvents);
    setDraggedIndex(null);
    await syncOrdering(updatedEvents);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Filter events based on search query
  const filteredEvents = events.filter(
    ev =>
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Retrieving campaigns archive...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Campaign & Event Records</h1>
          <p className="text-sm text-gray-500 mt-1">Configure clinical healthcare campaigns, mobile blood donations, and local school support programs.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-xl text-rose-600 text-xs font-bold border border-rose-100 self-start">
          <Sparkles className="w-4 h-4" />
          <span>Campaign Registry</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Lists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search campaigns by title, category, or location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-4 py-2 bg-gray-50 border border-gray-150 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold underline"
              >
                Clear
              </button>
            )}
          </div>

          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">No campaigns registered</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                {searchQuery
                  ? "We couldn't find any listings matching your search keys. Try refining terms."
                  : 'Start listing upcoming campaigns by using the registry form on the right.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredEvents.map((event, index) => (
                <div
                  key={event.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col sm:flex-row group hover:border-rose-200 hover:shadow-md transition-all duration-300 cursor-grab active:cursor-grabbing ${draggedIndex === index ? 'opacity-40 border-rose-455 border-dashed' : 'border-gray-100'}`}
                >
                  {/* Thumbnail Cover */}
                  <div className="sm:w-1/4 h-36 sm:h-auto bg-gray-100 shrink-0 relative overflow-hidden">
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-rose-350 bg-rose-50 border-r border-rose-100">
                        <Calendar className="w-8 h-8" />
                        <span className="text-[9px] uppercase font-bold text-rose-455 mt-1.5">No Cover</span>
                      </div>
                    )}
                  </div>

                  {/* Body details */}
                  <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 text-[10px] uppercase font-black rounded-lg">
                          {event.category}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <h4 className="font-extrabold text-gray-900 text-lg leading-tight group-hover:text-rose-600 transition">
                        {event.title}
                      </h4>
                      <p className="text-gray-650 text-xs sm:text-sm text-justify leading-relaxed line-clamp-2">
                        {event.description}
                      </p>
                    </div>

                    {/* Location/Actions bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-50 text-xs text-gray-500 font-bold">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-rose-500" />
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleMove(event.id, 'up')}
                          disabled={events.findIndex(e => e.id === event.id) === 0}
                          className="p-1.5 bg-white text-gray-500 hover:text-rose-600 disabled:opacity-35 disabled:pointer-events-none rounded-lg border border-gray-200 hover:border-rose-200 transition shadow-sm"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(event.id, 'down')}
                          disabled={events.findIndex(e => e.id === event.id) === events.length - 1}
                          className="p-1.5 bg-white text-gray-500 hover:text-rose-600 disabled:opacity-35 disabled:pointer-events-none rounded-lg border border-gray-200 hover:border-rose-200 transition shadow-sm"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEditClick(event)}
                          className="px-2.5 py-1.5 bg-white text-gray-650 hover:text-rose-600 border border-gray-200 hover:border-rose-200 rounded-lg transition shadow-sm flex items-center gap-1 font-bold"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="px-2.5 py-1.5 bg-white text-gray-655 hover:text-red-650 border border-gray-200 hover:border-red-200 rounded-lg transition shadow-sm flex items-center gap-1 font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Registry Form */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-fit space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-black text-gray-900 text-xl">
                {isEditing ? 'Edit Campaign' : 'Register Event'}
              </h3>
              <p className="text-xs text-gray-450 mt-0.5">
                {isEditing ? 'Modify event coordinates and categories.' : 'Initialize institutional campaigns.'}
              </p>
            </div>
            {isEditing && (
              <button
                onClick={resetForm}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-555 uppercase tracking-wider">Campaign Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Free Eye Assessment Clinic"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-555 uppercase tracking-wider">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-555 uppercase tracking-wider">Category *</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition bg-white"
                >
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education Support">Education Support</option>
                  <option value="Community Welfare">Community Welfare</option>
                  <option value="Disaster Relief">Disaster Relief</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-555 uppercase tracking-wider">Location / Venue *</label>
              <input
                type="text"
                required
                placeholder="e.g. Civil Hospital, Karachi"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
              />
            </div>

            <div className="space-y-1">
              <ImageUpload
                folder="events"
                value={formData.cover_image || formData.image_url}
                onChange={url => setFormData({ ...formData, cover_image: url, image_url: url })}
                label="Event Cover Image"
              />
            </div>

            <div className="space-y-1">
              <ImageGalleryUpload
                folder="events"
                value={formData.images}
                onChange={urls => setFormData({ ...formData, images: urls })}
                label="Event Photo Gallery"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-555 uppercase tracking-wider">Campaign Overview *</label>
              <textarea
                required
                placeholder="Summary highlighting objectives, requirements, target audients, and coordination hours..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              {isEditing ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isEditing ? 'Save Changes' : 'Publish Campaign'}</span>
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full py-2 border border-gray-200 text-gray-650 hover:bg-gray-50 font-bold rounded-xl text-sm transition"
              >
                Cancel Edition
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
