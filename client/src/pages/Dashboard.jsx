import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Home, BookOpen, Users, Banknote, Settings, LogOut, Copy, Check, 
  TrendingUp, Clock, CreditCard, Menu, X, Sparkles, ArrowRight, Radio, 
  Play, ShieldCheck, Award, Lock, DollarSign, Wallet
} from 'lucide-react';
import api from '../api/client';
import LiveViewer from '../components/LiveViewer';

const Dashboard = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [referrals, setReferrals] = useState([]);
  const [enrolledPackage, setEnrolledPackage] = useState(null);
  const [liveSessions, setLiveSessions] = useState([]);
  const [activeLiveSession, setActiveLiveSession] = useState(null);
  const [courses, setCourses] = useState([]);

  const [upiId, setUpiId] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMessage, setPayoutMessage] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    if (!currentUser) return;
    try {
      const coursesData = await api.getCoursesApi('All');
      setCourses(coursesData || []);

      try {
        const refData = await api.getReferralDashboardApi();
        setReferrals(refData.referrals || []);
      } catch (e) {
        console.warn('Failed to load referrals dashboard:', e.message);
      }

      try {
        const pkgs = await api.getPackagesApi();
        const pkgId = currentUser.enrolledPackage || currentUser.packageId;
        const matchedPkg = pkgs.find(p => p.id === pkgId || p._id === pkgId) || pkgs[0];
        setEnrolledPackage(matchedPkg || null);
      } catch (e) {
        console.warn('Failed to load package info:', e.message);
      }

      try {
        const enrolled = currentUser.enrolledCourses || [];
        const allSessions = [];
        for (const courseId of enrolled) {
          const sessions = await api.getStudentLiveClassesApi(courseId);
          allSessions.push(...(sessions || []));
        }
        setLiveSessions(allSessions);
      } catch (e) {
        console.warn('Failed to load student live classes:', e.message);
      }
    } catch (err) {
      console.warn('Failed to load student dashboard:', err.message);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F5F9FA] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-gray-200 text-center shadow-xl">
          <Lock size={40} className="mx-auto text-amber-500 mb-4" />
          <h2 className="font-heading font-extrabold text-2xl text-gray-900 mb-2">Access Protected</h2>
          <p className="text-xs text-gray-500 mb-6">Please log into your ClassConnect account to access your workspace.</p>
          <Link to="/login" className="px-6 py-3 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow inline-block">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  const referralLink = `${window.location.origin}/register?ref=${currentUser.referralCode || 'CLASSCONNECT'}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    setPayoutMessage('');
    const amt = parseFloat(payoutAmount);
    if (!amt || amt <= 0) {
      setPayoutMessage('Please enter a valid payout amount.');
      return;
    }
    if (!upiId.trim()) {
      setPayoutMessage('Please enter a valid UPI ID (e.g. user@upi).');
      return;
    }
    if (amt > (currentUser.pendingPayout || 1500)) {
      setPayoutMessage('Requested amount exceeds available referral balance.');
      return;
    }

    try {
      await api.requestPayoutApi(amt, upiId);
      setPayoutMessage('✨ Payout request submitted successfully! UPI transfer will be processed after encryption verification.');
      setPayoutAmount('');
      await loadDashboardData();
    } catch (err) {
      setPayoutMessage(err.message || 'Payout request failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FA] flex flex-col md:flex-row text-gray-900 font-sans">
      
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-[#001845] text-white p-4 flex items-center justify-between shadow-lg">
        <Link to="/" className="font-heading font-extrabold text-xl flex items-center gap-0.5">
          <span>Class</span>
          <span className="text-amber-400">Connect</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-white">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Student Sidebar */}
      <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-gradient-to-b from-[#001845] via-[#002B70] to-[#001845] text-white p-6 flex flex-col justify-between shrink-0 shadow-2xl relative border-r border-white/10 z-30`}>
        <div>
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-gray-950 flex items-center justify-center font-heading font-extrabold text-xl shadow-lg">
              CC
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg text-white block leading-none">ClassConnect</span>
              <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">Student Learning OS</span>
            </div>
          </Link>

          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              { id: 'courses', label: 'My Enrolled Courses', icon: BookOpen },
              { id: 'live', label: 'Live Masterclasses', icon: Radio },
              { id: 'referrals', label: 'Referral Wallet', icon: Wallet },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === item.id 
                    ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}

            <Link
              to="/profile"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all text-amber-300 hover:bg-white/10 hover:text-white border border-amber-500/30 bg-amber-500/10 mt-2"
            >
              <ShieldCheck size={18} className="text-amber-400" />
              <span>Profile & Aadhaar KYC</span>
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-[11px] text-amber-300 font-semibold bg-white/10 p-2.5 rounded-xl border border-white/10">
            <ShieldCheck size={14} className="text-amber-400" />
            <span>Verified Student Account</span>
          </div>

          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut size={16} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Student Workspace */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto min-w-0">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200/80 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-wider mb-2 border border-amber-200">
                  <Sparkles size={12} className="text-amber-600" /> Welcome Back
                </span>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
                  Hello, {currentUser.name}!
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Enrolled Plan: <strong className="text-amber-600 font-extrabold">{enrolledPackage?.name || 'Gold Bundle'}</strong>
                </p>
              </div>

              <Link to="/courses" className="px-6 py-3.5 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg inline-flex items-center justify-center gap-2 active:scale-95 transition-all">
                Browse Courses <ArrowRight size={16} />
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Referral Code</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-extrabold text-xl text-gray-900">{currentUser.referralCode || 'CCREF101'}</span>
                  <button onClick={copyReferralLink} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 cursor-pointer">
                    {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Referral Earnings</span>
                <h3 className="font-heading font-extrabold text-2xl text-emerald-600">₹{(currentUser.totalEarnings || 1500).toLocaleString('en-IN')}</h3>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Enrolled Courses</span>
                <h3 className="font-heading font-extrabold text-2xl text-[#001845]">{enrolledPackage?.courses?.length || 8} Courses</h3>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Verifiable Credentials</span>
                <h3 className="font-heading font-extrabold text-2xl text-amber-600 flex items-center gap-1.5">
                  <Award size={24} className="text-amber-500" /> Active
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200/80 p-6 rounded-3xl shadow-sm">
              <h2 className="font-heading font-extrabold text-2xl text-gray-900 mb-1">My Enrolled Masterclasses</h2>
              <p className="text-xs text-gray-500">Access full HD recorded units with 100% English & Telugu audio switching.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course.id || course._id} className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-44 object-cover" />
                  <div className="p-5 space-y-3">
                    <span className="text-[10px] font-extrabold uppercase text-amber-600 tracking-wider bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      {course.category}
                    </span>
                    <h3 className="font-heading font-extrabold text-lg text-gray-900">{course.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{course.description}</p>
                    <Link to={`/course/${course.id || course._id}`} className="w-full py-2.5 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all block text-center">
                      Watch Unit Lectures <Play size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIVE MASTERCLASSES TAB */}
        {activeTab === 'live' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200/80 p-6 rounded-3xl shadow-sm">
              <h2 className="font-heading font-extrabold text-2xl text-gray-900 mb-1">Live Masterclass Broadcasts</h2>
              <p className="text-xs text-gray-500">Join interactive live Q&A sessions with senior PRO Mentors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveSessions.map(session => (
                <div key={session.id} className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                        session.status === 'LIVE_NOW' ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {session.status === 'LIVE_NOW' ? '🔴 LIVE NOW' : '⚪ UPCOMING'}
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-xl text-gray-900">{session.title}</h3>
                    <p className="text-xs text-gray-600 font-medium">PRO Mentor: <strong className="text-gray-900">{session.instructor}</strong></p>
                  </div>

                  <button 
                    onClick={() => setActiveLiveSession(session)}
                    className="w-full py-3 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Play size={16} />
                    <span>Join Live Interactive Viewer</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REFERRAL WALLET TAB */}
        {activeTab === 'referrals' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200/80 p-6 rounded-3xl shadow-sm">
              <h2 className="font-heading font-extrabold text-2xl text-gray-900 mb-1">Referral Commission Wallet</h2>
              <p className="text-xs text-gray-500">Request daily commission payouts directly to your UPI ID.</p>
            </div>

            {payoutMessage && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                {payoutMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payout Request Card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
                <h3 className="font-heading font-extrabold text-lg text-gray-900 flex items-center gap-2">
                  <Wallet className="text-amber-500" /> Request Payout
                </h3>

                <form onSubmit={handleRequestPayout} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Amount (₹) *</label>
                    <input 
                      type="number" 
                      value={payoutAmount}
                      onChange={e => setPayoutAmount(e.target.value)}
                      placeholder="e.g. 1500" 
                      required 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Registered UPI ID *</label>
                    <input 
                      type="text" 
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="username@upi" 
                      required 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold"
                    />
                  </div>

                  <button type="submit" className="w-full py-3.5 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer">
                    Submit Payout Request
                  </button>
                </form>
              </div>

              {/* Referral Link Box */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
                <h3 className="font-heading font-extrabold text-lg text-gray-900">Your Shareable Referral Link</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Earn up to ₹3,000 direct commission for every friend who registers using your referral link.
                </p>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between text-xs font-mono">
                  <span className="truncate pr-2">{referralLink}</span>
                  <button onClick={copyReferralLink} className="p-2 bg-[#001845] text-white rounded-lg text-xs font-bold shrink-0">
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Live Interactive Viewer Modal for Students */}
      {activeLiveSession && (
        <LiveViewer 
          session={activeLiveSession}
          currentUser={currentUser}
          onClose={() => setActiveLiveSession(null)}
        />
      )}

    </div>
  );
};

export default Dashboard;
