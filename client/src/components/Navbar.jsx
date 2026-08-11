import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Phone, Mail, Search, Globe, ChevronRight, 
  User, LayoutDashboard, LogOut, ShieldCheck, Sparkles 
} from 'lucide-react';
import store from '../data/mockStore';
import { translations } from '../data/translations';

export default function Navbar({ currentUser, onLogout, currentLang = 'EN', onLangChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const t = translations[currentLang]?.nav || translations.EN.nav;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchExpanded(false);
    setSearchQuery('');
    setUserMenuOpen(false);
  }, [location]);

  // Click outside to collapse search & user menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchExpanded(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search handler
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const allCourses = store.getCourses();
      const filtered = allCourses.filter(c => 
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 6));
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (courseId) => {
    setSearchExpanded(false);
    setSearchQuery('');
    navigate(`/course/${courseId}`);
  };

  const navLinks = [
    { path: '/', label: t.home },
    { path: '/about', label: t.about },
    { path: '/courses', label: t.courses },
    { path: '/packages', label: t.packages },
    { path: '/contact', label: t.contact },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Header Contact Bar */}
      <div className="bg-[#001233] text-white py-1.5 px-4 lg:px-8 border-b border-white/10 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Phone size={13} className="text-amber-400" />
              <span>+91 93463 97827</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Mail size={13} className="text-amber-400" />
              <span>support@classconnect.in</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              100% Bilingual OS (English & Telugu)
            </span>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Navigation Bar */}
      <header className={`w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-gray-200/80' 
          : 'bg-white py-4 border-b border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#001845] to-[#002B70] text-amber-400 flex items-center justify-center font-heading font-extrabold text-xl shadow-lg group-hover:scale-105 transition-transform">
              CC
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl sm:text-2xl text-gray-900 leading-none tracking-tight block">
                Class<span className="text-amber-600">Connect</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Bilingual Learning OS</span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-heading font-extrabold tracking-wider uppercase transition-colors relative py-1 ${
                    isActive 
                      ? 'text-amber-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-amber-500 after:rounded-full' 
                      : 'text-gray-700 hover:text-amber-600'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Action Tools */}
          <div className="flex items-center gap-3">
            
            {/* 1. Small Search Magnifier Icon Button */}
            <div className="relative" ref={searchRef}>
              {searchExpanded ? (
                <div className="flex items-center bg-gray-100 border border-amber-500 rounded-full px-3 py-1.5 w-56 sm:w-64 shadow-inner animate-fade-in">
                  <Search size={16} className="text-amber-600 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    autoFocus
                    className="w-full bg-transparent text-xs outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                  />
                  <button 
                    onClick={() => { setSearchExpanded(false); setSearchQuery(''); }}
                    className="p-1 hover:bg-gray-200 rounded-full text-gray-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchExpanded(true)}
                  className="p-2.5 rounded-full bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-700 transition-all shadow-sm cursor-pointer"
                  aria-label="Search courses"
                  title="Search Courses"
                >
                  <Search size={18} />
                </button>
              )}

              {/* Live Search Results Dropdown */}
              {searchExpanded && searchQuery.trim() && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 z-50 animate-fade-in w-72 md:w-96">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-gray-400 tracking-wider flex justify-between">
                    <span>Search Results ({searchResults.length})</span>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                      {searchResults.map(course => (
                        <button
                          key={course.id}
                          onClick={() => handleResultClick(course.id)}
                          className="w-full p-2.5 flex items-center gap-3 text-left hover:bg-amber-50 rounded-xl transition-colors group"
                        >
                          <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="w-12 h-9 rounded-lg object-cover flex-shrink-0" 
                          />
                          <div className="flex-grow min-w-0">
                            <h5 className="font-heading font-bold text-xs text-gray-900 truncate group-hover:text-primary-container">
                              {course.title}
                            </h5>
                            <span className="text-[10px] text-amber-600 font-semibold">{course.category}</span>
                          </div>
                          <span className="text-xs font-extrabold text-gray-900">₹{course.price}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-gray-500">
                      No courses found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Three-Line Dropdown Menu Button (Containing Language, Profile, Dashboard, Logout) */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:border-amber-500 bg-gray-50 hover:bg-amber-50/50 shadow-sm transition-all cursor-pointer"
                title="User & Language Options"
              >
                <Menu size={18} className="text-gray-800" />
                {currentUser ? (
                  <div className="w-6 h-6 rounded-full bg-[#001845] text-amber-400 font-extrabold text-[11px] flex items-center justify-center shadow">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                ) : (
                  <User size={18} className="text-gray-500" />
                )}
              </button>

              {/* Clean 3-Line Dropdown Popover */}
              {userMenuOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 z-50 w-64 space-y-1.5 animate-fade-in text-xs font-semibold">
                  
                  {/* Language Toggle */}
                  <button
                    onClick={() => { onLangChange && onLangChange(currentLang === 'EN' ? 'TE' : 'EN'); setUserMenuOpen(false); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50 text-gray-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Globe size={16} className="text-amber-600" />
                      <span>Language</span>
                    </div>
                    <span className="font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md text-[11px]">
                      {currentLang === 'EN' ? 'TE (తెలుగు)' : 'EN (English)'}
                    </span>
                  </button>

                  <div className="border-t border-gray-100 my-1" />

                  {currentUser ? (
                    <>
                      <div className="px-2.5 py-1 text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
                        Signed in as <strong className="text-gray-900 block truncate font-heading">{currentUser.name}</strong>
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-blue-50 text-gray-900 font-bold transition-colors"
                      >
                        <ShieldCheck size={16} className="text-[#001845]" />
                        <span>Profile & Aadhaar KYC</span>
                      </Link>

                      <Link
                        to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-amber-50 text-gray-900 font-bold transition-colors"
                      >
                        <LayoutDashboard size={16} className="text-amber-600" />
                        <span>{currentUser.role === 'admin' ? 'Admin CMS' : 'Student Dashboard'}</span>
                      </Link>

                      <button
                        onClick={() => { onLogout && onLogout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-red-50 text-red-600 font-bold transition-colors cursor-pointer"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      <Link
                        to="/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center justify-center p-2.5 rounded-xl bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold uppercase text-[11px] tracking-wider transition-all shadow"
                      >
                        Sign In / Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center justify-center p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-950 font-heading font-extrabold uppercase text-[11px] tracking-wider transition-all shadow"
                      >
                        Register Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity lg:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setMobileOpen(false)} 
      />
      <div className={`fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-white z-50 shadow-2xl transition-transform duration-300 lg:hidden flex flex-col ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link to="/" className="font-heading font-extrabold text-xl">
            <span className="text-gray-900">Class</span>
            <span className="text-amber-600">Connect</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-500">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-grow">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block px-4 py-3 rounded-xl font-heading font-extrabold text-sm text-gray-800 hover:bg-amber-50 hover:text-amber-700"
            >
              {link.label}
            </Link>
          ))}

          {currentUser ? (
            <>
              <Link
                to="/profile"
                className="block px-4 py-3 rounded-xl font-heading font-extrabold text-sm text-[#001845] bg-blue-50"
              >
                Profile & Aadhaar KYC
              </Link>
              <Link
                to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                className="block px-4 py-3 rounded-xl font-heading font-extrabold text-sm text-amber-800 bg-amber-50"
              >
                {currentUser.role === 'admin' ? 'Admin CMS' : 'Student Dashboard'}
              </Link>
            </>
          ) : (
            <div className="pt-4 space-y-2 border-t border-gray-100">
              <Link to="/register" className="block w-full py-3 text-center bg-amber-500 text-gray-950 font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow">
                Register Account
              </Link>
              <Link to="/login" className="block w-full py-3 text-center bg-[#001845] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow">
                Sign In
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
