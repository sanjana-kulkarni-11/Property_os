import React, { useState } from 'react';
import { User } from '../../types';
import { portfolioStore } from '../../services/api';
import {
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  Sparkles,
  Building2,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onSuccess: (user: User) => void;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('demo@propertyos.com');
  const [password, setPassword] = useState('Demo@123');
  const [name, setName] = useState('Alex Vance');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (!email.includes('@')) {
        setError('Please provide a valid email address.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must contain at least 6 characters.');
        setLoading(false);
        return;
      }

      const user = portfolioStore.login(email);
      setLoading(false);
      onSuccess(user);
    }, 400);
  };

  const handle1ClickDemo = () => {
    setEmail('demo@propertyos.com');
    setPassword('Demo@123');
    setLoading(true);
    setTimeout(() => {
      const user = portfolioStore.login('demo@propertyos.com');
      setLoading(false);
      onSuccess(user);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Ambient Backdrop */}
      <div className="fixed inset-0 bg-[#07080a]/95 backdrop-blur-xl" />

      {/* Auth Card - Ferrari SF90 Inspired High-Precision Design */}
      <div className="relative w-full max-w-md bg-[#0b0e14] border border-zinc-800 rounded-3xl p-8 shadow-2xl z-10 space-y-6">
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-rose-600 to-zinc-900 flex items-center justify-center shadow-lg shadow-rose-950/60 ring-1 ring-rose-500/40">
            <span className="font-mono text-base font-black text-white tracking-widest">OS</span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-white tracking-tight">
            PROPERTYOS
          </h2>
          <p className="text-xs text-zinc-400">
            One intelligent command center for your entire property portfolio.
          </p>
        </div>

        {/* 1-Click Demo Account Quick Fill Button (Prompt Requirement) */}
        <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/50 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-rose-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Instant Demo Account</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Pre-seeded</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            demo@propertyos.com · Demo@123
          </div>
          <button
            type="button"
            onClick={handle1ClickDemo}
            className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-950/60 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Launch Demo Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-zinc-800 w-full" />
          <span className="bg-[#0b0e14] px-3 text-[10px] font-mono text-zinc-500 uppercase">
            Or Sign In With Credentials
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="text-zinc-400 block mb-1">Full Legal Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Vance"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-zinc-400 block mb-1">Registered Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@vanceholdings.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1">Vault Key / Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-all border border-zinc-700 shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isRegister ? 'Create Account' : 'Authenticate & Enter'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            {isRegister
              ? 'Already have credentials? Sign in'
              : "Don't have an account? Register new portfolio"}
          </button>
        </div>
      </div>
    </div>
  );
};
