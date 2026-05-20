import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Donation } from '../../types';
import toast from 'react-hot-toast';
import { Loader2, Heart, CheckCircle2, XCircle, Clock, Trash2, Eye, EyeOff, Search, Sparkles, AlertCircle } from 'lucide-react';

export default function ManageDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Lightbox Modal state
  const [activeProofUrl, setActiveProofUrl] = useState<string | null>(null);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const data = await api.getDonations();
      setDonations(data);
    } catch (error: any) {
      toast.error('Failed to load donations archive');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'completed' | 'failed') => {
    try {
      const updated = await api.updateDonationStatus(id, status);
      setDonations(donations.map(d => d.id === id ? updated : d));
      toast.success(`Donation audit completed: marked as ${status}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update transaction status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('WARNING: Are you sure you want to permanently delete this donation ledger entry? This cannot be undone and will affect total fund counts.')) return;
    try {
      await api.deleteDonation(id);
      setDonations(donations.filter(d => d.id !== id));
      toast.success('Donation entry purged successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove donation record');
    }
  };

  // Summarize stats
  const totalPKRAudited = donations
    .filter(d => d.status === 'completed')
    .reduce((sum, curr) => sum + Number(curr.amount), 0);

  const pendingPKRAudit = donations
    .filter(d => d.status === 'pending')
    .reduce((sum, curr) => sum + Number(curr.amount), 0);

  const pendingCount = donations.filter(d => d.status === 'pending').length;

  // Filter donations
  const filteredDonations = donations.filter(d => {
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesSearch =
      d.donor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.payment_method.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'easypaisa':
        return <span className="text-emerald-650 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase text-[10px]">Easypaisa</span>;
      case 'jazzcash':
        return <span className="text-amber-650 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase text-[10px]">JazzCash</span>;
      case 'bank_transfer':
        return <span className="text-blue-650 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase text-[10px]">Bank HBL</span>;
      default:
        return <span className="text-gray-550 font-bold bg-gray-50 px-2 py-0.5 rounded border border-gray-100 uppercase text-[10px]">{method}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-650 rounded-lg text-xs font-black border border-emerald-100 flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Audited (Verified)</span>
          </span>
        );
      case 'failed':
        return (
          <span className="px-2.5 py-1 bg-red-50 text-red-650 rounded-lg text-xs font-black border border-red-100 flex items-center gap-1.5 w-fit">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected / Failed</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-amber-50 text-amber-650 rounded-lg text-xs font-black border border-amber-100 flex items-center gap-1.5 w-fit animate-pulse">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Pending Audit</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Retrieving donation ledgers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Donation Audit ledgers</h1>
          <p className="text-sm text-gray-500 mt-1">Audit proof of transfers, confirm transaction IDs, and verify NGO operating capital.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-xl text-rose-600 text-xs font-bold border border-rose-100 self-start">
          <Heart className="w-4 h-4 fill-rose-100" />
          <span>Fiduciary Ledger</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">Total Audited Funds</span>
          <span className="text-2xl font-black text-emerald-650 mt-1.5 block">
            Rs. {totalPKRAudited.toLocaleString()}
          </span>
          <span className="text-xs text-gray-400 font-medium">Verified active operating balance.</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">Awaiting Verification</span>
          <span className="text-2xl font-black text-amber-500 mt-1.5 block">
            Rs. {pendingPKRAudit.toLocaleString()}
          </span>
          <span className="text-xs text-gray-400 font-medium">Sum of ledger entries pending review.</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">Pending Queue Count</span>
            <span className="text-3xl font-black text-rose-650 mt-1 block">
              {pendingCount}
            </span>
            <span className="text-xs text-gray-400 font-medium">Receipts needing validation.</span>
          </div>
          {pendingCount > 0 && (
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100 text-amber-600 animate-pulse">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>

      {/* Search & Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2 overflow-x-auto">
          {(['all', 'pending', 'completed', 'failed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition shrink-0 ${
                statusFilter === tab
                  ? 'border-rose-600 text-rose-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab === 'all' ? 'All Donations' : tab === 'pending' ? 'Pending Audit' : tab}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by donor name, email, transaction ID, or payment channel..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-150 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
          />
        </div>
      </div>

      {/* Table Section */}
      {filteredDonations.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm space-y-3">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-rose-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No matching donations</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            We couldn't locate any transaction receipts matching the filtered specifications.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4">Donor Details</th>
                  <th className="px-6 py-4">Payment Method</th>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Proof of Transfer</th>
                  <th className="px-6 py-4">Status & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredDonations.map(donation => (
                  <tr key={donation.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 space-y-0.5">
                      <span className="font-extrabold text-gray-900 block">{donation.donor_name}</span>
                      <a href={`mailto:${donation.email}`} className="text-xs text-gray-400 hover:text-rose-600 hover:underline">
                        {donation.email}
                      </a>
                    </td>
                    <td className="px-6 py-4">{getMethodLabel(donation.payment_method)}</td>
                    <td className="px-6 py-4 font-mono font-bold text-gray-600 text-xs">
                      {donation.transaction_id}
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900">
                      Rs. {Number(donation.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {donation.proof_url ? (
                        <button
                          onClick={() => setActiveProofUrl(donation.proof_url || null)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 rounded-lg text-xs font-bold transition shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs italic flex items-center gap-1">
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>No Proof Uploaded</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 space-y-2">
                      {getStatusBadge(donation.status)}

                      <div className="flex items-center gap-2 mt-1">
                        {donation.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(donation.id, 'completed')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(donation.id, 'failed')}
                              className="px-2.5 py-1 bg-red-650 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition shadow-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {donation.status !== 'pending' && (
                          <button
                            onClick={() => handleStatusChange(donation.id, 'pending')}
                            className="px-2.5 py-1 bg-white hover:bg-gray-50 text-gray-550 border border-gray-200 font-bold rounded-lg text-xs transition"
                          >
                            Re-Audit
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(donation.id)}
                          className="p-1.5 bg-white text-gray-400 hover:text-red-650 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg transition"
                          title="Purge transaction record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lightbox Modal Backdrop */}
      {activeProofUrl && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-gray-100 shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Donation Proof Document</span>
              <button
                onClick={() => setActiveProofUrl(null)}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-250 font-bold text-xs rounded-xl transition"
              >
                Close View
              </button>
            </div>
            <div className="p-6 bg-gray-900 flex items-center justify-center min-h-[300px] max-h-[500px] overflow-y-auto">
              <img
                src={activeProofUrl}
                alt="Donation Transfer Proof Document"
                className="max-w-full max-h-full object-contain rounded-lg border border-gray-700 shadow-md"
                onError={(e) => {
                  toast.error('The screenshot proof failed to load.');
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-450 italic">
              <span>Receipt matches selected ledger transaction parameters.</span>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = activeProofUrl;
                  link.download = `receipt-${Date.now()}.png`;
                  link.click();
                }}
                className="underline hover:text-rose-600 font-bold"
              >
                Download Raw Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
