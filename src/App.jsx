import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import MainLayout from './layout/MainLayout';
import './App.css';

// Lazy load pages for performance
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Events = React.lazy(() => import('./pages/Events'));
const EventDetail = React.lazy(() => import('./pages/EventDetail'));
const MyBookings = React.lazy(() => import('./pages/MyBookings'));
const Dashboards = React.lazy(() => import('./pages/Dashboard')); // User Dashboard or shared
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// Protected Route components
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading Auth...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div>Loading Auth...</div>;
  if (!isAdmin) return <Navigate to="/events" />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <React.Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#0f172a] text-blue-400 font-bold">Loading...</div>}>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/events" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                
                {/* User Only Routes */}
                <Route path="/bookings" element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } />

                {/* Admin Only Routes */}
                <Route path="/admin/*" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />

                <Route path="*" element={<Navigate to="/events" />} />
              </Routes>
            </MainLayout>
          </React.Suspense>
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
