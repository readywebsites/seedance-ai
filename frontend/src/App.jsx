import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import GenerateVideo from './pages/GenerateVideo';
import MyVideos from './pages/MyVideos';
import APIKeys from './pages/APIKeys';
import Billing from './pages/Billing';
import Profile from './pages/Profile';
import SettingsPage from './pages/Settings';
import AdminPanel from './pages/AdminPanel';

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Admin Route Wrapper
function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  return isAuthenticated && isAdmin ? children : <Navigate to="/dashboard" replace />;
}

// Layout wrapper for dashboard pages to support sidebar grid
function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm">
          <div className="relative animate-slide-right">
            <Sidebar />
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-[-45px] p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg"
            >
              ✕
            </button>
          </div>
          {/* Close tap area */}
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <main className="p-6 md:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Marketing Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Dashboard Layout and Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/generate" element={<GenerateVideo />} />
          <Route path="/videos" element={<MyVideos />} />
          <Route path="/apikeys" element={<APIKeys />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
