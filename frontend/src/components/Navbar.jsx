import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Cpu, Bell, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Navbar({ onMobileMenuToggle }) {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDashboard = location.pathname.startsWith('/dashboard') || 
                      location.pathname.startsWith('/generate') ||
                      location.pathname.startsWith('/videos') ||
                      location.pathname.startsWith('/billing') ||
                      location.pathname.startsWith('/apikeys') ||
                      location.pathname.startsWith('/settings') ||
                      location.pathname.startsWith('/profile') ||
                      location.pathname.startsWith('/admin');

  if (isDashboard) {
    return (
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {/* Mobile menu trigger */}
          <button
            onClick={onMobileMenuToggle}
            className="p-2 -ml-2 rounded-lg text-zinc-400 hover:text-zinc-200 lg:hidden cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <h1 className="text-lg font-heading font-semibold text-zinc-100 uppercase tracking-wide">
            {location.pathname.substring(1) === 'apikeys' ? 'API Keys' : location.pathname.substring(1).replace('-', ' ')}
          </h1>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-4">
          {/* Credits indicator in header */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
            <span className="text-zinc-400 font-medium">Credits:</span>
            <span className="text-brand-purple font-bold font-mono">{user?.credits ?? 0}</span>
          </div>

          <button className="relative p-2 rounded-lg text-zinc-400 hover:text-zinc-200 cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-magenta" />
          </button>
        </div>
      </header>
    );
  }

  // Landing Page Navbar
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-zinc-950/85 backdrop-blur-lg border-b border-zinc-900/80 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-1.5 bg-brand-purple/10 border border-brand-purple/20 rounded-lg text-brand-purple">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-gradient">SEEDANCE AI</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-zinc-200 transition-colors">Features</a>
          <a href="#models" className="hover:text-zinc-200 transition-colors">Models</a>
          <a href="#pricing" className="hover:text-zinc-200 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-zinc-200 transition-colors">FAQ</a>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple/95 text-white font-semibold text-sm shadow-lg shadow-brand-purple/20 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-zinc-300 hover:text-white text-sm font-semibold transition-colors">
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple/95 text-white font-semibold text-sm shadow-lg shadow-brand-purple/20 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 md:hidden cursor-pointer"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-950 border-b border-zinc-900 py-6 px-6 flex flex-col gap-6 shadow-2xl animate-fade-in">
          <nav className="flex flex-col gap-4 text-zinc-400 font-medium">
            <a href="#features" onClick={() => setMobileOpen(false)} className="hover:text-zinc-200 transition-colors">Features</a>
            <a href="#models" onClick={() => setMobileOpen(false)} className="hover:text-zinc-200 transition-colors">Models</a>
            <a href="#pricing" onClick={() => setMobileOpen(false)} className="hover:text-zinc-200 transition-colors">Pricing</a>
            <a href="#faq" onClick={() => setMobileOpen(false)} className="hover:text-zinc-200 transition-colors">FAQ</a>
          </nav>
          
          <hr className="border-zinc-900" />
          
          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl font-semibold text-sm transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl font-semibold text-sm hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl font-semibold text-sm hover:shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
