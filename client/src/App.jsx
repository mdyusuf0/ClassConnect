import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import api from './api/client';
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
  const localUser = localStorage.getItem('classconnect_user') || localStorage.getItem('user');
  const localToken = localStorage.getItem('classconnect_token') || localStorage.getItem('token');
  const cookieUser = getCookie('classconnect_user') || getCookie('user');
  const cookieToken = getCookie('classconnect_token') || getCookie('token') || getCookie('session');

  const hasLocalUser = localUser && localUser !== 'null' && localUser !== 'undefined' && localUser !== '';
  const hasLocalToken = localToken && localToken !== 'null' && localToken !== 'undefined' && localToken !== '' && localToken !== 'valid_session';
  const hasCookieUser = cookieUser && cookieUser !== 'null' && cookieUser !== 'undefined' && cookieUser !== '';
  const hasCookieToken = cookieToken && cookieToken !== 'null' && cookieToken !== 'undefined' && cookieToken !== '' && cookieToken !== 'valid_session';

  return !!(hasLocalUser || hasLocalToken || hasCookieUser || hasCookieToken);
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

  const handleLangChange = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('classconnect_lang', lang);
  };

  const handleLogin = (user, token) => {
    setCurrentUser(user);
    const userStr = JSON.stringify(user);
    
    // Check if there is already a token in localStorage (to avoid overwriting the real JWT token with a placeholder)
    const localTok = localStorage.getItem('classconnect_token');
    const hasLocalTok = localTok && localTok !== 'null' && localTok !== 'undefined' && localTok !== 'valid_session' && localTok !== '';
    const userToken = token || user?.token || (hasLocalTok ? localTok : 'valid_session');

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

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('classconnect_token') || 
                    localStorage.getItem('token') || 
                    getCookie('classconnect_token') || 
                    getCookie('token') || 
                    getCookie('session');

      if (token && token !== 'null' && token !== 'undefined' && token !== '' && token !== 'valid_session') {
        localStorage.setItem('classconnect_token', token);
        try {
          const user = await api.getMeApi();
          setCurrentUser(user);
          localStorage.setItem('classconnect_user', JSON.stringify(user));
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          handleLogout();
        }
      } else {
        const savedUser = localStorage.getItem('classconnect_user') || getCookie('classconnect_user') || getCookie('user');
        if (savedUser) {
          try {
            const parsed = typeof savedUser === 'string' ? JSON.parse(savedUser) : savedUser;
            setCurrentUser(parsed);
          } catch (e) {
            localStorage.removeItem('classconnect_user');
          }
        }
      }
    };
    checkSession();
  }, []);

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
