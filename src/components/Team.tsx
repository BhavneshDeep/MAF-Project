import React, { useState, useEffect, useRef } from 'react';
import { TeamMember } from '../types';
import { Mail, Phone, Linkedin, Loader2, Award } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

// Seeded local members to act as a fallback and dynamic blueprint
const localFallbackTeam: TeamMember[] = [
  {
    id: 'fallback-1',
    name: 'Bhawesh Karmani',
    role: 'Founder & President',
    image_url: '/Assets/asset_team/Bhawesh Karmani.jpg',
    bio: 'Dedicated leader guiding MAF with a vision of comprehensive community uplift and education reforms across Pakistan.',
    email: 'teammaheshwaripak@gmail.com',
    phone: '+923330000000',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'fallback-2',
    name: 'Bhevish Kumar',
    role: 'General Secretary',
    image_url: '/Assets/asset_team/Bhevish Kumar.jpg',
    bio: 'Organizes operational frameworks, handles community outreach programs, and ensures swift administrative execution.',
    email: 'bhevish.kumar@example.com',
    phone: '+923331111111',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'fallback-3',
    name: 'Bhunesh Kumar',
    role: 'Vice President',
    image_url: '/Assets/asset_team/Bhunesh Kumar.jpg',
    bio: 'Oversees dynamic relief drives and health awareness campaigns with a relentless commitment to societal welfare.',
    email: 'bhunesh.kumar@example.com',
    phone: '+923332222222',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'fallback-4',
    name: 'Jaint Karmani',
    role: 'Joint Secretary',
    image_url: '/Assets/asset_team/Jaint Karmani.jpg',
    bio: 'Fosters educational initiatives, manages collaborative partnerships, and coordinates teacher-training programs.',
    email: 'jaint.karmani@example.com',
    phone: '+923333333333',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'fallback-5',
    name: 'Mahaveer Langhani',
    role: 'Finance Secretary',
    image_url: '/Assets/asset_team/Mahaveer Langhani.jpg',
    bio: 'Ensures extreme fiscal precision, financial transparency, audit readiness, and optimal budget allocation for NGO projects.',
    email: 'mahaveer.langhani@example.com',
    phone: '+923334444444',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'fallback-6',
    name: 'Neeraj Kumar',
    role: 'Information Secretary',
    image_url: '/Assets/asset_team/Neeraj Kumar.jpg',
    bio: 'Spearheads corporate branding, media relations, dynamic digital presence, and impact reporting pipelines.',
    email: 'neeraj.kumar@example.com',
    phone: '+923335555555',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'fallback-7',
    name: 'Sagar Langhani',
    role: 'Executive Member',
    image_url: '/Assets/asset_team/Sagar Langhani.jpg',
    bio: 'Drives on-ground volunteer coordination during disaster management, food drives, and remote healthcare operations.',
    email: 'sagar.langhani@example.com',
    phone: '+923336666666',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'fallback-8',
    name: 'Gavish Karmani',
    role: 'Executive Member',
    image_url: '/Assets/asset_team/Gavish Karmani.jpg',
    bio: 'Mobilizes youth networks and designs community-level awareness drives for sustainable infrastructure development.',
    email: 'gavish.karmani@example.com',
    phone: '+923337777777',
    linkedin: 'https://linkedin.com'
  }
];

interface TeamMemberCardProps {
  member: TeamMember;
}

