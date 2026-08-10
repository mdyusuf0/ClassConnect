import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPasswordApi } from '../api/client';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordApi({ token, newPassword });
      if (res.success) {
        setMessage(res.message);
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="card glass-panel w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-3 text-indigo-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Set New Password</h2>
          <p className="text-xs text-slate-400 mt-1">Enter your new secure password below</p>
        </div>

        {error && (
          <div className="alert alert-error bg-red-950/40 border border-red-500/30 text-red-300 rounded-xl mb-4 text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {message ? (
          <div className="space-y-4">
            <div className="alert alert-success bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message} Redirecting to login...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label text-xs font-semibold text-slate-300">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 bg-slate-900/60 text-white placeholder-slate-500 border-white/10 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label text-xs font-semibold text-slate-300">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 bg-slate-900/60 text-white placeholder-slate-500 border-white/10 focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="btn bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 w-full mt-4 shadow-lg shadow-indigo-500/25"
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Update Password'}
            </button>
          </form>
        )}

        <div className="text-center mt-6 text-xs text-slate-400">
          <Link to="/login" className="text-indigo-400 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
