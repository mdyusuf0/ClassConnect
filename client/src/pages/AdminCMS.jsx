import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Package, MessageSquare, 
  Users, DollarSign, LogOut, Plus, Edit, Trash2, 
  Check, X, Image as ImageIcon, Video, Sparkles
} from 'lucide-react';
import store from '../data/mockStore';

const AdminCMS = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState([]);
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '', category: '', description: '', thumbnail: '', 
    duration: '', lessons: '', level: 'Beginner', featured: false
  });

  const [showPackageForm, setShowPackageForm] = useState(false);
  const [packageForm, setPackageForm] = useState({
    name: '', price: '', originalPrice: '', commission: '',
    selectedCourses: [], features: ''
  });

  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({
    name: '', role: '', content: '', rating: '5', avatar: ''
  });

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      loadData();
    }
  }, [currentUser]);

  const loadData = () => {
    setCourses(store.getCourses() || []);
    setPackages(store.getPackages() || []);
    setUsers(store.getUsers() || []);
    setPayouts(store.getPayoutRequests() || []);
    setTestimonials(store.getTestimonials ? store.getTestimonials() : [
      { id: 1, name: 'John Doe', role: 'Student', content: 'Great platform!', rating: 5, avatar: 'https://i.pravatar.cc/150?u=1' }
    ]);
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // --- Course Handlers ---
  const handleCourseSubmit = (e) => {
    e.preventDefault();
    const newCourse = {
      ...courseForm,
      id: Date.now().toString(),
      lessons: parseInt(courseForm.lessons) || 0
    };
    if (store.addCourse) store.addCourse(newCourse);
    setCourses([...courses, newCourse]);
    setShowCourseForm(false);
    setCourseForm({ title: '', category: '', description: '', thumbnail: '', duration: '', lessons: '', level: 'Beginner', featured: false });
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      if (store.deleteCourse) store.deleteCourse(id);
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleEditCoursePrice = (course) => {
    const newPrice = window.prompt(`Edit Discounted Price for "${course.title}" (₹):`, course.price || 1499);
    if (newPrice === null) return;
    const newOrigPrice = window.prompt(`Edit Original Strikethrough Price for "${course.title}" (₹):`, course.originalPrice || 2999);
    if (newOrigPrice === null) return;
    
    const updatedPrice = parseFloat(newPrice) || course.price;
    const updatedOrigPrice = parseFloat(newOrigPrice) || course.originalPrice;
    
    const updatedCourses = courses.map(c => c.id === course.id ? { ...c, price: updatedPrice, originalPrice: updatedOrigPrice } : c);
    setCourses(updatedCourses);
    if (store.updateCoursePrice) store.updateCoursePrice(course.id, updatedPrice, updatedOrigPrice);
  };

  const handleEditPackagePrice = (pkg) => {
    const newPrice = window.prompt(`Edit Discounted Price for "${pkg.name}" (₹):`, pkg.price);
    if (newPrice === null) return;
    const newOrigPrice = window.prompt(`Edit Original Strikethrough Price for "${pkg.name}" (₹):`, pkg.originalPrice);
    if (newOrigPrice === null) return;
    const newCommission = window.prompt(`Edit Referral Commission for "${pkg.name}" (₹):`, pkg.commission);
    if (newCommission === null) return;

    const updatedPrice = parseFloat(newPrice) || pkg.price;
    const updatedOrigPrice = parseFloat(newOrigPrice) || pkg.originalPrice;
    const updatedCommission = parseFloat(newCommission) || pkg.commission;

    const updatedPackages = packages.map(p => p.id === pkg.id ? { ...p, price: updatedPrice, originalPrice: updatedOrigPrice, commission: updatedCommission } : p);
    setPackages(updatedPackages);
    if (store.updatePackagePrice) store.updatePackagePrice(pkg.id, updatedPrice, updatedOrigPrice, updatedCommission);
  };

  // --- Package Handlers ---
  const handlePackageSubmit = (e) => {
    e.preventDefault();
    const newPackage = {
      ...packageForm,
      id: Date.now().toString(),
      price: parseFloat(packageForm.price),
      originalPrice: parseFloat(packageForm.originalPrice),
      commission: parseFloat(packageForm.commission),
      features: packageForm.features.split('\n').filter(f => f.trim() !== '')
    };
    if (store.addPackage) store.addPackage(newPackage);
    setPackages([...packages, newPackage]);
    setShowPackageForm(false);
    setPackageForm({ name: '', price: '', originalPrice: '', commission: '', selectedCourses: [], features: '' });
  };

  const handleCourseToggle = (courseId) => {
    setPackageForm(prev => {
      const selected = prev.selectedCourses.includes(courseId)
        ? prev.selectedCourses.filter(id => id !== courseId)
        : [...prev.selectedCourses, courseId];
      return { ...prev, selectedCourses: selected };
    });
  };

  const handleDeletePackage = (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      if (store.deletePackage) store.deletePackage(id);
      setPackages(packages.filter(p => p.id !== id));
    }
  };

  // --- Testimonial Handlers ---
  const handleTestimonialSubmit = (e) => {
    e.preventDefault();
    const newTestimonial = {
      ...testimonialForm,
      id: Date.now().toString(),
      rating: parseInt(testimonialForm.rating)
    };
    setTestimonials([...testimonials, newTestimonial]);
    setShowTestimonialForm(false);
    setTestimonialForm({ name: '', role: '', content: '', rating: '5', avatar: '' });
  };

  const handleDeleteTestimonial = (id) => {
    if (window.confirm('Delete this testimonial?')) {
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  // --- Payout Handlers ---
  const handleApprovePayout = (id) => {
    const txnId = window.prompt('Enter Transaction ID for approval:');
    if (txnId) {
      if (store.approvePayout) store.approvePayout(id, txnId);
      setPayouts(payouts.map(p => p.id === id ? { ...p, status: 'Completed', transactionId: txnId } : p));
    }
  };

  const handleRejectPayout = (id) => {
    if (window.confirm('Are you sure you want to reject this payout?')) {
      if (store.rejectPayout) store.rejectPayout(id);
      setPayouts(payouts.map(p => p.id === id ? { ...p, status: 'Rejected' } : p));
    }
  };

  // --- Rendering ---
  const renderSidebar = () => (
    <aside className="w-full md:w-64 bg-gradient-to-b from-[#001845] to-[#002B70] text-white flex flex-col justify-between p-5 min-h-screen shrink-0">
      <div>
        <div className="pb-6 border-b border-white/10 mb-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-gray-950 font-heading font-extrabold text-lg shadow-md">
              C
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-white">
              Admin<span className="text-amber-400">CMS</span>
            </span>
          </Link>
        </div>

        <nav className="space-y-1.5">
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`} 
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 ${activeTab === 'courses' ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`} 
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen size={18} /> <span>Courses</span>
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 ${activeTab === 'packages' ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`} 
            onClick={() => setActiveTab('packages')}
          >
            <Package size={18} /> <span>Packages</span>
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 ${activeTab === 'testimonials' ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`} 
            onClick={() => setActiveTab('testimonials')}
          >
            <MessageSquare size={18} /> <span>Testimonials</span>
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 ${activeTab === 'users' ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`} 
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} /> <span>Users & Registrations</span>
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 ${activeTab === 'payouts' ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`} 
            onClick={() => setActiveTab('payouts')}
          >
            <DollarSign size={18} /> <span>Payout Requests</span>
          </button>
        </nav>
      </div>

      <div className="pt-6 border-t border-white/10">
        <button 
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-400 border border-white/10 text-xs font-heading font-bold uppercase tracking-wider transition-all" 
          onClick={onLogout}
        >
          <LogOut size={16} /> <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white border-b border-gray-200/80 p-6 rounded-2xl shadow-sm">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen size={22} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Courses</h3>
            <p className="font-heading font-extrabold text-2xl text-gray-900 mt-0.5">{courses.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <Package size={22} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Packages</h3>
            <p className="font-heading font-extrabold text-2xl text-gray-900 mt-0.5">{packages.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Users</h3>
            <p className="font-heading font-extrabold text-2xl text-gray-900 mt-0.5">{users.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <DollarSign size={22} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Payouts</h3>
            <p className="font-heading font-extrabold text-2xl text-amber-600 mt-0.5">{payouts.filter(p => p.status === 'Pending' || p.status === 'pending').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
        <h3 className="font-heading font-extrabold text-lg text-gray-900">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button 
            className="px-5 py-3 bg-primary-container hover:bg-primary text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer" 
            onClick={() => { setActiveTab('courses'); setShowCourseForm(true); }}
          >
            <Plus size={16} /> Add New Course
          </button>
          <button 
            className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer" 
            onClick={() => { setActiveTab('packages'); setShowPackageForm(true); }}
          >
            <Plus size={16} /> Add New Package
          </button>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="bg-white border-b border-gray-200/80 p-6 rounded-2xl shadow-sm flex items-center justify-between">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Courses Management</h1>
        <button 
          className="px-5 py-2.5 bg-primary-container hover:bg-primary text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer" 
          onClick={() => setShowCourseForm(!showCourseForm)}
        >
          {showCourseForm ? <X size={16} /> : <Plus size={16} />} {showCourseForm ? 'Cancel' : 'Add New Course'}
        </button>
      </div>

      {showCourseForm && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
          <h3 className="font-heading font-extrabold text-lg text-gray-900">Add New Course</h3>
          <form onSubmit={handleCourseSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Title</label>
                <input type="text" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Category</label>
                <select value={courseForm.category} onChange={e => setCourseForm({...courseForm, category: e.target.value})} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none">
                  <option value="">Select Category</option>
                  <option value="Technology">Technology</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description</label>
              <textarea value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} rows="3" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Thumbnail URL</label>
              <input type="url" value={courseForm.thumbnail} onChange={e => setCourseForm({...courseForm, thumbnail: e.target.value})} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Duration (e.g. 10 hours)</label>
                <input type="text" value={courseForm.duration} onChange={e => setCourseForm({...courseForm, duration: e.target.value})} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Lessons Count</label>
                <input type="number" value={courseForm.lessons} onChange={e => setCourseForm({...courseForm, lessons: e.target.value})} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Level</label>
                <select value={courseForm.level} onChange={e => setCourseForm({...courseForm, level: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={courseForm.featured} onChange={e => setCourseForm({...courseForm, featured: e.target.checked})} className="rounded border-gray-300 text-amber-500" />
              <label className="text-xs font-bold text-gray-700">Featured Course</label>
            </div>
            <button type="submit" className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer">Save Course</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-heading font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Thumbnail</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Original Price</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4">
                  {course.thumbnail ? <img src={course.thumbnail} alt={course.title} className="w-12 h-9 object-cover rounded-lg" /> : <ImageIcon size={20} className="text-gray-400" />}
                </td>
                <td className="py-3 px-4 font-bold text-gray-900">{course.title}</td>
                <td className="py-3 px-4 text-gray-600">{course.category}</td>
                <td className="py-3 px-4 font-extrabold text-amber-600">₹{course.price || 1499}</td>
                <td className="py-3 px-4 text-gray-400 line-through">₹{course.originalPrice || 2999}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-[10px] bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase tracking-wider rounded-lg transition-colors" onClick={() => handleEditCoursePrice(course)} title="Edit Price & Discount">
                      Edit Price
                    </button>
                    <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" onClick={() => handleDeleteCourse(course.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {courses.length === 0 && <tr><td colSpan="6" className="text-center text-gray-500 py-6">No courses found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPackages = () => (
    <div className="space-y-6">
      <div className="bg-white border-b border-gray-200/80 p-6 rounded-2xl shadow-sm flex items-center justify-between">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Packages Management</h1>
        <button 
          className="px-5 py-2.5 bg-primary-container hover:bg-primary text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer" 
          onClick={() => setShowPackageForm(!showPackageForm)}
        >
          {showPackageForm ? <X size={16} /> : <Plus size={16} />} {showPackageForm ? 'Cancel' : 'Add New Package'}
        </button>
      </div>

      {showPackageForm && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
          <h3 className="font-heading font-extrabold text-lg text-gray-900">Add New Package</h3>
          <form onSubmit={handlePackageSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Package Name</label>
                <input type="text" value={packageForm.name} onChange={e => setPackageForm({...packageForm, name: e.target.value})} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Price (₹)</label>
                <input type="number" value={packageForm.price} onChange={e => setPackageForm({...packageForm, price: e.target.value})} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Original Price (₹)</label>
                <input type="number" value={packageForm.originalPrice} onChange={e => setPackageForm({...packageForm, originalPrice: e.target.value})} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Commission per Referral (₹)</label>
                <input type="number" value={packageForm.commission} onChange={e => setPackageForm({...packageForm, commission: e.target.value})} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Select Included Courses</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                {courses.map(course => (
                  <label key={course.id} className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={packageForm.selectedCourses.includes(course.id)}
                      onChange={() => handleCourseToggle(course.id)}
                      className="rounded border-gray-300 text-amber-500"
                    />
                    <span className="truncate">{course.title}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Features (One per line)</label>
              <textarea value={packageForm.features} onChange={e => setPackageForm({...packageForm, features: e.target.value})} rows="4" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"></textarea>
            </div>
            <button type="submit" className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer">Save Package</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-heading font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Original Price</th>
              <th className="py-3 px-4">Courses Count</th>
              <th className="py-3 px-4">Commission</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {packages.map(pkg => (
              <tr key={pkg.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 font-bold text-gray-900">{pkg.name}</td>
                <td className="py-3 px-4 font-extrabold text-gray-900">₹{pkg.price}</td>
                <td className="py-3 px-4 text-gray-400 line-through">₹{pkg.originalPrice}</td>
                <td className="py-3 px-4 text-gray-700">{pkg.courses?.length || pkg.selectedCourses?.length || 0}</td>
                <td className="py-3 px-4 font-extrabold text-emerald-600">₹{pkg.commission}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-[10px] bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase tracking-wider rounded-lg transition-colors" onClick={() => handleEditPackagePrice(pkg)} title="Edit Package Price & Commission">
                      Edit Price
                    </button>
                    <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" onClick={() => handleDeletePackage(pkg.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {packages.length === 0 && <tr><td colSpan="6" className="text-center text-gray-500 py-6">No packages found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTestimonials = () => (
    <div className="space-y-6">
      <div className="bg-white border-b border-gray-200/80 p-6 rounded-2xl shadow-sm flex items-center justify-between">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Testimonials</h1>
        <button 
          className="px-5 py-2.5 bg-primary-container hover:bg-primary text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer" 
          onClick={() => setShowTestimonialForm(!showTestimonialForm)}
        >
          {showTestimonialForm ? <X size={16} /> : <Plus size={16} />} {showTestimonialForm ? 'Cancel' : 'Add Testimonial'}
        </button>
      </div>

      {showTestimonialForm && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
          <h3 className="font-heading font-extrabold text-lg text-gray-900">Add Testimonial</h3>
          <form onSubmit={handleTestimonialSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Name</label>
                <input type="text" value={testimonialForm.name} onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Role</label>
                <input type="text" value={testimonialForm.role} onChange={e => setTestimonialForm({...testimonialForm, role: e.target.value})} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Rating</label>
                <select value={testimonialForm.rating} onChange={e => setTestimonialForm({...testimonialForm, rating: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none">
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Avatar URL</label>
              <input type="url" value={testimonialForm.avatar} onChange={e => setTestimonialForm({...testimonialForm, avatar: e.target.value})} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Content</label>
              <textarea value={testimonialForm.content} onChange={e => setTestimonialForm({...testimonialForm, content: e.target.value})} rows="3" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"></textarea>
            </div>
            <button type="submit" className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer">Save Testimonial</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-heading font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Avatar</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Content Preview</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {testimonials.map(t => (
              <tr key={t.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4"><img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" /></td>
                <td className="py-3 px-4 font-bold text-gray-900">{t.name}</td>
                <td className="py-3 px-4 text-gray-600">{t.role}</td>
                <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{t.content}</td>
                <td className="py-3 px-4 font-bold text-amber-500">{t.rating} ⭐</td>
                <td className="py-3 px-4">
                  <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" onClick={() => handleDeleteTestimonial(t.id)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {testimonials.length === 0 && <tr><td colSpan="6" className="text-center text-gray-500 py-6">No testimonials found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="bg-white border-b border-gray-200/80 p-6 rounded-2xl shadow-sm">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Users & Registrations</h1>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-heading font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Package</th>
              <th className="py-3 px-4">Referral Code</th>
              <th className="py-3 px-4">Referrals</th>
              <th className="py-3 px-4">Earnings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 font-bold text-gray-900">{user.name}</td>
                <td className="py-3 px-4 text-gray-600">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700">{user.packageId ? (packages.find(p => p.id === user.packageId)?.name || user.packageId) : '-'}</td>
                <td className="py-3 px-4 font-mono font-bold text-gray-800">{user.referralCode || '-'}</td>
                <td className="py-3 px-4 text-gray-700">{user.referrals?.length || 0}</td>
                <td className="py-3 px-4 font-extrabold text-emerald-600">₹{user.earnings || 0}</td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan="7" className="text-center text-gray-500 py-6">No users found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPayouts = () => (
    <div className="space-y-6">
      <div className="bg-white border-b border-gray-200/80 p-6 rounded-2xl shadow-sm">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Payout Requests</h1>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-heading font-bold uppercase tracking-wider">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Bank Details</th>
              <th className="py-3 px-4">Request Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payouts.map(req => {
              const u = users.find(u => u.id === req.userId);
              return (
                <tr key={req.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-bold text-gray-900">{u ? u.name : (req.userName || 'Unknown User')}</td>
                  <td className="py-3 px-4 font-extrabold text-emerald-600">₹{req.amount}</td>
                  <td className="py-3 px-4 text-gray-600">{req.paymentDetails || (req.bankDetails?.bankName + ' - ' + req.bankDetails?.accountNumber?.slice(-4).padStart(8, '*'))}</td>
                  <td className="py-3 px-4 text-gray-500">{new Date(req.date || req.requestDate || Date.now()).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                      req.status === 'Completed' || req.status === 'approved' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : req.status === 'Rejected' || req.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {req.status === 'Pending' || req.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors" onClick={() => handleApprovePayout(req.id)} title="Approve">
                          <Check size={16} />
                        </button>
                        <button className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors" onClick={() => handleRejectPayout(req.id)} title="Reject">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 font-mono text-[11px]">{req.transactionId || '-'}</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {payouts.length === 0 && <tr><td colSpan="6" className="text-center text-gray-500 py-6">No payout requests found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'courses': return renderCourses();
      case 'packages': return renderPackages();
      case 'testimonials': return renderTestimonials();
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
    </div>
  );
};

export default AdminCMS;

