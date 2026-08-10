import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Package, MessageSquare, 
  Users, DollarSign, LogOut, Plus, Edit, Trash2, 
  Check, X, Image as ImageIcon, Video
} from 'lucide-react';
import store from '../data/mockStore';
import './AdminCMS.css';

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
    // Assuming testimonials are stored in store, but it might not be implemented, let's fake it or fetch
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
    // Mock save
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
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <h2>Admin Panel</h2>
      </div>
      <nav className="admin-nav">
        <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <LayoutDashboard size={20} /> Dashboard
        </button>
        <button className={`admin-nav-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
          <BookOpen size={20} /> Courses Management
        </button>
        <button className={`admin-nav-item ${activeTab === 'packages' ? 'active' : ''}`} onClick={() => setActiveTab('packages')}>
          <Package size={20} /> Packages Management
        </button>
        <button className={`admin-nav-item ${activeTab === 'testimonials' ? 'active' : ''}`} onClick={() => setActiveTab('testimonials')}>
          <MessageSquare size={20} /> Testimonials
        </button>
        <button className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          <Users size={20} /> Users & Registrations
        </button>
        <button className={`admin-nav-item ${activeTab === 'payouts' ? 'active' : ''}`} onClick={() => setActiveTab('payouts')}>
          <DollarSign size={20} /> Payout Requests
        </button>
      </nav>
      <div className="admin-sidebar-footer">
        <button className="admin-logout-btn" onClick={onLogout}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );

  const renderDashboard = () => (
    <div className="admin-tab-content">
      <div className="admin-header">
        <h1>Dashboard Overview</h1>
      </div>
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon courses-icon"><BookOpen size={24} /></div>
          <div className="stat-details">
            <h3>Total Courses</h3>
            <p className="stat-value">{courses.length}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon packages-icon"><Package size={24} /></div>
          <div className="stat-details">
            <h3>Total Packages</h3>
            <p className="stat-value">{packages.length}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon users-icon"><Users size={24} /></div>
          <div className="stat-details">
            <h3>Total Users</h3>
            <p className="stat-value">{users.length}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon payouts-icon"><DollarSign size={24} /></div>
          <div className="stat-details">
            <h3>Pending Payouts</h3>
            <p className="stat-value">{payouts.filter(p => p.status === 'Pending').length}</p>
          </div>
        </div>
      </div>
      <div className="admin-quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-action-buttons">
          <button className="btn-primary" onClick={() => { setActiveTab('courses'); setShowCourseForm(true); }}>
            <Plus size={18} /> Add New Course
          </button>
          <button className="btn-secondary" onClick={() => { setActiveTab('packages'); setShowPackageForm(true); }}>
            <Plus size={18} /> Add New Package
          </button>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="admin-tab-content">
      <div className="admin-header flex-between">
        <h1>Courses Management</h1>
        <button className="btn-primary" onClick={() => setShowCourseForm(!showCourseForm)}>
          {showCourseForm ? <X size={18} /> : <Plus size={18} />} {showCourseForm ? 'Cancel' : 'Add New Course'}
        </button>
      </div>

      {showCourseForm && (
        <div className="admin-form-card">
          <h3>Add New Course</h3>
          <form onSubmit={handleCourseSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={courseForm.category} onChange={e => setCourseForm({...courseForm, category: e.target.value})} required>
                  <option value="">Select Category</option>
                  <option value="Technology">Technology</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} rows="3" required></textarea>
            </div>
            <div className="form-group">
              <label>Thumbnail URL</label>
              <input type="url" value={courseForm.thumbnail} onChange={e => setCourseForm({...courseForm, thumbnail: e.target.value})} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Duration (e.g. 10 hours)</label>
                <input type="text" value={courseForm.duration} onChange={e => setCourseForm({...courseForm, duration: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Lessons Count</label>
                <input type="number" value={courseForm.lessons} onChange={e => setCourseForm({...courseForm, lessons: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Level</label>
                <select value={courseForm.level} onChange={e => setCourseForm({...courseForm, level: e.target.value})}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" checked={courseForm.featured} onChange={e => setCourseForm({...courseForm, featured: e.target.checked})} />
                Featured Course
              </label>
            </div>
            <button type="submit" className="btn-primary">Save Course</button>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Thumbnail</th>
              <th>Title</th>
              <th>Category</th>
              <th>Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td>
                  {course.thumbnail ? <img src={course.thumbnail} alt={course.title} className="table-thumb" /> : <ImageIcon size={24} className="text-muted" />}
                </td>
                <td className="font-medium">{course.title}</td>
                <td>{course.category}</td>
                <td><span className={`badge badge-${course.level?.toLowerCase()}`}>{course.level}</span></td>
                <td>
                  <div className="table-actions">
                    <button className="action-btn delete" onClick={() => handleDeleteCourse(course.id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {courses.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">No courses found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPackages = () => (
    <div className="admin-tab-content">
      <div className="admin-header flex-between">
        <h1>Packages Management</h1>
        <button className="btn-primary" onClick={() => setShowPackageForm(!showPackageForm)}>
          {showPackageForm ? <X size={18} /> : <Plus size={18} />} {showPackageForm ? 'Cancel' : 'Add New Package'}
        </button>
      </div>

      {showPackageForm && (
        <div className="admin-form-card">
          <h3>Add New Package</h3>
          <form onSubmit={handlePackageSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Package Name</label>
                <input type="text" value={packageForm.name} onChange={e => setPackageForm({...packageForm, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" value={packageForm.price} onChange={e => setPackageForm({...packageForm, price: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Original Price (₹)</label>
                <input type="number" value={packageForm.originalPrice} onChange={e => setPackageForm({...packageForm, originalPrice: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Commission per Referral (₹)</label>
                <input type="number" value={packageForm.commission} onChange={e => setPackageForm({...packageForm, commission: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label>Select Included Courses</label>
              <div className="course-multi-select">
                {courses.map(course => (
                  <label key={course.id} className="course-select-item">
                    <input 
                      type="checkbox" 
                      checked={packageForm.selectedCourses.includes(course.id)}
                      onChange={() => handleCourseToggle(course.id)}
                    />
                    {course.title}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Features (One per line)</label>
              <textarea value={packageForm.features} onChange={e => setPackageForm({...packageForm, features: e.target.value})} rows="4" required></textarea>
            </div>
            <button type="submit" className="btn-primary">Save Package</button>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Original Price</th>
              <th>Courses Count</th>
              <th>Commission</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(pkg => (
              <tr key={pkg.id}>
                <td className="font-medium">{pkg.name}</td>
                <td>₹{pkg.price}</td>
                <td className="text-muted"><del>₹{pkg.originalPrice}</del></td>
                <td>{pkg.courses?.length || pkg.selectedCourses?.length || 0}</td>
                <td><span className="text-success font-medium">₹{pkg.commission}</span></td>
                <td>
                  <div className="table-actions">
                    <button className="action-btn delete" onClick={() => handleDeletePackage(pkg.id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {packages.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-4">No packages found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTestimonials = () => (
    <div className="admin-tab-content">
      <div className="admin-header flex-between">
        <h1>Testimonials</h1>
        <button className="btn-primary" onClick={() => setShowTestimonialForm(!showTestimonialForm)}>
          {showTestimonialForm ? <X size={18} /> : <Plus size={18} />} {showTestimonialForm ? 'Cancel' : 'Add Testimonial'}
        </button>
      </div>

      {showTestimonialForm && (
        <div className="admin-form-card">
          <h3>Add Testimonial</h3>
          <form onSubmit={handleTestimonialSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={testimonialForm.name} onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input type="text" value={testimonialForm.role} onChange={e => setTestimonialForm({...testimonialForm, role: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Rating</label>
                <select value={testimonialForm.rating} onChange={e => setTestimonialForm({...testimonialForm, rating: e.target.value})}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Avatar URL</label>
              <input type="url" value={testimonialForm.avatar} onChange={e => setTestimonialForm({...testimonialForm, avatar: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea value={testimonialForm.content} onChange={e => setTestimonialForm({...testimonialForm, content: e.target.value})} rows="3" required></textarea>
            </div>
            <button type="submit" className="btn-primary">Save Testimonial</button>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Role</th>
              <th>Content Preview</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map(t => (
              <tr key={t.id}>
                <td><img src={t.avatar} alt={t.name} className="table-avatar" /></td>
                <td className="font-medium">{t.name}</td>
                <td>{t.role}</td>
                <td className="truncate-text" title={t.content}>{t.content.substring(0, 50)}...</td>
                <td>{t.rating} ⭐</td>
                <td>
                  <div className="table-actions">
                    <button className="action-btn delete" onClick={() => handleDeleteTestimonial(t.id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {testimonials.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-4">No testimonials found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-tab-content">
      <div className="admin-header">
        <h1>Users & Registrations</h1>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Package</th>
              <th>Referral Code</th>
              <th>Referrals</th>
              <th>Earnings</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="font-medium">{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`badge badge-${user.role}`}>{user.role}</span></td>
                <td>{user.packageId ? (packages.find(p => p.id === user.packageId)?.name || user.packageId) : '-'}</td>
                <td><code>{user.referralCode || '-'}</code></td>
                <td>{user.referrals?.length || 0}</td>
                <td className="text-success font-medium">₹{user.earnings || 0}</td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-4">No users found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPayouts = () => (
    <div className="admin-tab-content">
      <div className="admin-header">
        <h1>Payout Requests</h1>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Bank Details</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(req => {
              const u = users.find(u => u.id === req.userId);
              return (
                <tr key={req.id}>
                  <td className="font-medium">{u ? u.name : 'Unknown User'}</td>
                  <td className="font-medium text-primary">₹{req.amount}</td>
                  <td className="text-sm">
                    {req.bankDetails?.bankName} - {req.bankDetails?.accountNumber?.slice(-4).padStart(8, '*')}
                  </td>
                  <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-status badge-${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === 'Pending' ? (
                      <div className="table-actions">
                        <button className="action-btn success" onClick={() => handleApprovePayout(req.id)} title="Approve">
                          <Check size={18} />
                        </button>
                        <button className="action-btn delete" onClick={() => handleRejectPayout(req.id)} title="Reject">
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted text-sm">{req.transactionId || '-'}</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {payouts.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-4">No payout requests found.</td></tr>}
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
    <div className="admin-layout">
      {renderSidebar()}
      <main className="admin-main">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminCMS;
