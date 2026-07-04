import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Cpu, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import GlassCard from '../components/GlassCard';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isLoading, error: authError } = useAuthStore();
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState('');
  const [generalError, setGeneralError] = useState('');

  const onSubmit = async (data) => {
    setSuccessMsg('');
    setGeneralError('');
    try {
      const success = await registerUser(data.email, data.password, data.name);
      if (success) {
        setSuccessMsg('Account created successfully! Check your inbox for verification email (or sign in directly for mock testing).');
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } else {
        setGeneralError('Registration failed. Try a different email.');
      }
    } catch (err) {
      setGeneralError(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] radial-glow-purple opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] radial-glow-magenta opacity-35 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-purple/10 border border-brand-purple/20 rounded-xl text-brand-purple">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight text-gradient">SEEDANCE AI</span>
          </Link>
          <h2 className="text-xl font-heading font-bold text-zinc-100">Create Your Account</h2>
          <p className="text-zinc-500 text-xs mt-1">Get 20 free credits and start generating instant videos.</p>
        </div>

        <GlassCard className="p-8 border-zinc-800/80 bg-zinc-900/60 shadow-2xl">
          {successMsg ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-heading font-bold text-zinc-100">Almost There!</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">{successMsg}</p>
              <Link
                to="/login"
                className="inline-block px-6 py-2.5 bg-brand-purple hover:bg-brand-purple/95 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Proceed to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Error messages */}
              {(authError || generalError) && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
                  {generalError || authError}
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className={`w-full pl-10 pr-4 py-3 bg-zinc-950 border rounded-xl text-sm text-zinc-200 focus:outline-none transition-all placeholder:text-zinc-600 ${
                      errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-brand-purple'
                    }`}
                    placeholder="Alex Mercer"
                  />
                </div>
                {errors.name && (
                  <span className="text-[10px] text-red-400 font-medium">{errors.name.message}</span>
                )}
              </div>

              {/* Email Field */}
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

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    className={`w-full pl-10 pr-10 py-3 bg-zinc-950 border rounded-xl text-sm text-zinc-200 focus:outline-none transition-all placeholder:text-zinc-600 ${
                      errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-brand-purple'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-[10px] text-red-400 font-medium">{errors.password.message}</span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-brand-purple hover:bg-brand-purple/95 text-white font-bold rounded-xl shadow-lg shadow-brand-purple/15 hover:shadow-brand-purple/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <div className="text-xs text-zinc-500">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-purple hover:text-brand-purple/80 font-semibold transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
