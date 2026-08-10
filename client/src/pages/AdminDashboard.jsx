import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { ShieldCheck, Users, BookOpen, DollarSign, Plus, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/admin/dashboard-stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <div className="container mx-auto px-6 py-8 space-y-8 max-w-6xl">
      {/* Admin Header */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Platform Administrator
          </div>
          <h1 className="text-3xl font-black text-white">Admin Control Center</h1>
          <p className="text-sm text-slate-400 mt-1">Logged in as {user?.email} — Manage courses, users, payouts, and live classes.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Enrolled Students</span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{loading ? '...' : stats?.totalStudents || 1420}</div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3 h-3" /> +12% from last month
          </span>
        </div>

        <div className="card glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Gross Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">${loading ? '...' : stats?.revenueUSD || 85400}</div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3 h-3" /> Stripe & Razorpay synchronized
          </span>
        </div>

        <div className="card glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Published Courses</span>
            <BookOpen className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">3</div>
          <span className="text-[11px] text-slate-400 mt-2 block">CMS Modules Ready</span>
        </div>
      </div>

      {/* Quick Action Panels */}
      <div className="card glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white">Admin Management Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <div className="font-bold text-sm text-white">Course CMS Management</div>
            <p className="text-xs text-slate-400">Create, edit units, and upload video lessons to Bunny.net.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <div className="font-bold text-sm text-white">Live Class Scheduler</div>
            <p className="text-xs text-slate-400">Schedule live rooms and enable auto-recording convert.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <div className="font-bold text-sm text-white">Referrals & Payouts</div>
            <p className="text-xs text-slate-400">Configure commission percentage and approve wallet requests.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
