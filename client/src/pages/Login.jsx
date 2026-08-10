import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F5F9FA] text-gray-900 flex flex-col justify-between relative overflow-hidden py-8 px-4">
      {/* Background Decorative Ambient Mesh & Dots */}
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Red/Teal Dots Grid */}
      <div className="hidden md:block absolute top-6 left-6 opacity-30 pointer-events-none">
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          ))}
        </div>
      </div>
      <div className="hidden md:block absolute bottom-6 right-6 opacity-30 pointer-events-none">
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          ))}
        </div>
      </div>

      {/* Top Header Navbar */}
      <header className="max-w-md mx-auto w-full flex justify-between items-center mb-6 relative z-10">
        <Link to="/" className="font-heading font-extrabold text-2xl tracking-tight flex items-center gap-0.5">
          <span className="text-[#001845]">Class</span>
          <span className="text-amber-500">Connect</span>
        </Link>

        <Link 
          to="/register" 
          className="text-xs font-bold text-[#001845] hover:text-amber-600 border border-gray-300 hover:border-amber-500 px-4 py-2 rounded-xl transition-all bg-white shadow-sm"
        >
          Register
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md mx-auto w-full bg-white rounded-3xl border border-gray-200/80 shadow-2xl p-6 sm:p-10 relative z-10 my-auto">
        <div className="text-center mb-8">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Register
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
      </main>

      {/* Footer Copyright */}
      <footer className="mt-6 text-center text-xs text-gray-500 relative z-10">
        <p>© {new Date().getFullYear()} ClassConnect Academy. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
