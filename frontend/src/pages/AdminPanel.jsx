import React, { useState } from 'react';
import { 
  Users, CreditCard, Play, ShieldAlert, Cpu, 
  Trash2, Plus, Sparkles, Terminal, Volume2, Ticket, BarChart3 
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function AdminPanel() {
  const [usersList, setUsersList] = useState([
    { id: 101, name: 'Alex Mercer', email: 'demo@seedance.ai', credits: 250, role: 'admin', tier: 'Pro' },
    { id: 102, name: 'Julien Sorel', email: 'julien@nexus.com', credits: 900, role: 'user', tier: 'Starter' },
    { id: 103, name: 'Tyler Ngo', email: 'tyler@freelancer.io', credits: 45, role: 'user', tier: 'Free' },
    { id: 104, name: 'Aisha Mercer', email: 'aisha@cyberia.co', credits: 1200, role: 'user', tier: 'Pro' }
  ]);

  const [coupons, setCoupons] = useState([
    { code: 'LAUNCH50', discount: '50% Off', active: true },
    { code: 'FREE100', discount: '100 Free Credits', active: false }
  ]);

  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Seedance v2 Model Release', date: '2026-07-01', text: 'We have updated our main rendering model for faster completion rates.' }
  ]);

  const [selectedTab, setSelectedTab] = useState('users'); // users, jobs, metrics, settings
  const [editUser, setEditUser] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('');
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceText, setAnnounceText] = useState('');

  const handleUpdateCredits = (id, amount) => {
    setUsersList(usersList.map(u => u.id === id ? { ...u, credits: amount } : u));
    setEditUser(null);
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!couponCode || !couponDiscount) return;
    setCoupons([...coupons, { code: couponCode.toUpperCase(), discount: couponDiscount, active: true }]);
    setCouponCode('');
    setCouponDiscount('');
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!announceTitle || !announceText) return;
    setAnnouncements([{ id: Date.now(), title: announceTitle, date: new Date().toISOString().split('T')[0], text: announceText }, ...announcements]);
    setAnnounceTitle('');
    setAnnounceText('');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 font-heading">Admin Operations</h2>
          <span className="text-xs text-zinc-500">Manage SaaS states, system metrics, announcements, and coupons.</span>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 border border-zinc-800 rounded-xl">
          {['users', 'announcements', 'marketing', 'metrics'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedTab === tab 
                  ? 'bg-brand-purple text-white' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards in Admin */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard hoverGlow={false} className="p-4 flex items-center gap-4 bg-zinc-900/40">
          <div className="p-2.5 bg-brand-purple/10 border border-brand-purple/20 text-brand-purple rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">SaaS Registered</span>
            <span className="text-lg font-bold font-heading text-zinc-200 block">4,890 users</span>
          </div>
        </GlassCard>

        <GlassCard hoverGlow={false} className="p-4 flex items-center gap-4 bg-zinc-900/40">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">ARR (Annual Rec)</span>
            <span className="text-lg font-bold font-heading text-zinc-200 block">$248,500</span>
          </div>
        </GlassCard>

        <GlassCard hoverGlow={false} className="p-4 flex items-center gap-4 bg-zinc-900/40">
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">Worker Error Rate</span>
            <span className="text-lg font-bold font-heading text-zinc-200 block">0.08 %</span>
          </div>
        </GlassCard>

        <GlassCard hoverGlow={false} className="p-4 flex items-center gap-4 bg-zinc-900/40">
          <div className="p-2.5 bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan rounded-lg">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">Celery Workers</span>
            <span className="text-lg font-bold font-heading text-zinc-200 block">16 Online</span>
          </div>
        </GlassCard>
      </div>

      {/* Tab: Users Management */}
      {selectedTab === 'users' && (
        <GlassCard className="p-0 border-zinc-900">
          <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-zinc-200">Users & Credits Directory</h3>
            <span className="text-xs text-zinc-500 font-mono">DRF API: Connected</span>
          </div>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-semibold bg-zinc-900/30">
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Credits Balance</th>
                <th className="p-4">Tier Plan</th>
                <th className="p-4 pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {usersList.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-900/20 transition-colors">
                  <td className="p-4 pl-6 font-mono text-zinc-500">{user.id}</td>
                  <td className="p-4 font-semibold text-zinc-200">{user.name}</td>
                  <td className="p-4 text-zinc-400">{user.email}</td>
                  <td className="p-4 font-mono font-semibold text-brand-magenta">{user.credits} cr</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      user.tier === 'Pro' ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {user.tier}
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <button
                      onClick={() => setEditUser(user)}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-semibold cursor-pointer"
                    >
                      Edit Credits
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {/* Tab: Announcements */}
      {selectedTab === 'announcements' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <GlassCard className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-brand-purple" />
                <span>Write Announcement</span>
              </h3>
              <form onSubmit={handleAddAnnouncement} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Headline</label>
                  <input
                    type="text"
                    required
                    value={announceTitle}
                    onChange={(e) => setAnnounceTitle(e.target.value)}
                    placeholder="e.g. Model V2.5 Rollout"
                    className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 focus:border-brand-purple rounded-xl text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Body Content</label>
                  <textarea
                    required
                    rows="4"
                    value={announceText}
                    onChange={(e) => setAnnounceText(e.target.value)}
                    placeholder="Provide details about updates, maintenance, or feature releases."
                    className="w-full p-4 bg-zinc-950 border border-zinc-800 focus:border-brand-purple rounded-xl text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-purple hover:bg-brand-purple/95 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Publish Announcement
                </button>
              </form>
            </GlassCard>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 font-heading">Published Announcements</h3>
            {announcements.map((a) => (
              <GlassCard key={a.id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <h4 className="font-bold text-zinc-200">{a.title}</h4>
                    <span className="text-zinc-500 font-medium">{a.date}</span>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">{a.text}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Marketing & Coupons */}
      {selectedTab === 'marketing' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <GlassCard className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-brand-purple" />
                <span>Create Coupon</span>
              </h3>
              <form onSubmit={handleAddCoupon} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Promo Code</label>
                  <input
                    type="text"
                    required
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. SUMMER20"
                    className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 focus:border-brand-purple rounded-xl text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Discount Tagger</label>
                  <input
                    type="text"
                    required
                    value={couponDiscount}
                    onChange={(e) => setCouponDiscount(e.target.value)}
                    placeholder="e.g. 20% Off or 100 Credits"
                    className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 focus:border-brand-purple rounded-xl text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-purple hover:bg-brand-purple/95 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Create Code
                </button>
              </form>
            </GlassCard>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 font-heading">Coupon Codes</h3>
            <GlassCard className="p-0 border-zinc-900">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-semibold bg-zinc-900/30">
                    <th className="p-4 pl-6">Code</th>
                    <th className="p-4">Benefit</th>
                    <th className="p-4 pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {coupons.map((c, idx) => (
                    <tr key={idx} className="hover:bg-zinc-900/20 transition-colors">
                      <td className="p-4 pl-6 font-mono font-bold text-brand-purple">{c.code}</td>
                      <td className="p-4 font-semibold text-zinc-200">{c.discount}</td>
                      <td className="p-4 pr-6">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${c.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                          {c.active ? 'Active' : 'Expired'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Tab: System Metrics */}
      {selectedTab === 'metrics' && (
        <GlassCard className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-brand-purple" />
            <span>Active Worker Metrics & Broker Logs</span>
          </h3>
          <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-xl font-mono text-[11px] text-zinc-400 space-y-2 h-[300px] overflow-y-auto">
            <div>[2026-07-03 11:50:23] [Celery Broker] Connection established with Redis cluster on redis://127.0.0.1:6379/0</div>
            <div>[2026-07-03 11:51:04] [Celery Worker] Started job "video_gen.tasks.process_generation[job_e81aa90]"</div>
            <div>{'[2026-07-03 11:51:19] [Celery Worker] Task "job_e81aa90" succeeded in 15.2s: result={"url": "/cyberpunk.jpg"}'}</div>
            <div>[2026-07-03 11:53:40] [Django REST] POST /api/video/generate/ status=202 Accepted</div>
            <div>[2026-07-03 11:53:41] [Celery Worker] Started job "video_gen.tasks.process_generation[job_b0922ca]"</div>
            <div className="text-red-400">[2026-07-03 11:54:12] [AI Provider API] HTTP 429 Too Many Requests response from api.seedance.com. Retrying job in 5s...</div>
            <div>[2026-07-03 11:54:17] [Celery Worker] Retry #1 of job "job_b0922ca" started</div>
            <div>{'[2026-07-03 11:54:32] [Celery Worker] Task "job_b0922ca" succeeded in 15.1s: result={"url": "/steampunk.jpg"}'}</div>
          </div>
        </GlassCard>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <GlassCard className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <button
              onClick={() => setEditUser(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <div className="text-left space-y-4 pt-2">
              <h4 className="text-base font-bold text-zinc-200">Adjust Credit Balance</h4>
              <p className="text-xs text-zinc-500">
                User: <span className="font-semibold text-zinc-300">{editUser.name}</span> ({editUser.email})
              </p>
              
              <hr className="border-zinc-850" />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Credits Amount</label>
                <input
                  type="number"
                  defaultValue={editUser.credits}
                  id="admin_credits_input"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-brand-purple rounded-xl text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              <button
                onClick={() => {
                  const val = parseInt(document.getElementById('admin_credits_input').value);
                  handleUpdateCredits(editUser.id, val);
                }}
                className="w-full py-3 bg-brand-purple hover:bg-brand-purple/95 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Apply Balance Update
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
