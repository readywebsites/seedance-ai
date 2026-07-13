import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Cpu, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import GlassCard from '../components/GlassCard';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error: authError } = useAuthStore();
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState('');

  const onSubmit = async (data) => {
    setGeneralError('');
    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setGeneralError('Invalid email or password.');
      }
    } catch (err) {
      setGeneralError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] radial-glow-purple opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] radial-glow-magenta opacity-35 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Intro */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-purple/10 border border-brand-purple/20 rounded-xl text-brand-purple">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight text-gradient">SEEDANCE AI</span>
          </Link>
          <h2 className="text-xl font-heading font-bold text-zinc-100">Welcome Back</h2>
          <p className="text-zinc-500 text-xs mt-1">Enter your credentials to access your creator dashboard.</p>
        </div>

        <GlassCard className="p-8 border-zinc-800/80 bg-zinc-900/60 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Display errors */}
            {(authError || generalError) && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
                {generalError || authError}
              </div>
            )}

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
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand-purple hover:text-brand-purple/80 font-medium transition-colors">
                  Forgot Password?
                </Link>
              </div>
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
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Oauth (Optional) & Register Link */}
          <div className="mt-6 text-center space-y-4">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink mx-4 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Or Continue With</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <button
              onClick={() => onSubmit({ email: 'google-auth@seedance.ai', password: 'google_mock_pass' })}
              className="w-full py-2.5 bg-zinc-950 border border-zinc-800 hover:bg-zinc-900/60 rounded-xl text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="text-xs text-zinc-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-purple hover:text-brand-purple/80 font-semibold transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
