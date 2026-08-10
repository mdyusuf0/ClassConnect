import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, CheckCircle2, Shield, CreditCard, ArrowRight, ArrowLeft, BookOpen, Sparkles } from 'lucide-react';

const COURSES = [
  {
    id: 'course_web_dev_101',
    title: 'Full Stack Web Development Bootcamp',
    category: 'Web Development',
    price: 99,
    description: 'Master React, Node.js, Express, MongoDB, and modern web deployment.',
  },
  {
    id: 'course_ai_ml_201',
    title: 'AI & Machine Learning Masterclass',
    category: 'Artificial Intelligence',
    price: 149,
    description: 'Build real-world LLM apps, neural networks, and computer vision pipelines.',
  },
  {
    id: 'course_data_sci_301',
    title: 'Data Science & Analytics Pro',
    category: 'Data Science',
    price: 129,
    description: 'Statistical analysis, Python Pandas, visualization, and big data processing.',
  },
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    courseId: 'course_web_dev_101',
    paymentMethod: 'stripe_card',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all required account fields.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }
    setError('');
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setError('');
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await register(formData);
      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="card glass-panel w-full max-w-2xl p-8 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        {/* Multi-Step Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-2 text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white">Student Registration & Enrollment</h2>
            <p className="text-xs text-slate-400 mt-1">Create your account and enroll in your first course in 3 simple steps</p>
          </div>

          <ul className="steps steps-horizontal w-full text-xs font-semibold">
            <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Account Details</li>
            <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Course Selection</li>
            <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Checkout Stub</li>
          </ul>
        </div>

        {error && (
          <div className="alert alert-error bg-red-950/40 border border-red-500/30 text-red-300 rounded-xl mb-6 text-sm">
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Account Information */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="form-control">
              <label className="label text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                  className="input input-bordered w-full pl-10 bg-slate-900/60 text-white placeholder-slate-500 border-white/10 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="student@example.com"
                  className="input input-bordered w-full pl-10 bg-slate-900/60 text-white placeholder-slate-500 border-white/10 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="•••••••• (min 6 chars)"
                  className="input input-bordered w-full pl-10 bg-slate-900/60 text-white placeholder-slate-500 border-white/10 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="form-control pt-2">
              <label className="label text-xs font-semibold text-slate-300">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('role', 'student')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    formData.role === 'student'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-900/40 border-white/10 text-slate-400'
                  }`}
                >
                  <User className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="font-bold text-sm">Student</div>
                    <div className="text-[11px] opacity-70">Enroll & watch courses</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('role', 'admin')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    formData.role === 'admin'
                      ? 'bg-purple-600/20 border-purple-500 text-white'
                      : 'bg-slate-900/40 border-white/10 text-slate-400'
                  }`}
                >
                  <Shield className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="font-bold text-sm">Platform Admin</div>
                    <div className="text-[11px] opacity-70">Manage CMS & users</div>
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 w-full mt-6 shadow-lg shadow-indigo-500/25"
            >
              Continue to Course Selection <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Course Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="text-xs font-semibold text-slate-300 block mb-2">Select Your Primary Course</label>
            <div className="space-y-3">
              {COURSES.map((course) => {
                const isSelected = formData.courseId === course.id;
                return (
                  <div
                    key={course.id}
                    onClick={() => handleInputChange('courseId', course.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1 max-w-md">
                      <span className="badge badge-sm badge-outline text-indigo-400 border-indigo-500/40">{course.category}</span>
                      <h4 className="font-bold text-sm text-white">{course.title}</h4>
                      <p className="text-xs text-slate-400">{course.description}</p>
                    </div>
                    <div className="text-right pl-4">
                      <div className="text-xl font-black text-indigo-400">${course.price}</div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400 ml-auto mt-1" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="btn btn-outline border-white/10 text-slate-300 hover:bg-white/5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="btn bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 flex-1 shadow-lg shadow-indigo-500/25"
              >
                Proceed to Payment Placeholder <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Payment Method Placeholder */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 text-xs space-y-2">
              <div className="flex justify-between font-bold text-white text-sm pb-2 border-b border-white/10">
                <span>Selected Course</span>
                <span className="text-indigo-400 font-extrabold">
                  ${COURSES.find((c) => c.id === formData.courseId)?.price}
                </span>
              </div>
              <p className="text-slate-300">{COURSES.find((c) => c.id === formData.courseId)?.title}</p>
              <p className="text-slate-500">Student: {formData.name} ({formData.email})</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-3">Payment Gateway (Stub preview for Phase 4)</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('paymentMethod', 'stripe_card')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                    formData.paymentMethod === 'stripe_card'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-900/40 border-white/10 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-indigo-400" /> Stripe Payment
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('paymentMethod', 'razorpay_card')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                    formData.paymentMethod === 'razorpay_card'
                      ? 'bg-purple-600/20 border-purple-500 text-white'
                      : 'bg-slate-900/40 border-white/10 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-purple-400" /> Razorpay
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>Full live checkout integration will be connected in Phase 4. Registering now instantly completes initial enrollment.</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={loading}
                className="btn btn-outline border-white/10 text-slate-300 hover:bg-white/5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 flex-1 shadow-lg shadow-emerald-500/25"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Complete Registration & Enroll <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-6 text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
