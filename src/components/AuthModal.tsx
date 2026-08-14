import React, { useState } from 'react';
import { X, Lock, Mail, User, Building } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup' | 'manage';
  onSuccess: (email: string, mode: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'manage'>(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(email || 'user@example.com', mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="auth-modal"
        className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="bg-slate-900 text-white p-6 relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-md flex items-center justify-center transition cursor-pointer border border-slate-700"
            aria-label="Close authentication modal"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-md flex items-center justify-center mb-3 text-red-500">
            {mode === 'manage' ? <Building className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </div>
          <h3 className="text-xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Your Account' : 'Landlord & Property Portal'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'manage'
              ? 'List properties, track rental leads, and manage tenant applications'
              : 'Save favorite properties, schedule instant tours, and track inquiries'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-300 rounded-md pl-9 pr-3 py-2 outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium text-slate-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-md pl-9 pr-3 py-2 outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-md pl-9 pr-3 py-2 outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-2.5 rounded-md transition text-sm shadow-xs cursor-pointer mt-2"
          >
            {mode === 'login' ? 'Sign In to RentHub' : mode === 'signup' ? 'Create Account' : 'Enter Management Portal'}
          </button>

          <div className="pt-2 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-red-600 font-semibold hover:underline cursor-pointer"
                >
                  Sign up free
                </button>
              </p>
            ) : mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-red-600 font-semibold hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </p>
            ) : (
              <p>
                Need tenant login instead?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-red-600 font-semibold hover:underline cursor-pointer"
                >
                  Resident Sign in
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
