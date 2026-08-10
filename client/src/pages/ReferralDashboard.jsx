import React, { useEffect, useState } from 'react';
import { getReferralDashboardApi, requestPayoutApi } from '../api/client';
import { Share2, Copy, Wallet, DollarSign, ArrowUpRight, CheckCircle2, Clock, AlertCircle, Send, Sparkles } from 'lucide-react';

export default function ReferralDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [submittingPayout, setSubmittingPayout] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await getReferralDashboardApi();
      if (res.success) {
        setData(res);
        if (res.wallet?.availableBalance) {
          setPayoutAmount(res.wallet.availableBalance.toString());
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load referral dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCopyLink = () => {
    if (data?.shareableLink) {
      navigator.clipboard.writeText(data.shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handlePayoutSubmit = async (e) => {
    e.preventDefault();
    if (!payoutAmount || !paymentDetails) return;
    setSubmittingPayout(true);
    setError('');

    try {
      const res = await requestPayoutApi({
        amount: Number(payoutAmount),
        paymentDetails,
      });
      if (res.success) {
        setSuccessMsg('Payout request submitted! Admin review in progress.');
        setPayoutModalOpen(false);
        fetchDashboard();
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Payout request failed');
    } finally {
      setSubmittingPayout(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-indigo-500"></span>
      </div>
    );
  }

  const wallet = data?.wallet || { totalEarned: 0, totalPaidOut: 0, pendingPayout: 0, availableBalance: 0 };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8 max-w-6xl">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500"></div>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Share2 className="w-3.5 h-3.5" /> Affiliate & Referral Hub
          </div>
          <h1 className="text-3xl font-black text-white">Referral Rewards Program</h1>
          <p className="text-sm text-slate-400 mt-1">Share your unique code, earn commissions when peers enroll, and request payouts.</p>
        </div>

        <button
          onClick={() => setPayoutModalOpen(true)}
          disabled={wallet.availableBalance <= 0}
          className="btn bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg shadow-emerald-500/25 gap-2 text-xs font-bold shrink-0 disabled:opacity-40"
        >
          <Wallet className="w-4 h-4" /> Request Payout
        </button>
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

      {/* Shareable Link Card */}
      <div className="card glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" /> Your Unique Referral Code & Share Link
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-white/10 text-center font-mono font-black text-lg text-indigo-400 tracking-wider">
            {data?.referralCode}
          </div>
          <div className="md:col-span-2 flex gap-2">
            <input
              type="text"
              readOnly
              value={data?.shareableLink || ''}
              className="input input-bordered flex-1 bg-slate-900/80 text-white font-mono text-xs border-white/10"
            />
            <button
              onClick={handleCopyLink}
              className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-0 text-xs gap-1.5 shrink-0"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      {/* Wallet Balance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="card glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-xs font-semibold text-slate-400">Total Lifetime Commissions</span>
          <div className="text-2xl font-black text-white mt-1">${wallet.totalEarned.toFixed(2)}</div>
        </div>

        <div className="card glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-xs font-semibold text-slate-400">Available Balance</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">${wallet.availableBalance.toFixed(2)}</div>
        </div>

        <div className="card glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-xs font-semibold text-slate-400">Pending Payout Requests</span>
          <div className="text-2xl font-black text-amber-400 mt-1">${wallet.pendingPayout.toFixed(2)}</div>
        </div>

        <div className="card glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-xs font-semibold text-slate-400">Total Paid Out</span>
          <div className="text-2xl font-black text-slate-300 mt-1">${wallet.totalPaidOut.toFixed(2)}</div>
        </div>
      </div>

      {/* Referral History & Payout Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings History Table */}
        <div className="card glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="font-bold text-sm text-white">Referral Commissions History</h3>
          {data?.earningsHistory?.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 text-center">No referrals generated yet. Share your link to start earning!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full text-xs text-left">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-white/10">
                  <tr>
                    <th>Student Email</th>
                    <th>Course</th>
                    <th>Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {data?.earningsHistory?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold text-white">{item.referredUserEmail}</td>
                      <td className="max-w-[140px] truncate">{item.courseTitle}</td>
                      <td className="font-bold text-emerald-400">+${item.commissionAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payout Requests List */}
        <div className="card glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="font-bold text-sm text-white">Payout Requests History</h3>
          {data?.payoutRequests?.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 text-center">No payout requests submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {data?.payoutRequests?.map((req) => (
                <div key={req.requestId} className="p-3 bg-slate-900/60 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">${req.amount}</div>
                    <div className="text-[11px] text-slate-400">{req.paymentDetails}</div>
                  </div>
                  <span className={`badge badge-sm font-bold uppercase text-[10px] ${
                    req.status === 'approved' ? 'badge-success' : req.status === 'rejected' ? 'badge-error' : 'badge-warning'
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payout Request Modal */}
      {payoutModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box glass-panel bg-slate-950 border border-white/10 max-w-md p-6 space-y-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" /> Request Wallet Payout
            </h3>

            <form onSubmit={handlePayoutSubmit} className="space-y-4 text-xs">
              <div className="form-control">
                <label className="label text-slate-300 font-semibold">Payout Amount ($ USD)</label>
                <input
                  type="number"
                  max={wallet.availableBalance}
                  min={1}
                  required
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="input input-bordered bg-slate-900/60 text-white border-white/10 font-bold"
                />
                <span className="text-[10px] text-slate-500 mt-1">Available: ${wallet.availableBalance.toFixed(2)}</span>
              </div>

              <div className="form-control">
                <label className="label text-slate-300 font-semibold">Payment Details (PayPal Email / UPI / Bank Info)</label>
                <textarea
                  required
                  rows={3}
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
                  placeholder="e.g. PayPal: myemail@example.com or UPI: user@okaxis"
                  className="textarea textarea-bordered bg-slate-900/60 text-white border-white/10"
                ></textarea>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setPayoutModalOpen(false)}
                  className="btn btn-ghost text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayout}
                  className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                >
                  {submittingPayout ? <span className="loading loading-spinner loading-xs"></span> : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
