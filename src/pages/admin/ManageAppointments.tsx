import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Appointment } from '../../types';
import toast from 'react-hot-toast';
import { Loader2, Calendar, CheckCircle, Clock, Trash2, ShieldCheck, Mail, Phone, User, MessageSquare } from 'lucide-react';

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await api.getAppointments();
      setAppointments(data);
    } catch (error: any) {
      toast.error('Failed to retrieve appointments telemetry');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'completed') => {
    try {
      const updated = await api.updateAppointmentStatus(id, status);
      setAppointments(appointments.map(a => a.id === id ? updated : a));
      toast.success(`Appointment status updated to ${status}!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update meeting status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently cancel and remove this appointment from historical logs?')) return;
    try {
      await api.deleteAppointment(id);
      setAppointments(appointments.filter(a => a.id !== id));
      toast.success('Appointment record removed successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove appointment');
    }
  };

  const filteredAppointments = appointments.filter(
    a => statusFilter === 'all' || a.status === statusFilter
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 bg-sky-50 text-sky-600 rounded-lg text-xs font-bold border border-sky-100 flex items-center gap-1.5 w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Confirmed</span>
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold border border-emerald-100 flex items-center gap-1.5 w-fit">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold border border-amber-100 flex items-center gap-1.5 w-fit">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Retrieving appointment schedules...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Appointments & Scheduling</h1>
          <p className="text-sm text-gray-500 mt-1">Review clinical appointments, administrative briefings, and public hearings.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-xl text-rose-600 text-xs font-bold border border-rose-100 self-start">
          <Calendar className="w-4 h-4" />
          <span>Sync Successful</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-px overflow-x-auto">
        {(['all', 'pending', 'confirmed', 'completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition shrink-0 ${
              statusFilter === tab
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab === 'all' ? 'All Schedules' : tab}
          </button>
        ))}
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm space-y-3">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No appointments recorded</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            There are currently no meetings or clinic appointments recorded under this filter slot.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredAppointments.map(app => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            >
              {/* Profile/Contact Section */}
              <div className="space-y-4 md:max-w-xs flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-100">
                    {app.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900 leading-tight">{app.name}</h4>
                    <span className="text-xs text-gray-400">
                      Booked {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'recently'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <a href={`mailto:${app.email}`} className="hover:underline hover:text-rose-600 truncate block">
                      {app.email}
                    </a>
                  </div>
                  {app.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <a href={`tel:${app.phone}`} className="hover:underline hover:text-rose-600">
                        {app.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule and Rep details */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Meeting Schedule</span>
                    <span className="font-bold text-gray-800 block mt-1">
                      {new Date(app.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      Time Slot: {app.time || 'General Clinic Hours'}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Assigned Representative</span>
                    <span className="font-bold text-gray-800 block mt-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-rose-500" />
                      {app.team_member_name || 'General NGO Trustee'}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      Status: {app.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Purpose Brief */}
                <div className="flex gap-2.5 items-start bg-rose-50/30 p-3 rounded-xl border border-rose-50 text-gray-700 text-sm">
                  <MessageSquare className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Meeting Purpose</span>
                    <p className="leading-relaxed text-justify">{app.purpose}</p>
                  </div>
                </div>
              </div>

              {/* Actions Console */}
              <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                <div className="text-left md:text-center">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Current Status</span>
                  {getStatusBadge(app.status)}
                </div>

                <div className="flex items-center gap-2">
                  {app.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(app.id, 'confirmed')}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                    >
                      Confirm
                    </button>
                  )}
                  {app.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(app.id, 'completed')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                    >
                      Complete
                    </button>
                  )}
                  {app.status !== 'pending' && (
                    <button
                      onClick={() => handleStatusChange(app.id, 'pending')}
                      className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-200 transition"
                    >
                      Reset Status
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-2 bg-white text-gray-400 hover:text-red-650 hover:bg-red-50 rounded-lg border border-gray-200 hover:border-red-200 transition shadow-sm"
                    title="Cancel Appointment"
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
  );
}
