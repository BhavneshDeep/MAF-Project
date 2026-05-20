export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  image_url: string;
  description: string;
  created_at?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image_url: string;
  bio: string;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description: string;
  impact_metric: string;
  created_at?: string;
}

export interface Collaborator {
  id: string;
  name: string;
  type: 'ngo' | 'government' | 'healthcare' | 'educational';
  description: string;
  logo: string;
  projects: string[];
  created_at?: string;
}

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time?: string;
  team_member_name?: string;
  purpose: string;
  status: 'pending' | 'confirmed' | 'completed';
  created_at?: string;
}

export interface Collaboration {
  id: string;
  organization_name: string;
  contact_person: string;
  email: string;
  proposal: string;
  created_at?: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  email: string;
  amount: number;
  currency: string;
  payment_method: 'easypaisa' | 'jazzcash' | 'bank_transfer';
  transaction_id: string;
  proof_url?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at?: string;
}