import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const menuItems = [
    { label: 'Projects', href: '#projects' },
    { label: 'Team', href: '#team' },
    { label: 'Events', href: '#events' },
    { label: 'Collaborations', href: '#collaborations' },
    { label: 'Book Appointment', href: '#book' },
    { label: 'Donate Now', href: '#donations' },
  ];

  // ScrollSpy listener to determine which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      // Manage header elevation / transparency
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Check section bounding boxes
      const scrollPos = window.scrollY + 100;
      for (const item of menuItems) {
        const targetId = item.href.substring(1);
        const el = document.getElementById(targetId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(item.href);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300
      ${scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-md py-3' 
        : 'bg-white/80 backdrop-blur-sm py-4 border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Brand Brand Section */}
          <div className="flex items-center gap-3">
            <img 
              src="/Assets/MAF_logo.jpg" 
              alt="Maheshwari Action Forum Logo" 
              className="h-11 w-11 rounded-xl shadow-inner border border-rose-50 object-cover" 
            />
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-black tracking-tight text-gray-900 leading-none">
                Maheshwari
              </span>
              <span className="text-xs font-bold tracking-widest text-rose-600 uppercase mt-0.5">
                Action Forum
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => {
              const isDonate = item.label === 'Donate Now';
              const isActive = activeSection === item.href;
              
              if (isDonate) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-rose-600/10 hover:shadow-lg hover:-translate-y-0.5 text-sm"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{item.label}</span>
                  </a>
                );
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-bold tracking-wide transition-all duration-200 relative py-1
                    ${isActive 
                      ? 'text-rose-600 font-extrabold' 
                      : 'text-gray-600 hover:text-rose-600'}`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 rounded-full" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Mobile Navigation Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg bg-gray-50 border border-gray-100"
              title="Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden animate-slideDown bg-white border-t border-gray-100 mt-2 rounded-2xl shadow-xl overflow-hidden text-left">
            <div className="px-3 pt-2 pb-4 space-y-1 sm:px-4">
              {menuItems.map((item) => {
                const isDonate = item.label === 'Donate Now';
                const isActive = activeSection === item.href;

                if (isDonate) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 bg-rose-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md text-sm mt-3"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>{item.label}</span>
                    </a>
                  );
                }

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all
                      ${isActive 
                        ? 'bg-rose-50 text-rose-600 font-extrabold border-l-4 border-rose-600' 
                        : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}