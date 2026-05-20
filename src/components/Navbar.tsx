import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Home',            to: '/' },
  { label: 'Projects',        to: '/projects' },
  { label: 'Team',            to: '/team' },
  { label: 'Events',          to: '/events' },
  { label: 'Collaborations',  to: '/collaborations' },
  { label: 'Book Appointment',to: '/book-appointment' },
];

export default function Navbar() {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location                = useLocation();

  /* ── Scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Close drawer on route change ── */
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg shadow-gray-900/5 py-2 border-b border-gray-100/80'
          : 'bg-white/85 backdrop-blur-md py-3 border-b border-gray-100/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <img
                src="/Assets/MAF_logo.jpg"
                alt="Maheshwari Action Forum"
                className="h-11 w-11 rounded-xl shadow object-cover border border-rose-100 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-xl ring-2 ring-rose-500/0 group-hover:ring-rose-500/30 transition-all duration-300" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="text-base sm:text-lg font-black tracking-tight text-gray-900">
                Maheshwari
              </span>
              <span className="text-[10px] sm:text-xs font-extrabold tracking-widest text-rose-600 uppercase mt-0.5">
                Action Forum
              </span>
            </div>
          </Link>

          {/* ── Desktop Links ── */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative px-3 py-2 rounded-lg text-sm font-bold tracking-wide transition-all duration-200 group
                    ${active
                      ? 'text-rose-600 bg-rose-50'
                      : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50/60'
                    }`}
                >
                  {item.label}
                  {/* Active underline pill */}
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-rose-600 rounded-full transition-all duration-300 ${
                      active ? 'w-4/5' : 'w-0 group-hover:w-3/5'
                    }`}
                  />
                </Link>
              );
            })}

            {/* Donate CTA */}
            <Link
              to="/donations"
              className={`ml-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 ${
                isActive('/donations')
                  ? 'bg-rose-700 text-white shadow-rose-700/20'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
              }`}
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Donate Now</span>
            </Link>
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
            aria-label="Toggle navigation"
          >
            {isOpen
              ? <X className="h-5 w-5" />
              : <Menu className="h-5 w-5" />
            }
          </button>
        </div>

        {/* ── Mobile Drawer ── */}
        {isOpen && (
          <div className="lg:hidden animate-slideDown mt-2 pb-4 border-t border-gray-100">
            <div className="pt-3 space-y-1">
              {navLinks.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      active
                        ? 'bg-rose-50 text-rose-600 border-l-4 border-rose-600 pl-3'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-rose-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Mobile Donate */}
              <Link
                to="/donations"
                className="flex items-center justify-center gap-2 mt-3 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Donate Now</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}