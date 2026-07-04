import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Settings, Lock, Eye, EyeOff, Bell, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function SettingsPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPass, setShowPass] = useState(false);
  const [notifBrowser, setNotifBrowser] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [success, setSuccess] = useState(false);

  const onSubmitPassword = (data) => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleRequestPermission = () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  return (
    <div className="max-w-2xl text-left space-y-6">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 font-heading">Preferences</h2>
        <span className="text-xs text-zinc-500">Configure notifications, security, and rendering defaults.</span>
      </div>

      {/* Notifications Block */}
      <GlassCard className="p-5 space-y-4">
        <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-purple" />
          <span>Notification Settings</span>
        </h3>
        
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-zinc-300 block">Browser Notifications</span>
              <span className="text-[10px] text-zinc-500 block leading-relaxed">Alert when rendering is completed or failed.</span>
            </div>
            <button
              onClick={() => {
                setNotifBrowser(!notifBrowser);
                handleRequestPermission();
              }}
              className="text-brand-purple focus:outline-none cursor-pointer"
            >
              {notifBrowser ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9 text-zinc-600" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-zinc-300 block">Email Alerts</span>
              <span className="text-[10px] text-zinc-500 block leading-relaxed">Get billing and monthly replenish statements.</span>
            </div>
            <button
              onClick={() => setNotifEmail(!notifEmail)}
              className="text-brand-purple focus:outline-none cursor-pointer"
            >
              {notifEmail ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9 text-zinc-600" />}
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Password Change Block */}
      <GlassCard className="p-5">
        <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-purple" />
            <span>Update Password</span>
          </h3>

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
              Password updated successfully!
            </div>
          )}

          {/* Current Password */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Current Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-brand-purple rounded-xl text-xs text-zinc-200 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">New Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: { value: 6, message: "Must be at least 6 characters" }
                })}
                className="w-full px-4 pr-10 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-brand-purple rounded-xl text-xs text-zinc-200 focus:outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <span className="text-[10px] text-red-400 font-medium">{errors.newPassword.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-purple hover:bg-brand-purple/95 text-white font-bold rounded-xl text-xs cursor-pointer"
          >
            Update Security Credentials
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
