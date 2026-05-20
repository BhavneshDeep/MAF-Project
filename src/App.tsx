import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';

/* ─── Public Pages ─── */
import Home from './pages/public/Home';

const TeamPage            = lazy(() => import('./pages/public/TeamPage'));
const EventsPage          = lazy(() => import('./pages/public/EventsPage'));
const ProjectsPage        = lazy(() => import('./pages/public/ProjectsPage'));
const DonationsPage       = lazy(() => import('./pages/public/DonationsPage'));
const CollaborationsPage  = lazy(() => import('./pages/public/CollaborationsPage'));
const BookAppointmentPage = lazy(() => import('./pages/public/BookAppointmentPage'));

/* ─── Admin Pages ─── */
import Login from './pages/admin/Login';
import AdminLayout from './components/AdminLayout';

const Dashboard            = lazy(() => import('./pages/admin/Dashboard'));
const ManageEvents         = lazy(() => import('./pages/admin/ManageEvents'));
const ManageProjects       = lazy(() => import('./pages/admin/ManageProjects'));
const ManageTeam           = lazy(() => import('./pages/admin/ManageTeam'));
const ManageAppointments   = lazy(() => import('./pages/admin/ManageAppointments'));
const ManageDonations      = lazy(() => import('./pages/admin/ManageDonations'));
const ManageCollaborations = lazy(() => import('./pages/admin/ManageCollaborations'));

/* ─── Shared Suspense Fallback ─── */
function PageLoader() {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center gap-4">
      <Loader2 className="w-12 h-12 text-rose-600 animate-spin" />
      <p className="text-gray-400 text-sm font-medium animate-pulse">Loading page...</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#e11d48', secondary: '#fff' } },
          }}
        />
        <Routes>

          {/* ── Public Routes ── */}
          <Route path="/" element={<Home />} />

          <Route
            path="/team"
            element={
              <Suspense fallback={<PageLoader />}>
                <TeamPage />
              </Suspense>
            }
          />
          <Route
            path="/events"
            element={
              <Suspense fallback={<PageLoader />}>
                <EventsPage />
              </Suspense>
            }
          />
          <Route
            path="/projects"
            element={
              <Suspense fallback={<PageLoader />}>
                <ProjectsPage />
              </Suspense>
            }
          />
          <Route
            path="/donations"
            element={
              <Suspense fallback={<PageLoader />}>
                <DonationsPage />
              </Suspense>
            }
          />
          <Route
            path="/collaborations"
            element={
              <Suspense fallback={<PageLoader />}>
                <CollaborationsPage />
              </Suspense>
            }
          />
          <Route
            path="/book-appointment"
            element={
              <Suspense fallback={<PageLoader />}>
                <BookAppointmentPage />
              </Suspense>
            }
          />

          {/* ── Admin Routes ── */}
          <Route path="/admin/login" element={<Login />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route
              path="events"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ManageEvents />
                </Suspense>
              }
            />
            <Route
              path="projects"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ManageProjects />
                </Suspense>
              }
            />
            <Route
              path="team"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ManageTeam />
                </Suspense>
              }
            />
            <Route
              path="appointments"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ManageAppointments />
                </Suspense>
              }
            />
            <Route
              path="donations"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ManageDonations />
                </Suspense>
              }
            />
            <Route
              path="collaborations"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ManageCollaborations />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* ── 404 Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;