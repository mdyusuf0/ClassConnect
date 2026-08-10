import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Info, ChevronDown, Sparkles, Award, Zap } from 'lucide-react';
import store, { indianStates } from '../data/mockStore.js';

const Register = ({ currentUser, onLogin }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedPackageId = searchParams.get('package');

  // Auto-redirect if logged in or valid token/cookie present
  useEffect(() => {
    function getCookie(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    }
    const tokenCookie = getCookie('classconnect_token') || getCookie('token') || getCookie('session');
    const userCookie = getCookie('classconnect_user') || getCookie('user');
    const localUser = localStorage.getItem('classconnect_user');
    const localToken = localStorage.getItem('classconnect_token');

    if (currentUser || tokenCookie || userCookie || localUser || localToken) {
      let role = currentUser?.role;
      if (!role && (userCookie || localUser)) {
        try {
          const parsed = JSON.parse(userCookie || localUser);
          role = parsed?.role;
        } catch (e) {}
      }
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  const [packages, setPackages] = useState([]);
  
  const [formData, setFormData] = useState({
    planId: preSelectedPackageId || '',
    referralCode: '',
    name: '',
    state: '',
    mobile: '',
    email: '',
    password: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [referralValid, setReferralValid] = useState(false);
  const [showPaymentNote, setShowPaymentNote] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const allPackages = store.getPackages();
    setPackages(allPackages);

    if (preSelectedPackageId) {
      const match = allPackages.find(p => p.id === preSelectedPackageId);
      if (match) {
        setSelectedPlan(match);
      }
    }
  }, [preSelectedPackageId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'planId') {
      const plan = packages.find(p => p.id === value);
      setSelectedPlan(plan || null);
    }

    if (name === 'referralCode') {
      setReferralValid(value.trim().length >= 4);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.planId) {
      setError('Please select a course package plan.');
      return;
    }
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.state) {
      setError('Please select your state.');
      return;
    }
    if (!formData.mobile.trim()) {
      setError('Please enter your mobile number.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!formData.password) {
      setError('Please enter a password.');
      return;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the User Agreement and Terms & Conditions.');
      return;
    }

    try {
      const user = await store.registerUser(formData);
      if (user) {
        if (onLogin) onLogin(user);
        navigate('/dashboard');
      } else {
        setError('Registration failed. Please check your inputs and try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FA] text-gray-900 flex flex-col items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 dot-pattern opacity-25 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Floating Navigation Bar with Back to Home Button */}
      <div className="max-w-6xl w-full flex justify-between items-center mb-4 z-20">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-amber-400 text-xs font-bold text-gray-800 hover:text-amber-600 transition-all shadow-sm group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <Link 
          to="/" 
          className="font-heading font-extrabold text-xl tracking-tight flex items-center gap-0.5"
        >
          <span className="text-[#001845]">Class</span>
          <span className="text-amber-500">Connect</span>
        </Link>
      </div>

      {/* Main 2-Column Split-Screen Card */}
      <div className="max-w-6xl w-full bg-white rounded-[32px] border border-gray-200/80 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 my-auto">
        
        {/* LEFT COLUMN: Creative Brand Showcase & Clickable Logo */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#001845] via-[#002B70] to-[#001845] text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />

          {/* Top Clickable Brand Logo Redirecting to Home */}
          <div className="relative z-10">
            <Link 
              to="/" 
              className="font-heading font-extrabold text-2xl tracking-tight inline-flex items-center gap-0.5 mb-8 hover:opacity-90 transition-opacity"
              title="Click to return to Home page"
            >
              <span className="text-white">Class</span>
              <span className="text-amber-400">Connect</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles size={14} /> Bilingual Learning OS
            </div>

            <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-white leading-tight mb-4">
              Transform Your Career With <span className="text-amber-400">Next-Gen Skills</span>
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              Join over 10,000+ active learners mastering Fullstack Development, Generative AI, Video Editing, and Performance Marketing with 100% Telugu & English clarity.
            </p>
          </div>

          {/* Middle Showcase Image Card */}
          <div className="relative z-10 my-4 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-gray-900 group">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" 
              alt="ClassConnect Learning OS" 
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-xs text-amber-300 font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Award size={14} className="text-amber-400" /> Verifiable Certificates</span>
              <span className="flex items-center gap-1.5"><Zap size={14} className="text-amber-400" /> Referral Earnings</span>
            </div>
          </div>

          {/* Bottom Features List */}
          <div className="relative z-10 space-y-2.5 pt-4 border-t border-white/10 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-amber-400 flex-shrink-0" />
              <span>100% Practical Hands-on Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-amber-400 flex-shrink-0" />
              <span>Daily Referral Payouts Directly To Your UPI</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Registration Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 mb-1">Registration</h1>
              <p className="text-xs text-gray-500">Fill in your details to activate your learning workspace.</p>
            </div>

            <Link to="/login" className="text-xs font-bold text-[#001845] hover:text-amber-600 border border-gray-200 hover:border-amber-400 px-3.5 py-1.5 rounded-xl transition-all shadow-sm">
              Sign In
            </Link>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Row 1 Left: Choose Plan (Mandatory*) */}
              <div>
                <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
                  Choose Plan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    name="planId" 
                    value={formData.planId} 
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all appearance-none pr-9 font-semibold"
                  >
                    <option value="">Select Plan</option>
                    {packages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — ₹{pkg.price.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Row 1 Right: Referral ID (Optional) */}
              <div>
                <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Referral ID</span>
                  <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Optional</span>
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="referralCode" 
                    value={formData.referralCode} 
                    onChange={handleChange}
                    placeholder="Enter reference code"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all pr-9"
                  />
                  {referralValid && (
                    <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                  )}
                </div>
              </div>

              {/* Row 2 Left: Your Name (Mandatory*) */}
              <div>
                <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>

              {/* Row 2 Right: State (Mandatory*) */}
              <div>
                <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all appearance-none pr-9 font-medium"
                  >
                    <option value="">Select State</option>
                    {indianStates.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Row 3 Left: Mobile Number (Mandatory*) */}
              <div>
                <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  name="mobile" 
                  value={formData.mobile} 
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>

              {/* Row 3 Right: Email ID (Mandatory*) */}
              <div>
                <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email ID <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Row 4: Password (Mandatory*) */}
            <div>
              <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Terms & Conditions Checkbox (Mandatory*) */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-600 select-none">
                <input 
                  type="checkbox" 
                  name="agreeTerms" 
                  checked={formData.agreeTerms} 
                  onChange={handleChange}
                  required
                  className="mt-0.5 rounded border-gray-300 text-amber-500 focus:ring-amber-400 w-3.5 h-3.5 cursor-pointer"
                />
                <span>
                  I agree to the User Agreement and{' '}
                  <a href="#terms" className="text-blue-600 font-semibold hover:underline">
                    Terms & Conditions. <span className="text-red-500">*</span>
                  </a>
                </span>
              </label>
            </div>

            {/* Dynamic Price Summary Box */}
            <div className="bg-amber-50/70 rounded-2xl p-3 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Price :</span>
                {selectedPlan?.originalPrice ? (
                  <span className="text-xs font-semibold text-gray-400 line-through decoration-red-500">
                    ₹{selectedPlan.originalPrice.toLocaleString('en-IN')}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-gray-400 line-through decoration-red-500">₹0</span>
                )}
              </div>

              <div className="text-right">
                <span className="font-heading font-extrabold text-2xl text-amber-600 block">
                  ₹{selectedPlan ? selectedPlan.price.toLocaleString('en-IN') : '0'}
                </span>
              </div>
            </div>

            {/* Register CTA Button */}
            <button 
              type="submit" 
              className="w-full py-3.5 rounded-xl font-heading font-extrabold text-xs tracking-wider uppercase bg-[#001845] hover:bg-[#002B70] text-white transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 active:scale-95"
            >
              Register <ArrowRight size={16} />
            </button>
          </form>

          {/* Expandable Important Payment Note */}
          <div className="mt-4 text-center">
            <button 
              type="button" 
              onClick={() => setShowPaymentNote(!showPaymentNote)}
              className="text-[11px] font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 hover:underline"
            >
              <Info size={14} /> Show Important Payment Note
            </button>

            {showPaymentNote && (
              <div className="mt-2 p-3 rounded-xl bg-blue-50 border border-blue-200 text-left text-[11px] text-blue-950 space-y-1.5 animate-fade-in">
                <p className="font-bold flex items-center gap-1 text-blue-900">
                  <ShieldCheck size={14} className="text-blue-700" /> ClassConnect Verification Guarantee
                </p>
                <p className="text-gray-700 leading-relaxed">
                  • Encrypted gateway payments & instant dashboard access.<br />
                  • Direct daily referral commission payouts directly to your UPI ID.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
