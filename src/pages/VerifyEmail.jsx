import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Cpu, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import GlassCard from '../components/GlassCard';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail } = useAuthStore();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    const triggerVerify = async () => {
      if (!token) {
        setStatus('error');
        return;
      }
      try {
        const success = await verifyEmail(token);
        if (success) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        setStatus('error');
      }
    };

    const delayTimer = setTimeout(() => {
      triggerVerify();
    }, 2000); // 2s simulated loading state

    return () => clearTimeout(delayTimer);
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] radial-glow-purple opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] radial-glow-magenta opacity-35 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-purple/10 border border-brand-purple/20 rounded-xl text-brand-purple">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight text-gradient">SEEDANCE AI</span>
          </div>
          <h2 className="text-xl font-heading font-bold text-zinc-100">Verify Email</h2>
          <p className="text-zinc-500 text-xs mt-1">Authenticating your creator account.</p>
        </div>

        <GlassCard className="p-8 border-zinc-800/80 bg-zinc-900/60 shadow-2xl text-center">
          {status === 'verifying' && (
            <div className="py-6 space-y-4 flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-brand-purple animate-spin" />
              <h3 className="text-base font-semibold text-zinc-200">Verifying your token...</h3>
              <p className="text-zinc-500 text-xs">This takes just a moment.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-4 space-y-6 flex flex-col items-center">
              <CheckCircle2 className="w-14 h-14 text-emerald-500" />
              <div className="space-y-2">
                <h3 className="text-lg font-heading font-bold text-zinc-100">Verification Successful!</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Your email has been verified. You can now access all generation tools and features.
                </p>
              </div>
              <Link
                to="/login"
                className="w-full py-3 bg-brand-purple hover:bg-brand-purple/95 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Sign In to Dashboard
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="py-4 space-y-6 flex flex-col items-center">
              <AlertCircle className="w-14 h-14 text-rose-500" />
              <div className="space-y-2">
                <h3 className="text-lg font-heading font-bold text-zinc-100">Verification Failed</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-medium">
                  The verification link was invalid, expired, or missing parameters.
                </p>
              </div>
              <Link
                to="/register"
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Sign Up for New Link
              </Link>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
