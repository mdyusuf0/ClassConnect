import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import store, { indianStates } from '../data/mockStore.js';
import './Register.css';

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  
  const [formData, setFormData] = useState({
    planId: '',
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
  const [error, setError] = useState('');

  useEffect(() => {
    // get packages
    setPackages(store.getPackages());
  }, []);

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
      if (value.length >= 5) {
        setReferralValid(true);
      } else {
        setReferralValid(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions.');
      return;
    }
    
    try {
      const user = await store.registerUser(formData);
      if (user) {
        if (onLogin) onLogin(user);
        navigate('/dashboard');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
    }
  };

  return (
    <div className="auth-layout">
      {/* minimal header */}
      <header className="auth-header">
        <div className="logo">ClassConnect</div>
        <Link to="/login" className="auth-header-link">Sign In</Link>
      </header>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-title">Registration</h1>
            <p className="auth-subtitle">Already have an account? <Link to="/login">Login</Link></p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Choose Plan</label>
                <select className="form-select" name="planId" value={formData.planId} onChange={handleChange} required>
                  <option value="">Select a plan</option>
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                  ))}
                </select>
                {selectedPlan && (
                  <div className="plan-price-preview">
                    <span className="original-price">₹{selectedPlan.originalPrice || (selectedPlan.price * 1.5)}</span>
                    <span className="current-price">₹{selectedPlan.price}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Referral ID</label>
                <div className="input-with-icon">
                  <input type="text" className="form-input" name="referralCode" value={formData.referralCode} onChange={handleChange} placeholder="Optional" />
                  {referralValid && <CheckCircle className="success-icon" size={18} />}
                </div>
                {referralValid && <span className="success-text">Referral code applied!</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">State</label>
                <select className="form-select" name="state" value={formData.state} onChange={handleChange} required>
                  <option value="">Select state</option>
                  {indianStates && indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input type="tel" className="form-input" name="mobile" value={formData.mobile} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-input" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group checkbox-group full-width">
              <label className="checkbox-label">
                <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} required />
                <span>I agree to the User Agreement and Terms & Conditions</span>
              </label>
            </div>

            {selectedPlan && (
              <div className="price-summary">
                <p>Total Amount:</p>
                <div className="price-amounts">
                  <span className="summary-original-price">₹{selectedPlan.originalPrice || (selectedPlan.price * 1.5)}</span>
                  <span className="summary-current-price">₹{selectedPlan.price}</span>
                </div>
              </div>
            )}

            <button type="submit" className="auth-submit-btn">
              Register <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
      <div className="bg-dots top-left"></div>
      <div className="bg-dots bottom-right"></div>
    </div>
  );
};

export default Register;
