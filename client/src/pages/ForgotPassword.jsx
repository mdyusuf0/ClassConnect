import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordApi } from '../api/client';
import { KeyRound, Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetTokenStub, setResetTokenStub] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await forgotPasswordApi({ email });
      if (res.success) {
        setMessage(res.message);
        if (res.resetToken) {
          setResetTokenStub(res.resetToken);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Request failed.');
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
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Reset Your Password</h2>
          <p className="text-xs text-slate-400 mt-1">Enter your registered email to receive password reset instructions</p>
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
              <span>{message}</span>
            </div>

            {resetTokenStub && (
              <div className="p-4 bg-slate-900/80 rounded-xl border border-white/10 text-xs space-y-2">
                <span className="text-slate-400 block font-semibold">Dev Test Reset Link Generated:</span>
                <Link
                  to={`/reset-password?token=${resetTokenStub}`}
                  className="text-indigo-400 underline break-all hover:text-indigo-300 font-mono"
                >
                  /reset-password?token={resetTokenStub}
                </Link>
              </div>
            )}

            <Link to="/login" className="btn btn-outline border-white/10 text-white w-full">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label text-xs font-semibold text-slate-300">Registered Email</label>
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

            <button
              type="submit"
              disabled={loading}
              className="btn bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 w-full mt-4 shadow-lg shadow-indigo-500/25"
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Send Reset Instructions'}
            </button>
          </form>
        )}

        <div className="text-center mt-6 text-xs text-slate-400">
          <Link to="/login" className="inline-flex items-center gap-1 text-slate-400 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
