import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Video, Library, KeyRound, CreditCard, Settings, User, LogOut, ShieldAlert, Cpu } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Generate Video', path: '/generate', icon: Video },
    { name: 'My Videos', path: '/videos', icon: Library },
    { name: 'API Keys', path: '/apikeys', icon: KeyRound },
    { name: 'Billing', path: '/billing', icon: CreditCard },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
        <div className="p-2 bg-brand-purple/10 border border-brand-purple/20 rounded-lg text-brand-purple">
          <Cpu className="w-6 h-6 animate-pulse" />
        </div>
        <span className="font-heading font-bold text-xl tracking-tight text-gradient">SEEDANCE AI</span>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-purple/10 border border-brand-purple/20 text-brand-purple'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200 border border-transparent'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-rose-500/10 border border-rose-500/20 text-rose-500'
                  : 'text-rose-400/80 hover:bg-rose-950/20 hover:text-rose-400 border border-transparent'
              }`
            }
          >
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>Admin Panel</span>
          </NavLink>
        )}
      </nav>

      {/* Credits Display */}
      <div className="p-4 border-t border-zinc-900">
        <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 radial-glow-purple opacity-40 group-hover:opacity-60 transition-opacity" />
          <div className="relative z-10">
            <span className="text-xs text-zinc-400 block mb-1 font-medium">Credits Remaining</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-heading text-zinc-100">{user?.credits ?? 0}</span>
              <span className="text-xs text-zinc-500">cr</span>
            </div>
            {/* Quick Topup action */}
            <button
              onClick={() => navigate('/billing')}
              className="mt-3 w-full py-1.5 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-lg text-xs font-semibold shadow-md shadow-brand-purple/10 hover:shadow-brand-purple/20 transition-all cursor-pointer"
            >
              Buy Credits
            </button>
          </div>
        </div>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-zinc-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-purple to-brand-magenta flex items-center justify-center font-bold text-white shrink-0 shadow-md">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="min-w-0">
            <span className="block text-sm font-semibold text-zinc-200 truncate">{user?.name || 'User'}</span>
            <span className="block text-xs text-zinc-500 truncate">{user?.email || 'email@domain.com'}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
