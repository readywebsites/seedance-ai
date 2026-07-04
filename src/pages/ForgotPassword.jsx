import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Cpu, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import GlassCard from '../components/GlassCard';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { forgotPassword, isLoading } = useAuthStore();
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      setSuccess(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] radial-glow-purple opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] radial-glow-magenta opacity-35 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-purple/10 border border-brand-purple/20 rounded-xl text-brand-purple">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight text-gradient">SEEDANCE AI</span>
          </Link>
          <h2 className="text-xl font-heading font-bold text-zinc-100">Reset Password</h2>
          <p className="text-zinc-500 text-xs mt-1">We'll send you link instructions to reset your password.</p>
        </div>

        <GlassCard className="p-8 border-zinc-800/80 bg-zinc-900/60 shadow-2xl">
          {success ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-zinc-100">Check Your Email</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                If the email exists, we've sent reset instructions. Please check your junk or spam folders if you don't receive it shortly.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-purple hover:text-brand-purple/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Login</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className={`w-full pl-10 pr-4 py-3 bg-zinc-950 border rounded-xl text-sm text-zinc-200 focus:outline-none transition-all placeholder:text-zinc-600 ${
                      errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-brand-purple'
                    }`}
                    placeholder="name@company.com"
                  />
                </div>
                {errors.email && (
                  <span className="text-[10px] text-red-400 font-medium">{errors.email.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-brand-purple hover:bg-brand-purple/95 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
