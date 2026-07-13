import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, ShieldAlert, Cpu } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import GlassCard from '../components/GlassCard';

export default function Profile() {
  const { user, updateProfile, isLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  });
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState('');

  const onSubmit = async (data) => {
    setSuccess(false);
    setErr('');
    try {
      const ok = await updateProfile(data);
      if (ok) {
        setSuccess(true);
      } else {
        setErr('Profile update failed.');
      }
    } catch (e) {
      setErr(e.message || 'Error occurred.');
    }
  };

  return (
    <div className="max-w-2xl text-left space-y-6">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 font-heading">User Settings</h2>
        <span className="text-xs text-zinc-500">Edit your core profile credentials.</span>
      </div>

      <GlassCard className="p-6 md:p-8 bg-zinc-900/40">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold">
              Profile updated successfully!
            </div>
          )}
          {err && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-semibold">
              {err}
            </div>
          )}

          {/* Profile Picture Mock */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-purple to-brand-magenta flex items-center justify-center font-extrabold text-xl text-white shadow-lg border border-brand-purple/20">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-200 block mb-1">Avatar</span>
              <span className="text-[10px] text-zinc-500 block leading-relaxed">
                Profile picture is fetched automatically using Gravatar or OAuth provider image.
              </span>
            </div>
          </div>

          <hr className="border-zinc-800" />

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className={`w-full pl-10 pr-4 py-3 bg-zinc-950 border rounded-xl text-xs text-zinc-200 focus:outline-none transition-all placeholder:text-zinc-650 ${
                  errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-brand-purple'
                }`}
              />
            </div>
            {errors.name && (
              <span className="text-[10px] text-red-400 font-medium">{errors.name.message}</span>
            )}
          </div>

          {/* Email */}
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
                className={`w-full pl-10 pr-4 py-3 bg-zinc-950 border rounded-xl text-xs text-zinc-200 focus:outline-none transition-all placeholder:text-zinc-650 ${
                  errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-brand-purple'
                }`}
              />
            </div>
            {errors.email && (
              <span className="text-[10px] text-red-400 font-medium">{errors.email.message}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-brand-purple hover:bg-brand-purple/95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isLoading ? 'Saving Changes...' : 'Save Profile'}</span>
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
