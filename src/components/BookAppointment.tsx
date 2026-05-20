import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MessageSquare, Loader2, Sparkles, Phone, HelpCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { TeamMember } from '../types';

const fallbackTeamOptions = [
  'Bhawesh Karmani (President)',
  'Bhevish Kumar (General Secretary)',
  'Bhunesh Kumar (Vice President)',
  'Jaint Karmani (Joint Secretary)'
];

const appointmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Provide a valid contact number (at least 10 digits)'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  team_member_name: z.string().min(1, 'Select a representative board member'),
  purpose: z.string().min(10, 'Purpose description must be at least 10 characters long'),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export default function BookAppointment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(false);

  useEffect(() => {
    loadTeamOptions();
  }, []);

  const loadTeamOptions = async () => {
    try {
      setLoadingTeam(true);
      const data = await api.getTeam();
      if (data && data.length > 0) {
        setTeamMembers(data.map(member => `${member.name} (${member.role})`));
      } else {
        setTeamMembers(fallbackTeamOptions);
      }
    } catch (e) {
      setTeamMembers(fallbackTeamOptions);
    } finally {
      setLoadingTeam(false);
    }
  };

  const onSubmit = async (data: AppointmentFormData) => {
    // Prevent booking past dates
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      toast.error('Cannot schedule appointments in the past');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Submit individual fields directly to Supabase now that the table handles them
      await api.createAppointment({
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: data.date,
        time: data.time,
        team_member_name: data.team_member_name,
        purpose: data.purpose,
      });
      
      toast.success('Appointment scheduled successfully!');
      
      // Auto-trigger Google Calendar Event invite link as helper
      const startDateTime = new Date(`${data.date}T${data.time}`);
      const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 min duration
      const formatDateTime = (dt: Date) => dt.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, -1);
      
      const calendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=MAF+Appointment+with+${encodeURIComponent(
        data.name
      )}&dates=${formatDateTime(startDateTime)}/${formatDateTime(
        endDateTime
      )}&details=${encodeURIComponent(
        `Representative: ${data.team_member_name}\nPurpose: ${data.purpose}\nPhone: ${data.phone}\nEmail: ${data.email}`
      )}&location=Online+Google+Meet&add=teammaheshwaripak@gmail.com`;
      
      window.open(calendarUrl, '_blank');
      reset();
    } catch (error) {
      console.error('Scheduling error:', error);
      toast.error('Failed to schedule appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  return (
    <section id="book" className="py-24 bg-white relative overflow-hidden">
      {/* Background visual detail */}
      <div className="absolute left-0 bottom-0 w-80 h-80 bg-rose-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>Connect & Collaborate</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            Book an Appointment
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Schedule a virtual or on-ground meeting with our core executive board members to pitch ideas, explore collaborations, or request aid.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-8 sm:p-12 text-left">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                    <input
                      {...register('name')}
                      type="text"
                      placeholder="e.g. Bhavesh Karmani"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm font-semibold"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="e.g. name@domain.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm font-semibold"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
                      <input
                        {...register('phone')}
                        type="text"
                        placeholder="e.g. 0333-XXXXXXX"
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm font-semibold"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
                      <input
                        {...register('date')}
                        type="date"
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm font-bold"
                      />
                    </div>
                    {errors.date && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.date.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Time</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
                      <input
                        {...register('time')}
                        type="time"
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm font-bold"
                      />
                    </div>
                    {errors.time && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.time.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Board Representative</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
                    <select
                      {...register('team_member_name')}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm font-bold"
                      disabled={loadingTeam}
                    >
                      <option value="">Select a board member</option>
                      {teamMembers.map((member, index) => (
                        <option key={index} value={member}>{member}</option>
                      ))}
                    </select>
                  </div>
                  {errors.team_member_name && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.team_member_name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Purpose of Meeting</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-gray-400 h-4.5 w-4.5" />
                    <textarea
                      {...register('purpose')}
                      rows={4}
                      placeholder="Detail your request, project pitch, or specific questions so our team comes prepared..."
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm leading-relaxed"
                    ></textarea>
                  </div>
                  {errors.purpose && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.purpose.message}</p>}
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex justify-center items-center bg-rose-600 hover:bg-rose-700 text-white py-4 px-8 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 shadow-md shadow-rose-600/10 hover:shadow-lg shrink-0"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    {isSubmitting ? 'Requesting Appointment...' : 'Schedule Appointment'}
                  </button>
                  <a
                    href="mailto:teammaheshwaripak@gmail.com"
                    className="text-rose-600 hover:underline text-sm font-bold text-center block"
                  >
                    Direct Email Inquiry? teammaheshwaripak@gmail.com
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
