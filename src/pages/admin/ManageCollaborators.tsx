import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Collaborator } from '../../types';
import toast from 'react-hot-toast';
import { Loader2, Plus, Trash2, Edit3, Building2, Sparkles, X, ChevronRight } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

export default function ManageCollaborators() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'ngo' as 'ngo' | 'government' | 'healthcare' | 'educational',
    description: '',
    logo: '',
    image_url: '',
    projects: '',
  });

  useEffect(() => {
    loadCollaborators();
  }, []);

  const loadCollaborators = async () => {
    try {
      setLoading(true);
      const data = await api.getCollaborators();
      setCollaborators(data);
    } catch (error: any) {
      toast.error('Failed to load partners directory');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'ngo',
      description: '',
      logo: '',
      image_url: '',
      projects: '',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEditClick = (collab: Collaborator) => {
    setIsEditing(true);
    setEditingId(collab.id);
    setFormData({
      name: collab.name,
      type: collab.type || 'ngo',
      description: collab.description || '',
      logo: collab.logo || '',
      image_url: collab.image_url || collab.logo || '',
      projects: collab.projects ? collab.projects.join(', ') : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      toast.error('Partner Name and Description are required fields');
      return;
    }

    const parsedProjects = formData.projects
      ? formData.projects.split(',').map(p => p.trim()).filter(Boolean)
      : [];

    const submissionData = {
      name: formData.name,
      type: formData.type,
      description: formData.description,
      logo: formData.image_url || formData.logo,
      image_url: formData.image_url || formData.logo,
      projects: parsedProjects,
    };

    try {
      if (isEditing && editingId) {
        const updated = await api.updateCollaborator(editingId, submissionData);
        setCollaborators(collaborators.map(c => c.id === editingId ? updated : c));
        toast.success('Partner information updated successfully!');
      } else {
        const created = await api.createCollaborator(submissionData);
        setCollaborators([created, ...collaborators]);
        toast.success('New partner registered successfully!');
      }
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this partner record from public listings?')) return;
    try {
      await api.deleteCollaborator(id);
      setCollaborators(collaborators.filter(c => c.id !== id));
      toast.success('Partner listing removed');
      if (editingId === id) resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove partner profile');
    }
  };

  const filteredCollaborators = collaborators.filter(
    c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Loading partners database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Partners & Sponsors Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage institutional sponsors, medical partners, and educational alliance logos shown publicly.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-xl text-rose-600 text-xs font-bold border border-rose-100 self-start">
          <Sparkles className="w-4 h-4" />
          <span>Strategic Alliances</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Lists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search partners by name, alliance type, or projects..."
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

          {filteredCollaborators.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">No partner listings found</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                {searchQuery
                  ? "We couldn't locate any records matching your search query. Try broadening your keywords."
                  : 'Start adding alliances by using the partner registry form on the right.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredCollaborators.map(partner => (
                <div
                  key={partner.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-rose-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      {partner.image_url || partner.logo ? (
                        <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-xl p-1 flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={partner.image_url || partner.logo}
                            alt={partner.name}
                            className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bea4caa92f14?auto=format&fit=crop&q=80&w=300';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg border border-rose-100 shrink-0">
                          {partner.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900 text-base leading-tight group-hover:text-rose-600 transition line-clamp-1">
                          {partner.name}
                        </h4>
                        <span className="inline-block px-2.5 py-0.5 bg-rose-50 text-rose-600 text-[10px] uppercase font-bold rounded-lg border border-rose-100 mt-1">
                          {partner.type}
                        </span>
                      </div>
                    </div>
                    {partner.description && (
                      <p className="text-gray-650 text-xs sm:text-sm leading-relaxed line-clamp-3 text-justify">
                        {partner.description}
                      </p>
                    )}
                    {partner.projects && partner.projects.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] uppercase font-black tracking-wider text-rose-600 block mb-1">Active Projects</span>
                        <div className="flex flex-wrap gap-1">
                          {partner.projects.map((proj, idx) => (
                            <span key={idx} className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded-lg border border-gray-150 text-[10px] font-bold">
                              {proj}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Registered {partner.created_at ? new Date(partner.created_at).toLocaleDateString() : 'recently'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(partner)}
                        className="p-1.5 bg-white text-gray-500 hover:text-rose-600 rounded-lg border border-gray-200 hover:border-rose-200 transition shadow-sm"
                        title="Edit Partner Profile"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(partner.id)}
                        className="p-1.5 bg-white text-gray-500 hover:text-red-655 rounded-lg border border-gray-200 hover:border-red-200 transition shadow-sm"
                        title="Delete Partner listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
                {isEditing ? 'Edit Partner' : 'Register Partner'}
              </h3>
              <p className="text-xs text-gray-450 mt-0.5">
                {isEditing ? 'Modify alliance parameters.' : 'Publish official partner logo.'}
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
              <label className="text-xs font-bold text-gray-555 uppercase tracking-wider">Institution Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Aga Khan University Hospital"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-555 uppercase tracking-wider">Alliance Category *</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition bg-white"
              >
                <option value="ngo">Non-Governmental (NGO)</option>
                <option value="government">Government Institution</option>
                <option value="healthcare">Healthcare System</option>
                <option value="educational">Educational Entity</option>
              </select>
            </div>

            <div className="space-y-1">
              <ImageUpload
                folder="collaborators"
                value={formData.image_url || formData.logo}
                onChange={url => setFormData({ ...formData, image_url: url, logo: url })}
                label="Partner Logo Image"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-555 uppercase tracking-wider">Active Joint Operations (Comma Separated)</label>
              <input
                type="text"
                placeholder="e.g. Free Eye Screening Camp, Primary Ration Drive"
                value={formData.projects}
                onChange={e => setFormData({ ...formData, projects: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
              />
              <p className="text-[9px] text-gray-400 italic leading-snug">
                Separate multiple joint operation campaigns with commas to render them dynamically.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-555 uppercase tracking-wider">Strategic Mission Description *</label>
              <textarea
                required
                placeholder="Detail their cooperation terms, logistics assistance metrics, or free medicine supply sponsorship..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              {isEditing ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isEditing ? 'Save Changes' : 'Register Partner'}</span>
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
