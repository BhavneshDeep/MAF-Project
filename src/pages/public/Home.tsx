import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';
import {
  Users, Calendar, Briefcase, Handshake,
  Heart, ArrowRight, CalendarCheck, Shield
} from 'lucide-react';

/* ── Quick-access section teasers ── */
const sections = [
  {
    icon: Briefcase,
    title: 'Active Projects',
    description: 'Solar water pumps, scholarship grants, and free medical clinics — see all running campaigns.',
    to: '/projects',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    text: 'text-blue-600',
  },
  {
    icon: Users,
    title: 'Our Team',
    description: "Meet the passionate executive board driving MAF's humanitarian mission across Pakistan.",
    to: '/team',
    color: 'from-rose-500 to-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    text: 'text-rose-600',
  },
  {
    icon: Calendar,
    title: 'Events & Campaigns',
    description: 'Browse our historic drives — Iftar distributions, plantation days, and health camps.',
    to: '/events',
    color: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    text: 'text-amber-600',
  },
  {
    icon: Handshake,
    title: 'Collaborations',
    description: 'Institutional alliances with hospitals, schools, and NGOs for collective impact.',
    to: '/collaborations',
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    text: 'text-emerald-600',
  },
  {
    icon: CalendarCheck,
    title: 'Book Appointment',
    description: 'Schedule a meeting with our board members to discuss partnerships or aid requests.',
    to: '/book-appointment',
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    text: 'text-purple-600',
  },
  {
    icon: Heart,
    title: 'Donate Now',
    description: 'Support our cause via Easypaisa, JazzCash, or Bank Transfer. 100% goes to welfare.',
    to: '/donations',
    color: 'from-rose-600 to-pink-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    text: 'text-rose-600',
    highlight: true,
  },
];

/* ── Impact stats ── */
const stats = [
  { value: '5,000+', label: 'Patients Treated' },
  { value: '120+',   label: 'Scholarships' },
  { value: '15+',    label: 'Water Wells' },
  { value: '8+',     label: 'Partner Orgs' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* ── Hero ── */}
        <Hero />

        {/* ── Impact Stats Banner ── */}
        <section className="bg-rose-600 py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-700 to-rose-500 opacity-80" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="text-center animate-fadeInUp"
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
                >
                  <p className="text-3xl sm:text-4xl font-black text-white">{stat.value}</p>
                  <p className="text-rose-200 text-xs sm:text-sm font-bold uppercase tracking-widest mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section Teasers ── */}
        <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="section-label mb-4">
                <Shield className="w-4 h-4" />
                <span>Explore MAF</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
                Everything We Do
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Discover our projects, meet the team, attend events, or support our mission.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {sections.map((section, i) => {
                const Icon = section.icon;
                return (
                  <Link
                    key={section.to}
                    to={section.to}
                    className={`group relative flex flex-col p-7 bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden ${
                      section.highlight ? 'border-rose-200 ring-2 ring-rose-500/20' : 'border-gray-100'
                    }`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {/* Top gradient bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${section.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl`} />

                    {/* Icon */}
                    <div className={`w-12 h-12 ${section.bg} ${section.border} border rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`w-6 h-6 ${section.text}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-rose-600 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1">
                      {section.description}
                    </p>

                    {/* CTA */}
                    <div className={`flex items-center gap-1.5 mt-5 text-sm font-bold ${section.text} group-hover:gap-3 transition-all duration-200`}>
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA Banner ── */}
        <section className="py-20 bg-gray-950 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-900/20 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-800/10 rounded-full filter blur-3xl" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600/20 border border-rose-500/30 rounded-full text-rose-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Heart className="w-4 h-4 fill-rose-400" />
              <span>Make a Difference Today</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">
              Your Donation Changes{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
                Real Lives
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Every rupee donated goes directly to free medical camps, student scholarships, and clean water initiatives across Pakistan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/donations"
                className="btn-primary text-base px-8 py-4 shadow-rose-900/40"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>Donate Now</span>
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-700 hover:border-rose-500 text-gray-300 hover:text-white font-bold rounded-xl transition-all duration-200 text-base"
              >
                <span>View Projects</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
