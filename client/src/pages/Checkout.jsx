import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { getCourseDetailApi, createPaymentOrderApi, confirmPaymentApi } from '../api/client';
import { CreditCard, Shield, CheckCircle2, Lock, Sparkles, ArrowLeft, Tag, BookOpen } from 'lucide-react';

export default function Checkout() {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const initialRefCode = searchParams.get('ref') || '';

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gateway, setGateway] = useState('stripe');
  const [referralCode, setReferralCode] = useState(initialRefCode);
  const [cardHolder, setCardHolder] = useState('John Doe');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await getCourseDetailApi(courseId || 'course_web_dev_101');
        if (res.success && res.course) {
          setCourse(res.course);
        }
      } catch (err) {
        setError('Failed to load checkout course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      // Step 1: Create Payment Order
      const orderRes = await createPaymentOrderApi({
        courseId: course?._id || course?.id || courseId || 'course_web_dev_101',
        gateway,
        referralCode: referralCode || undefined,
      });

      if (orderRes.success && orderRes.order) {
        const { transactionId } = orderRes.order;

        // Step 2: Confirm Payment Webhook / Callback
        const confirmRes = await confirmPaymentApi({
          transactionId,
          gatewayPaymentId: gateway === 'stripe' ? `pi_${transactionId}` : `pay_rzp_${transactionId}`,
        });

        if (confirmRes.success) {
          setCompletedOrder(confirmRes.enrollment);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Payment processing failed.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-indigo-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6">
      <div className="container max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Order Summary */}
        <div className="card glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="btn btn-circle btn-ghost btn-sm text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h2 className="text-xl font-black text-white">Order Summary</h2>
          </div>

          <div className="flex gap-4 p-4 bg-slate-900/60 rounded-xl border border-white/10">
            <img
              src={course?.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=80'}
              alt={course?.title}
              className="w-20 h-20 object-cover rounded-lg border border-white/10 shrink-0"
            />
            <div className="space-y-1">
              <span className="badge badge-sm badge-primary text-[10px]">{course?.category}</span>
              <h3 className="font-bold text-sm text-white leading-snug">{course?.title}</h3>
              <p className="text-xs text-indigo-400 font-bold">${course?.price}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 pt-2 border-t border-white/10">
            <div className="flex justify-between">
              <span>Course Tuition</span>
              <span className="font-bold">${course?.price}</span>
            </div>
            {referralCode && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Referral Code Applied</span>
                <span>{referralCode.toUpperCase()}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-white pt-3 border-t border-white/10">
              <span>Total Due</span>
              <span className="text-indigo-400">${course?.price}</span>
            </div>
          </div>

          {/* Referral Code Capture Field */}
          <div className="form-control">
            <label className="label text-xs font-semibold text-slate-300">Referral Code (Optional)</label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="e.g. REF-SAMIR2026"
                className="input input-bordered input-sm w-full pl-10 bg-slate-900/60 text-white uppercase font-mono text-xs border-white/10"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Gateway Selector & Payment Form */}
        <div className="card glass-panel p-6 rounded-2xl border border-white/10 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <h2 className="text-xl font-black text-white">Payment Method</h2>

          {/* Gateway Selector Tabs */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGateway('stripe')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                gateway === 'stripe'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/40 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4 text-indigo-400" /> Stripe Card
            </button>
            <button
              type="button"
              onClick={() => setGateway('razorpay')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                gateway === 'razorpay'
                  ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                  : 'bg-slate-900/40 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4 text-purple-400" /> Razorpay UPI
            </button>
          </div>

          {error && (
            <div className="alert alert-error bg-red-950/40 border border-red-500/30 text-red-300 text-xs rounded-xl">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handlePaySubmit} className="space-y-4 text-xs">
            <div className="form-control">
              <label className="label text-slate-300 font-semibold">Cardholder / Name on Account</label>
              <input
                type="text"
                required
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className="input input-bordered bg-slate-900/60 text-white border-white/10"
              />
            </div>

            <div className="form-control">
              <label className="label text-slate-300 font-semibold">
                {gateway === 'stripe' ? 'Credit / Debit Card Number' : 'Razorpay UPI ID / Card'}
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="input input-bordered w-full pl-9 bg-slate-900/60 text-white font-mono border-white/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label text-slate-300 font-semibold">Expiry Date</label>
                <input
                  type="text"
                  defaultValue="08/28"
                  className="input input-bordered bg-slate-900/60 text-white border-white/10 font-mono"
                />
              </div>
              <div className="form-control">
                <label className="label text-slate-300 font-semibold">CVC / CVV</label>
                <input
                  type="password"
                  defaultValue="123"
                  maxLength={4}
                  className="input input-bordered bg-slate-900/60 text-white border-white/10 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="btn bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 w-full mt-4 shadow-lg shadow-emerald-500/25 font-bold"
            >
              {processing ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Pay ${course?.price} via {gateway.toUpperCase()}
                </span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Payment Success & Enrollment Modal */}
      {completedOrder && (
        <div className="modal modal-open">
          <div className="modal-box glass-panel bg-slate-950 border border-white/10 max-w-md p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-white">Payment Confirmed!</h3>
            <p className="text-xs text-slate-300">
              Your transaction <span className="font-mono text-indigo-400">{completedOrder.transactionId}</span> was completed successfully. You are now enrolled in <span className="font-bold text-white">{completedOrder.courseTitle}</span>.
            </p>

            <div className="pt-4 flex flex-col gap-2">
              <Link
                to={`/learn/${completedOrder.courseId}`}
                className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-0 w-full"
              >
                <BookOpen className="w-4 h-4" /> Open Course Player
              </Link>
              <Link to="/dashboard" className="btn btn-ghost text-slate-400 text-xs">
                Go to Student Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
