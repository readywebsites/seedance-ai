import React, { useState } from 'react';
import { KeyRound, Plus, Trash2, Copy, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function APIKeys() {
  const [keys, setKeys] = useState([
    { id: 'key_01', name: 'Production Pipeline', value: 'sd_live_4f89ac1203bfd7894a', created: '2026-06-01', scope: 'Read & Write' },
    { id: 'key_02', name: 'Testing Sandbox', value: 'sd_test_22e08bc0a2b53a01ff', created: '2026-06-25', scope: 'Read Only' }
  ]);
  const [copiedKey, setCopiedKey] = useState(null);
  const [visibleKey, setVisibleKey] = useState(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState('Read & Write');
  const [showCreate, setShowCreate] = useState(false);

  const handleCreateKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const randomSuffix = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const mockVal = `sd_${newKeyScope === 'Read Only' ? 'test' : 'live'}_${randomSuffix}`;
    const newKey = {
      id: 'key_' + Math.random().toString(36).substring(2, 5),
      name: newKeyName,
      value: mockVal,
      created: new Date().toISOString().split('T')[0],
      scope: newKeyScope
    };

    setKeys([...keys, newKey]);
    setNewKeyName('');
    setShowCreate(false);
  };

  const handleRevokeKey = (id) => {
    if (confirm('Are you sure you want to revoke this API key? Systems relying on it will immediately fail.')) {
      setKeys(keys.filter(k => k.id !== id));
    }
  };

  const handleCopy = (val) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(val);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Block */}
      <GlassCard hoverGlow={false} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6">
        <div className="text-left space-y-2">
          <h3 className="text-lg font-bold font-heading text-zinc-100 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-brand-purple" />
            <span>Developer API Keys</span>
          </h3>
          <p className="text-zinc-400 text-xs max-w-lg leading-relaxed">
            Integrate Seedance Video Generation Engine directly into your scripts, Discord bots, or video pipelines. Protect these keys and do not expose them on the client side.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2.5 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Create Key</span>
        </button>
      </GlassCard>

      {/* Keys List */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 font-heading text-left">Active Keys</h3>
        {keys.length === 0 ? (
          <GlassCard className="flex flex-col items-center justify-center text-center h-[200px] text-zinc-500 gap-3">
            <KeyRound className="w-8 h-8 opacity-30 text-brand-purple" />
            <span className="text-xs font-semibold text-zinc-400">No active keys</span>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {keys.map((k) => (
              <GlassCard key={k.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-zinc-200">{k.name}</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 text-[9px] font-mono">
                      Scope: {k.scope}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono bg-zinc-950 py-1.5 px-3 border border-zinc-900 rounded-lg text-zinc-400 block min-w-[240px]">
                      {visibleKey === k.id ? k.value : '••••••••••••••••••••••••••••••••'}
                    </span>
                    <button
                      onClick={() => setVisibleKey(visibleKey === k.id ? null : k.id)}
                      className="p-2 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg cursor-pointer"
                      title="Reveal Key"
                    >
                      {visibleKey === k.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleCopy(k.value)}
                      className="p-2 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg cursor-pointer"
                      title="Copy Key"
                    >
                      {copiedKey === k.value ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 self-end sm:self-center">
                  <span>Created: {k.created}</span>
                  <button
                    onClick={() => handleRevokeKey(k.id)}
                    className="p-2 border border-red-500/10 hover:border-red-500/30 bg-red-500/5 hover:bg-red-500/15 text-red-400 rounded-lg cursor-pointer"
                    title="Revoke Key"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Create Key Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <GlassCard className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <button
              onClick={() => setShowCreate(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <form onSubmit={handleCreateKey} className="text-left space-y-4">
              <h4 className="text-base font-bold text-zinc-200">Create Developer Key</h4>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Key Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Production Mobile App"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-brand-purple rounded-xl text-xs text-zinc-200 focus:outline-none placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Scope permissions</label>
                <select
                  value={newKeyScope}
                  onChange={(e) => setNewKeyScope(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-brand-purple rounded-xl text-xs text-zinc-300 focus:outline-none"
                >
                  <option value="Read & Write">Read & Write (Full generation access)</option>
                  <option value="Read Only">Read Only (Status polling history)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-purple hover:bg-brand-purple/95 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Generate Key
              </button>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
