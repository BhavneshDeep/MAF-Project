import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { FileText, Heart, Briefcase, Calendar, Loader2, Sparkles, UserCheck } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    appointments: 0,
    donationsSum: 0,
    projects: 0,
    events: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch appointments count
      const { count: appointmentsCount, error: errApp } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true });
      if (errApp) console.warn(errApp);

      // Fetch active projects count
      const { count: projectsCount, error: errProj } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
      if (errProj) console.warn(errProj);

      // Fetch events count
      const { count: eventsCount, error: errEvt } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });
      if (errEvt) console.warn(errEvt);

      // Fetch donations and sum up completed ones (with PKR currency logic)
      const { data: donationsData, error: errDon } = await supabase
        .from('donations')
        .select('amount, status');
      if (errDon) console.warn(errDon);

      let totalDonations = 0;
      if (donationsData) {
        // Summing up only 'completed' approved donations for fiscal accuracy
        totalDonations = donationsData
          .filter(d => d.status === 'completed')
          .reduce((sum, current) => sum + Number(current.amount), 0);
      }

      setStats({
        appointments: appointmentsCount || 0,
        donationsSum: totalDonations,
        projects: projectsCount || 0,
        events: eventsCount || 0,
      });

    } catch (e) {
      console.error('Error fetching dashboard counts:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Assembling server telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Telemetry</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time status updates from the Maheshwari Action Forum network.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-xl text-rose-600 text-xs font-bold shrink-0 self-start sm:self-center border border-rose-100">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Sync Successful</span>
        </div>
      </div>

      {/* Numerical Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Appointments Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Appointments</h3>
            <p className="text-3xl font-black text-gray-900 mt-2">{stats.appointments}</p>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Total Audited Donations Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Audited Funds</h3>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
              Rs. {stats.donationsSum.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <Heart className="w-6 h-6 fill-emerald-100" />
          </div>
        </div>

        {/* Active Projects Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Social Projects</h3>
            <p className="text-3xl font-black text-gray-900 mt-2">{stats.projects}</p>
          </div>
          <div className="p-4 bg-rose-50 text-rose-600 rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* Registered Campaigns Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Campaigns</h3>
            <p className="text-3xl font-black text-gray-900 mt-2">{stats.events}</p>
          </div>
          <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Workspace Pitch Card */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Welcome to your Portal Workspace</h2>
        </div>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-justify max-w-4xl">
          Use the secure administrative sidebar to manage board profiles, adjust project entries, schedule and confirm upcoming healthcare/education campaigns, audit direct donations, process incoming meeting requests, and review institutional partnership proposals.
        </p>
      </div>
    </div>
  );
}
