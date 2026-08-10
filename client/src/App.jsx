import { Routes, Route, useLocation } from 'react-router-dom';
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

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('classconnect_lang') || 'EN';
  });

  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('classconnect_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('classconnect_user');
      }
    }
  }, []);

  const handleLangChange = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('classconnect_lang', lang);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('classconnect_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('classconnect_user');
  };

  // Pages that should not show the main navbar & footer
  const transactionalRoutes = ['/register', '/login', '/admin', '/dashboard'];
  const isTransactional = transactionalRoutes.some(r => location.pathname.startsWith(r));

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
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<Dashboard currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/admin/*" element={<AdminCMS currentUser={currentUser} onLogout={handleLogout} />} />
      </Routes>
      {!isTransactional && <Footer currentLang={currentLang} />}
    </>
  );
}

export default App;
