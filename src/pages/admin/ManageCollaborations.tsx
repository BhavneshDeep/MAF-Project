import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Collaboration } from '../../types';
import toast from 'react-hot-toast';
import { Loader2, Handshake, Mail, User, Building, Trash2, Calendar, FileText, Sparkles, ChevronRight, X } from 'lucide-react';

export default function ManageCollaborations() {
  const [proposals, setProposals] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Proposal reader panel
  const [selectedProposal, setSelectedProposal] = useState<Collaboration | null>(null);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      setLoading(true);
      const data = await api.getCollaborations();
      setProposals(data);
    } catch (error: any) {
      toast.error('Failed to load partnership proposals');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this alliance proposal record? This action is irreversible.')) return;
    try {
      await api.deleteCollaboration(id);
      setProposals(proposals.filter(p => p.id !== id));
      toast.success('Alliance proposal record archived and removed');
      if (selectedProposal?.id === id) setSelectedProposal(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove partnership record');
    }
  };

  const filteredProposals = proposals.filter(
    p =>
      p.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.proposal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Retrieving partnership portfolios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Institutional Alliances & Proposals</h1>
          <p className="text-sm text-gray-500 mt-1">Review incoming partnership requests, clinic/hospital integration pitches, and academic initiatives.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-xl text-rose-600 text-xs font-bold border border-rose-100 self-start">
          <Handshake className="w-4 h-4" />
          <span>Alliances Desk</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Lists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <input
              type="text"
              placeholder="Search alliances by organization, representative, email, or proposal text..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-150 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
            />
          </div>

          {filteredProposals.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm space-y-3">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
                <Handshake className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">No proposals received</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                {searchQuery
                  ? "We couldn't locate any alliance pitches matching your keyword metrics."
                  : 'There are currently no institutional partnership applications pending review.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredProposals.map(prop => (
                <div
                  key={prop.id}
                  onClick={() => setSelectedProposal(prop)}
                  className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 flex items-center justify-between gap-6 group text-left ${
                    selectedProposal?.id === prop.id
                      ? 'border-rose-500 ring-2 ring-rose-500/10 bg-rose-50/10'
                      : 'border-gray-100 hover:border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-100 shrink-0">
                      <Building className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-extrabold text-gray-900 leading-tight group-hover:text-rose-600 transition truncate">
                        {prop.organization_name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1 font-bold">
                          <User className="w-3.5 h-3.5 text-gray-450" />
                          {prop.contact_person}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-gray-450" />
                          {prop.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-450" />
                          {prop.created_at ? new Date(prop.created_at).toLocaleDateString() : 'recent'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(prop.id);
                      }}
                      className="p-2 bg-white text-gray-400 hover:text-red-650 hover:bg-red-50 rounded-xl border border-gray-200 hover:border-red-200 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Archive Pitch"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-gray-350 group-hover:text-rose-500 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Pitch Reader */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-fit space-y-6 min-h-[400px] flex flex-col justify-between">
          {selectedProposal ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              {/* Header Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-gray-50 pb-4">
                  <div className="space-y-1 max-w-[80%]">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-rose-600 block">Alliance Applicant</span>
                    <h3 className="font-black text-gray-900 text-xl leading-tight">
                      {selectedProposal.organization_name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedProposal(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="font-bold text-gray-700">Institution:</span>
                    <span>{selectedProposal.organization_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="font-bold text-gray-700">Representative:</span>
                    <span>{selectedProposal.contact_person}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="font-bold text-gray-700">Email:</span>
                    <a href={`mailto:${selectedProposal.email}`} className="text-rose-600 underline truncate hover:text-rose-700 font-medium">
                      {selectedProposal.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="font-bold text-gray-700">Pitch Submitted:</span>
                    <span>{selectedProposal.created_at ? new Date(selectedProposal.created_at).toLocaleString() : 'Recent'}</span>
                  </div>
                </div>

                {/* Proposal Text */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">Proposal & Collaboration Intent</span>
                  <div className="bg-rose-50/20 border border-rose-100/55 p-4 rounded-2xl text-gray-750 text-sm leading-relaxed text-justify max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                    {selectedProposal.proposal}
                  </div>
                </div>
              </div>

              {/* Quick Actions at bottom */}
              <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                <a
                  href={`mailto:${selectedProposal.email}?subject=Khidmat NGO Partnership Proposal: ${selectedProposal.organization_name}`}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs text-center transition shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Initiate Response</span>
                </a>
                <button
                  onClick={() => handleDelete(selectedProposal.id)}
                  className="p-2.5 bg-white text-gray-400 hover:text-red-650 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl transition shadow-sm"
                  title="Delete proposal portfolio"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center p-6 text-gray-450 space-y-3">
              <FileText className="w-12 h-12 text-rose-200 stroke-1" />
              <div>
                <h4 className="font-bold text-gray-800">Proposal Reader</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">
                  Select a proposal item from the list on the left to read full alliance pitches and access responder actions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
