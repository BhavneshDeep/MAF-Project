import React, { useState, useEffect } from 'react';
import { Building2, Heart, Handshake, Loader2, Landmark, HelpCircle, Briefcase } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Collaborator } from '../types';

const localFallbackCollaborators: Collaborator[] = [
  {
    id: 'collab-fallback-1',
    name: 'Government Girls Secondary School, Shah Faisal',
    type: 'government',
    description: 'A leading public secondary institution in Karachi cooperating to launch inclusive learning spaces and bias mitigation.',
    logo: '/Assets/assets_collaborators/school.jpg',
    projects: ['Pedagogy Training & Anti-Stereotyping Seminars']
  },
  {
    id: 'collab-fallback-2',
    name: 'Tabba Heart Institute',
    type: 'healthcare',
    description: 'A gold-standard cardiovascular center, deploying specialized doctors and cardiac support tools to remote camps.',
    logo: '/Assets/assets_collaborators/tabba.jpg',
    projects: ['Free Cardiovascular Diagnostics Campaigns']
  },
  {
    id: 'collab-fallback-3',
    name: 'Dr. Essa Laboratory & Diagnostic Centre',
    type: 'healthcare',
    description: 'Pakistan’s top diagnostic chain, granting completely free clinical lab pathology kits for local camp beneficiaries.',
    logo: '/Assets/assets_collaborators/essa.jpg',
    projects: ['Outpatient Blood & Pathological Screenings']
  },
  {
    id: 'collab-fallback-4',
    name: 'Aga Khan University Hospital (AKUH)',
    type: 'healthcare',
    description: 'Collaborates with MAF in running advanced remote clinics and emergency patient referral assistance programs.',
    logo: '/Assets/assets_collaborators/AKU.jpg',
    projects: ['Rural Health Checkup Campaigns']
  },
  {
    id: 'collab-fallback-5',
    name: 'Pakistan Hindu Council',
    type: 'ngo',
    description: 'Cooperating in minority empowerment, interfaith harmony campaigns, and coastal disaster relief mobilization.',
    logo: '/Assets/assets_collaborators/hindu_council.jpeg',
    projects: ['Minority Welfare & Interfaith Seminars']
  }
];

const collabSchema = z.object({
  organization_name: z.string().min(2, 'Organization name must be at least 2 characters'),
  contact_person: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Provide a valid email address'),
  proposal: z.string().min(10, 'Proposal pitch must be at least 10 characters long'),
});

type CollabFormData = z.infer<typeof collabSchema>;

export default function Collaborations() {
  const [partners, setPartners] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CollabFormData>({
    resolver: zodResolver(collabSchema),
  });

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);
      const data = await api.getCollaborators();
      if (data && data.length > 0) {
        setPartners(data);
      } else {
        setPartners(localFallbackCollaborators);
      }
    } catch (e) {
      console.error('Error fetching collaborators:', e);
      setPartners(localFallbackCollaborators);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CollabFormData) => {
    try {
      setIsSubmitting(true);
      await api.createCollaboration(data);
      toast.success('Partnership proposal submitted successfully! We will contact you soon.');
      reset();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="collaborations" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm font-medium mb-4">
            <Handshake className="w-4 h-4" />
            <span>Strategic Alliances</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            Institutional Collaborations
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            By joining forces with premier healthcare systems, public institutions, and other NGOs, we multiply our capability to bring relief.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-12 w-12 text-rose-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {partners.map((partner) => (
              <div 
                key={partner.id} 
                className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col h-full transition-all duration-300 transform hover:-translate-y-1.5"
              >
                <div className="relative h-48 bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center p-6 border-b border-gray-50">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform duration-500 rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bea4caa92f14?auto=format&fit=crop&q=80&w=300';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm
                      ${partner.type === 'ngo' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                      {partner.type === 'ngo' ? 
                        <Heart className="w-3.5 h-3.5 mr-1" /> : 
                        <Building2 className="w-3.5 h-3.5 mr-1" />}
                      {partner.type}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between text-left">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-rose-600 transition-colors">
                      {partner.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 text-justify">
                      {partner.description}
                    </p>
                  </div>
                  
                  <div className="space-y-3 border-t border-gray-50 pt-4 mt-auto">
                    <h4 className="font-bold text-gray-900 text-sm flex items-center">
                      <Handshake className="w-4 h-4 mr-2 text-rose-600 shrink-0" />
                      Joint Operations:
                    </h4>
                    <ul className="text-xs text-gray-500 space-y-1.5 list-none ml-0">
                      {partner.projects.map((project, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                          <span>{project}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Partnership proposal Form */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-8 sm:p-12 text-center text-white relative">
            {/* Background design accents */}
            <div className="absolute right-0 bottom-0 w-48 h-48 bg-white/5 rounded-full filter blur-2xl pointer-events-none" />
            <Landmark className="w-12 h-12 text-rose-200 mx-auto mb-4" />
            <h3 className="text-2xl sm:text-3xl font-black mb-3">Pitch an Alliance Proposal</h3>
            <p className="text-rose-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Are you an educational institute, healthcare facility, or social NGO? Complete the alliance pitch form below and let’s work together.
            </p>
          </div>
          
          <div className="p-8 sm:p-12 text-left">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Organization/Entity Name</label>
                  <input
                    {...register('organization_name')}
                    type="text"
                    placeholder="e.g. Tabba Heart Clinic, Karachi"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                  {errors.organization_name && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.organization_name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Lead Contact Person</label>
                  <input
                    {...register('contact_person')}
                    type="text"
                    placeholder="e.g. Dr. Jaint Karmani"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                  {errors.contact_person && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.contact_person.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Corporate Email Address</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="e.g. info@organization.org"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Strategic Partnership Proposal</label>
                <textarea
                  {...register('proposal')}
                  rows={5}
                  placeholder="Detail your campaign proposal, expected community target demographics, and required logistics support..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-sm leading-relaxed"
                ></textarea>
                {errors.proposal && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.proposal.message}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center bg-rose-600 hover:bg-rose-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 shadow-md shadow-rose-600/10 hover:shadow-lg"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {isSubmitting ? 'Uploading Pitch...' : 'Submit Partnership Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}