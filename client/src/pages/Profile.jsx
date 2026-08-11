import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, ShieldCheck, AlertTriangle, Upload, CheckCircle2, 
  CreditCard, MapPin, Building, Calendar, Phone, Mail, 
  BookOpen, Briefcase, Lock, ArrowLeft, Save, Sparkles, Shield
} from 'lucide-react';
import store from '../data/mockStore';
import MediaUploader from '../components/MediaUploader';

const Profile = ({ currentUser, onUpdateUser }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: currentUser?.id || 'CC02143',
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    mobile: currentUser?.mobile || '9346397827',
    dob: currentUser?.dob || '1996-06-02',
    gender: currentUser?.gender || 'Female',
    qualification: currentUser?.qualification || 'Inter',
    occupation: currentUser?.occupation || 'Self employed',
    
    // Address Details
    address: currentUser?.address || 'Rangapuram, Narpala',
    city: currentUser?.city || 'Anantapur',
    state: currentUser?.state || 'Andhrapradesh',
    pincode: currentUser?.pincode || '515425',
    country: currentUser?.country || 'India',

    // Identity & KYC
    aadhaarNumber: currentUser?.aadhaarNumber || '',
    aadhaarDoc: currentUser?.aadhaarDoc || '',
    panNumber: currentUser?.panNumber || '',
    avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',

    // Bank Details
    accountHolderName: currentUser?.bankDetails?.accountHolderName || currentUser?.name || 'K rani',
    bankName: currentUser?.bankDetails?.bankName || 'Karur Vysya Bank Limited',
    accountNumber: currentUser?.bankDetails?.accountNumber || '',
    ifscCode: currentUser?.bankDetails?.ifscCode || '',
    upiId: currentUser?.bankDetails?.upiId || ''
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        userId: currentUser.id || 'CC02143',
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        mobile: currentUser.mobile || prev.mobile,
        dob: currentUser.dob || prev.dob,
        gender: currentUser.gender || prev.gender,
        qualification: currentUser.qualification || prev.qualification,
        occupation: currentUser.occupation || prev.occupation,
        address: currentUser.address || prev.address,
        city: currentUser.city || prev.city,
        state: currentUser.state || prev.state,
        pincode: currentUser.pincode || prev.pincode,
        country: currentUser.country || prev.country,
        aadhaarNumber: currentUser.aadhaarNumber || prev.aadhaarNumber,
        aadhaarDoc: currentUser.aadhaarDoc || prev.aadhaarDoc,
        panNumber: currentUser.panNumber || prev.panNumber,
        avatar: currentUser.avatar || prev.avatar,
        accountHolderName: currentUser.bankDetails?.accountHolderName || prev.accountHolderName,
        bankName: currentUser.bankDetails?.bankName || prev.bankName,
        accountNumber: currentUser.bankDetails?.accountNumber || prev.accountNumber,
        ifscCode: currentUser.bankDetails?.ifscCode || prev.ifscCode,
        upiId: currentUser.bankDetails?.upiId || prev.upiId
      }));
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F5F9FA] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-gray-200 text-center shadow-xl">
          <Lock size={40} className="mx-auto text-amber-500 mb-4" />
          <h2 className="font-heading font-extrabold text-2xl text-gray-900 mb-2">Access Protected</h2>
          <p className="text-xs text-gray-500 mb-6">Please sign in to manage your ClassConnect profile & KYC verification.</p>
          <Link to="/login" className="px-6 py-3 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow inline-block">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  const isAadhaarVerified = formData.aadhaarNumber && formData.aadhaarNumber.trim().length === 12;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    // Security Check: Aadhaar 12 digits verification check
    if (formData.aadhaarNumber && formData.aadhaarNumber.trim().length !== 12) {
      setErrorMsg('Invalid Aadhaar Number: Aadhaar must be exactly 12 digits for KYC verification.');
      return;
    }

    setSaving(true);

    const updatedProfile = {
      ...formData,
      aadhaarVerified: isAadhaarVerified,
      bankDetails: {
        accountHolderName: formData.accountHolderName,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        upiId: formData.upiId
      }
    };

    if (store.updateUserProfile) {
      store.updateUserProfile(currentUser.id, updatedProfile);
    }

    // Save to localStorage
    const savedUser = JSON.parse(localStorage.getItem('classconnect_user') || '{}');
    const newUserObj = { ...savedUser, ...updatedProfile };
    localStorage.setItem('classconnect_user', JSON.stringify(newUserObj));

    if (onUpdateUser) {
      onUpdateUser(newUserObj);
    }

    setTimeout(() => {
      setSaving(false);
      setSuccessMsg('✨ Profile & Mandatory Aadhaar KYC Details Saved Successfully!');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FA] py-10 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <Link 
            to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#001845] hover:text-amber-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
              isAadhaarVerified ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {isAadhaarVerified ? <ShieldCheck size={14} className="text-emerald-600" /> : <AlertTriangle size={14} className="text-amber-600" />}
              {isAadhaarVerified ? 'Aadhaar Verified KYC' : 'Aadhaar Verification Pending'}
            </span>
          </div>
        </div>

        {/* Post-Registration Alert Banner for Payout Eligibility */}
        {!isAadhaarVerified && (
          <div className="p-5 rounded-3xl bg-amber-500/10 border-2 border-amber-400 text-amber-900 shadow-md flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-gray-950 flex items-center justify-center font-bold shrink-0 mt-0.5 shadow">
              <Shield size={20} />
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-base text-gray-900">Mandatory Profile & KYC Requirement</h4>
              <p className="text-xs text-gray-700 leading-relaxed mt-1">
                Under financial compliance rules, <strong>12-digit Aadhaar Verification is mandatory</strong> before requesting any referral commission money transfers or payouts. Please fill out your profile below.
              </p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* 1. PROFILE PHOTO CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-heading font-extrabold text-xl text-gray-900">Profile Photo & Identity</h3>
              <p className="text-xs text-gray-500 mt-0.5">Upload a clear face photo for your verified student credential badge.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-28 h-28 rounded-full border-4 border-[#001845] overflow-hidden shadow-xl shrink-0 relative group">
                <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 w-full">
                <MediaUploader 
                  value={formData.avatar}
                  onChange={url => setFormData({...formData, avatar: url})}
                  label="Select Profile Photo"
                  type="image"
                  subfolder="avatars"
                />
              </div>
            </div>
          </div>

          {/* 2. PERSONAL INFORMATION CARD (Matching Reference Image 2) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-heading font-extrabold text-xl text-gray-900">Personal Details</h3>
              <p className="text-xs text-gray-500 mt-0.5">Basic identity information as per official documents.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">User ID (Readonly)</label>
                <input 
                  type="text" 
                  value={formData.userId} 
                  disabled 
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-xs font-mono font-bold text-gray-700 cursor-not-allowed" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Full Name *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-900 focus:border-[#001845] outline-none" 
                  placeholder="e.g. K rani"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Date of Birth *</label>
                <input 
                  type="date" 
                  value={formData.dob} 
                  onChange={e => setFormData({...formData, dob: e.target.value})}
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-900 focus:border-[#001845] outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Gender *</label>
                <select 
                  value={formData.gender} 
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-900 focus:border-[#001845] outline-none"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Mobile Number *</label>
                <input 
                  type="text" 
                  value={formData.mobile} 
                  onChange={e => setFormData({...formData, mobile: e.target.value})}
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-900 focus:border-[#001845] outline-none" 
                  placeholder="e.g. 9346397827"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Email Address (Readonly)</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  disabled 
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-600 cursor-not-allowed" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Qualification *</label>
                <select 
                  value={formData.qualification} 
                  onChange={e => setFormData({...formData, qualification: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-900 focus:border-[#001845] outline-none"
                >
                  <option value="Inter">Inter / 10+2</option>
                  <option value="B.Tech">B.Tech / B.E.</option>
                  <option value="Degree / Graduate">Degree / Graduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                  <option value="High School">High School</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Occupation / Job *</label>
                <input 
                  type="text" 
                  value={formData.occupation} 
                  onChange={e => setFormData({...formData, occupation: e.target.value})}
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-900 focus:border-[#001845] outline-none" 
                  placeholder="e.g. Self employed / Student"
                />
              </div>
            </div>
          </div>

          {/* 3. ADDRESS DETAILS CARD (Matching Reference Image 1) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-heading font-extrabold text-xl text-gray-900">Address Details</h3>
              <p className="text-xs text-gray-500 mt-0.5">Permanent residential address details.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Street Address *</label>
                <input 
                  type="text" 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-900 focus:border-[#001845] outline-none" 
                  placeholder="e.g. Rangapuram, Narpala"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">City *</label>
                <input 
                  type="text" 
                  value={formData.city} 
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-900 focus:border-[#001845] outline-none" 
                  placeholder="e.g. Anantapur"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">State *</label>
                <input 
                  type="text" 
                  value={formData.state} 
                  onChange={e => setFormData({...formData, state: e.target.value})}
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-900 focus:border-[#001845] outline-none" 
                  placeholder="e.g. Andhrapradesh"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Pincode *</label>
                <input 
                  type="text" 
                  value={formData.pincode} 
                  onChange={e => setFormData({...formData, pincode: e.target.value})}
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-900 focus:border-[#001845] outline-none" 
                  placeholder="e.g. 515425"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Country</label>
                <input 
                  type="text" 
                  value={formData.country} 
                  disabled 
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-600 cursor-not-allowed" 
                />
              </div>
            </div>
          </div>

          {/* 4. MANDATORY IDENTITY & KYC VERIFICATION CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-md space-y-6">
            <div className="border-b border-amber-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-xl text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="text-amber-500" /> Mandatory Identity & KYC Verification
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Required for commission withdrawal payouts and money transfers.</p>
              </div>

              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                CRITICAL SECURITY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center justify-between">
                  <span>Aadhaar Number * (MANDATORY)</span>
                  <span className="text-[10px] text-red-600 font-extrabold">12 DIGITS REQUIRED</span>
                </label>
                <input 
                  type="text" 
                  value={formData.aadhaarNumber} 
                  onChange={e => setFormData({...formData, aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12)})}
                  required 
                  maxLength={12}
                  className="w-full bg-amber-50/50 border border-amber-300 rounded-xl px-4 py-3 text-xs font-mono font-extrabold text-gray-900 focus:border-[#001845] outline-none" 
                  placeholder="Enter 12-digit Aadhaar Number"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center justify-between">
                  <span>PAN Card Number (OPTIONAL)</span>
                  <span className="text-[10px] text-gray-400 font-normal">OPTIONAL</span>
                </label>
                <input 
                  type="text" 
                  value={formData.panNumber} 
                  onChange={e => setFormData({...formData, panNumber: e.target.value.toUpperCase().slice(0, 10)})}
                  maxLength={10}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-mono font-bold text-gray-900 focus:border-[#001845] outline-none" 
                  placeholder="e.g. ABCDE1234F"
                />
              </div>
            </div>

            <MediaUploader 
              value={formData.aadhaarDoc}
              onChange={url => setFormData({...formData, aadhaarDoc: url})}
              label="Upload Aadhaar Card Image / Document Copy"
              type="image"
              subfolder="kyc"
            />
          </div>

          {/* 5. BANK DETAILS CARD (Matching Reference Image 1) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-heading font-extrabold text-xl text-gray-900 flex items-center gap-2">
                <CreditCard className="text-[#001845]" /> Bank Details For Direct Payouts
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Account details where referral commission money transfers will be deposited.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Name as per Bank Account *</label>
                <input 
                  type="text" 
                  value={formData.accountHolderName} 
                  onChange={e => setFormData({...formData, accountHolderName: e.target.value})}
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-900 focus:border-[#001845] outline-none" 
                  placeholder="e.g. K rani"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Bank Name *</label>
                <input 
                  type="text" 
                  value={formData.bankName} 
                  onChange={e => setFormData({...formData, bankName: e.target.value})}
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-900 focus:border-[#001845] outline-none" 
                  placeholder="e.g. Karur Vysya Bank Limited"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Account Number *</label>
                <input 
                  type="text" 
                  value={formData.accountNumber} 
                  onChange={e => setFormData({...formData, accountNumber: e.target.value})}
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-mono font-bold text-gray-900 focus:border-[#001845] outline-none" 
                  placeholder="Enter Account Number"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">IFSC Code *</label>
                <input 
                  type="text" 
                  value={formData.ifscCode} 
                  onChange={e => setFormData({...formData, ifscCode: e.target.value.toUpperCase()})}
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-mono font-bold text-gray-900 focus:border-[#001845] outline-none" 
                  placeholder="e.g. KVBL0001824"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Registered UPI ID *</label>
                <input 
                  type="text" 
                  value={formData.upiId} 
                  onChange={e => setFormData({...formData, upiId: e.target.value})}
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-900 focus:border-[#001845] outline-none" 
                  placeholder="e.g. user@upi"
                />
              </div>
            </div>
          </div>

          {/* 6. SUBMIT BUTTON */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button 
              type="submit" 
              disabled={saving}
              className="w-full sm:w-auto px-8 py-4 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              <Save size={16} />
              <span>{saving ? 'Updating KYC & Profile...' : 'Save Profile & Update KYC'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Profile;
