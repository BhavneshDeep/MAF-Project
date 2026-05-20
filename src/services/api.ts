import { supabase } from './supabase';
import type { Event, TeamMember, Project, Appointment, Collaboration, Donation, Collaborator } from '../types';

export const api = {
  // --- Events ---
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    if (error) throw error;
    return data as Event[];
  },

  async createEvent(event: Omit<Event, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select();
    if (error) throw error;
    return data[0] as Event;
  },

  async updateEvent(id: string, event: Partial<Omit<Event, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('events')
      .update(event)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0] as Event;
  },

  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
  
  // --- Team ---
  async getTeam() {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as TeamMember[];
  },

  async createTeamMember(member: Omit<TeamMember, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('team_members')
      .insert([member])
      .select();
    if (error) throw error;
    return data[0] as TeamMember;
  },

  async updateTeamMember(id: string, member: Partial<Omit<TeamMember, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('team_members')
      .update(member)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0] as TeamMember;
  },

  async deleteTeamMember(id: string) {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // --- Projects ---
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Project[];
  },

  async createProject(project: Omit<Project, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select();
    if (error) throw error;
    return data[0] as Project;
  },

  async updateProject(id: string, project: Partial<Omit<Project, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0] as Project;
  },

  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // --- Collaborators (Sponsors/Partners in collaborations section) ---
  async getCollaborators() {
    const { data, error } = await supabase
      .from('collaborators')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Collaborator[];
  },

  async createCollaborator(collaborator: Omit<Collaborator, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('collaborators')
      .insert([collaborator])
      .select();
    if (error) throw error;
    return data[0] as Collaborator;
  },

  async updateCollaborator(id: string, collaborator: Partial<Omit<Collaborator, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('collaborators')
      .update(collaborator)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0] as Collaborator;
  },

  async deleteCollaborator(id: string) {
    const { error } = await supabase
      .from('collaborators')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // --- Appointments (Public Scheduling & Admin CRUD) ---
  async getAppointments() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Appointment[];
  },

  async createAppointment(payload: Omit<Appointment, 'id' | 'created_at' | 'status'>) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{ ...payload, status: 'pending' }])
      .select();
    if (error) throw error;
    return data[0] as Appointment;
  },

  async updateAppointmentStatus(id: string, status: 'pending' | 'confirmed' | 'completed') {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0] as Appointment;
  },

  async deleteAppointment(id: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // --- Collaborations (Partnership Proposal Form & Admin Review) ---
  async getCollaborations() {
    const { data, error } = await supabase
      .from('collaborations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Collaboration[];
  },

  async createCollaboration(payload: Omit<Collaboration, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('collaborations')
      .insert([payload])
      .select();
    if (error) throw error;
    return data[0] as Collaboration;
  },

  async deleteCollaboration(id: string) {
    const { error } = await supabase
      .from('collaborations')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
  
  // --- Donations (Stripe removed. Easypaisa / JazzCash / Bank manual workflow) ---
  async getDonations() {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Donation[];
  },

  async createDonation(payload: Omit<Donation, 'id' | 'created_at' | 'status'>) {
    const { data, error } = await supabase
      .from('donations')
      .insert([{ ...payload, status: 'pending' }])
      .select();
    if (error) throw error;
    return data[0] as Donation;
  },

  async updateDonationStatus(id: string, status: 'pending' | 'completed' | 'failed') {
    const { data, error } = await supabase
      .from('donations')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0] as Donation;
  },

  async deleteDonation(id: string) {
    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // --- Storage service for Donation proof files ---
  async uploadDonationProof(file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `proofs/${fileName}`;

      const { data, error } = await supabase.storage
        .from('donations-proof')
        .upload(filePath, file);

      if (error) {
        // If storage bucket is missing, or fails, fallback to local base64 to avoid blocking local runs
        console.warn('Supabase storage upload failed or is unconfigured. Falling back to base64 encoding...', error.message);
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
        });
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('donations-proof')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (e) {
      console.warn('Storage error, executing base64 fallback...', e);
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
      });
    }
  }
};
