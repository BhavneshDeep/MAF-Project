import React from 'react';
import { Heart, Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: Brand Pitch */}
          <div className="space-y-5 text-left">
            <div className="flex items-center gap-3">
              <img 
                src="/Assets/MAF_logo.jpg" 
                alt="Maheshwari Action Forum Logo" 
                className="h-10 w-10 rounded-lg border border-gray-800" 
              />
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-white leading-none">
                  Maheshwari
                </span>
                <span className="text-[10px] font-bold tracking-widest text-rose-500 uppercase mt-0.5">
                  Action Forum
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed text-justify">
              Maheshwari Action Forum (MAF) is a registered, non-profit social welfare organization dedicated to poverty alleviation, healthcare empowerment, and educational aid across Sindh, Pakistan.
            </p>
          </div>
          
          {/* Column 2: Navigation Links */}
          <div className="text-left md:pl-8">
            <h3 className="text-sm font-black tracking-widest uppercase text-rose-500 mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#projects" className="text-gray-400 hover:text-rose-500 transition-colors font-semibold">
                  Active Projects
                </a>
              </li>
              <li>
                <a href="#team" className="text-gray-400 hover:text-rose-500 transition-colors font-semibold">
                  Board Members
                </a>
              </li>
              <li>
                <a href="#events" className="text-gray-400 hover:text-rose-500 transition-colors font-semibold">
                  Historic Campaigns
                </a>
              </li>
              <li>
                <a href="#collaborations" className="text-gray-400 hover:text-rose-500 transition-colors font-semibold">
                  Collaborations
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Contact Info */}
          <div className="text-left">
            <h3 className="text-sm font-black tracking-widest uppercase text-rose-500 mb-5">Contact Hub</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-rose-500 shrink-0" />
                <a href="mailto:teammaheshwaripak@gmail.com" className="text-gray-400 hover:text-rose-500 transition-colors break-all">
                  teammaheshwaripak@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-rose-500 shrink-0" />
                <a href="tel:+923332895648" className="text-gray-400 hover:text-rose-500 transition-colors font-mono">
                  +92 (333) 289-5648
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-gray-400 leading-snug">
                  Maheshwari Action Forum, Karachi / Hyderabad, Sindh, Pakistan
                </span>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Social Outlets */}
          <div className="text-left">
            <h3 className="text-sm font-black tracking-widest uppercase text-rose-500 mb-5">Follow Operations</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              We post real-time updates, audits, and camp photos on our official social media channels.
            </p>
            <div className="flex space-x-3.5">
              <a
                href="https://www.instagram.com/maheshwariactionforum/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-900 border border-gray-800 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all transform hover:-translate-y-0.5 shadow-md shadow-black/30"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100091449397418"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-900 border border-gray-800 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all transform hover:-translate-y-0.5 shadow-md shadow-black/30"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Footer Base */}
        <div className="border-t border-gray-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Maheshwari Action Forum (MAF). All rights reserved.</p>
          <p className="flex items-center gap-1.5 font-bold">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600 animate-pulse" />
            <span>for Social Welfare in Pakistan</span>
          </p>
        </div>
      </div>
    </footer>
  );
}