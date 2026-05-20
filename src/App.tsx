import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Public Page
import Home from './pages/public/Home';

// Admin Core Pages
import Login from './pages/admin/Login';
import AdminLayout from './components/AdminLayout';

// Lazy load heavy admin views to enable code-splitting
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageEvents = lazy(() => import('./pages/admin/ManageEvents'));
const ManageProjects = lazy(() => import('./pages/admin/ManageProjects'));
const ManageTeam = lazy(() => import('./pages/admin/ManageTeam'));
const ManageAppointments = lazy(() => import('./pages/admin/ManageAppointments'));
const ManageDonations = lazy(() => import('./pages/admin/ManageDonations'));
const ManageCollaborations = lazy(() => import('./pages/admin/ManageCollaborations'));

// Clean Loading Screen for Suspense Fallback
function AdminPageLoader() {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center gap-4">
      <Loader2 className="w-12 h-12 text-rose-600 animate-spin" />
      <p className="text-gray-500 font-medium animate-pulse">Loading workspace section...</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route 
            path="dashboard" 
            element={
              <Suspense fallback={<AdminPageLoader />}>
                <Dashboard />
              </Suspense>
            } 
          />
          <Route 
            path="events" 
            element={
              <Suspense fallback={<AdminPageLoader />}>
                <ManageEvents />
              </Suspense>
            } 
          />
          <Route 
            path="projects" 
            element={
              <Suspense fallback={<AdminPageLoader />}>
                <ManageProjects />
              </Suspense>
            } 
          />
          <Route 
            path="team" 
            element={
              <Suspense fallback={<AdminPageLoader />}>
                <ManageTeam />
              </Suspense>
            } 
          />
          <Route 
            path="appointments" 
            element={
              <Suspense fallback={<AdminPageLoader />}>
                <ManageAppointments />
              </Suspense>
            } 
          />
          <Route 
            path="donations" 
            element={
              <Suspense fallback={<AdminPageLoader />}>
                <ManageDonations />
              </Suspense>
            } 
          />
          <Route 
            path="collaborations" 
            element={
              <Suspense fallback={<AdminPageLoader />}>
                <ManageCollaborations />
              </Suspense>
            } 
          />
          {/* Unrecognized admin path fallback */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
        
        {/* Catch-all general path redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;