function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [activeIcon, setActiveIcon] = useState<'email' | 'phone' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setActiveIcon(null);
      }
    }

    if (activeIcon) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeIcon]);

  const handleIconClick = (type: 'email' | 'phone', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIcon((prev) => (prev === type ? null : type));
  };

  return (
    <div 
      ref={cardRef}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full relative"
    >
      {/* Image Wrap with hover zoom */}
      <div className="relative h-64 sm:h-72 overflow-hidden bg-gray-100">
        <img
          src={member.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'}
          alt={member.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            // Fallback if local profile image fails to load or path is wrong
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=800';
          }}
        />
        {/* Rose Colored overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90 transition-opacity duration-300" />
        
        {/* Position text absolute over image at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
          <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-rose-300 transition-colors">
            {member.name}
          </h3>
          <p className="text-rose-400 text-sm font-semibold tracking-wider uppercase mt-1">
            {member.role}
          </p>
        </div>
      </div>
      
      {/* Bio Details */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-white">
        <p className="text-gray-600 text-sm leading-relaxed text-justify mb-6 line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
          {member.bio}
        </p>
        
        {/* Contact Social Icons with Click-to-Toggle Premium Popups */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100 mt-auto min-h-[3rem] relative">
          {member.email && (
            <div className="relative">
              <button 
                onClick={(e) => handleIconClick('email', e)}
                className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center ${
                  activeIcon === 'email' 
                    ? 'bg-rose-600 text-white shadow-md scale-110' 
                    : 'bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600'
                }`}
                type="button"
                aria-label="Toggle Email Details"
              >
                <Mail className="w-4 h-4" />
              </button>
              
              {/* Premium Glassmorphic Tooltip */}
              <div 
                className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gray-950/95 backdrop-blur-md border border-gray-800 text-white text-xs rounded-xl shadow-xl transition-all duration-300 z-30 flex items-center gap-2 whitespace-nowrap ${
                  activeIcon === 'email' 
                    ? 'opacity-100 scale-100 translate-y-0 visible' 
                    : 'opacity-0 scale-95 translate-y-1 invisible pointer-events-none'
                }`}
              >
                <a 
                  href={`mailto:${member.email}?subject=Contact%20${encodeURIComponent(member.name)}`}
                  className="hover:text-rose-400 font-semibold transition-colors flex items-center gap-1.5 py-0.5 px-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail className="w-3.5 h-3.5 text-rose-400" />
                  <span>{member.email}</span>
                </a>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-950" />
              </div>
            </div>
          )}

          {member.phone && (
            <div className="relative">
              <button 
                onClick={(e) => handleIconClick('phone', e)}
                className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center ${
                  activeIcon === 'phone' 
                    ? 'bg-rose-600 text-white shadow-md scale-110' 
                    : 'bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600'
                }`}
                type="button"
                aria-label="Toggle Phone Details"
              >
                <Phone className="w-4 h-4" />
              </button>
              
              {/* Premium Glassmorphic Tooltip */}
              <div 
                className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gray-950/95 backdrop-blur-md border border-gray-800 text-white text-xs rounded-xl shadow-xl transition-all duration-300 z-30 flex items-center gap-2 whitespace-nowrap ${
                  activeIcon === 'phone' 
                    ? 'opacity-100 scale-100 translate-y-0 visible' 
                    : 'opacity-0 scale-95 translate-y-1 invisible pointer-events-none'
                }`}
              >
                <a 
                  href={`tel:${member.phone}`}
                  className="hover:text-rose-400 font-semibold transition-colors flex items-center gap-1.5 py-0.5 px-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Phone className="w-3.5 h-3.5 text-rose-400" />
                  <span>{member.phone}</span>
                </a>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-950" />
              </div>
            </div>
          )}

          {member.linkedin && (
            <div className="relative">
              <button 
                onClick={() => window.open(member.linkedin, "_blank")}
                className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center animate-none"
                type="button"
                aria-label="Open LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      setLoading(true);
      const data = await api.getTeam();
      if (data && data.length > 0) {
        setTeamMembers(data);
      } else {
        // Fallback to local high-quality mock data if database is empty
        setTeamMembers(localFallbackTeam);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
      // Fail-safe fallback on network/DB failure
      setTeamMembers(localFallbackTeam);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="team" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-rose-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            <span>Passionate Leadership</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 mb-6">
            Our Executive Board
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet the visionaries, social advocates, and dynamic organizers steering Maheshwari Action Forum towards sustainable humanitarian impact.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-rose-600 animate-spin" />
              <p className="text-gray-500 font-medium animate-pulse">Loading board profiles...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}