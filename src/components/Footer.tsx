import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Instagram, Facebook, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const quickLinks = [
  { label: 'Active Projects',    to: '/projects' },
  { label: 'Board Members',      to: '/team' },
  { label: 'Historic Campaigns', to: '/events' },
  { label: 'Collaborations',     to: '/collaborations' },
  { label: 'Book Appointment',   to: '/book-appointment' },
  { label: 'Donate',             to: '/donations' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-900/20 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-800/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* ── Col 1: Brand ── */}
          <div className="space-y-5 text-left lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <img
                src="/Assets/MAF_logo.jpg"
                alt="Maheshwari Action Forum"
                className="h-11 w-11 rounded-xl border border-gray-700 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col leading-none">
                <span className="text-base font-black tracking-tight text-white">Maheshwari</span>
                <span className="text-[10px] font-extrabold tracking-widest text-rose-500 uppercase mt-0.5">
                  Action Forum
                </span>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed">
              MAF is a registered non-profit dedicated to poverty alleviation, healthcare empowerment,
              and educational aid across Sindh, Pakistan.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/maheshwariactionforum/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2.5 bg-gray-800 border border-gray-700/60 rounded-xl text-rose-400 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100091449397418"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2.5 bg-gray-800 border border-gray-700/60 rounded-xl text-rose-400 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* ── Col 2: Quick Links ── */}
          <div className="text-left">
            <h3 className="text-sm font-black tracking-widest uppercase text-rose-500 mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-rose-600" />
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-gray-400 hover:text-rose-400 transition-colors text-sm font-medium"
                  >
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-rose-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Contact ── */}
          <div className="text-left">
            <h3 className="text-sm font-black tracking-widest uppercase text-rose-500 mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-rose-600" />
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:teammaheshwaripak@gmail.com"
                  className="flex items-start gap-3 text-gray-400 hover:text-rose-400 transition-colors group"
                >
                  <div className="p-1.5 bg-gray-800 rounded-lg shrink-0 group-hover:bg-rose-900/40 transition-colors">
                    <Mail className="h-4 w-4 text-rose-500" />
                  </div>
                  <span className="text-sm break-all">teammaheshwaripak@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+923332895648"
                  className="flex items-center gap-3 text-gray-400 hover:text-rose-400 transition-colors group"
                >
                  <div className="p-1.5 bg-gray-800 rounded-lg shrink-0 group-hover:bg-rose-900/40 transition-colors">
                    <Phone className="h-4 w-4 text-rose-500" />
                  </div>
                  <span className="text-sm font-mono">+92 (333) 289-5648</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <div className="p-1.5 bg-gray-800 rounded-lg shrink-0">
                  <MapPin className="h-4 w-4 text-rose-500" />
                </div>
                <span className="text-sm leading-snug">
                  Karachi / Hyderabad, Sindh, Pakistan
                </span>
              </li>
            </ul>
          </div>

          {/* ── Col 4: Donate CTA ── */}
          <div className="text-left">
            <h3 className="text-sm font-black tracking-widest uppercase text-rose-500 mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-rose-600" />
              Support MAF
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Your generosity directly powers free clinics, school scholarships, and clean water projects.
            </p>
            <Link
              to="/donations"
              className="inline-flex items-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-rose-900/30 hover:-translate-y-0.5"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Donate Now</span>
            </Link>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-gray-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Maheshwari Action Forum (MAF). All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600 animate-pulse" />
            <span>for Social Welfare in Pakistan</span>
          </p>
        </div>
      </div>
    </footer>
  );
}