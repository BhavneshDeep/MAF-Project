import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { supabase } from '../../services/supabase';
import { Project } from '../../types';
import toast from 'react-hot-toast';
import { Loader2, Plus, Trash2, Edit3, Briefcase, Sparkles, X, Heart, ArrowUp, ArrowDown } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    impact_metric: '',
    image_url: '',
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects();
      setProjects(data);
    } catch (error: any) {
      toast.error('Failed to load campaigns/projects');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', category: '', description: '', impact_metric: '', image_url: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEditClick = (project: Project) => {
    setIsEditing(true);
    setEditingId(project.id);
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description || '',
      impact_metric: project.impact_metric || '',
      image_url: project.image_url || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.description) {
      toast.error('Title, Category, and Description are required fields');
      return;
    }

    try {
      if (isEditing && editingId) {
        const updated = await api.updateProject(editingId, formData);
        setProjects(projects.map(p => p.id === editingId ? updated : p));
        toast.success('Social project updated successfully!');
      } else {
        const created = await api.createProject(formData);
        setProjects([created, ...projects]);
        toast.success('New social project initialized successfully!');
      }
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this social project?')) return;
    try {
      await api.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Project deleted');
      if (editingId === id) resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove project record');
    }
  };

  const syncOrdering = async (updatedProjects: Project[]) => {
    try {
      console.log('Initiating bulk projects ordering sync. Length:', updatedProjects.length);
      const updates = updatedProjects.map((item, index) => {
        console.log(`Update sync details - Table: projects, ID: ${item.id}, Index: ${index}`);
        return supabase
          .from('projects')
          .update({ position: index })
          .eq('id', item.id)
          .select();
      });

      const results = await Promise.all(updates);
      
      const failed = results.find(res => res.error);
      if (failed) {
        console.error('Failed to sync a row in projects table:', failed.error);
        throw failed.error;
      }
      
      toast.success('Ordering updated successfully!');
    } catch (err: any) {
      console.error('Supabase update failed for projects ordering:', err);
      const errMsg = err?.message || err?.details || JSON.stringify(err);
      toast.error(`Failed to save ordering in database: ${errMsg}`);
      loadProjects();
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= projects.length) return;

    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[newIndex];
    newProjects[newIndex] = temp;

    const updatedProjects = newProjects.map((p, idx) => ({
      ...p,
      position: idx
    }));

    setProjects(updatedProjects);
    await syncOrdering(updatedProjects);
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

    const reorderedProjects = [...projects];
    const [draggedItem] = reorderedProjects.splice(draggedIndex, 1);
    reorderedProjects.splice(targetIndex, 0, draggedItem);

    const updatedProjects = reorderedProjects.map((p, idx) => ({
      ...p,
      position: idx
    }));

    setProjects(updatedProjects);
    setDraggedIndex(null);
    await syncOrdering(updatedProjects);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Retrieving project boards...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Social Projects & Operations</h1>
          <p className="text-sm text-gray-500 mt-1">Deploy, monitor, and configure high-impact social project records.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-xl text-rose-600 text-xs font-bold border border-rose-100 self-start">
          <Sparkles className="w-4 h-4" />
          <span>Operations Console</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: List & Filters */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search projects by title, category, or description..."
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

          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">No projects registered</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                {searchQuery
                  ? "We couldn't find any projects matching your search criteria. Refine keywords."
                  : 'Start cataloging NGO programs by using the registry form on the right.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col md:flex-row group hover:border-rose-200 hover:shadow-md transition-all duration-300 cursor-grab active:cursor-grabbing ${draggedIndex === index ? 'opacity-40 border-rose-455 border-dashed' : 'border-gray-100'}`}
                >
                  {/* Optional Image Panel */}
                  <div className="md:w-1/3 h-48 md:h-auto bg-gray-100 shrink-0 relative overflow-hidden">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-rose-50 border-r border-rose-100">
                        <Briefcase className="w-8 h-8 text-rose-300" />
                        <span className="text-[10px] uppercase font-bold text-rose-400 mt-2">No Image Linked</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-rose-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg shadow-sm">
                      {project.category}
                    </span>
                  </div>

                  <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-gray-900 text-xl group-hover:text-rose-600 transition">
                        {project.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed text-justify line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Impact Metric Highlight if any */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-rose-600">
                        <Heart className="w-4 h-4 fill-rose-100" />
                        <span className="text-xs font-extrabold tracking-wider uppercase">Impact Metric:</span>
                        <span className="text-sm font-black text-gray-800 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                          {project.impact_metric || '500+ Beneficiaries'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleMove(project.id, 'up')}
                          disabled={projects.findIndex(p => p.id === project.id) === 0}
                          className="p-1.5 bg-white text-gray-500 hover:text-rose-600 disabled:opacity-35 disabled:pointer-events-none rounded-lg border border-gray-200 hover:border-rose-200 transition shadow-sm"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(project.id, 'down')}
                          disabled={projects.findIndex(p => p.id === project.id) === projects.length - 1}
                          className="p-1.5 bg-white text-gray-500 hover:text-rose-600 disabled:opacity-35 disabled:pointer-events-none rounded-lg border border-gray-200 hover:border-rose-200 transition shadow-sm"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEditClick(project)}
                          className="px-3 py-1.5 bg-white text-gray-655 hover:text-rose-600 rounded-lg border border-gray-200 hover:border-rose-200 text-xs font-bold transition shadow-sm flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="px-3 py-1.5 bg-white text-gray-655 hover:text-red-650 rounded-lg border border-gray-200 hover:border-red-200 text-xs font-bold transition shadow-sm flex items-center gap-1"
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
                {isEditing ? 'Edit Project' : 'Register Program'}
              </h3>
              <p className="text-xs text-gray-450 mt-0.5">
                {isEditing ? 'Update program benchmarks and status.' : 'Deploy new structural project cards.'}
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
              <label className="text-xs font-bold text-gray-555 uppercase tracking-wider">Project Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Free Medical Dispensary Camp"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-555 uppercase tracking-wider">Operational Category *</label>
              <input
                type="text"
                required
                placeholder="e.g. Healthcare, Education, Relief"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-555 uppercase tracking-wider">Key Impact Metric *</label>
              <input
                type="text"
                required
                placeholder="e.g. 5,000+ Treated Monthly"
                value={formData.impact_metric}
                onChange={e => setFormData({ ...formData, impact_metric: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
              />
            </div>

            <div className="space-y-1">
              <ImageUpload
                folder="projects"
                value={formData.image_url}
                onChange={url => setFormData({ ...formData, image_url: url })}
                label="Cover Image"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-555 uppercase tracking-wider">Project Description & Goal *</label>
              <textarea
                required
                placeholder="Detailed summary outlining project deliverables, locations, timelines, and volunteer teams..."
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
              <span>{isEditing ? 'Save Changes' : 'Launch Project'}</span>
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
