import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { ArrowRight, Target, Loader2, Sparkles, X, HeartHandshake, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

const fallbackProjects: Project[] = [
  {
    id: 'fallback-proj-1',
    title: 'Project Jal - Pure Solar Water',
    category: 'Water & Sanitation',
    image_url: '/Assets/assets_events/project_jal_1.jpg',
    description: 'Installing solar-powered deep water filtration pumps across arid communities in Sindh, providing continuous pure drinking water to over 10,000 villagers daily.',
    impact_metric: '15+ Solar Pure Wells Operating'
  },
  {
    id: 'fallback-proj-2',
    title: 'Sponsor a Student Scholarship',
    category: 'Education Aid',
    image_url: '/Assets/assets_events/Workshop.jpg',
    description: 'Distributing complete tuition grants, uniform allowances, and books to girls secondary schools. Running teacher-training seminars to eradicate gender-biases.',
    impact_metric: '120+ Scholarship Grants Yearly'
  },
  {
    id: 'fallback-proj-3',
    title: 'Free Diagnostic Medical Camps',
    category: 'Healthcare Support',
    image_url: '/Assets/assets_events/medical_camp_1.jpg',
    description: 'Collaborating with premier institutes like Tabba Heart and Dr. Essa Laboratories to deploy free diagnosis checkup tents, diagnostic labs, and medications.',
    impact_metric: '5,000+ Outpatients Treated Free'
  }
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects();
      if (data && data.length > 0) {
        setProjects(data);
      } else {
        setProjects(fallbackProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects(fallbackProjects);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="projects" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-blue-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute left-10 bottom-10 w-96 h-96 bg-rose-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Measurable Local Impact</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            Active Social Initiatives
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Every contribution we receive directly powers structured drives addressing severe resource inequalities in Pakistan.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-rose-600 animate-spin" />
              <p className="text-gray-500 font-medium animate-pulse">Fetching active operations...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="relative h-56 bg-gray-200 overflow-hidden">
                  <img
                    src={project.image_url || 'https://images.unsplash.com/photo-1593113563332-e147ce367fa0?auto=format&fit=crop&q=80&w=800'}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 shadow-sm uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-extrabold text-gray-900 group-hover:text-rose-600 transition-colors mb-3 leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 text-justify">
                      {project.description}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-rose-600 font-bold bg-rose-50/75 border border-rose-100 rounded-xl p-3 mb-6">
                      <Target className="h-5 w-5 mr-3 shrink-0" />
                      <span className="text-sm tracking-wide">{project.impact_metric}</span>
                    </div>
                    
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center text-rose-600 hover:text-rose-700 font-bold text-sm group/btn"
                    >
                      <span>Explore Initiatives</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Learn More Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 transform scale-100 transition-transform duration-300 max-h-[90vh] flex flex-col">
            {/* Header image cover */}
            <div className="relative h-64 sm:h-72 bg-gray-100 shrink-0">
              <img 
                src={selectedProject.image_url} 
                alt={selectedProject.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-md transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="absolute bottom-5 left-6 right-6">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border border-blue-500">
                  {selectedProject.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 leading-tight">
                  {selectedProject.title}
                </h3>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-8 overflow-y-auto space-y-6 flex-1 text-left">
              <div>
                <h4 className="text-gray-900 font-bold text-lg mb-2">Campaign Description</h4>
                <p className="text-gray-600 text-sm leading-relaxed text-justify">
                  {selectedProject.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">Verified Action</h5>
                    <p className="text-gray-500 text-xs mt-0.5">Continuous on-ground monitoring</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <HeartHandshake className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">100% Direct Charity</h5>
                    <p className="text-gray-500 text-xs mt-0.5">Fund allocation transparency</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center text-rose-600 font-bold">
                  <Target className="w-5 h-5 mr-2" />
                  <span className="text-sm">Initiative Impact: {selectedProject.impact_metric}</span>
                </div>
                <a 
                  href="#donations" 
                  onClick={() => setSelectedProject(null)}
                  className="w-full sm:w-auto text-center px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition-colors shadow-md shadow-rose-600/10 shrink-0"
                >
                  Support This Work
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}