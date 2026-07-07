import React, { useState } from 'react';
import { CreditCard, Sparkles, CheckCircle2, ShieldCheck, HelpCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import GlassCard from '../components/GlassCard';

export default function Billing() {
  const { user, addCredits } = useAuthStore();
  const [loadingGateway, setLoadingGateway] = useState(''); // '', 'stripe', 'razorpay'
  const [selectedTopup, setSelectedTopup] = useState(null); // { name, credits, price }
  const [successMsg, setSuccessMsg] = useState('');

  const plans = [
    { name: "Free", price: "$0", credits: 1000, desc: "Basic test drive", highlight: false },
    { name: "Starter", price: "$19", credits: 300, desc: "For creators & designers", highlight: false },
    { name: "Pro", price: "$49", credits: 1000, desc: "For professional studios", highlight: true },
    { name: "Business", price: "$149", credits: 4000, desc: "For custom pipelines", highlight: false }
  ];

  const topups = [
    { name: "Micro Pack", credits: 100, price: "$5" },
    { name: "Studio Pack", credits: 500, price: "$20" },
    { name: "Producer Pack", credits: 1500, price: "$50" }
  ];

  const handleCheckout = (gateway, credits, name) => {
    setLoadingGateway(gateway);
    setSuccessMsg('');

    // Simulate Payment Request
    setTimeout(() => {
      addCredits(credits);
      setSuccessMsg(`Simulated Payment Completed! Purchased "${name}". ${credits} credits added to your profile.`);
      setLoadingGateway('');
      setSelectedTopup(null);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Current plan and notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium text-left flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Plan stats block */}
      <GlassCard hoverGlow={false} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6">
        <div className="text-left space-y-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Active Subscription</span>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold font-heading text-zinc-100">Pro Plan</h3>
            <span className="px-2.5 py-0.5 rounded bg-brand-purple/20 border border-brand-purple/30 text-brand-purple text-[10px] font-extrabold uppercase tracking-wide">
              Active
            </span>
          </div>
          <p className="text-zinc-400 text-xs max-w-md">
            Your plan renews on <span className="font-semibold text-zinc-300">August 3, 2026</span> for $49. Credits replenish to 1,000 monthly.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-zinc-950 p-4 border border-zinc-900 rounded-xl">
          <div className="text-left">
            <span className="text-[10px] text-zinc-500 block uppercase tracking-wider font-semibold">Available Balance</span>
            <span className="text-3xl font-extrabold font-heading text-zinc-100 font-mono">{user?.credits ?? 0}</span>
          </div>
          <span className="text-xs text-zinc-500 font-semibold">credits</span>
        </div>
      </GlassCard>

      {/* Subscription Plans */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 font-heading text-left">Upgrade Subscription</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                p.highlight
                  ? 'bg-zinc-900 border border-brand-purple/60 shadow-xl shadow-brand-purple/5'
                  : 'bg-zinc-900/60 border border-zinc-800/80'
              }`}
            >
              <div className="text-left">
                <span className="text-xs text-zinc-500 uppercase tracking-wider block font-semibold mb-1">{p.name}</span>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-2xl font-bold font-heading text-white">{p.price}</span>
                  <span className="text-zinc-500 text-xs">/ mo</span>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed mb-4">{p.desc}</p>
                <div className="px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg text-xs font-semibold flex justify-between text-zinc-300 mb-6">
                  <span>Credits:</span>
                  <span className="text-brand-magenta font-mono font-bold">{p.credits}</span>
                </div>
              </div>

              <button
                onClick={() => handleCheckout('stripe', p.credits, `${p.name} Subscription`)}
                disabled={loadingGateway !== ''}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  p.highlight
                    ? 'bg-brand-purple hover:bg-brand-purple/95 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700/80 text-zinc-200'
                }`}
              >
                {loadingGateway ? 'Checking out...' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Top-ups */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 font-heading text-left">Buy Extra Credits (One-Time)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topups.map((t, idx) => (
            <GlassCard key={idx} className="flex flex-col justify-between h-[180px] p-5">
              <div className="text-left flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-zinc-200 mb-1">{t.name}</h4>
                  <span className="text-[10px] text-zinc-500 block leading-relaxed">Instantly add extra tokens to your active pool.</span>
                </div>
                <span className="text-lg font-extrabold font-heading text-brand-cyan">{t.price}</span>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-brand-magenta font-bold font-mono text-sm">+{t.credits} credits</span>
                <button
                  onClick={() => setSelectedTopup(t)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 hover:border-zinc-650 text-zinc-300 hover:text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Buy Pack
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Checkout Gateway Selector Modal */}
      {selectedTopup && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <GlassCard className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <button
              onClick={() => setSelectedTopup(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <div className="text-center space-y-4 py-4">
              <CreditCard className="w-10 h-10 text-brand-purple mx-auto" />
              <div>
                <h4 className="text-base font-bold text-zinc-200">Checkout</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  You are purchasing <span className="font-semibold text-zinc-300">{selectedTopup.name}</span> for {selectedTopup.price}.
                </p>
              </div>

              <hr className="border-zinc-800" />

              <div className="space-y-3">
                <button
                  onClick={() => handleCheckout('stripe', selectedTopup.credits, selectedTopup.name)}
                  disabled={loadingGateway !== ''}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loadingGateway === 'stripe' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Pay with Stripe</span>
                  )}
                </button>

                <button
                  onClick={() => handleCheckout('razorpay', selectedTopup.credits, selectedTopup.name)}
                  disabled={loadingGateway !== ''}
                  className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loadingGateway === 'razorpay' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Pay with Razorpay</span>
                  )}
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
