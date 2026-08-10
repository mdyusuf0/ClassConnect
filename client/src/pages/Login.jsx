import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Lock, Mail, Sparkles, Award, Zap, CheckCircle2 } from 'lucide-react';
import store from '../data/mockStore.js';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    
    try {
      const user = await store.loginUser(email, password);
      if (user) {
        if (onLogin) onLogin(user);
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid email or password. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FA] text-gray-900 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 dot-pattern opacity-25 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main 2-Column Split-Screen Card */}
      <div className="max-w-5xl w-full bg-white rounded-[32px] border border-gray-200/80 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 my-auto">
        
        {/* LEFT COLUMN: Creative Brand Showcase & Image */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#001845] via-[#002B70] to-[#001845] text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10">
            <Link to="/" className="font-heading font-extrabold text-2xl tracking-tight inline-flex items-center gap-0.5 mb-8">
              <span className="text-white">Class</span>
              <span className="text-amber-400">Connect</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles size={14} /> Bilingual Learning OS
            </div>

            <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-white leading-tight mb-4">
              Welcome Back To Your <span className="text-amber-400">Learning OS</span>
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              Access your HD course units, live masterclass schedules, verifiable certificates, and referral commission wallet.
            </p>
          </div>

          {/* Middle Showcase Image Card */}
          <div className="relative z-10 my-4 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-gray-900 group">
            <img 
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop" 
              alt="ClassConnect Workspace" 
              className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-xs text-amber-300 font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Award size={14} className="text-amber-400" /> PRO Mentorship</span>
              <span className="flex items-center gap-1.5"><Zap size={14} className="text-amber-400" /> Instant Access</span>
            </div>
          </div>

          {/* Bottom Features List */}
          <div className="relative z-10 space-y-2 pt-4 border-t border-white/10 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-amber-400 flex-shrink-0" />
              <span>100% Telugu & English Audio Options</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Login Form */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-heading font-extrabold text-3xl text-gray-900 mb-1">Sign In</h1>
              <p className="text-xs text-gray-500">Enter your email and password to log in.</p>
            </div>

            <Link to="/register" className="text-xs font-bold text-[#001845] hover:text-amber-600 border border-gray-200 hover:border-amber-400 px-4 py-2 rounded-xl transition-all shadow-sm">
              Register
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-gray-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all pl-10"
                />
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-gray-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all pl-10 pr-12"
                />
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 select-none">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <Link to="/contact" className="text-xs font-bold text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit CTA Button */}
            <button 
              type="submit" 
              className="w-full py-4 rounded-xl font-heading font-extrabold text-sm tracking-wider uppercase bg-[#001845] hover:bg-[#002B70] text-white transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 active:scale-95"
            >
              Login <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
