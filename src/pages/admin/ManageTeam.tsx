import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { TeamMember } from '../../types';
import toast from 'react-hot-toast';
import { Loader2, Plus, Trash2, Edit3, User, Sparkles, X, ChevronRight } from 'lucide-react';

export default function ManageTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image_url: '',
    bio: '',
  });

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      setLoading(true);
      const data = await api.getTeam();
      setMembers(data);
    } catch (error: any) {
      toast.error('Failed to retrieve board members');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', image_url: '', bio: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEditClick = (member: TeamMember) => {
    setIsEditing(true);
    setEditingId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      image_url: member.image_url || '',
      bio: member.bio || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      toast.error('Name and Role are required fields');
      return;
    }

    try {
      if (isEditing && editingId) {
        const updated = await api.updateTeamMember(editingId, formData);
        setMembers(members.map(m => m.id === editingId ? updated : m));
        toast.success('Board member updated successfully!');
      } else {
        const created = await api.createTeamMember(formData);
        setMembers([created, ...members]);
        toast.success('New board member registered successfully!');
      }
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to retire this board member profile?')) return;
    try {
      await api.deleteTeamMember(id);
      setMembers(members.filter(m => m.id !== id));
      toast.success('Board member profile removed');
      if (editingId === id) resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete team member');
    }
  };

  // Filter team members based on search query
  const filteredMembers = members.filter(
    m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Loading board directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Board & Team Management</h1>
          <p className="text-sm text-gray-500 mt-1">Configure structural leaders, staff profiles, and administrative agents.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-xl text-rose-600 text-xs font-bold border border-rose-100 self-start">
          <Sparkles className="w-4 h-4" />
          <span>Active Directory</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: List & Filters */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name, title, or role..."
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

          {filteredMembers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
                <User className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">No board members found</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                {searchQuery
                  ? "We couldn't find any listings matching your search keys. Try refining your keywords."
                  : 'Start building your team by using the registry form on the right.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredMembers.map(member => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-rose-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-rose-500"
                          onError={(e) => {
                            // Fallback if image fails to load
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150';
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg border border-rose-100">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg group-hover:text-rose-600 transition">
                          {member.name}
                        </h4>
                        <span className="inline-block px-2.5 py-0.5 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg border border-rose-100 mt-0.5">
                          {member.role}
                        </span>
                      </div>
                    </div>
                    {member.bio && (
                      <p className="text-gray-650 text-sm leading-relaxed line-clamp-3 text-justify">
                        {member.bio}
                      </p>
                    )}
                  </div>
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Added {member.created_at ? new Date(member.created_at).toLocaleDateString() : 'recently'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(member)}
                        className="p-1.5 bg-white text-gray-500 hover:text-rose-600 rounded-lg border border-gray-200 hover:border-rose-200 transition shadow-sm"
                        title="Edit profile"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-1.5 bg-white text-gray-500 hover:text-red-650 rounded-lg border border-gray-200 hover:border-red-200 transition shadow-sm"
                        title="Delete profile"
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
                {isEditing ? 'Edit Profile' : 'Register Member'}
              </h3>
              <p className="text-xs text-gray-450 mt-0.5">
                {isEditing ? 'Modify board member capabilities.' : 'Publish structural leadership records.'}
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
              <label className="text-xs font-bold text-gray-550 uppercase tracking-wider">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Muhammad Raza"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-550 uppercase tracking-wider">Role / Designation *</label>
              <input
                type="text"
                required
                placeholder="e.g. Chief Medical Trustee"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-550 uppercase tracking-wider">Profile Photo URL</label>
              <input
                type="url"
                placeholder="e.g. https://images.unsplash.com/..."
                value={formData.image_url}
                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
              />
              <p className="text-[10px] text-gray-400 italic">
                Use high-resolution portrait URLs or local NGO assets like /Assets/asset_team/avatar.jpg.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-550 uppercase tracking-wider">Biography / Professional Profile</label>
              <textarea
                placeholder="Brief summary of their history, medical credentials, active trusteeships, or education dedication..."
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              {isEditing ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isEditing ? 'Save Changes' : 'Publish Member'}</span>
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold rounded-xl text-sm transition"
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
