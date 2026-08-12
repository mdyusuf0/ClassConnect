import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Package, MessageSquare, 
  Users, DollarSign, LogOut, Plus, Edit, Trash2, 
  Check, X, Image as ImageIcon, Video, Sparkles, Radio, PlayCircle, Upload, Layers, ShieldCheck, Lock, ChevronRight, BarChart2
} from 'lucide-react';
import api from '../api/client';
import MediaUploader from '../components/MediaUploader';
import LiveStudio from '../components/LiveStudio';

const AdminCMS = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState([]);
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [videoTestimonials, setVideoTestimonials] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedTrend, setSelectedTrend] = useState('revenue');

  // Edit Course Modal State
  const [editingCourse, setEditingCourse] = useState(null);

  // Edit Package Modal State
  const [editingPackage, setEditingPackage] = useState(null);

  // Course Form State
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '', category: 'Development', description: '', thumbnail: '', 
    duration: '4 Weeks', lessons: '24', level: 'Beginner', featured: true, price: '2499', originalPrice: '4999'
  });

  // Unit-wise Lecture Restructured Manager State
  const [activeLectureCourse, setActiveLectureCourse] = useState(null);
  const [newUnitForm, setNewUnitForm] = useState({ title: '', description: '' });
  const [editingUnitId, setEditingUnitId] = useState(null);
  const [editingUnitForm, setEditingUnitForm] = useState({ title: '', description: '' });
  
  const [newLessonForm, setNewLessonForm] = useState({
    unitId: '', title: '', description: '', duration: '300', isFreePreview: false, videoUrl: '', bunnyVideoId: ''
  });
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editingLessonForm, setEditingLessonForm] = useState({
    unitId: '', id: '', title: '', description: '', duration: '300', isFreePreview: false, videoUrl: '', bunnyVideoId: ''
  });

  // Live Session State
  const [showLiveForm, setShowLiveForm] = useState(false);
  const [activeStudioSession, setActiveStudioSession] = useState(null);
  const [liveForm, setLiveForm] = useState({
    title: '', instructor: 'ClassConnect PRO Mentors', courseId: '', scheduledAt: '', 
    streamUrl: '', coverImage: '', recordingUrl: '', unitId: ''
  });

  // Package Form State
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [packageForm, setPackageForm] = useState({
    name: '', price: '', originalPrice: '', commission: '',
    selectedCourses: [], features: ''
  });

  // Video Testimonial Form State
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [videoForm, setVideoForm] = useState({
    name: '', role: '', courseTag: '', badge: '300% SALARY HIKE',
    avatar: '', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quote: '', rating: '5'
  });

  // Referral Rules Setting State
  const [selectedReferralCourse, setSelectedReferralCourse] = useState('');
  const [referralSettings, setReferralSettings] = useState({
    referralsEnabled: true, commissionType: 'percentage', commissionValue: 15
  });

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    try {
      const coursesData = await api.getCoursesApi('All');
      setCourses(coursesData || []);
      
      const packagesData = await api.getPackagesApi();
      setPackages(packagesData || []);
      
      const usersData = await api.getAdminUsersApi();
      setUsers(usersData || []);
      
      const payoutsData = await api.getAdminPayoutsApi();
      setPayouts(payoutsData || []);
      
      const liveData = await api.getAdminLiveClassesApi();
      setLiveSessions(liveData || []);
      
      const storiesData = await api.getVideoStoriesApi();
      setVideoTestimonials(storiesData || []);
      
      const reviewsData = await api.getAdminReviewsApi();
      setTestimonials(reviewsData || []);

      const analyticsData = await api.getAdminAnalyticsApi();
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load dynamic admin data:', err);
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // --- Course Handlers ---
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createCourseApi({
        ...courseForm,
        price: parseFloat(courseForm.price) || 2499,
        originalPrice: parseFloat(courseForm.originalPrice) || 4999,
        lessons: parseInt(courseForm.lessons) || 0
      });
      await loadData();
      setShowCourseForm(false);
      setCourseForm({ title: '', category: 'Development', description: '', thumbnail: '', duration: '4 Weeks', lessons: '24', level: 'Beginner', featured: true, price: '2499', originalPrice: '4999' });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditCourseSave = async (e) => {
    e.preventDefault();
    if (!editingCourse) return;
    try {
      await api.updateCourseApi(editingCourse.id || editingCourse._id, editingCourse);
      await loadData();
      setEditingCourse(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Security Alert: Are you sure you want to delete this course?')) {
      try {
        await api.deleteCourseApi(id);
        await loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // --- Restructured Unit-wise Lecture Handlers ---
  const handleAddUnit = async (e) => {
    e.preventDefault();
    if (!activeLectureCourse || !newUnitForm.title.trim()) return;
    try {
      const units = await api.addUnitApi(activeLectureCourse.id || activeLectureCourse._id, newUnitForm);
      const updatedCourse = { ...activeLectureCourse, units };
      setActiveLectureCourse(updatedCourse);
      setNewUnitForm({ title: '', description: '' });
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateUnit = async (unitId) => {
    if (!activeLectureCourse || !editingUnitForm.title.trim()) return;
    try {
      const units = await api.updateUnitApi(activeLectureCourse.id || activeLectureCourse._id, unitId, editingUnitForm);
      const updatedCourse = { ...activeLectureCourse, units };
      setActiveLectureCourse(updatedCourse);
      setEditingUnitId(null);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteUnit = async (unitId) => {
    if (!activeLectureCourse) return;
    if (window.confirm('Delete this unit and all its lectures?')) {
      try {
        const units = await api.deleteUnitApi(activeLectureCourse.id || activeLectureCourse._id, unitId);
        const updatedCourse = { ...activeLectureCourse, units };
        setActiveLectureCourse(updatedCourse);
        await loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    const { unitId, title, description, duration, isFreePreview, videoUrl, bunnyVideoId } = newLessonForm;
    if (!activeLectureCourse || !unitId || !title.trim()) return;
    try {
      const unit = await api.addLessonApi(activeLectureCourse.id || activeLectureCourse._id, unitId, {
        title, description, duration: Number(duration), isFreePreview, videoUrl, bunnyVideoId
      });
      const updatedUnits = activeLectureCourse.units.map(u => u.id === unitId ? unit : u);
      setActiveLectureCourse({ ...activeLectureCourse, units: updatedUnits });
      setNewLessonForm({ unitId: '', title: '', description: '', duration: '300', isFreePreview: false, videoUrl: '', bunnyVideoId: '' });
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    const { unitId, id, title, description, duration, isFreePreview, videoUrl, bunnyVideoId } = editingLessonForm;
    if (!activeLectureCourse || !unitId || !id || !title.trim()) return;
    try {
      const unit = await api.updateLessonApi(activeLectureCourse.id || activeLectureCourse._id, unitId, id, {
        title, description, duration: Number(duration), isFreePreview, videoUrl, bunnyVideoId
      });
      const updatedUnits = activeLectureCourse.units.map(u => u.id === unitId ? unit : u);
      setActiveLectureCourse({ ...activeLectureCourse, units: updatedUnits });
      setEditingLessonId(null);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteLesson = async (unitId, lessonId) => {
    if (!activeLectureCourse) return;
    if (window.confirm('Delete this lecture video?')) {
      try {
        const unit = await api.deleteLessonApi(activeLectureCourse.id || activeLectureCourse._id, unitId, lessonId);
        const updatedUnits = activeLectureCourse.units.map(u => u.id === unitId ? unit : u);
        setActiveLectureCourse({ ...activeLectureCourse, units: updatedUnits });
        await loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // --- Live Session Handlers ---
  const handleLiveSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.scheduleLiveClassApi({
        ...liveForm,
        scheduledAt: new Date(liveForm.scheduledAt).toISOString()
      });
      await loadData();
      setShowLiveForm(false);
      setLiveForm({ title: '', instructor: 'ClassConnect PRO Mentors', courseId: '', scheduledAt: '', streamUrl: '', coverImage: '', recordingUrl: '', unitId: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateLiveStatus = async (id, status) => {
    try {
      await api.updateLiveStatusApi(id, status);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteLiveSession = async (id) => {
    if (window.confirm('Delete this live masterclass session?')) {
      // Endpoint to delete live sessions if desired
      await loadData();
    }
  };

  // --- Referral Settings Handlers ---
  const handleSelectReferralCourse = async (courseId) => {
    setSelectedReferralCourse(courseId);
    if (!courseId) return;
    try {
      const setting = await api.getCourseReferralSettingsApi(courseId);
      setReferralSettings({
        referralsEnabled: setting.referralsEnabled,
        commissionType: setting.commissionType,
        commissionValue: setting.commissionValue
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveReferralSettings = async (e) => {
    e.preventDefault();
    if (!selectedReferralCourse) return;
    try {
      await api.updateCourseReferralSettingsApi(selectedReferralCourse, referralSettings);
      alert('Referral commission configuration saved successfully.');
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- Package Handlers ---
  const handlePackageSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createPackageApi({
        ...packageForm,
        price: parseFloat(packageForm.price),
        originalPrice: parseFloat(packageForm.originalPrice),
        commission: parseFloat(packageForm.commission),
        features: packageForm.features.split('\n').filter(f => f.trim() !== '')
      });
      await loadData();
      setShowPackageForm(false);
      setPackageForm({ name: '', price: '', originalPrice: '', commission: '', selectedCourses: [], features: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditPackageSave = async (e) => {
    e.preventDefault();
    if (!editingPackage) return;
    try {
      const formattedPkg = {
        ...editingPackage,
        price: parseFloat(editingPackage.price),
        originalPrice: parseFloat(editingPackage.originalPrice),
        commission: parseFloat(editingPackage.commission),
        features: Array.isArray(editingPackage.features) 
          ? editingPackage.features 
          : editingPackage.features.split('\n').filter(f => f.trim() !== '')
      };
      await api.updatePackageApi(editingPackage.id || editingPackage._id, formattedPkg);
      await loadData();
      setEditingPackage(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeletePackage = async (id) => {
    if (window.confirm('Delete this package bundle?')) {
      try {
        await api.deletePackageApi(id);
        await loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // --- Student Review Handlers ---
  const handleModerateReview = async (reviewId, status) => {
    try {
      await api.moderateReviewApi(reviewId, status);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- Video Testimonial Handlers ---
  const handleVideoTestimonialSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createVideoStoryApi(videoForm);
      await loadData();
      setShowVideoForm(false);
      setVideoForm({ name: '', role: '', courseTag: '', badge: '300% SALARY HIKE', avatar: '', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', quote: '', rating: '5' });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteVideoTestimonial = async (id) => {
    if (window.confirm('Delete this video story?')) {
      try {
        await api.deleteVideoStoryApi(id);
        await loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // --- User Suspension Handlers ---
  const handleToggleUserSuspension = async (userId, currentSuspended) => {
    const action = currentSuspended ? 'Restore' : 'Suspend';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await api.toggleUserSuspensionApi(userId, !currentSuspended);
        alert(`User successfully ${currentSuspended ? 'Restored' : 'Suspended'}.`);
        await loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // --- Payout Handlers ---
  const handleApprovePayout = async (id) => {
    const txnId = window.prompt('Security Gateway Check: Enter UPI Transaction ID for approval:');
    if (txnId) {
      try {
        await api.processAdminPayoutApi(id, 'approved', `Approved with Txn ID: ${txnId}`);
        await loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleRejectPayout = async (id) => {
    if (window.confirm('Reject this referral commission payout request?')) {
      try {
        await api.processAdminPayoutApi(id, 'rejected', 'Rejected by admin');
        await loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // --- Sidebar Component ---
  const renderSidebar = () => (
    <aside className="w-full md:w-64 bg-gradient-to-b from-[#001845] via-[#002B70] to-[#001845] text-white p-6 flex flex-col justify-between shrink-0 shadow-2xl relative border-r border-white/10">
      <div>
        {/* LOGO LINK WRAPPER FIXED */}
        <Link to="/" className="flex items-center gap-2 mb-8 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-gray-950 flex items-center justify-center font-heading font-extrabold text-xl shadow-lg">
            CC
          </div>
          <div>
            <span className="font-heading font-extrabold text-lg text-white block leading-none">ClassConnect</span>
            <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">Admin CMS Control</span>
          </div>
        </Link>

        <nav className="space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'courses', label: 'Courses & Lectures', icon: BookOpen },
            { id: 'live', label: 'Live Masterclasses', icon: Radio },
            { id: 'packages', label: 'Package Bundles', icon: Package },
            { id: 'referrals', label: 'Referral Rules', icon: Sparkles },
            { id: 'testimonials', label: 'Student Reviews', icon: MessageSquare },
            { id: 'video-testimonials', label: 'Video Stories', icon: Video },
            { id: 'users', label: 'Users & Registrations', icon: Users },
            { id: 'payouts', label: 'Payout Requests', icon: DollarSign },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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
          <span>Security & SSL Protected</span>
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          <LogOut size={16} /> <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  // --- Dynamic SVG Graph Component ---
  const renderSVGGraph = () => {
    if (!analytics) return <div className="h-48 flex items-center justify-center text-xs text-gray-400">Loading chart analytics...</div>;

    const data = selectedTrend === 'revenue' ? analytics.revenueHistory : analytics.enrollmentHistory;
    if (!data || data.length === 0) return <div className="h-48 flex items-center justify-center text-xs text-gray-400">No trend history available.</div>;

    const width = 600;
    const height = 240;
    const padding = 40;
    
    const xMax = width - padding * 2;
    const yMax = height - padding * 2;
    
    const xStep = xMax / (data.length - 1);
    const maxValue = Math.max(...data.map(d => selectedTrend === 'revenue' ? d.revenue : d.count), 1);
    
    const points = data.map((d, i) => {
      const val = selectedTrend === 'revenue' ? d.revenue : d.count;
      const x = padding + i * xStep;
      const y = height - padding - (val / maxValue) * yMax;
      return { x, y, month: d.month, val };
    });
    
    const linePath = points.reduce((path, p, i) => {
      return path + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`);
    }, '');
    
    const areaPath = points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
      : '';

    return (
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-heading font-extrabold text-sm text-gray-900 uppercase tracking-wider">
              {selectedTrend === 'revenue' ? 'Monthly Revenue Analytics' : 'Student Enrollments Trend'}
            </h4>
            <p className="text-[11px] text-gray-400">Time-series data retrieved dynamically from database</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedTrend('revenue')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                selectedTrend === 'revenue' ? 'bg-[#001845] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Revenue
            </button>
            <button 
              onClick={() => setSelectedTrend('enrollment')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                selectedTrend === 'enrollment' ? 'bg-[#001845] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Enrollments
            </button>
          </div>
        </div>

        <div className="relative w-full">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-60 overflow-visible">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = padding + ratio * yMax;
              const val = Math.round((1 - ratio) * maxValue);
              return (
                <g key={index} className="opacity-40">
                  <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e2e8f0" strokeDasharray="3" strokeWidth="1" />
                  <text x={padding - 8} y={y + 4} textAnchor="end" className="text-[9px] fill-gray-400 font-mono font-bold">
                    {selectedTrend === 'revenue' ? `₹${val.toLocaleString('en-IN')}` : val}
                  </text>
                </g>
              );
            })}

            {areaPath && <path d={areaPath} fill="url(#chartGrad)" />}
            {linePath && <path d={linePath} fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}

            {points.map((p, index) => (
              <g key={index} className="group/dot cursor-pointer">
                <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="#d97706" strokeWidth="3" />
                
                <g className="opacity-0 group-hover/dot:opacity-100 transition-opacity duration-200">
                  <rect x={p.x - 35} y={p.y - 32} width="70" height="22" rx="6" fill="#1e293b" />
                  <text x={p.x} y={p.y - 17} textAnchor="middle" fill="#ffffff" className="text-[9px] font-bold font-mono">
                    {selectedTrend === 'revenue' ? `₹${p.val.toLocaleString('en-IN')}` : p.val}
                  </text>
                </g>

                <text x={p.x} y={height - padding + 18} textAnchor="middle" className="text-[9px] fill-gray-500 font-bold uppercase">
                  {p.month}
                </text>
              </g>
            ))}
            
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    );
  };

  // --- Dashboard Tab ---
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200/80 p-6 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900">Admin Control Center</h1>
          <p className="text-xs text-gray-500 mt-1">Manage courses, live masterclasses, video stories, and referral payouts.</p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> System Operational
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Courses</span>
          <h3 className="font-heading font-extrabold text-3xl text-gray-900">{courses.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Active Users</span>
          <h3 className="font-heading font-extrabold text-3xl text-[#001845]">{users.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Package Bundles</span>
          <h3 className="font-heading font-extrabold text-3xl text-amber-600">{packages.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Payout Requests</span>
          <h3 className="font-heading font-extrabold text-3xl text-emerald-600">{payouts.length}</h3>
        </div>
      </div>

      {renderSVGGraph()}
    </div>
  );

  // --- Referral Settings Tab ---
  const renderReferralRules = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200/80 p-6 rounded-3xl shadow-sm">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Referral Commission settings</h1>
        <p className="text-xs text-gray-500 mt-1">Configure user referral commission amount for individual courses.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm max-w-xl">
        <form onSubmit={handleSaveReferralSettings} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Select Course *</label>
            <select 
              value={selectedReferralCourse} 
              onChange={e => handleSelectReferralCourse(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900"
              required
            >
              <option value="">-- Choose a Course --</option>
              {courses.map(c => (
                <option key={c.id || c._id} value={c.id || c._id}>{c.title}</option>
              ))}
            </select>
          </div>

          {selectedReferralCourse && (
            <>
              <div className="flex items-center gap-2 py-2">
                <input 
                  type="checkbox" 
                  checked={referralSettings.referralsEnabled}
                  onChange={e => setReferralSettings({ ...referralSettings, referralsEnabled: e.target.checked })}
                  id="referralsEnabled"
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="referralsEnabled" className="text-xs font-bold text-gray-700 uppercase">Enable Referral Rewards</label>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Commission Reward Type *</label>
                <select 
                  value={referralSettings.commissionType}
                  onChange={e => setReferralSettings({ ...referralSettings, commissionType: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Reward Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Commission Value *</label>
                <input 
                  type="number" 
                  value={referralSettings.commissionValue}
                  onChange={e => setReferralSettings({ ...referralSettings, commissionValue: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900"
                  min="0"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer transition-colors"
              >
                Save Referral Configuration
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );

  // --- Testimonials Tab ---
  const renderTestimonials = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200/80 p-6 rounded-3xl shadow-sm">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Student Reviews Moderation</h1>
        <p className="text-xs text-gray-500 mt-1">Review student reviews and ratings submitted for catalog courses.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-heading font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Comment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {testimonials.map(t => (
              <tr key={t.reviewId} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 font-bold text-gray-900">{t.userName} ({t.userEmail})</td>
                <td className="py-3 px-4 text-amber-500 font-bold">★ {t.rating} / 5</td>
                <td className="py-3 px-4 text-gray-600 max-w-sm">{t.comment}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    t.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : t.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="py-3 px-4 flex gap-2">
                  {t.status === 'pending' && (
                    <>
                      <button onClick={() => handleModerateReview(t.reviewId, 'approved')} className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px] hover:bg-emerald-700 cursor-pointer">Approve</button>
                      <button onClick={() => handleModerateReview(t.reviewId, 'rejected')} className="px-2.5 py-1 bg-red-600 text-white font-bold rounded-lg text-[10px] hover:bg-red-700 cursor-pointer">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- Video Testimonials Tab ---
  const renderVideoTestimonials = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200/80 p-6 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900">Student Video Stories</h1>
          <p className="text-xs text-gray-500 mt-1">Manage video testimonials displayed on the homepage.</p>
        </div>
        <button 
          onClick={() => setShowVideoForm(true)} 
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-950 font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} /> Add Video Story
        </button>
      </div>

      {showVideoForm && (
        <form onSubmit={handleVideoTestimonialSubmit} className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-4 max-w-2xl">
          <h3 className="font-heading font-extrabold text-lg text-gray-900">Add New Video Testimonial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Student Name *</label>
              <input type="text" value={videoForm.name} onChange={e => setVideoForm({ ...videoForm, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Student Role *</label>
              <input type="text" value={videoForm.role} onChange={e => setVideoForm({ ...videoForm, role: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" required placeholder="e.g. Fullstack Developer" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Course Tag *</label>
              <input type="text" value={videoForm.courseTag} onChange={e => setVideoForm({ ...videoForm, courseTag: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" required placeholder="e.g. React & Node Masterclass" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Badge Highlight *</label>
              <input type="text" value={videoForm.badge} onChange={e => setVideoForm({ ...videoForm, badge: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" required />
            </div>
            <div className="md:col-span-2">
              <MediaUploader 
                value={videoForm.videoUrl} 
                onChange={url => setVideoForm({ ...videoForm, videoUrl: url })} 
                label="Student Story Video (Upload directly to Bunny Storage CDN) *" 
                type="video"
                subfolder="video-stories"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Rating *</label>
              <input type="number" value={videoForm.rating} onChange={e => setVideoForm({ ...videoForm, rating: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" min="1" max="5" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Quote Description *</label>
            <textarea value={videoForm.quote} onChange={e => setVideoForm({ ...videoForm, quote: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" rows="2" required />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-5 py-2.5 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer">Save Story</button>
            <button type="button" onClick={() => setShowVideoForm(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoTestimonials.map(v => (
          <div key={v.id || v._id} className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">{v.badge}</span>
                <span className="text-[10px] text-gray-400 font-bold">{v.courseTag}</span>
              </div>
              <h4 className="font-heading font-extrabold text-sm text-gray-900">{v.name}</h4>
              <p className="text-[10px] text-gray-500 font-medium mb-2">{v.role}</p>
              <p className="text-gray-600 text-xs italic leading-relaxed">"{v.quote}"</p>
            </div>
            <button 
              onClick={() => handleDeleteVideoTestimonial(v.id || v._id)} 
              className="py-2 bg-red-50 hover:bg-red-100 text-red-600 font-heading font-bold text-[10px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1 border border-red-200 cursor-pointer"
            >
              <Trash2 size={12} /> Delete Story
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // --- Courses Tab ---
  const renderCourses = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200/80 p-6 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900">Courses & Unit Lectures</h1>
          <p className="text-xs text-gray-500 mt-1">Add courses, set Bunny CDN video streams, and edit unit modules.</p>
        </div>
        <button 
          onClick={() => setShowCourseForm(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-950 font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} /> Add Course
        </button>
      </div>

      {showCourseForm && (
        <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md">
          <h3 className="font-heading font-extrabold text-lg text-gray-900 mb-4">Create New Masterclass Course</h3>
          <form onSubmit={handleCourseSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Course Title *</label>
                <input type="text" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900" placeholder="e.g. React 19 & Next.js 15 Pro" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category *</label>
                <select value={courseForm.category} onChange={e => setCourseForm({...courseForm, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900">
                  <option value="Development">Development</option>
                  <option value="Marketing">Marketing</option>
                  <option value="AI & Tech">AI & Tech</option>
                  <option value="Design">Design</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Discounted Price (₹) *</label>
                <input type="number" value={courseForm.price} onChange={e => setCourseForm({...courseForm, price: e.target.value})} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Original Strikethrough Price (₹) *</label>
                <input type="number" value={courseForm.originalPrice} onChange={e => setCourseForm({...courseForm, originalPrice: e.target.value})} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900" />
              </div>
            </div>

            <MediaUploader 
              value={courseForm.thumbnail}
              onChange={url => setCourseForm({...courseForm, thumbnail: url})}
              label="Course Cover Photo Upload"
              type="image"
              subfolder="courses"
            />

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Course Description *</label>
              <textarea value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} required rows="2" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900" placeholder="Course overview..." />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="px-5 py-2.5 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer">Save Course</button>
              <button type="button" onClick={() => setShowCourseForm(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Courses List Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-heading font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Units Count</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.map(course => (
              <tr key={course.id || course._id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-2">
                  <img src={course.thumbnail} alt={course.title} className="w-10 h-8 rounded-lg object-cover" />
                  <span>{course.title}</span>
                </td>
                <td className="py-3 px-4 text-gray-600">{course.category}</td>
                <td className="py-3 px-4 font-extrabold text-amber-600">₹{course.price?.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 text-gray-700">{course.units?.length || 0} Units</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <button 
                    onClick={() => setActiveLectureCourse(course)} 
                    className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200 hover:bg-blue-100 cursor-pointer"
                  >
                    Manage Units & Lectures
                  </button>
                  <button 
                    onClick={() => handleDeleteCourse(course.id || course._id)} 
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RESTRUCTURED STRICT UNIT-WISE LECTURE MANAGEMENT MODAL */}
      {activeLectureCourse && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 max-w-4xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setActiveLectureCourse(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <X size={20} />
            </button>

            <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-1">
              Course Module Restructure: {activeLectureCourse.title}
            </h3>
            <p className="text-xs text-gray-500 mb-6">Manage Units and edit lectures dynamically inside each Unit.</p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Side: Units & Lecture Listing */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h4 className="font-heading font-extrabold text-sm text-gray-800 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-amber-500 rounded-full"></span>
                    Existing Curriculum Modules
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Total Units: {activeLectureCourse.units?.length || 0}
                  </span>
                </div>

                <div className="space-y-5 max-h-[58vh] overflow-y-auto pr-2 custom-scrollbar">
                  {(!activeLectureCourse.units || activeLectureCourse.units.length === 0) && (
                    <div className="p-12 text-center text-xs text-gray-400 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                      No units configured yet. Create a unit on the right panel.
                    </div>
                  )}

                  {activeLectureCourse.units?.map((unit, uIdx) => {
                    const cleanUnitTitle = unit.title.toUpperCase().startsWith('UNIT') 
                      ? unit.title 
                      : `Unit ${uIdx + 1}: ${unit.title}`;

                    return (
                      <div key={unit.id} className="border border-slate-200/80 rounded-3xl p-5 bg-slate-50/40 shadow-sm space-y-4 hover:shadow-md transition-all hover:bg-slate-50">
                        
                        {/* Unit Header */}
                        <div className="flex items-start justify-between border-b border-slate-200/60 pb-3">
                          {editingUnitId === unit.id ? (
                            <div className="flex-grow space-y-3 mr-4">
                              <input 
                                type="text" 
                                value={editingUnitForm.title} 
                                onChange={e => setEditingUnitForm({ ...editingUnitForm, title: e.target.value })} 
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all" 
                              />
                              <input 
                                type="text" 
                                value={editingUnitForm.description} 
                                onChange={e => setEditingUnitForm({ ...editingUnitForm, description: e.target.value })} 
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all" 
                              />
                              <div className="flex gap-2">
                                <button onClick={() => handleUpdateUnit(unit.id)} className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-950 font-heading font-extrabold text-[10px] uppercase rounded-xl cursor-pointer shadow">Save</button>
                                <button onClick={() => setEditingUnitId(null)} className="px-3.5 py-1.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-[10px] uppercase cursor-pointer">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <h5 className="font-heading font-extrabold text-xs text-gray-900 uppercase tracking-wide">
                                {cleanUnitTitle}
                              </h5>
                              <p className="text-[10px] text-gray-500 leading-relaxed font-medium">{unit.description || 'No description provided'}</p>
                            </div>
                          )}

                          {editingUnitId !== unit.id && (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => {
                                  setEditingUnitId(unit.id);
                                  setEditingUnitForm({ title: unit.title, description: unit.description || '' });
                                }} 
                                className="p-2 bg-white hover:bg-amber-50 hover:text-amber-600 text-slate-500 rounded-xl border border-slate-200 shadow-sm cursor-pointer transition-all"
                                title="Edit Unit details"
                              >
                                <Edit size={12} />
                              </button>
                              <button 
                                onClick={() => handleDeleteUnit(unit.id)} 
                                className="p-2 bg-white hover:bg-red-50 hover:text-red-500 text-slate-500 rounded-xl border border-slate-200 shadow-sm cursor-pointer transition-all"
                                title="Delete Unit"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Lectures under Unit */}
                        <div className="space-y-2.5">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Lectures inside unit</span>
                          
                          {(!unit.lessons || unit.lessons.length === 0) ? (
                            <p className="text-[10px] text-slate-400 italic font-medium pl-1">No lectures configured inside this unit module.</p>
                          ) : (
                            <div className="space-y-2">
                              {unit.lessons.map((les) => (
                                <div key={les.id} className={`bg-white border rounded-2xl p-4 flex items-center justify-between text-xs transition-all ${editingLessonId === les.id ? 'border-amber-500 ring-4 ring-amber-500/10 bg-amber-500/5' : 'border-slate-100 hover:border-amber-200 hover:shadow-sm'}`}>
                                  <div className="space-y-1 pr-4">
                                    <span className="font-heading font-extrabold text-gray-900 block text-xs">{les.title}</span>
                                    <div className="flex flex-wrap items-center gap-2 text-slate-500 text-[10px] font-medium">
                                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">{Math.round(les.duration / 60)} mins</span>
                                      <span>•</span>
                                      {les.isFreePreview ? (
                                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-700 text-[8px] font-extrabold uppercase rounded-full border border-emerald-500/20 tracking-wider">Free Preview</span>
                                      ) : (
                                        <span className="px-2 py-0.5 bg-slate-500/10 text-slate-600 text-[8px] font-extrabold uppercase rounded-full border border-slate-500/20 tracking-wider">Locked</span>
                                      )}
                                      {les.videoUrl && (
                                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-700 text-[8px] font-extrabold uppercase rounded-full border border-blue-500/20 tracking-wider">Bunny CDN Linked</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 flex-shrink-0">
                                    <button 
                                      onClick={() => {
                                        setEditingLessonId(les.id);
                                        setEditingLessonForm({
                                          unitId: unit.id, id: les.id, title: les.title, description: les.description || '',
                                          duration: String(les.duration), isFreePreview: les.isFreePreview, videoUrl: les.videoUrl, bunnyVideoId: les.bunnyVideoId || ''
                                        });
                                      }}
                                      className={`p-2 rounded-xl border transition-all cursor-pointer ${editingLessonId === les.id ? 'bg-amber-500 text-gray-950 border-amber-500 shadow-md' : 'bg-slate-50 hover:bg-amber-50 hover:text-amber-600 border-slate-200/60'}`}
                                      title="Edit lecture video properties"
                                    >
                                      <Edit size={12} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteLesson(unit.id, les.id)}
                                      className="p-2 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-xl text-red-500 cursor-pointer border border-slate-200/60 transition-all"
                                      title="Remove lecture"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          <button 
                            onClick={() => {
                              setEditingLessonId(null);
                              setNewLessonForm({ ...newLessonForm, unitId: unit.id });
                            }}
                            className="w-full py-2 mt-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 font-heading font-extrabold text-[10px] uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-amber-500/20 transition-all shadow-sm"
                          >
                            <Plus size={12} /> Add Lecture to this Unit
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Add Unit / Add Lecture / Edit Lecture Forms */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. Edit Lecture Form (Shown when active) */}
                {editingLessonId ? (
                  <form onSubmit={handleUpdateLesson} className="bg-amber-500/5 p-5 rounded-3xl border border-amber-200/60 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-amber-200/40 pb-2">
                      <h4 className="font-heading font-extrabold text-xs text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
                        <Edit size={12} /> Edit Lecture Details
                      </h4>
                      <button type="button" onClick={() => setEditingLessonId(null)} className="text-amber-800 hover:text-amber-950 cursor-pointer"><X size={14} /></button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Lecture Title *</label>
                      <input type="text" value={editingLessonForm.title} onChange={e => setEditingLessonForm({ ...editingLessonForm, title: e.target.value })} required className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Duration (Seconds)</label>
                        <input type="number" value={editingLessonForm.duration} onChange={e => setEditingLessonForm({ ...editingLessonForm, duration: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all" />
                      </div>
                      <div className="flex items-center gap-1.5 pt-4">
                        <input type="checkbox" checked={editingLessonForm.isFreePreview} onChange={e => setEditingLessonForm({ ...editingLessonForm, isFreePreview: e.target.checked })} id="editIsFreePreview" className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4" />
                        <label htmlFor="editIsFreePreview" className="text-[10px] font-bold text-gray-700 uppercase cursor-pointer">Free Preview</label>
                      </div>
                    </div>

                    <MediaUploader 
                      value={editingLessonForm.videoUrl}
                      onChange={url => setEditingLessonForm({ ...editingLessonForm, videoUrl: url })}
                      label="Lecture Video File Upload (MP4 / Bunny Stream CDN)"
                      type="video"
                      subfolder="lessons"
                    />

                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Bunny Video ID</label>
                      <input type="text" value={editingLessonForm.bunnyVideoId} onChange={e => setEditingLessonForm({ ...editingLessonForm, bunnyVideoId: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all" placeholder="e.g. bunny_vid_xyz" />
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button type="submit" className="flex-grow py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-gray-950 font-heading font-extrabold text-[10px] uppercase tracking-wider rounded-xl shadow transition-all cursor-pointer">
                        Save Changes
                      </button>
                      <button type="button" onClick={() => setEditingLessonId(null)} className="px-4 py-3 bg-slate-100 text-gray-700 font-bold text-[10px] uppercase rounded-xl cursor-pointer">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : newLessonForm.unitId ? (
                  // 2. Add Lecture Form
                  <form onSubmit={handleAddLesson} className="bg-amber-500/5 p-6 rounded-3xl border border-amber-200/60 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-amber-200/40 pb-2">
                      <h4 className="font-heading font-extrabold text-xs text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
                        <Plus size={12} /> Add Lecture Video
                      </h4>
                      <button type="button" onClick={() => setNewLessonForm({ ...newLessonForm, unitId: '' })} className="text-amber-800 hover:text-amber-950 cursor-pointer"><X size={14} /></button>
                    </div>

                    <div className="p-2.5 bg-white/70 rounded-xl border text-[10px] text-slate-600 font-bold border-amber-200/30">
                      Adding to: <strong>Unit {activeLectureCourse.units.findIndex(u => u.id === newLessonForm.unitId) + 1}</strong>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Lecture Title *</label>
                      <input type="text" value={newLessonForm.title} onChange={e => setNewLessonForm({ ...newLessonForm, title: e.target.value })} required className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all" placeholder="e.g. Masterclass Roadmaps" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Duration (Seconds)</label>
                        <input type="number" value={newLessonForm.duration} onChange={e => setNewLessonForm({ ...newLessonForm, duration: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all" />
                      </div>
                      <div className="flex items-center gap-1.5 pt-4">
                        <input type="checkbox" checked={newLessonForm.isFreePreview} onChange={e => setNewLessonForm({ ...newLessonForm, isFreePreview: e.target.checked })} id="isFreePreview" className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4" />
                        <label htmlFor="isFreePreview" className="text-[10px] font-bold text-gray-700 uppercase cursor-pointer">Free Preview</label>
                      </div>
                    </div>

                    <MediaUploader 
                      value={newLessonForm.videoUrl}
                      onChange={url => setNewLessonForm({ ...newLessonForm, videoUrl: url })}
                      label="Lecture Video File Upload (MP4 / Bunny Stream CDN)"
                      type="video"
                      subfolder="lessons"
                    />

                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Bunny Video ID</label>
                      <input type="text" value={newLessonForm.bunnyVideoId} onChange={e => setNewLessonForm({ ...newLessonForm, bunnyVideoId: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all" placeholder="e.g. bunny_vid_xyz" />
                    </div>

                    <button type="submit" className="w-full py-3 bg-gradient-to-r from-[#001845] to-[#002B70] hover:from-[#002B70] hover:to-[#003C85] text-white font-heading font-extrabold text-[10px] uppercase tracking-wider rounded-xl shadow shadow-[#001845]/20 cursor-pointer transition-all active:scale-[0.98]">
                      Save & Add Lecture
                    </button>
                  </form>
                ) : (
                  // 3. Add Unit Form
                  <form onSubmit={handleAddUnit} className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-sm">
                    <h4 className="font-heading font-extrabold text-xs text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                      <Plus size={12} /> Add New Unit Module
                    </h4>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Unit Title *</label>
                      <input type="text" value={newUnitForm.title} onChange={e => setNewUnitForm({ ...newUnitForm, title: e.target.value })} placeholder="e.g. Unit 3: Advanced Hooks" required className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Unit Description</label>
                      <input type="text" value={newUnitForm.description} onChange={e => setNewUnitForm({ ...newUnitForm, description: e.target.value })} placeholder="Brief outline..." className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-gray-950 font-heading font-extrabold text-[10px] uppercase tracking-wider rounded-xl shadow cursor-pointer transition-all active:scale-[0.98]">
                      Create Unit
                    </button>
                  </form>
                )}

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );

  // --- Live Sessions Tab ---
  const renderLiveSessions = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200/80 p-6 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900">Live Masterclasses</h1>
          <p className="text-xs text-gray-500 mt-1">Schedule live classes and launch instructor WebRTC studio feeds.</p>
        </div>
        <button 
          onClick={() => setShowLiveForm(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-950 font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Radio size={16} /> Create Live Class
        </button>
      </div>

      {showLiveForm && (
        <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md">
          <h3 className="font-heading font-extrabold text-lg text-gray-900 mb-4">Create Live Masterclass</h3>
          <form onSubmit={handleLiveSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Course *</label>
                <select value={liveForm.courseId} onChange={e => setLiveForm({ ...liveForm, courseId: e.target.value, unitId: courses.find(c => c.id === e.target.value || c._id === e.target.value)?.units?.[0]?.id || '' })} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900">
                  <option value="">Select Course...</option>
                  {courses.map(c => (
                    <option key={c.id || c._id} value={c.id || c._id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Unit ID *</label>
                <select value={liveForm.unitId} onChange={e => setLiveForm({ ...liveForm, unitId: e.target.value })} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900">
                  <option value="">Select Unit...</option>
                  {courses.find(c => c.id === liveForm.courseId || c._id === liveForm.courseId)?.units?.map(u => (
                    <option key={u.id} value={u.id}>{u.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Session Title *</label>
                <input type="text" value={liveForm.title} onChange={e => setLiveForm({...liveForm, title: e.target.value})} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900" placeholder="e.g. Live Q&A & Code Review" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Scheduled At *</label>
                <input type="datetime-local" value={liveForm.scheduledAt} onChange={e => setLiveForm({...liveForm, scheduledAt: e.target.value})} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900" />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="px-5 py-2.5 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer">Schedule Class</button>
              <button type="button" onClick={() => setShowLiveForm(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Live sessions List */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-heading font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Class Session Details</th>
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {liveSessions.map(sess => {
              const courseTitle = courses.find(c => c.id === sess.courseId || c._id === sess.courseId)?.title || 'Global Course';
              return (
                <tr key={sess.sessionId} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-bold text-gray-900">
                    <span className="block">{sess.title}</span>
                    <span className="text-[10px] text-gray-400 font-mono">ID: {sess.sessionId}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{courseTitle}</td>
                  <td className="py-3 px-4 text-gray-700 font-medium">
                    {new Date(sess.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      sess.status === 'live' 
                        ? 'bg-red-100 text-red-800 border border-red-200' 
                        : sess.status === 'ended' 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sess.status === 'live' ? '🔴 LIVE' : sess.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    {sess.status !== 'ended' && (
                      <button 
                        onClick={() => setActiveStudioSession(sess)}
                        className="px-3 py-1 bg-amber-500 text-gray-950 font-bold rounded-lg border border-amber-400 hover:bg-amber-600 cursor-pointer text-[10px] uppercase"
                      >
                        Enter Broadcast Studio
                      </button>
                    )}
                    {sess.status === 'live' && (
                      <button 
                        onClick={() => handleUpdateLiveStatus(sess.sessionId, 'ended')}
                        className="px-3 py-1 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 cursor-pointer text-[10px] uppercase"
                      >
                        End Broadcast
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- Packages Tab ---
  const renderPackages = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200/80 p-6 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900">Package Bundles</h1>
          <p className="text-xs text-gray-500 mt-1">Configure starter, growth, and gold learning bundles with direct affiliate referral rewards.</p>
        </div>
        <button 
          onClick={() => setShowPackageForm(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-950 font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} /> Add Package
        </button>
      </div>

      {showPackageForm && (
        <form onSubmit={handlePackageSubmit} className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-4 max-w-2xl">
          <h3 className="font-heading font-extrabold text-lg text-gray-900">Create New Bundle Package</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Package Name *</label>
              <input type="text" value={packageForm.name} onChange={e => setPackageForm({ ...packageForm, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Discount Price (₹) *</label>
              <input type="number" value={packageForm.price} onChange={e => setPackageForm({ ...packageForm, price: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Original Price (₹) *</label>
              <input type="number" value={packageForm.originalPrice} onChange={e => setPackageForm({ ...packageForm, originalPrice: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Referral Commission (₹) *</label>
              <input type="number" value={packageForm.commission} onChange={e => setPackageForm({ ...packageForm, commission: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Features (One per line) *</label>
            <textarea value={packageForm.features} onChange={e => setPackageForm({ ...packageForm, features: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" rows="2" required placeholder="e.g. Lifetime Access&#10;1-on-1 Mentorship" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Bundled Courses *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-200">
              {courses.map(course => {
                const targetId = course.id || course._id;
                const isChecked = (packageForm.selectedCourses || []).includes(targetId);
                return (
                  <label key={targetId} className="flex items-center gap-2 text-xs font-semibold text-gray-800 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={e => {
                        const newCourses = e.target.checked 
                          ? [...(packageForm.selectedCourses || []), targetId]
                          : (packageForm.selectedCourses || []).filter(cid => cid !== targetId);
                        setPackageForm({ ...packageForm, selectedCourses: newCourses });
                      }}
                      className="rounded text-amber-500 focus:ring-amber-500 w-3.5 h-3.5"
                    />
                    <span className="truncate">{course.title}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-5 py-2.5 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer">Save Package</button>
            <button type="button" onClick={() => setShowPackageForm(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer">Cancel</button>
          </div>
        </form>
      )}

      {editingPackage && (
        <form onSubmit={handleEditPackageSave} className="bg-white p-6 rounded-3xl border border-blue-200 shadow-md space-y-4 max-w-2xl">
          <h3 className="font-heading font-extrabold text-lg text-gray-900">Update Package Bundle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Package Name *</label>
              <input type="text" value={editingPackage.name} onChange={e => setEditingPackage({ ...editingPackage, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Discount Price (₹) *</label>
              <input type="number" value={editingPackage.price} onChange={e => setEditingPackage({ ...editingPackage, price: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Original Price (₹) *</label>
              <input type="number" value={editingPackage.originalPrice} onChange={e => setEditingPackage({ ...editingPackage, originalPrice: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Referral Commission (₹) *</label>
              <input type="number" value={editingPackage.commission} onChange={e => setEditingPackage({ ...editingPackage, commission: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Features (One per line) *</label>
            <textarea 
              value={Array.isArray(editingPackage.features) ? editingPackage.features.join('\n') : editingPackage.features} 
              onChange={e => setEditingPackage({ ...editingPackage, features: e.target.value })} 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" 
              rows="2" 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Bundled Courses *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-200">
              {courses.map(course => {
                const targetId = course.id || course._id;
                const isChecked = (editingPackage.selectedCourses || []).includes(targetId);
                return (
                  <label key={targetId} className="flex items-center gap-2 text-xs font-semibold text-gray-800 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={e => {
                        const newCourses = e.target.checked 
                          ? [...(editingPackage.selectedCourses || []), targetId]
                          : (editingPackage.selectedCourses || []).filter(cid => cid !== targetId);
                        setEditingPackage({ ...editingPackage, selectedCourses: newCourses });
                      }}
                      className="rounded text-amber-500 focus:ring-amber-500 w-3.5 h-3.5"
                    />
                    <span className="truncate">{course.title}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-5 py-2.5 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer">Save Changes</button>
            <button type="button" onClick={() => setEditingPackage(null)} className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer">Cancel</button>
          </div>
        </form>
      )}

      {/* Packages Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-heading font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Package</th>
              <th className="py-3 px-4">Discount Price</th>
              <th className="py-3 px-4">Original Price</th>
              <th className="py-3 px-4">Referral Commission</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {packages.map(pkg => (
              <tr key={pkg.id || pkg._id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 font-bold text-gray-900">{pkg.name}</td>
                <td className="py-3 px-4 text-gray-700 font-semibold">₹{pkg.price}</td>
                <td className="py-3 px-4 text-gray-400 line-through">₹{pkg.originalPrice}</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">₹{pkg.commission} Payout</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <button 
                    onClick={() => setEditingPackage({
                      id: pkg.id || pkg._id,
                      _id: pkg._id,
                      name: pkg.name || '',
                      price: pkg.price || '',
                      originalPrice: pkg.originalPrice || '',
                      commission: pkg.commission || 0,
                      selectedCourses: pkg.selectedCourses || [],
                      features: Array.isArray(pkg.features) ? pkg.features.join('\n') : (pkg.features || '')
                    })} 
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeletePackage(pkg.id || pkg._id)} 
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- Users & Registrations Tab ---
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200/80 p-6 rounded-3xl shadow-sm">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Registered Users & Students</h1>
        <p className="text-xs text-gray-500 mt-1">Review student registries, course enrollments, and toggle platform access.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-heading font-bold uppercase tracking-wider">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Registered On</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id || u._id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4">
                  <span className="font-bold text-gray-900 block">{u.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{u.email}</span>
                </td>
                <td className="py-3 px-4 uppercase font-bold text-gray-500">{u.role}</td>
                <td className="py-3 px-4 text-gray-600">
                  {new Date(u.createdAt).toLocaleDateString([], { dateStyle: 'medium' })}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${u.isSuspended ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-emerald-100 text-emerald-800'}`}>
                    {u.isSuspended ? 'Suspended Banned' : 'Active'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {u.role !== 'admin' && (
                    <button 
                      onClick={() => handleToggleUserSuspension(u.id || u._id, u.isSuspended)}
                      className={`px-3 py-1 font-bold rounded-lg text-[10px] uppercase tracking-wider cursor-pointer border ${
                        u.isSuspended 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                      }`}
                    >
                      {u.isSuspended ? 'Take Suspension Back (Restore)' : 'Suspend user'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- Payouts Tab ---
  const renderPayouts = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200/80 p-6 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900">Referral Payout Requests</h1>
          <p className="text-xs text-gray-500 mt-1">Review and process student commission payouts via encrypted UPI verification.</p>
        </div>
      </div>
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-heading font-bold uppercase tracking-wider">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">UPI ID</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payouts.map(p => (
              <tr key={p.requestId} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 font-bold text-gray-900">{p.userEmail}</td>
                <td className="py-3 px-4 font-extrabold text-emerald-600">₹{p.amount?.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 font-mono text-gray-700">{p.paymentDetails || 'user@upi'}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${p.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : p.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {p.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprovePayout(p.requestId)} className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 cursor-pointer">Approve</button>
                      <button onClick={() => handleRejectPayout(p.requestId)} className="px-3 py-1 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 cursor-pointer">Reject</button>
                    </div>
                  ) : (
                    <span className="font-mono text-gray-400">{p.adminNotes || 'PROCESSED'}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'courses': return renderCourses();
      case 'live': return renderLiveSessions();
      case 'packages': return renderPackages();
      case 'referrals': return renderReferralRules();
      case 'testimonials': return renderTestimonials();
      case 'video-testimonials': return renderVideoTestimonials();
      case 'users': return renderUsers();
      case 'payouts': return renderPayouts();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FA] flex flex-col md:flex-row text-gray-900 font-sans">
      {renderSidebar()}
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto min-w-0">
        {renderContent()}
      </main>

      {/* Fullscreen Broadcast Studio Environment */}
      {activeStudioSession && (
        <LiveStudio 
          session={activeStudioSession} 
          onClose={() => setActiveStudioSession(null)} 
          onUpdateStatus={handleUpdateLiveStatus}
          onReloadUsers={loadData}
        />
      )}
    </div>
  );
};

export default AdminCMS;
