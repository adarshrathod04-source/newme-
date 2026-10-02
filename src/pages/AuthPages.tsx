import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { ShieldCheck, User, Lock, Mail, Phone, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthPagesProps {
  initialMode?: 'login' | 'register' | 'forgot' | 'reset';
  onNavigate: (path: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ initialMode = 'login', onNavigate }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialMode);
  const { login, register } = useAuth();

  // Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      onNavigate('/account');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, phone, password);
      onNavigate('/account');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.forgotPassword(email);
      setSuccessMsg(res.message);
      setMode('reset');
    } catch (err: any) {
      setError(err.message || 'Could not process password reset');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.resetPassword(email, newPassword);
      setSuccessMsg('Password successfully changed. You can now log in.');
      setTimeout(() => {
        setMode('login');
        setSuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  // Fast Fill for testing
  const fastFill = (role: 'ADMIN' | 'STAFF' | 'CUSTOMER') => {
    if (role === 'ADMIN') {
      setEmail('admin@newme.asia');
      setPassword('admin123');
    } else if (role === 'STAFF') {
      setEmail('staff@newme.asia');
      setPassword('staff123');
    } else {
      setEmail('priya@example.com');
      setPassword('customer123');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] py-16 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white border border-[#E1ECE5] rounded-xl p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <button
              onClick={() => onNavigate('/')}
              className="font-serif text-3xl font-bold tracking-tight text-[#111815] hover:text-[#134E35]"
            >
              NEWME
            </button>
            <p className="text-xs font-bold uppercase tracking-widest text-[#134E35]">
              Phoenix Marketcity Pune
            </p>
            <h2 className="font-serif text-2xl font-bold text-[#111815] pt-1">
              {mode === 'login'
                ? 'Sign In to Your Account'
                : mode === 'register'
                ? 'Create Customer Account'
                : mode === 'forgot'
                ? 'Reset Your Password'
                : 'Enter New Password'}
            </h2>
          </div>

          {error && (
            <div className="p-3.5 bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-[#DCFCE7] border border-[#86EFAC] text-[#166534] text-xs rounded-md flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Demo Logins Bar */}
          {mode === 'login' && (
            <div className="p-3 bg-[#F2F7F4] border border-[#D5E5DB] rounded text-[11px] space-y-1.5">
              <span className="font-bold text-[#134E35] block">Quick Test Credentials:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => fastFill('ADMIN')}
                  className="px-2 py-1 bg-white border border-[#CBDAD1] rounded text-[#111815] font-semibold hover:border-[#134E35] cursor-pointer"
                >
                  Admin (Store Director)
                </button>
                <button
                  type="button"
                  onClick={() => fastFill('STAFF')}
                  className="px-2 py-1 bg-white border border-[#CBDAD1] rounded text-[#111815] font-semibold hover:border-[#134E35] cursor-pointer"
                >
                  Staff (Stylist)
                </button>
                <button
                  type="button"
                  onClick={() => fastFill('CUSTOMER')}
                  className="px-2 py-1 bg-white border border-[#CBDAD1] rounded text-[#111815] font-semibold hover:border-[#134E35] cursor-pointer"
                >
                  Customer (Priya)
                </button>
              </div>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-sm text-[#111815] focus:outline-none focus:border-[#134E35]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-[#134E35] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-sm text-[#111815] focus:outline-none focus:border-[#134E35]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-xs font-bold uppercase tracking-widest text-white bg-[#134E35] hover:bg-[#0A2419] disabled:opacity-50 rounded transition-colors shadow-xs cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>

              <div className="pt-2 text-center text-xs text-[#52665A]">
                <span>Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-[#134E35] font-bold hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-sm text-[#111815] focus:outline-none focus:border-[#134E35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="radhika@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-sm text-[#111815] focus:outline-none focus:border-[#134E35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-sm text-[#111815] focus:outline-none focus:border-[#134E35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-sm text-[#111815] focus:outline-none focus:border-[#134E35]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-xs font-bold uppercase tracking-widest text-white bg-[#134E35] hover:bg-[#0A2419] disabled:opacity-50 rounded transition-colors shadow-xs cursor-pointer"
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>

              <div className="pt-2 text-center text-xs text-[#52665A]">
                <span>Already registered? </span>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#134E35] font-bold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* Forgot Password */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <p className="text-xs text-[#52665A]">
                Enter your registered email address and we'll send a password recovery reset confirmation.
              </p>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-sm text-[#111815] focus:outline-none focus:border-[#134E35]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-xs font-bold uppercase tracking-widest text-white bg-[#134E35] hover:bg-[#0A2419] disabled:opacity-50 rounded transition-colors shadow-xs cursor-pointer"
              >
                {loading ? 'Sending...' : 'Request Reset Link'}
              </button>

              <div className="pt-2 text-center text-xs">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#52665A] hover:text-[#111815]"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Reset Password */}
          {mode === 'reset' && (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-sm text-[#111815]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-sm text-[#111815] focus:outline-none focus:border-[#134E35]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-xs font-bold uppercase tracking-widest text-white bg-[#134E35] hover:bg-[#0A2419] disabled:opacity-50 rounded transition-colors shadow-xs cursor-pointer"
              >
                {loading ? 'Updating...' : 'Set New Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
