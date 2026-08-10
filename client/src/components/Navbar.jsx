import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Mail, Search, Globe, ChevronRight } from 'lucide-react';
import store from '../data/mockStore';
import { translations } from '../data/translations';

export default function Navbar({ currentUser, onLogout, currentLang = 'EN', onLangChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

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
  }, [location]);

  // Click outside to collapse search
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchExpanded(false);
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

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Contact Bar */}
      <div className="hidden lg:block bg-primary text-white/80 text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="https://wa.me/+918885490091" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={13} /> WhatsApp: +91 8885490091
            </a>
            <a href="https://wa.me/+919014887314" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={13} /> WhatsApp: +91 9014887314
            </a>
            <a href="mailto:info@classconnect.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail size={13} /> info@classconnect.com
            </a>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold tracking-wider">
              {currentLang === 'EN' ? '🌐 Bilingual Learning OS (EN)' : '🌐 ద్విభాషా విద్యా వర్క్‌స్పేస్ (TE)'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white/90 backdrop-blur-md border-b border-gray-200/50 py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="font-heading font-extrabold text-2xl flex items-center gap-0.5 flex-shrink-0">
            <span className="text-primary">Class</span>
            <span className="text-secondary-container">Connect</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors relative ${
                  isActive(link.path)
                    ? 'text-primary-container font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-secondary-container after:rounded-full'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-100/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons: Compact Search + Language Switcher + User Auth */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0" ref={searchRef}>
            
            {/* 1. Compact Search Bar (Icon by default, expands on click) */}
            <div className="relative">
              {searchExpanded ? (
                <div className="flex items-center bg-gray-100 border border-amber-400 rounded-2xl px-3 py-1.5 shadow-lg w-64 md:w-80 transition-all duration-300 animate-fade-in">
                  <Search size={16} className="text-amber-500 mr-2 flex-shrink-0" />
                  <input 
                    type="text" 
                    autoFocus
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full bg-transparent text-xs text-gray-900 focus:outline-none"
                  />
                  <button onClick={() => { setSearchExpanded(false); setSearchQuery(''); }} className="text-gray-400 hover:text-gray-700 p-0.5 ml-1">
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchExpanded(true)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-600 border border-gray-200 transition-all shadow-sm flex items-center gap-1.5"
                  aria-label="Search courses"
                  title="Search Courses / శోధించండి"
                >
                  <Search size={18} />
                  <span className="hidden md:inline text-xs font-semibold">Search</span>
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

            {/* 2. Compact Language Switcher Icon Button (Globe Icon) */}
            <button
              onClick={() => onLangChange && onLangChange(currentLang === 'EN' ? 'TE' : 'EN')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-900 hover:from-amber-100 hover:to-amber-200 transition-all shadow-sm active:scale-95"
              aria-label="Switch language"
              title="Switch Language (English / తెలుగు)"
            >
              <Globe size={16} className="text-amber-600 flex-shrink-0 animate-spin-slow" />
              <span className="font-bold">{currentLang === 'EN' ? 'TE (తెలుగు)' : 'EN (English)'}</span>
            </button>

            {/* 3. User Auth Controls */}
            <div className="hidden sm:flex items-center gap-2">
              {currentUser ? (
                <>
                  <Link to={currentUser.role === 'admin' ? '/admin' : '/dashboard'} className="px-3.5 py-1.5 text-xs font-bold text-primary-container border border-primary-container rounded-xl hover:bg-primary-container hover:text-white transition-colors">
                    {t.dashboard}
                  </Link>
                  <button onClick={onLogout} className="px-3.5 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all shadow-sm">
                    {t.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/register" className="px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl transition-all shadow-sm">
                    {t.register}
                  </Link>
                  <Link to="/login" className="px-3.5 py-1.5 text-xs font-bold bg-primary-container hover:bg-primary text-white rounded-xl transition-colors shadow-sm">
                    {t.login}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="lg:hidden text-gray-700 p-2 focus:outline-none"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
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
            <span className="text-primary">Class</span>
            <span className="text-secondary-container">Connect</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="text-gray-700 p-1" aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <nav className="py-2 flex flex-col">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-6 py-3 text-base font-medium transition-colors border-l-4 ${
                isActive(link.path)
                  ? 'text-primary-container bg-primary-container/10 border-secondary-container font-semibold'
                  : 'text-gray-700 hover:bg-gray-50 border-transparent'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-5 border-t border-gray-200 flex flex-col gap-3">
          {currentUser ? (
            <>
              <Link to={currentUser.role === 'admin' ? '/admin' : '/dashboard'} className="w-full py-2.5 text-center text-sm font-semibold border border-primary-container text-primary-container rounded-xl">
                {t.dashboard}
              </Link>
              <button onClick={() => { onLogout(); setMobileOpen(false); }} className="w-full py-2.5 text-center text-sm font-semibold bg-amber-500 text-white rounded-xl">
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="w-full py-2.5 text-center text-sm font-semibold bg-amber-500 text-white rounded-xl">
                {t.register}
              </Link>
              <Link to="/login" className="w-full py-2.5 text-center text-sm font-semibold bg-primary-container text-white rounded-xl">
                {t.login}
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
