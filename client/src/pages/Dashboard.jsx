import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Users, 
  Banknote, 
  Settings, 
  LogOut, 
  Copy, 
  Check, 
  TrendingUp, 
  Clock, 
  CreditCard, 
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Radio,
  Play
} from 'lucide-react';
import store from '../data/mockStore';

const Dashboard = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [referrals, setReferrals] = useState([]);
  const [enrolledPackage, setEnrolledPackage] = useState(null);
  const [liveSessions, setLiveSessions] = useState([]);
  
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: ''
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser) {
      setReferrals(store.getReferralsByUser(currentUser.id));
      setLiveSessions(store.getLiveSessions ? store.getLiveSessions() : []);
      if (currentUser.enrolledPackage) {
        setEnrolledPackage(store.getPackageById(currentUser.enrolledPackage));
      }
      if (currentUser.bankDetails) {
        setBankDetails(currentUser.bankDetails);
      }
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const handleCopyLink = () => {
    const link = `${window.location.origin}/register?ref=${currentUser.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setBankDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveBankDetails = (e) => {
    e.preventDefault();
    store.updateUserBankDetails(currentUser.id, bankDetails);
    alert('Bank details saved successfully!');
  };

  const handleRequestPayout = () => {
    const pendingAmount = currentUser.earnings?.pending || 0;
    if (pendingAmount <= 0) {
      alert('No pending amount to request.');
      return;
    }
    const success = store.requestPayout(currentUser.id, pendingAmount);
    if (success) {
      alert(`Payout request for ₹${pendingAmount} submitted!`);
    } else {
      alert('Failed to submit payout request.');
    }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <Home size={18} /> },
    { id: 'courses', label: 'My Courses', icon: <BookOpen size={18} /> },
    { id: 'live', label: 'Live Masterclasses', icon: <Radio size={18} /> },
    { id: 'referrals', label: 'Referrals', icon: <Users size={18} /> },
    { id: 'bank', label: 'Bank Details', icon: <Banknote size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  const totalEarnings = currentUser.earnings?.total || 0;
  const pendingEarnings = currentUser.earnings?.pending || 0;
  const totalReferrals = currentUser.totalReferrals || 0;
  const packageName = enrolledPackage ? enrolledPackage.name : 'None';

  return (
    <div className="min-h-screen bg-[#F5F9FA] flex flex-col md:flex-row text-gray-900 font-sans">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-gradient-to-b from-[#001845] to-[#002B70] text-white flex flex-col justify-between p-5 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-gray-950 font-heading font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
                C
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                Class<span className="text-amber-400">Connect</span>
              </span>
            </Link>
            <button className="md:hidden p-1 text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {navItems.map(item => (
              <button 
                key={item.id}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="pt-6 border-t border-white/10">
          <button 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-400 border border-white/10 text-xs font-heading font-bold uppercase tracking-wider transition-all" 
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="font-heading font-extrabold text-xl md:text-2xl text-gray-900">
              Welcome back, <span className="text-primary-container">{currentUser.name.split(' ')[0]}</span> 👋
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white font-heading font-extrabold text-sm flex items-center justify-center shadow-md">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Dynamic Content Pane */}
        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto flex-1 space-y-6">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                    <BookOpen size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Enrolled Package</p>
                    <h3 className="font-heading font-extrabold text-lg text-gray-900 mt-0.5">{packageName}</h3>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                    <Users size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Referrals</p>
                    <h3 className="font-heading font-extrabold text-lg text-gray-900 mt-0.5">{totalReferrals}</h3>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Earnings</p>
                    <h3 className="font-heading font-extrabold text-lg text-emerald-600 mt-0.5">₹{totalEarnings.toLocaleString('en-IN')}</h3>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Payout</p>
                    <h3 className="font-heading font-extrabold text-lg text-amber-600 mt-0.5">₹{pendingEarnings.toLocaleString('en-IN')}</h3>
                  </div>
                </div>

              </div>

              {/* Referral Box */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-lg text-gray-900">Your Referral Link</h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-extrabold uppercase">
                    <Sparkles size={14} /> Earn Commission
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">Share this link to earn commission whenever a student registers.</p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-semibold text-gray-700 truncate">
                    {window.location.origin}/register?ref={currentUser.referralCode}
                  </div>
                  <button 
                    className="px-6 py-3 bg-primary-container hover:bg-primary text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer" 
                    onClick={handleCopyLink}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
                
                <div className="pt-2 text-xs text-gray-500">
                  Referral Code: <strong className="text-gray-900 font-mono text-sm ml-1">{currentUser.referralCode}</strong>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
                <h3 className="font-heading font-extrabold text-lg text-gray-900">Recent Referrals</h3>
                {referrals.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-xs font-semibold text-gray-500">No referrals yet. Share your link to start earning!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50/80 text-gray-600 font-heading font-bold uppercase tracking-wider">
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Package</th>
                          <th className="py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {referrals.slice(0, 5).map(ref => (
                          <tr key={ref.id} className="hover:bg-gray-50/50">
                            <td className="py-3.5 px-4 text-gray-500">{new Date(ref.date).toLocaleDateString()}</td>
                            <td className="py-3.5 px-4 font-bold text-gray-900">{ref.referredUserName}</td>
                            <td className="py-3.5 px-4 text-gray-700">{store.getPackageById(ref.packageId)?.name || 'Unknown'}</td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                                ref.status === 'credited' || ref.status === 'completed' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {ref.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MY COURSES TAB */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <h2 className="font-heading font-extrabold text-2xl text-gray-900">My Learning Catalog</h2>
              {enrolledPackage ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledPackage.courses.map((course, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="w-full h-36 bg-gradient-to-br from-primary via-primary-container to-primary-light rounded-xl flex items-center justify-center text-white mb-4 shadow-inner">
                          <BookOpen size={40} className="text-amber-400" />
                        </div>
                        <h3 className="font-heading font-extrabold text-base text-gray-900 mb-3">{course}</h3>
                        
                        <div className="space-y-1.5 mb-4">
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full w-[25%] rounded-full"></div>
                          </div>
                          <span className="text-[11px] font-semibold text-gray-500">25% Completed</span>
                        </div>
                      </div>

                      <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer">
                        <span>Continue Learning</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm space-y-4">
                  <p className="text-gray-500 text-sm font-medium">You haven't enrolled in any packages yet.</p>
                  <Link to="/packages" className="inline-flex px-6 py-3 bg-primary-container text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md">
                    Browse Packages
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* LIVE SESSIONS TAB */}
          {activeTab === 'live' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-gray-900">Live Masterclasses</h2>
                <p className="text-xs text-gray-500 mt-1">Interactive live broadcasts, Q&A sessions, and recorded masterclasses delivered via Bunny Stream CDN.</p>
              </div>

              {liveSessions.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
                  <Radio size={36} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-sm font-semibold text-gray-500">No live sessions scheduled right now.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {liveSessions.map(session => (
                    <div key={session.id} className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                            session.status === 'LIVE_NOW' ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-100 text-blue-800'
                          }`}>
                            <Radio size={12} />
                            {session.status === 'LIVE_NOW' ? 'LIVE NOW' : session.status}
                          </span>
                          <span className="text-[11px] font-medium text-gray-500">{new Date(session.scheduledAt).toLocaleDateString()}</span>
                        </div>

                        <h3 className="font-heading font-extrabold text-lg text-gray-900">{session.title}</h3>
                        <p className="text-xs font-medium text-gray-600">Instructor: <strong className="text-gray-900">{session.instructor}</strong></p>

                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs font-mono text-amber-700 truncate">
                          Bunny Stream: {session.streamUrl}
                        </div>
                      </div>

                      <a 
                        href={session.streamUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2"
                      >
                        <Play size={16} />
                        <span>{session.status === 'LIVE_NOW' ? 'Join Live Stream' : 'Watch Recording'}</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REFERRALS TAB */}
          {activeTab === 'referrals' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="font-heading font-extrabold text-2xl text-gray-900">Referral Network</h2>
                <button 
                  className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  onClick={handleRequestPayout}
                  disabled={pendingEarnings <= 0}
                >
                  <CreditCard size={16} />
                  <span>Request Payout (₹{pendingEarnings})</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Referrals</span>
                  <p className="font-heading font-extrabold text-3xl text-gray-900 mt-1">{totalReferrals}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Commission</span>
                  <p className="font-heading font-extrabold text-3xl text-emerald-600 mt-1">₹{totalEarnings.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
                <h3 className="font-heading font-extrabold text-lg text-gray-900">All Referrals</h3>
                {referrals.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-xs font-semibold text-gray-500">No referrals found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50/80 text-gray-600 font-heading font-bold uppercase tracking-wider">
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Referred User</th>
                          <th className="py-3 px-4">Package</th>
                          <th className="py-3 px-4">Commission</th>
                          <th className="py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {referrals.map(ref => {
                          const pkg = store.getPackageById(ref.packageId);
                          return (
                            <tr key={ref.id} className="hover:bg-gray-50/50">
                              <td className="py-3.5 px-4 text-gray-500">{new Date(ref.date).toLocaleDateString()}</td>
                              <td className="py-3.5 px-4 font-bold text-gray-900">{ref.referredUserName}</td>
                              <td className="py-3.5 px-4 text-gray-700">{pkg?.name || 'Unknown'}</td>
                              <td className="py-3.5 px-4 font-extrabold text-emerald-600">₹{ref.commissionAmount?.toLocaleString('en-IN') || 0}</td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                                  ref.status === 'credited' || ref.status === 'completed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {ref.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BANK DETAILS TAB */}
          {activeTab === 'bank' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-gray-900">Bank & Payout Details</h2>
                <p className="text-xs text-gray-500 mt-1">Update your bank details to receive seamless commission payouts.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200/80 shadow-sm">
                <form onSubmit={handleSaveBankDetails} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Bank Name</label>
                    <input 
                      type="text" 
                      name="bankName"
                      value={bankDetails.bankName} 
                      onChange={handleBankDetailsChange} 
                      placeholder="e.g. State Bank of India"
                      required
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent text-xs font-medium text-gray-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Account Holder Name</label>
                    <input 
                      type="text" 
                      name="accountHolderName"
                      value={bankDetails.accountHolderName} 
                      onChange={handleBankDetailsChange} 
                      placeholder="As per official bank records"
                      required
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent text-xs font-medium text-gray-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Account Number</label>
                    <input 
                      type="text" 
                      name="accountNumber"
                      value={bankDetails.accountNumber} 
                      onChange={handleBankDetailsChange} 
                      placeholder="Enter account number"
                      required
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent text-xs font-medium text-gray-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">IFSC Code</label>
                    <input 
                      type="text" 
                      name="ifscCode"
                      value={bankDetails.ifscCode} 
                      onChange={handleBankDetailsChange} 
                      placeholder="e.g. SBIN0001234"
                      required
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent text-xs font-medium text-gray-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">UPI ID (Optional)</label>
                    <input 
                      type="text" 
                      name="upiId"
                      value={bankDetails.upiId} 
                      onChange={handleBankDetailsChange} 
                      placeholder="e.g. username@upi"
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent text-xs font-medium text-gray-900 outline-none"
                    />
                  </div>
                  
                  <button type="submit" className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer">
                    Save Bank Details
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="font-heading font-extrabold text-2xl text-gray-900">Settings</h2>
              <div className="bg-white rounded-2xl p-8 border border-gray-200/80 shadow-sm text-center">
                <p className="text-xs text-gray-500 font-semibold">Account & notification settings coming soon...</p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;

