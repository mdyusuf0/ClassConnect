import React, { useEffect, useState } from 'react';
import { getAdminReviewsApi, moderateReviewApi } from '../../api/client';
import { Star, CheckCircle2, XCircle, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await getAdminReviewsApi();
      if (res.success) {
        setReviews(res.reviews);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch reviews queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (reviewId, status) => {
    const actionName = status === 'approved' ? 'Approve' : 'Reject';
    if (!window.confirm(`${actionName} review ${reviewId}?`)) return;

    try {
      const res = await moderateReviewApi(reviewId, { status });
      if (res.success) {
        setSuccessMsg(`Review ${reviewId} ${status}.`);
        fetchReviews();
      }
    } catch (err) {
      setError(err.message || 'Moderation failed');
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterStatus === 'All') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="container mx-auto px-6 py-8 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold mb-2">
            <Star className="w-3.5 h-3.5" /> Ratings & Reviews Moderation
          </div>
          <h1 className="text-2xl font-black text-white">Student Reviews Queue</h1>
          <p className="text-xs text-slate-400">Review student ratings and approve or reject feedback before public publishing.</p>
        </div>

        <button onClick={fetchReviews} className="btn btn-ghost btn-circle text-slate-400 hover:text-white">
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

      {/* Filter Tabs */}
      <div className="join border border-white/10 p-1 rounded-xl bg-slate-900/60">
        {['All', 'pending', 'approved', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`join-item btn btn-xs capitalize border-0 ${
              filterStatus === st ? 'btn-primary' : 'btn-ghost text-slate-400'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Moderation Queue Table */}
      <div className="card glass-panel rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <span className="loading loading-spinner loading-md text-yellow-500"></span>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs italic">No reviews found for this status.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-white/10 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-4 px-6">Student</th>
                  <th>Rating</th>
                  <th>Review Comment</th>
                  <th>Status</th>
                  <th className="text-right px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredReviews.map((r) => (
                  <tr key={r.reviewId} className="hover:bg-white/5 transition-all">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{r.userName || r.userEmail?.split('@')[0]}</div>
                      <div className="text-[10px] text-slate-400">{r.userEmail}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-yellow-400 font-bold">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                        ))}
                        <span className="ml-1 text-white text-xs">({r.rating}/5)</span>
                      </div>
                    </td>
                    <td className="max-w-md">
                      <p className="line-clamp-2 text-slate-300 leading-relaxed">{r.comment}</p>
                    </td>
                    <td>
                      <span className={`badge badge-sm font-bold uppercase text-[10px] ${
                        r.status === 'approved' ? 'badge-success' : r.status === 'rejected' ? 'badge-error' : 'badge-warning'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="text-right px-6 space-x-2">
                      {r.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleModerate(r.reviewId, 'approved')}
                            className="btn btn-xs bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Approve
                          </button>
                          <button
                            onClick={() => handleModerate(r.reviewId, 'rejected')}
                            className="btn btn-xs bg-red-600/20 border-red-500/40 text-red-300 hover:bg-red-600/30 gap-1"
                          >
                            <XCircle className="w-3 h-3" /> Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleModerate(r.reviewId, r.status === 'approved' ? 'rejected' : 'approved')}
                          className="btn btn-xs btn-ghost text-slate-400 hover:text-white"
                        >
                          Switch to {r.status === 'approved' ? 'Rejected' : 'Approved'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
