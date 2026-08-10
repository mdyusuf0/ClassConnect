import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Packages from './pages/Packages';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminCMS from './pages/AdminCMS';
import Profile from './pages/Profile';

// Cookie helper
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function isUserAuthenticated(currentUser) {
  if (currentUser) return true;
  const localUser = localStorage.getItem('classconnect_user');
  const localToken = localStorage.getItem('classconnect_token');
  const cookieUser = getCookie('classconnect_user') || getCookie('user');
  const cookieToken = getCookie('classconnect_token') || getCookie('token') || getCookie('session');

  return !!(localUser || localToken || cookieUser || cookieToken);
}

function getUserTargetDashboard(currentUser) {
  let user = currentUser;
  if (!user) {
    try {
      const savedUser = localStorage.getItem('classconnect_user') || getCookie('classconnect_user') || getCookie('user');
      if (savedUser) user = typeof savedUser === 'string' ? JSON.parse(savedUser) : savedUser;
    } catch (e) {
      user = null;
    }
  }
  return user?.role === 'admin' ? '/admin' : '/dashboard';
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('classconnect_lang') || 'EN';
  });

  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('classconnect_user') || getCookie('classconnect_user');
    if (savedUser) {
      try {
        const parsed = typeof savedUser === 'string' ? JSON.parse(savedUser) : savedUser;
        setCurrentUser(parsed);
      } catch (e) {
        localStorage.removeItem('classconnect_user');
      }
    }
  }, []);

  const handleLangChange = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('classconnect_lang', lang);
  };

  const handleLogin = (user, token) => {
    setCurrentUser(user);
    const userStr = JSON.stringify(user);
    const userToken = token || user.token || 'valid_session';

    localStorage.setItem('classconnect_user', userStr);
    localStorage.setItem('classconnect_token', userToken);

    document.cookie = `classconnect_user=${encodeURIComponent(userStr)}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `classconnect_token=${encodeURIComponent(userToken)}; path=/; max-age=604800; SameSite=Lax`;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('classconnect_user');
    localStorage.removeItem('classconnect_token');

    document.cookie = 'classconnect_user=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'classconnect_token=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
  };

  // Pages that should not show the main navbar & footer
  const transactionalRoutes = ['/register', '/login', '/admin', '/dashboard'];
  const isTransactional = transactionalRoutes.some(r => location.pathname.startsWith(r));

  const isAuthenticated = isUserAuthenticated(currentUser);
  const targetDashboard = getUserTargetDashboard(currentUser);

  return (
    <>
      <ScrollToTop />
      {!isTransactional && (
        <Navbar 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          currentLang={currentLang} 
          onLangChange={handleLangChange} 
        />
      )}
      <Routes>
        <Route path="/" element={<Home currentLang={currentLang} />} />
        <Route path="/about" element={<About currentLang={currentLang} />} />
        <Route path="/courses" element={<Courses currentLang={currentLang} />} />
        <Route path="/course/:id" element={<CourseDetail currentLang={currentLang} />} />
        <Route path="/packages" element={<Packages currentLang={currentLang} />} />
        <Route path="/contact" element={<Contact currentLang={currentLang} />} />
        
        {/* Auth routes with auto-redirect to Home (/) if logged in */}
        <Route 
          path="/register" 
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Register currentUser={currentUser} onLogin={handleLogin} />
            )
          } 
        />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login currentUser={currentUser} onLogin={handleLogin} />
            )
          } 
        />
        
        <Route path="/dashboard" element={<Dashboard currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/profile" element={<Profile currentUser={currentUser} onUpdateUser={setCurrentUser} />} />
        <Route path="/admin/*" element={<AdminCMS currentUser={currentUser} onLogout={handleLogout} />} />
      </Routes>
      {!isTransactional && <Footer currentLang={currentLang} />}
    </>
  );
}

export default App;

