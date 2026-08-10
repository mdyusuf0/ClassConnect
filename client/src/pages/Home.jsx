import React, { useEffect, useState } from 'react';
import { getHealthCheck } from '../api/client';
import { Activity, CheckCircle2, Server, Shield, Zap, RefreshCw } from 'lucide-react';

export default function Home() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHealthCheck();
      setHealth(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl space-y-8">
        {/* Hero Banner */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold">
            <Zap className="w-4 h-4 text-indigo-400" /> Full-Stack Architecture Initialized
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">ClassConnect</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            High-performance course selling platform with live classes, sequential unit progression, anti-piracy streaming, and referral payouts.
          </p>
        </div>

        {/* Backend Health Check Verification Box */}
        <div className="card glass-panel shadow-2xl p-8 rounded-2xl border border-white/10 text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <Server className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Backend Health Check</h3>
                <p className="text-xs text-slate-400">Real-time status ping to Express TypeScript API</p>
              </div>
            </div>
            <button
              onClick={fetchHealth}
              disabled={loading}
              className="btn btn-sm btn-ghost btn-circle text-slate-400 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8 text-slate-400 gap-3">
              <span className="loading loading-spinner loading-md text-indigo-500"></span>
              <span>Pinging Express API server...</span>
            </div>
          ) : error ? (
            <div className="alert alert-error bg-red-950/40 border border-red-500/30 text-red-300 rounded-xl">
              <Activity className="w-5 h-5" />
              <div>
                <h4 className="font-bold">Connection Failed</h4>
                <p className="text-xs">{error}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-sm font-medium text-slate-300">Status Response</span>
                <div className="badge badge-success gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" /> {health?.status || 'OK'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                  <span className="text-slate-500 block mb-1">Service Identifier</span>
                  <span className="font-mono text-slate-200">{health?.service}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
                  <span className="text-slate-500 block mb-1">Timestamp</span>
                  <span className="font-mono text-slate-200">{health?.timestamp}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Phase Checklist Badge */}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" /> React 18 + Vite
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" /> Express + TypeScript
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" /> Tailwind + DaisyUI
          </span>
        </div>
      </div>
    </div>
  );
}
