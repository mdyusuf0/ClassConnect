import React, { useEffect, useState } from 'react';
import { getAdminPaymentsApi, issueRefundApi } from '../../api/client';
import { DollarSign, Search, CreditCard, RotateCcw, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [search, setSearch] = useState('');
  const [selectedGateway, setSelectedGateway] = useState('All');
  const [refundModalTxn, setRefundModalTxn] = useState(null);
  const [refundReason, setRefundReason] = useState('');
  const [refunding, setRefunding] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await getAdminPaymentsApi();
      if (res.success) {
        setPayments(res.payments);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    if (!refundModalTxn) return;
    setRefunding(true);
    setError('');

    try {
      const res = await issueRefundApi(refundModalTxn.transactionId, { reason: refundReason });
      if (res.success) {
        setSuccessMsg(`Refund issued successfully for transaction ${refundModalTxn.transactionId}`);
        setRefundModalTxn(null);
        setRefundReason('');
        fetchPayments();
      }
    } catch (err) {
      setError(err.message || 'Refund failed');
    } finally {
      setRefunding(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      p.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      p.courseTitle.toLowerCase().includes(search.toLowerCase());
    const matchesGateway = selectedGateway === 'All' || p.gateway === selectedGateway;
    return matchesSearch && matchesGateway;
  });

  return (
    <div className="container mx-auto px-6 py-8 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <DollarSign className="w-3.5 h-3.5" /> Payments & Transactions
          </div>
          <h1 className="text-2xl font-black text-white">Payment Ledger & Refunds</h1>
          <p className="text-xs text-slate-400">Lookup Stripe & Razorpay orders, trace referrals, and process refunds.</p>
        </div>

        <button onClick={fetchPayments} className="btn btn-ghost btn-circle text-slate-400 hover:text-white">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
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

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction ID, student email, or course..."
            className="input input-bordered w-full pl-10 bg-slate-900/60 text-white border-white/10 text-xs"
          />
        </div>

        <select
          value={selectedGateway}
          onChange={(e) => setSelectedGateway(e.target.value)}
          className="select select-bordered bg-slate-900/60 text-white border-white/10 text-xs shrink-0"
        >
          <option value="All">All Gateways</option>
          <option value="stripe">Stripe</option>
          <option value="razorpay">Razorpay</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="card glass-panel rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <span className="loading loading-spinner loading-md text-emerald-500"></span>
            <p className="text-xs">Fetching financial transaction ledger...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <CreditCard className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No payment transactions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                <tr>
                  <th className="py-4 px-6">Transaction ID</th>
                  <th>Student Email</th>
                  <th>Course</th>
                  <th>Gateway</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-right px-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredPayments.map((p) => (
                  <tr key={p.transactionId} className="hover:bg-white/5 transition-all">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-400">{p.transactionId}</td>
                    <td className="font-semibold text-white">{p.userEmail}</td>
                    <td className="max-w-xs truncate">{p.courseTitle}</td>
                    <td>
                      <span className={`badge badge-sm uppercase font-bold text-[10px] ${
                        p.gateway === 'stripe' ? 'badge-primary' : 'badge-secondary'
                      }`}>
                        {p.gateway}
                      </span>
                    </td>
                    <td className="font-black text-white text-sm">${p.amount} {p.currency}</td>
                    <td>
                      <span className={`badge badge-sm uppercase font-bold text-[10px] ${
                        p.status === 'completed' ? 'badge-success' : p.status === 'refunded' ? 'badge-error' : 'badge-ghost'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="text-right px-6">
                      {p.status === 'completed' ? (
                        <button
                          onClick={() => setRefundModalTxn(p)}
                          className="btn btn-xs bg-red-600/20 border-red-500/40 text-red-300 hover:bg-red-600/30 gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Issue Refund
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">No Action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Issue Refund Modal */}
      {refundModalTxn && (
        <div className="modal modal-open">
          <div className="modal-box glass-panel bg-slate-950 border border-white/10 max-w-md p-6 space-y-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-red-400" /> Issue Refund for {refundModalTxn.transactionId}
            </h3>
            <p className="text-xs text-slate-400">
              Amount: <span className="font-bold text-white">${refundModalTxn.amount} {refundModalTxn.currency}</span> via {refundModalTxn.gateway.toUpperCase()}
            </p>

            <form onSubmit={handleRefundSubmit} className="space-y-4 text-xs">
              <div className="form-control">
                <label className="label text-slate-300 font-semibold">Refund Reason</label>
                <textarea
                  required
                  rows={3}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Reason for processing refund..."
                  className="textarea textarea-bordered bg-slate-900/60 text-white border-white/10"
                ></textarea>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setRefundModalTxn(null)}
                  className="btn btn-ghost text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={refunding}
                  className="btn bg-red-600 hover:bg-red-700 text-white border-0"
                >
                  {refunding ? <span className="loading loading-spinner loading-xs"></span> : 'Confirm Refund'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
