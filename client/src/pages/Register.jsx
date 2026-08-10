import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck, Info, ChevronDown, Sparkles } from 'lucide-react';
import store, { indianStates } from '../data/mockStore.js';

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedPackageId = searchParams.get('package');

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

    // If pre-selected package passed in query param
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

    // Field validations (Mandatory check)
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
    <div className="min-h-screen bg-[#F5F9FA] text-gray-900 flex flex-col justify-between relative overflow-hidden py-8 px-4">
      {/* Background Decorative Ambient Mesh & Dots */}
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Red/Teal Dots Grid (Reference Matching) */}
      <div className="hidden md:block absolute top-6 right-6 opacity-30 pointer-events-none">
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          ))}
        </div>
      </div>
      <div className="hidden md:block absolute bottom-6 left-6 opacity-30 pointer-events-none">
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          ))}
        </div>
      </div>

      {/* Top Header Navbar */}
      <header className="max-w-4xl mx-auto w-full flex justify-between items-center mb-6 relative z-10">
        <Link to="/" className="font-heading font-extrabold text-2xl tracking-tight flex items-center gap-0.5">
          <span className="text-[#001845]">Class</span>
          <span className="text-amber-500">Connect</span>
        </Link>

        <Link 
          to="/login" 
          className="text-xs font-bold text-[#001845] hover:text-amber-600 border border-gray-300 hover:border-amber-500 px-4 py-2 rounded-xl transition-all bg-white shadow-sm"
        >
          Sign In
        </Link>
      </header>

      {/* Main Registration Card */}
      <main className="max-w-2xl mx-auto w-full bg-white rounded-3xl border border-gray-200/80 shadow-2xl p-6 sm:p-10 relative z-10 my-auto">
        <div className="text-center mb-8">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-gray-900 mb-2">Registration</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Row 1 Left: Choose Plan (Mandatory*) */}
            <div>
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                Choose Plan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  name="planId" 
                  value={formData.planId} 
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-gray-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all appearance-none pr-10 font-semibold"
                >
                  <option value="">Select Plan</option>
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — ₹{pkg.price.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Row 1 Right: Referral ID (Optional) */}
            <div>
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Referral ID</span>
                <span className="text-[10px] font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Optional</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  name="referralCode" 
                  value={formData.referralCode} 
                  onChange={handleChange}
                  placeholder="Enter reference code"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-gray-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all pr-10"
                />
                {referralValid && (
                  <CheckCircle2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                )}
              </div>
            </div>

            {/* Row 2 Left: Your Name (Mandatory*) */}
            <div>
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-gray-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
              />
            </div>

            {/* Row 2 Right: State (Mandatory*) */}
            <div>
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  name="state" 
                  value={formData.state} 
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-gray-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all appearance-none pr-10 font-medium"
                >
                  <option value="">Select State</option>
                  {indianStates.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Row 3 Left: Mobile Number (Mandatory*) */}
            <div>
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                Mobile <span className="text-red-500">*</span>
              </label>
              <input 
                type="tel" 
                name="mobile" 
                value={formData.mobile} 
                onChange={handleChange}
                placeholder="Enter your mobile number"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-gray-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
              />
            </div>

            {/* Row 3 Right: Email ID (Mandatory*) */}
            <div>
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                Email ID <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-gray-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Row 4: Password (Mandatory*) */}
          <div>
            <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
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
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-gray-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                aria-label="Toggle password"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Terms & Conditions Checkbox (Mandatory*) */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-600 select-none">
              <input 
                type="checkbox" 
                name="agreeTerms" 
                checked={formData.agreeTerms} 
                onChange={handleChange}
                required
                className="mt-0.5 rounded border-gray-300 text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
              />
              <span>
                I agree to the User Agreement and{' '}
                <a href="#terms" className="text-blue-600 font-semibold hover:underline">
                  Terms & Conditions. <span className="text-red-500">*</span>
                </a>
              </span>
            </label>
          </div>

          {/* Dynamic Price Summary Box (Reference Matching) */}
          <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Price :</span>
              {selectedPlan?.originalPrice ? (
                <span className="text-sm font-semibold text-gray-400 line-through decoration-red-500">
                  ₹{selectedPlan.originalPrice.toLocaleString('en-IN')}
                </span>
              ) : (
                <span className="text-sm font-semibold text-gray-400 line-through decoration-red-500">₹0</span>
              )}
            </div>

            <div className="text-right">
              <span className="font-heading font-extrabold text-3xl text-amber-600 block">
                ₹{selectedPlan ? selectedPlan.price.toLocaleString('en-IN') : '0'}
              </span>
            </div>
          </div>

          {/* Register CTA Button */}
          <button 
            type="submit" 
            className="w-full py-4 rounded-xl font-heading font-extrabold text-sm tracking-wider uppercase bg-[#001845] hover:bg-[#002B70] text-white transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 active:scale-95"
          >
            Register <ArrowRight size={18} />
          </button>
        </form>

        {/* Expandable Important Payment Note Button & Box */}
        <div className="mt-6 text-center">
          <button 
            type="button" 
            onClick={() => setShowPaymentNote(!showPaymentNote)}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1.5 hover:underline"
          >
            <Info size={15} /> Show Important Payment Note
          </button>

          {showPaymentNote && (
            <div className="mt-3 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-left text-xs text-blue-950 space-y-2 animate-fade-in">
              <p className="font-bold flex items-center gap-1.5 text-blue-900">
                <ShieldCheck size={16} className="text-blue-700" /> ClassConnect Verification Guarantee
              </p>
              <p className="text-gray-700 leading-relaxed">
                • Payments are processed through secure encrypted gateways.<br />
                • Instant course access and referral dashboard activation after enrollment.<br />
                • For referral commission payouts, ensure your registered mobile number is linked to UPI.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer Copyright */}
      <footer className="mt-6 text-center text-xs text-gray-500 relative z-10">
        <p>© {new Date().getFullYear()} ClassConnect Academy. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Register;
