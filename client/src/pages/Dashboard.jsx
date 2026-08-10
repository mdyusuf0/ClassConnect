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
  X
} from 'lucide-react';
import store from '../data/mockStore';

const Dashboard = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [referrals, setReferrals] = useState([]);
  const [enrolledPackage, setEnrolledPackage] = useState(null);
  
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
      // In a real app we'd update user state here
    } else {
      alert('Failed to submit payout request.');
    }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <Home size={20} /> },
    { id: 'courses', label: 'My Courses', icon: <BookOpen size={20} /> },
    { id: 'referrals', label: 'Referrals', icon: <Users size={20} /> },
    { id: 'bank', label: 'Bank Details', icon: <Banknote size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  const totalEarnings = currentUser.earnings?.total || 0;
  const pendingEarnings = currentUser.earnings?.pending || 0;
  const totalReferrals = currentUser.totalReferrals || 0;
  const packageName = enrolledPackage ? enrolledPackage.name : 'None';

  return (
    <div className="dashboard-container">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <span className="logo-text">Class<span className="logo-accent">Connect</span></span>
          </Link>
          <button className="close-sidebar-btn" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map(item => (
              <li key={item.id}>
                <button 
                  className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="greeting">Welcome back, {currentUser.name.split(' ')[0]}! 👋</h1>
          </div>
          <div className="header-right">
            <div className="user-avatar">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="dashboard-content">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="tab-pane overview-pane">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon package-icon"><BookOpen size={24} /></div>
                  <div className="stat-info">
                    <p className="stat-label">Enrolled Package</p>
                    <h3 className="stat-value">{packageName}</h3>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon users-icon"><Users size={24} /></div>
                  <div className="stat-info">
                    <p className="stat-label">Total Referrals</p>
                    <h3 className="stat-value">{totalReferrals}</h3>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon total-icon"><TrendingUp size={24} /></div>
                  <div className="stat-info">
                    <p className="stat-label">Total Earnings</p>
                    <h3 className="stat-value">₹{totalEarnings.toLocaleString()}</h3>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon pending-icon"><Clock size={24} /></div>
                  <div className="stat-info">
                    <p className="stat-label">Pending Payout</p>
                    <h3 className="stat-value">₹{pendingEarnings.toLocaleString()}</h3>
                  </div>
                </div>
              </div>

              <div className="overview-row">
                <div className="referral-box card">
                  <h3 className="card-title">Your Referral Link</h3>
                  <p className="card-desc">Share this link to earn commission when someone registers.</p>
                  
                  <div className="referral-link-container">
                    <div className="link-text">
                      {window.location.origin}/register?ref={currentUser.referralCode}
                    </div>
                    <button className="copy-btn" onClick={handleCopyLink}>
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  
                  <div className="referral-code-badge">
                    Code: <strong>{currentUser.referralCode}</strong>
                  </div>
                </div>
              </div>

              <div className="recent-activity-section card">
                <h3 className="card-title">Recent Referrals</h3>
                {referrals.length === 0 ? (
                  <p className="empty-state">No referrals yet. Share your link to start earning!</p>
                ) : (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Name</th>
                          <th>Package</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {referrals.slice(0, 5).map(ref => (
                          <tr key={ref.id}>
                            <td>{new Date(ref.date).toLocaleDateString()}</td>
                            <td>{ref.referredUserName}</td>
                            <td>{store.getPackageById(ref.packageId)?.name || 'Unknown'}</td>
                            <td>
                              <span className={`status-badge ${ref.status}`}>
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
            <div className="tab-pane courses-pane">
              <h2 className="section-title">My Learning</h2>
              {enrolledPackage ? (
                <div className="courses-grid">
                  {enrolledPackage.courses.map((course, idx) => (
                    <div key={idx} className="course-card">
                      <div className="course-thumbnail">
                        <BookOpen size={48} className="placeholder-icon" />
                      </div>
                      <div className="course-details">
                        <h3 className="course-title">{course}</h3>
                        <div className="progress-container">
                          <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: '0%' }}></div>
                          </div>
                          <span className="progress-text">0% Complete</span>
                        </div>
                        <button className="continue-btn">Start Learning</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state card">
                  <p>You haven't enrolled in any packages yet.</p>
                  <Link to="/packages" className="btn btn-primary">Browse Packages</Link>
                </div>
              )}
            </div>
          )}

          {/* REFERRALS TAB */}
          {activeTab === 'referrals' && (
            <div className="tab-pane referrals-pane">
              <div className="referrals-header">
                <h2 className="section-title">Referral Network</h2>
                <button 
                  className="btn btn-primary request-payout-btn"
                  onClick={handleRequestPayout}
                  disabled={pendingEarnings <= 0}
                >
                  <CreditCard size={18} />
                  Request Payout (₹{pendingEarnings})
                </button>
              </div>

              <div className="referrals-summary card">
                <div className="summary-item">
                  <span className="summary-label">Total Referrals</span>
                  <span className="summary-value">{totalReferrals}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Commission</span>
                  <span className="summary-value">₹{totalEarnings.toLocaleString()}</span>
                </div>
              </div>

              <div className="referrals-list card">
                <h3 className="card-title">All Referrals</h3>
                {referrals.length === 0 ? (
                  <p className="empty-state">No referrals found.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Referred User</th>
                          <th>Package</th>
                          <th>Commission</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {referrals.map(ref => {
                          const pkg = store.getPackageById(ref.packageId);
                          return (
                            <tr key={ref.id}>
                              <td>{new Date(ref.date).toLocaleDateString()}</td>
                              <td>{ref.referredUserName}</td>
                              <td>{pkg?.name || 'Unknown'}</td>
                              <td>₹{ref.commissionAmount?.toLocaleString() || 0}</td>
                              <td>
                                <span className={`status-badge ${ref.status}`}>
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
            <div className="tab-pane bank-pane">
              <h2 className="section-title">Bank Details</h2>
              <p className="section-subtitle">Update your bank details to receive payouts.</p>
              
              <div className="card bank-form-card">
                <form onSubmit={handleSaveBankDetails} className="bank-form">
                  <div className="form-group">
                    <label>Bank Name</label>
                    <input 
                      type="text" 
                      name="bankName"
                      value={bankDetails.bankName} 
                      onChange={handleBankDetailsChange} 
                      placeholder="e.g. State Bank of India"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Holder Name</label>
                    <input 
                      type="text" 
                      name="accountHolderName"
                      value={bankDetails.accountHolderName} 
                      onChange={handleBankDetailsChange} 
                      placeholder="As per bank records"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Number</label>
                    <input 
                      type="text" 
                      name="accountNumber"
                      value={bankDetails.accountNumber} 
                      onChange={handleBankDetailsChange} 
                      placeholder="Enter account number"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>IFSC Code</label>
                    <input 
                      type="text" 
                      name="ifscCode"
                      value={bankDetails.ifscCode} 
                      onChange={handleBankDetailsChange} 
                      placeholder="e.g. SBIN0001234"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>UPI ID (Optional)</label>
                    <input 
                      type="text" 
                      name="upiId"
                      value={bankDetails.upiId} 
                      onChange={handleBankDetailsChange} 
                      placeholder="e.g. username@upi"
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Save Bank Details</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="tab-pane settings-pane">
              <h2 className="section-title">Settings</h2>
              <div className="card">
                <p>Settings coming soon...</p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
