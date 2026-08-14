import React, { useState } from 'react';
import { X, Lock, Mail, User, Building, AlertCircle, Loader2 } from 'lucide-react';
import { signUpWithEmail, logInWithEmail, logInWithGoogle } from '../services/authService';

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
  const [role, setRole] = useState<'renter' | 'landlord'>(initialMode === 'manage' ? 'landlord' : 'renter');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await signUpWithEmail(email, password, name, role);
        onSuccess(email, 'signup');
      } else {
        // login or manage portal login
        await logInWithEmail(email, password);
        onSuccess(email, mode);
      }
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please log in.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const user = await logInWithGoogle();
      if (user.email) {
        onSuccess(user.email, 'google');
      }
      onClose();
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
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
            {mode === 'login' ? 'Sign In to Your Account' : mode === 'signup' ? 'Create Your Account' : 'Landlord & Property Portal'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'manage'
              ? 'List properties, track rental leads, and manage tenant applications'
              : 'Save your favorite properties, manage tour bookings, and sync across devices'}
          </p>
        </div>

        <div className="p-6 space-y-4 text-sm">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Social Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 transition cursor-pointer shadow-xs disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-2 text-[11px] text-slate-400 uppercase font-bold tracking-wider absolute">
              or with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <>
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">I am a</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setRole('renter')}
                      className={`py-2 px-3 rounded-md border text-center font-medium transition cursor-pointer ${
                        role === 'renter'
                          ? 'border-red-600 bg-red-50/50 text-red-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Renter / Home Seeker
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('landlord')}
                      className={`py-2 px-3 rounded-md border text-center font-medium transition cursor-pointer ${
                        role === 'landlord'
                          ? 'border-red-600 bg-red-50/50 text-red-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Property Manager / Owner
                    </button>
                  </div>
                </div>
              </>
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
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-md pl-9 pr-3 py-2 outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-2.5 rounded-md transition text-sm shadow-xs cursor-pointer mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Free Account' : 'Enter Management Portal'}
              </span>
            </button>

            <div className="pt-2 text-center text-xs text-slate-500">
              {mode === 'login' ? (
                <p>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMsg(null);
                    }}
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
                    onClick={() => {
                      setMode('login');
                      setErrorMsg(null);
                    }}
                    className="text-red-600 font-semibold hover:underline cursor-pointer"
                  >
                    Log in
                  </button>
                </p>
              ) : (
                <p>
                  Need renter login instead?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg(null);
                    }}
                    className="text-red-600 font-semibold hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
