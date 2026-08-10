import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res.success) {
        if (from) {
          navigate(from, { replace: true });
        } else if (res.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="card glass-panel w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-3 text-indigo-400">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-400 mt-1">Log in to access your courses and learning dashboard</p>
        </div>

        {error && (
          <div className="alert alert-error bg-red-950/40 border border-red-500/30 text-red-300 rounded-xl mb-6 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="input input-bordered w-full pl-10 bg-slate-900/60 text-white placeholder-slate-500 border-white/10 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="form-control">
            <div className="flex justify-between items-center mb-1">
              <label className="label text-xs font-semibold text-slate-300 p-0">Password</label>
              <Link to="/forgot-password" className="text-xs text-indigo-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input input-bordered w-full pl-10 bg-slate-900/60 text-white placeholder-slate-500 border-white/10 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 w-full mt-6 shadow-lg shadow-indigo-500/25"
          >
            {loading ? <span className="loading loading-spinner loading-sm"></span> : (
              <span className="flex items-center justify-center gap-2">
                Sign In <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
            Register & Enroll
          </Link>
        </div>
      </div>
    </div>
  );
}
