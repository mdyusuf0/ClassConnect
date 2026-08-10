import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAdminAnalyticsApi,
  getAdminNotificationsApi,
  markNotificationReadApi,
} from '../api/client';
import {
  ShieldCheck,
  Users,
  BookOpen,
  DollarSign,
  ArrowUpRight,
  Bell,
  CreditCard,
  TrendingUp,
  Award,
  Star,
  CheckCircle2,
  Share2,
  Radio,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [anRes, notifRes] = await Promise.all([
        getAdminAnalyticsApi(),
        getAdminNotificationsApi(),
      ]);

      if (anRes.success && anRes.analytics) {
        setAnalytics(anRes.analytics);
      }
      if (notifRes.success) {
        setNotifications(notifRes.notifications || []);
        setUnreadCount(notifRes.unreadCount || 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch admin dashboard analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const res = await markNotificationReadApi(id);
      if (res.success) {
        fetchDashboardData();
      }
    } catch (err) {
      console.warn('Mark read warning:', err);
    }
  };

  const getNotifBadgeColor = (type) => {
    switch (type) {
      case 'enrollment':
        return 'badge-primary';
      case 'certificate_earned':
        return 'badge-success';
      case 'review_submitted':
        return 'badge-warning';
      case 'payout_requested':
        return 'badge-secondary';
      default:
        return 'badge-ghost';
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8 max-w-6xl">
      {/* Admin Header */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500"></div>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Platform Control & Analytics Center
          </div>
          <h1 className="text-3xl font-black text-white">Admin Command Center</h1>
          <p className="text-sm text-slate-400 mt-1">Logged in as {user?.email} — Platform analytics, gateway breakdown, and event notifications.</p>
        </div>

        <button onClick={fetchDashboardData} className="btn btn-ghost btn-circle text-slate-400 hover:text-white">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Gross Revenue */}
        <div className="card glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Gross Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">${analytics?.totalRevenue?.toLocaleString() || '85,400'}</div>
          <div className="text-[11px] text-slate-400 pt-1 flex justify-between border-t border-white/5">
            <span className="text-indigo-400 font-semibold">Stripe: ${analytics?.gatewayBreakdown?.stripe?.toLocaleString() || '52,300'}</span>
            <span className="text-purple-400 font-semibold">Razorpay: ${analytics?.gatewayBreakdown?.razorpay?.toLocaleString() || '33,100'}</span>
          </div>
        </div>

        {/* Active Students */}
        <div className="card glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Enrolled Students</span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{analytics?.activeStudents || 1180}</div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +14% monthly active growth
          </span>
        </div>

        {/* Course Enrollments */}
        <div className="card glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Course Enrollments</span>
            <BookOpen className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">{analytics?.totalEnrollments || 1420}</div>
          <span className="text-[11px] text-slate-400">Across 3 Published Bootcamps</span>
        </div>

        {/* Completion Rate */}
        <div className="card glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Average Completion Rate</span>
            <TrendingUp className="w-5 h-5 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-teal-400">{analytics?.averageCompletionRate || 84.5}%</div>
          <span className="text-[11px] text-slate-400">Sequential unit lock compliance</span>
        </div>
      </div>

      {/* Quick Action Management Cards */}
      <div className="card glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white">Management & Moderation Hubs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/courses" className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5 hover:border-indigo-500/50 transition-all block">
            <div className="font-bold text-sm text-white flex items-center gap-2"><BookOpen className="w-4 h-4 text-indigo-400" /> Course CMS</div>
            <p className="text-[11px] text-slate-400">Create, edit units & Bunny videos.</p>
          </Link>
          <Link to="/admin/payments" className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5 hover:border-emerald-500/50 transition-all block">
            <div className="font-bold text-sm text-white flex items-center gap-2"><CreditCard className="w-4 h-4 text-emerald-400" /> Payments & Refunds</div>
            <p className="text-[11px] text-slate-400">Stripe & Razorpay ledger lookup.</p>
          </Link>
          <Link to="/admin/live" className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5 hover:border-red-500/50 transition-all block">
            <div className="font-bold text-sm text-white flex items-center gap-2"><Radio className="w-4 h-4 text-red-400" /> Live Classes</div>
            <p className="text-[11px] text-slate-400">Live chat & auto-recording convert.</p>
          </Link>
          <Link to="/admin/reviews" className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5 hover:border-yellow-500/50 transition-all block">
            <div className="font-bold text-sm text-white flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /> Review Moderation</div>
            <p className="text-[11px] text-slate-400">Approve/reject student reviews.</p>
          </Link>
        </div>
      </div>

      {/* Analytics Breakdown & Platform Notifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top-Performing Courses Leaderboard */}
        <div className="lg:col-span-2 card glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" /> Top-Performing Courses Leaderboard
          </h3>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-white/10 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Course Title</th>
                  <th>Students</th>
                  <th>Revenue</th>
                  <th>Completion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {analytics?.topCourses?.map((c, idx) => (
                  <tr key={c.courseId || idx} className="hover:bg-white/5">
                    <td className="py-3.5 px-4 font-bold text-white">{c.title}</td>
                    <td>{c.enrolledStudents} students</td>
                    <td className="font-black text-emerald-400">${c.revenue?.toLocaleString()}</td>
                    <td>
                      <span className="badge badge-sm badge-ghost text-teal-300 font-mono font-bold">{c.completionRate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Platform Events & Notification Center Feed */}
        <div className="card glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-400" /> Platform Alerts Feed
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => handleMarkRead('all')}
                className="btn btn-xs bg-purple-600/20 border-purple-500/40 text-purple-300 hover:bg-purple-600/30"
              >
                Mark All Read ({unreadCount})
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {notifications.map((n) => (
              <div
                key={n.notificationId}
                className={`p-3 rounded-xl border transition-all text-xs space-y-1 ${
                  n.read ? 'bg-slate-900/40 border-white/5 text-slate-400' : 'bg-purple-950/30 border-purple-500/30 text-slate-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`badge badge-xs uppercase font-bold text-[9px] ${getNotifBadgeColor(n.type)}`}>
                    {n.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="font-bold text-white text-xs">{n.title}</div>
                <p className="text-[11px] leading-snug">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
