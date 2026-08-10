import React, { useEffect, useState } from 'react';
import logger from '../../utils/logger';
import {
  getAdminCoursesApi,
  getAdminReferralSettingsApi,
  updateAdminReferralSettingsApi,
  getAdminPayoutsApi,
  processAdminPayoutApi,
} from '../../api/client';
import { Share2, Settings, Wallet, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminReferrals() {
  const [activeTab, setActiveTab] = useState('payouts'); // 'payouts' | 'settings'

  // Settings state
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [setting, setSetting] = useState({
    referralsEnabled: true,
    commissionType: 'percentage',
    commissionValue: 15,
  });
  const [savingSetting, setSavingSetting] = useState(false);

  // Payouts state
  const [payouts, setPayouts] = useState([]);
  const [loadingPayouts, setLoadingPayouts] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await getAdminCoursesApi();
      if (res.success && res.courses?.length > 0) {
        setCourses(res.courses);
        setSelectedCourseId(res.courses[0]._id || res.courses[0].id);
      }
    } catch (err) {
      logger.warn('Failed to load courses for referral settings:', err);
    }
  };

  const fetchCourseSetting = async (cId) => {
    if (!cId) return;
    try {
      const res = await getAdminReferralSettingsApi(cId);
      if (res.success && res.setting) {
        setSetting(res.setting);
      }
    } catch (err) {
      logger.warn('Failed to load course referral setting:', err);
    }
  };

  const fetchPayouts = async () => {
    setLoadingPayouts(true);
    try {
      const res = await getAdminPayoutsApi();
      if (res.success) {
        setPayouts(res.payoutRequests);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch payout requests');
    } finally {
      setLoadingPayouts(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchPayouts();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchCourseSetting(selectedCourseId);
    }
  }, [selectedCourseId]);

  const handleSaveSetting = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    setSavingSetting(true);
    setError('');

    try {
      const res = await updateAdminReferralSettingsApi(selectedCourseId, setting);
      if (res.success) {
        setSuccessMsg('Course referral commission settings saved successfully.');
      }
    } catch (err) {
      setError(err.message || 'Saving setting failed');
    } finally {
      setSavingSetting(false);
    }
  };

  const handleProcessPayout = async (requestId, status) => {
    const actionName = status === 'approved' ? 'Approve' : 'Reject';
    if (!window.confirm(`${actionName} payout request ${requestId}?`)) return;

    try {
      const res = await processAdminPayoutApi(requestId, { status });
      if (res.success) {
        setSuccessMsg(`Payout request ${requestId} ${status}.`);
        fetchPayouts();
      }
    } catch (err) {
      setError(err.message || 'Payout processing failed');
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Share2 className="w-3.5 h-3.5" /> Referral & CMS Admin
          </div>
          <h1 className="text-2xl font-black text-white">Referral Settings & Payouts</h1>
          <p className="text-xs text-slate-400">Configure per-course referral commission rules and approve wallet payout requests.</p>
        </div>

        {/* Tab Buttons */}
        <div className="join border border-white/10 p-1 rounded-xl bg-slate-900/60">
          <button
            onClick={() => setActiveTab('payouts')}
            className={`join-item btn btn-xs border-0 ${activeTab === 'payouts' ? 'btn-primary' : 'btn-ghost text-slate-400'}`}
          >
            Payout Requests
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`join-item btn btn-xs border-0 ${activeTab === 'settings' ? 'btn-primary' : 'btn-ghost text-slate-400'}`}
          >
            Course Rules CMS
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex justify-between">
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-xs text-emerald-400 hover:underline">Dismiss</button>
        </div>
      )}

      {error && (
        <div className="alert alert-error bg-red-950/40 border border-red-500/30 text-red-300 rounded-xl text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* TAB 1: Payout Requests */}
      {activeTab === 'payouts' && (
        <div className="card glass-panel rounded-2xl border border-white/10 overflow-hidden space-y-4">
          <div className="p-4 bg-slate-900/80 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold text-sm text-white">Student Payout Requests</h3>
            <button onClick={fetchPayouts} className="btn btn-ghost btn-xs text-slate-400 hover:text-white">
              <RefreshCw className={`w-3.5 h-3.5 ${loadingPayouts ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {loadingPayouts ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <span className="loading loading-spinner loading-md text-indigo-500"></span>
            </div>
          ) : payouts.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs italic">No payout requests submitted yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="py-4 px-6">Request ID</th>
                    <th>Student Email</th>
                    <th>Requested Amount</th>
                    <th>Payment Details</th>
                    <th>Status</th>
                    <th className="text-right px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {payouts.map((p) => (
                    <tr key={p.requestId} className="hover:bg-white/5 transition-all">
                      <td className="font-mono font-bold text-indigo-400 py-4 px-6">{p.requestId}</td>
                      <td className="font-semibold text-white">{p.userEmail}</td>
                      <td className="font-black text-emerald-400 text-sm">${p.amount}</td>
                      <td className="max-w-xs truncate text-slate-400">{p.paymentDetails}</td>
                      <td>
                        <span className={`badge badge-sm uppercase font-bold text-[10px] ${
                          p.status === 'approved' ? 'badge-success' : p.status === 'rejected' ? 'badge-error' : 'badge-warning'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="text-right px-6 space-x-2">
                        {p.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleProcessPayout(p.requestId, 'approved')}
                              className="btn btn-xs bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve
                            </button>
                            <button
                              onClick={() => handleProcessPayout(p.requestId, 'rejected')}
                              className="btn btn-xs bg-red-600/20 border-red-500/40 text-red-300 hover:bg-red-600/30 gap-1"
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Course Referral CMS Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSetting} className="card glass-panel p-8 rounded-2xl border border-white/10 space-y-6 max-w-xl mx-auto">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" /> Configure Course Referral Rule
          </h3>

          <div className="form-control">
            <label className="label text-xs font-semibold text-slate-300">Select Target Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="select select-bordered bg-slate-900/60 text-white border-white/10 text-xs"
            >
              {courses.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label text-xs font-semibold text-slate-300">Referral Program Status</label>
            <label className="label cursor-pointer p-3 rounded-xl bg-slate-900/60 border border-white/10 justify-between">
              <span className="text-xs text-slate-300">Enable affiliate commissions for this course</span>
              <input
                type="checkbox"
                checked={setting.referralsEnabled}
                onChange={(e) => setSetting((p) => ({ ...p, referralsEnabled: e.target.checked }))}
                className="toggle toggle-primary"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label text-xs font-semibold text-slate-300">Commission Rule Type</label>
              <select
                value={setting.commissionType}
                onChange={(e) => setSetting((p) => ({ ...p, commissionType: e.target.value }))}
                className="select select-bordered bg-slate-900/60 text-white border-white/10 text-xs"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount ($)</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label text-xs font-semibold text-slate-300">
                {setting.commissionType === 'percentage' ? 'Commission Percentage (%)' : 'Flat Amount ($ USD)'}
              </label>
              <input
                type="number"
                min={0}
                required
                value={setting.commissionValue}
                onChange={(e) => setSetting((p) => ({ ...p, commissionValue: Number(e.target.value) }))}
                className="input input-bordered bg-slate-900/60 text-white border-white/10 text-xs font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingSetting}
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-0 w-full font-bold shadow-lg shadow-indigo-500/20"
          >
            {savingSetting ? <span className="loading loading-spinner loading-sm"></span> : 'Save Referral Rule'}
          </button>
        </form>
      )}
    </div>
  );
}
