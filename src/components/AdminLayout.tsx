import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';
import { supabase } from '../services/supabase';
import {
  LayoutDashboard, Users, Calendar, Briefcase,
  FileText, Heart, LogOut, Loader2, Handshake,
  Menu, X, ChevronRight, Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { name: 'Dashboard',     path: '/admin/dashboard',      icon: LayoutDashboard },
  { name: 'Events',        path: '/admin/events',          icon: Calendar },
  { name: 'Projects',      path: '/admin/projects',        icon: Briefcase },
  { name: 'Team',          path: '/admin/team',            icon: Users },
  { name: 'Appointments',  path: '/admin/appointments',    icon: FileText },
  { name: 'Donations',     path: '/admin/donations',       icon: Heart },
  { name: 'Proposals',     path: '/admin/collaborations',  icon: Handshake },
  { name: 'Partners',      path: '/admin/collaborators',   icon: Building2 },
];

export default function AdminLayout() {
  const [isLoading, setIsLoading]       = useState(true);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const navigate                        = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate('/admin/login');
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
          <p className="text-gray-500 text-sm font-medium animate-pulse">Verifying session...</p>
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-6 border-b border-gray-800/60">
        <div className="flex items-center gap-3">
          <img
            src="/Assets/MAF_logo.jpg"
            alt="MAF"
            className="h-9 w-9 rounded-lg object-cover border border-gray-700"
          />
          <div>
            <p className="text-sm font-black text-white tracking-tight leading-none">MAF Admin</p>
            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mt-0.5">Control Panel</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group
              ${isActive
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-rose-400'}`} />
                <span>{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-800/60">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-60 xl:w-64 bg-gray-900 flex-col shrink-0 shadow-xl">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar Drawer ── */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-end p-4 border-b border-gray-800">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/Assets/MAF_logo.jpg" alt="MAF" className="h-7 w-7 rounded-lg object-cover" />
            <span className="font-black text-gray-900 text-sm">MAF Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
