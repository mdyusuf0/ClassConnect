import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Package, MessageSquare, 
  Users, DollarSign, LogOut, Plus, Edit, Trash2, 
  Check, X, Image as ImageIcon, Video, Sparkles, Radio, PlayCircle, Upload, Layers, ShieldCheck, Lock, ChevronRight
} from 'lucide-react';
import store from '../data/mockStore';
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

  // Unit-wise Lecture Management State
  const [activeLectureCourse, setActiveLectureCourse] = useState(null);
  const [lectureForm, setLectureForm] = useState({
    unitNumber: '1',
    unitTitle: 'Unit 1: Core Fundamentals',
    title: '',
    description: '',
    duration: '15:00',
    isFreePreview: false,
    videoUrl: '',
    thumbnailUrl: ''
  });

  // Live Session State
  const [showLiveForm, setShowLiveForm] = useState(false);
  const [activeStudioSession, setActiveStudioSession] = useState(null);
  const [liveForm, setLiveForm] = useState({
    title: '', instructor: 'ClassConnect PRO Mentors', courseId: '', scheduledAt: '', 
    streamUrl: '', coverImage: '', recordingUrl: ''
  });

  // Package Form State
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [packageForm, setPackageForm] = useState({
    name: '', price: '', originalPrice: '', commission: '',
    selectedCourses: [], features: ''
  });

  // Testimonial Form State
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({
    name: '', role: '', content: '', rating: '5', avatar: ''
  });

  // Video Testimonial Form State
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [videoForm, setVideoForm] = useState({
    name: '', role: '', courseTag: '', badge: '300% SALARY HIKE',
    avatar: '', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quote: '', rating: '5'
  });

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      loadData();
    }
  }, [currentUser]);

  // Listen to global store update events for dynamic multi-tab sync
  useEffect(() => {
    const handleStoreUpdate = () => loadData();
    window.addEventListener('classconnect_store_update', handleStoreUpdate);
    return () => window.removeEventListener('classconnect_store_update', handleStoreUpdate);
  }, []);

  const loadData = () => {
    setCourses(store.getCourses() || []);
    setPackages(store.getPackages() || []);
    setUsers(store.getUsers() || []);
    setPayouts(store.getPayoutRequests() || []);
    setLiveSessions(store.getLiveSessions ? store.getLiveSessions() : []);
    setVideoTestimonials(store.getVideoTestimonials ? store.getVideoTestimonials() : []);
    setTestimonials(store.getTestimonials ? store.getTestimonials() : []);
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // --- Course Handlers ---
  const handleCourseSubmit = (e) => {
    e.preventDefault();
    const newCourse = {
      ...courseForm,
      price: parseFloat(courseForm.price) || 2499,
      originalPrice: parseFloat(courseForm.originalPrice) || 4999,
      id: 'c' + Date.now(),
      lessons: parseInt(courseForm.lessons) || 0
    };
    if (store.addCourse) store.addCourse(newCourse);
    loadData();
    setShowCourseForm(false);
    setCourseForm({ title: '', category: 'Development', description: '', thumbnail: '', duration: '4 Weeks', lessons: '24', level: 'Beginner', featured: true, price: '2499', originalPrice: '4999' });
  };

  const handleEditCourseSave = (e) => {
    e.preventDefault();
    if (!editingCourse) return;
    if (store.updateCourse) {
      store.updateCourse(editingCourse.id, editingCourse);
    }
    loadData();
    setEditingCourse(null);
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm('Security Alert: Are you sure you want to delete this course?')) {
      if (store.deleteCourse) store.deleteCourse(id);
      loadData();
    }
  };

  // --- Unit-wise Lecture Handlers ---
  const handleAddLectureSubmit = (e) => {
    e.preventDefault();
    if (!activeLectureCourse) return;

    const newLesson = store.addLectureToCourse(
      activeLectureCourse.id,
      lectureForm.unitNumber,
      lectureForm.unitTitle,
      lectureForm
    );

    if (newLesson) {
      alert(`Lecture "${newLesson.title}" added to Unit ${lectureForm.unitNumber}!`);
      setLectureForm({
        unitNumber: '1',
        unitTitle: 'Unit 1: Core Fundamentals',
        title: '',
        description: '',
        duration: '15:00',
        isFreePreview: false,
        videoUrl: '',
        thumbnailUrl: ''
      });
      loadData();
      const updatedCourse = store.getCourseById(activeLectureCourse.id);
      setActiveLectureCourse(updatedCourse);
    }
  };

  const handleDeleteLecture = (unitNumber, lessonId) => {
    if (!activeLectureCourse) return;
    if (window.confirm('Delete this lecture video unit?')) {
      store.deleteLectureFromCourse(activeLectureCourse.id, unitNumber, lessonId);
      loadData();
      const updatedCourse = store.getCourseById(activeLectureCourse.id);
      setActiveLectureCourse(updatedCourse);
    }
  };

  // --- Live Session Handlers ---
  const handleLiveSubmit = (e) => {
    e.preventDefault();
    const newSession = {
      ...liveForm,
      id: 'ls-' + Date.now(),
      status: 'SCHEDULED',
      createdAt: new Date().toISOString()
    };
    if (store.addLiveSession) store.addLiveSession(newSession);
    loadData();
    setShowLiveForm(false);
    setLiveForm({ title: '', instructor: 'ClassConnect PRO Mentors', courseId: '', scheduledAt: '', streamUrl: '', coverImage: '', recordingUrl: '' });
  };

  const handleUpdateLiveStatus = (id, status) => {
    if (store.updateLiveSessionStatus) store.updateLiveSessionStatus(id, status);
    loadData();
  };

  const handleDeleteLiveSession = (id) => {
    if (window.confirm('Delete this live masterclass session?')) {
      if (store.deleteLiveSession) store.deleteLiveSession(id);
      loadData();
    }
  };

  // --- Package Handlers ---
  const handlePackageSubmit = (e) => {
    e.preventDefault();
    const newPackage = {
      ...packageForm,
      id: 'pkg-' + Date.now(),
      price: parseFloat(packageForm.price),
      originalPrice: parseFloat(packageForm.originalPrice),
      commission: parseFloat(packageForm.commission),
      features: packageForm.features.split('\n').filter(f => f.trim() !== '')
    };
    if (store.addPackage) store.addPackage(newPackage);
    loadData();
    setShowPackageForm(false);
    setPackageForm({ name: '', price: '', originalPrice: '', commission: '', selectedCourses: [], features: '' });
  };

  const handleEditPackageSave = (e) => {
    e.preventDefault();
    if (!editingPackage) return;
    if (store.updatePackage) {
      store.updatePackage(editingPackage.id, editingPackage);
    }
    loadData();
    setEditingPackage(null);
  };

  const handleDeletePackage = (id) => {
    if (window.confirm('Delete this package bundle?')) {
      if (store.deletePackage) store.deletePackage(id);
      loadData();
    }
  };

  // --- Video & Testimonial Handlers ---
  const handleVideoTestimonialSubmit = (e) => {
    e.preventDefault();
    if (store.addVideoTestimonial) {
      store.addVideoTestimonial(videoForm);
    }
    loadData();
    setShowVideoForm(false);
    setVideoForm({
      name: '', role: '', courseTag: '', badge: '300% SALARY HIKE',
      avatar: '', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      quote: '', rating: '5'
    });
  };

  const handleDeleteVideoTestimonial = (id) => {
    if (window.confirm('Delete this video testimonial?')) {
      if (store.deleteVideoTestimonial) store.deleteVideoTestimonial(id);
      loadData();
    }
  };

  // --- Security Payout Handlers ---
  const handleApprovePayout = (id) => {
    const txnId = window.prompt('Security Gateway Check: Enter UPI Transaction ID for approval:');
    if (txnId) {
      if (store.approvePayout) store.approvePayout(id, txnId);
      loadData();
    }
  };

  const handleRejectPayout = (id) => {
    if (window.confirm('Reject this referral commission payout request?')) {
      if (store.rejectPayout) store.rejectPayout(id);
      loadData();
    }
  };

  // --- Sidebar Component ---
  const renderSidebar = () => (
    <aside className="w-full md:w-64 bg-gradient-to-b from-[#001845] via-[#002B70] to-[#001845] text-white p-6 flex flex-col justify-between shrink-0 shadow-2xl relative border-r border-white/10">
      <div>
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-gray-950 flex items-center justify-center font-heading font-extrabold text-xl shadow-lg">
            CC
          </div>
          <div>
            <span className="font-heading font-extrabold text-lg text-white block leading-none">ClassConnect</span>
            <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">Admin CMS Control</span>
          </div>
        </div>

        <nav className="space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'courses', label: 'Courses & Lectures', icon: BookOpen },
            { id: 'live', label: 'Live Masterclasses', icon: Radio },
            { id: 'packages', label: 'Package Bundles', icon: Package },
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
              <th className="py-3 px-4">Lessons</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-2">
                  <img src={course.thumbnail} alt={course.title} className="w-10 h-8 rounded-lg object-cover" />
                  <span>{course.title}</span>
                </td>
                <td className="py-3 px-4 text-gray-600">{course.category}</td>
                <td className="py-3 px-4 font-extrabold text-amber-600">₹{course.price?.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 text-gray-700">{course.lessons || 24} Lectures</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <button 
                    onClick={() => setActiveLectureCourse(course)} 
                    className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200 hover:bg-blue-100 cursor-pointer"
                  >
                    Manage Units
                  </button>
                  <button 
                    onClick={() => handleDeleteCourse(course.id)} 
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

      {/* Unit-wise Lecture Management Modal */}
      {activeLectureCourse && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setActiveLectureCourse(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <X size={20} />
            </button>

            <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-1">
              Unit-wise Lecture Manager: {activeLectureCourse.title}
            </h3>
            <p className="text-xs text-gray-500 mb-6">Add lectures with live Bunny Stream CDN video previews.</p>

            <form onSubmit={handleAddLectureSubmit} className="space-y-4 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Unit Number *</label>
                  <select value={lectureForm.unitNumber} onChange={e => setLectureForm({...lectureForm, unitNumber: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs">
                    <option value="1">Unit 1</option>
                    <option value="2">Unit 2</option>
                    <option value="3">Unit 3</option>
                    <option value="4">Unit 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Lecture Title *</label>
                  <input type="text" value={lectureForm.title} onChange={e => setLectureForm({...lectureForm, title: e.target.value})} required className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs" placeholder="e.g. Introduction & Project Setup" />
                </div>
              </div>

              <MediaUploader 
                value={lectureForm.videoUrl}
                onChange={url => setLectureForm({...lectureForm, videoUrl: url})}
                label="Lecture Video File Upload (MP4 / Bunny Stream CDN)"
                type="video"
                subfolder="lessons"
              />

              <button type="submit" className="w-full py-3 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer">
                Add Lecture to Unit
              </button>
            </form>
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
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Class Title *</label>
                <input type="text" value={liveForm.title} onChange={e => setLiveForm({...liveForm, title: e.target.value})} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs" placeholder="e.g. Live Q&A & Code Review" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Scheduled Time *</label>
                <input type="datetime-local" value={liveForm.scheduledAt} onChange={e => setLiveForm({...liveForm, scheduledAt: e.target.value})} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs" />
              </div>
            </div>

            <MediaUploader 
              value={liveForm.coverImage}
              onChange={url => setLiveForm({...liveForm, coverImage: url})}
              label="Live Masterclass Cover Photo"
              type="image"
              subfolder="live"
            />

            <div className="flex gap-3 pt-2">
              <button type="submit" className="px-5 py-2.5 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer">Schedule Masterclass</button>
              <button type="button" onClick={() => setShowLiveForm(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Live Sessions List Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-heading font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Class</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Instructor</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {liveSessions.map(session => (
              <tr key={session.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 font-bold text-gray-900">{session.title}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    session.status === 'LIVE_NOW' ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {session.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{session.instructor}</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <button 
                    onClick={() => setActiveStudioSession(session)}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer flex items-center gap-1"
                  >
                    <Radio size={14} /> Launch Studio
                  </button>
                  <button 
                    onClick={() => handleDeleteLiveSession(session.id)}
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
    </div>
  );

  // --- Packages Tab ---
  const renderPackages = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200/80 p-6 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900">Package Bundles</h1>
          <p className="text-xs text-gray-500 mt-1">Manage bundle pricing and direct referral commissions.</p>
        </div>
        <button 
          onClick={() => setShowPackageForm(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-950 font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} /> Add Package
        </button>
      </div>

      {/* Packages Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-heading font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Package</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Original Price</th>
              <th className="py-3 px-4">Referral Commission</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {packages.map(pkg => (
              <tr key={pkg.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 font-bold text-gray-900">{pkg.name}</td>
                <td className="py-3 px-4 font-extrabold text-amber-600">₹{pkg.price?.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 text-gray-400 line-through">₹{pkg.originalPrice?.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 font-extrabold text-emerald-600">₹{pkg.commission?.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <button 
                    onClick={() => handleDeletePackage(pkg.id)}
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
    </div>
  );

  // --- Users & Payouts Tabs ---
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200/80 p-6 rounded-3xl shadow-sm">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Users & Registrations</h1>
      </div>
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-heading font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Referral Code</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 font-bold text-gray-900">{user.name}</td>
                <td className="py-3 px-4 text-gray-600">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-gray-800 font-bold">{user.referralCode || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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
              <tr key={p.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 font-bold text-gray-900">{p.userName || p.userId}</td>
                <td className="py-3 px-4 font-extrabold text-emerald-600">₹{p.amount?.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 font-mono text-gray-700">{p.upiId || 'user@upi'}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${p.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {p.status === 'Pending' ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprovePayout(p.id)} className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 cursor-pointer">Approve</button>
                      <button onClick={() => handleRejectPayout(p.id)} className="px-3 py-1 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 cursor-pointer">Reject</button>
                    </div>
                  ) : (
                    <span className="font-mono text-gray-400">{p.transactionId || 'PROCESSED'}</span>
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
        />
      )}
    </div>
  );
};

export default AdminCMS;
