import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import store from '../data/mockStore';
import { Clock, Heart } from 'lucide-react';
import { translations } from '../data/translations';

export default function Courses({ currentLang = 'EN' }) {
  const [activeTab, setActiveTab] = useState('All');
  const [favorites, setFavorites] = useState({});
  const [courses, setCourses] = useState([]);

  const t = translations[currentLang]?.coursesPage || translations.EN.coursesPage;
  const tc = translations[currentLang]?.common || translations.EN.common;
  
  const categories = [
    { id: 'All', label: t.tabs.all },
    { id: 'Marketing', label: t.tabs.marketing },
    { id: 'AI & Tech', label: t.tabs.ai },
    { id: 'Content Creation', label: t.tabs.content },
    { id: 'E-Commerce', label: t.tabs.ecommerce },
    { id: 'Business', label: t.tabs.business },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const storeCourses = store.getCoursesByCategory(activeTab);
        const data = await api.getCoursesApi(activeTab).catch(() => null);
        setCourses(data && data.length >= 5 ? data : storeCourses);
      } catch (err) {
        console.warn('Failed to load dynamic courses:', err.message);
        setCourses(store.getCoursesByCategory(activeTab));
      }
    };
    fetchCourses();
  }, [activeTab]);

  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-[#F5F9FA] min-h-screen py-8">
      {/* Header Banner */}
      <div className="bg-primary text-white py-12 mb-10 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">{t.tag}</span>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl">{t.title}</h1>
          <p className="text-gray-300 text-sm md:text-base mt-2 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              className={`px-5 py-2.5 rounded-xl font-heading font-bold text-xs md:text-sm whitespace-nowrap transition-all duration-200 ${
                activeTab === cat.id 
                  ? 'bg-primary-container text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              onClick={() => setActiveTab(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Courses Grid with display viewport bounds */}
        <div className="max-h-[calc(100vh-260px)] overflow-y-auto pr-2 pb-6 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map(course => (
            <div key={course.id || course._id} className="premium-course-card group">
                <div className="card-media-wrapper">
                  <img src={course.thumbnail} alt={course.title} className="card-media-img" />
                  
                  {/* Top Overlay Badges */}
                  <div className="absolute top-3 right-3 z-10">
                    <button 
                      className="favorite-glass-btn"
                      onClick={(e) => toggleFavorite(course.id || course._id, e)}
                      aria-label="Save course"
                    >
                      <Heart size={16} fill={favorites[course.id || course._id] ? '#EE4A03' : 'none'} color={favorites[course.id || course._id] ? '#EE4A03' : '#FFFFFF'} />
                    </button>
                  </div>
                </div>

                <div className="card-body-content">
                  <h3 className="card-course-title">{course.title}</h3>
                  <p className="card-course-desc">{course.description}</p>
                  <div className="card-divider"></div>
                  <div className="card-footer-row">
                    <Link to={`/course/${course.id || course._id}`} className="card-action-btn">
                      {tc.explore}
                    </Link>
                    <div className="card-price-block">
                      {course.originalPrice && (
                        <span className="text-[11px] font-semibold text-gray-400 line-through decoration-red-500 decoration-2 leading-none mb-1">
                          ₹{(course.originalPrice || 2999).toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="font-heading font-extrabold text-base md:text-lg text-gray-900 leading-none">
                        ₹{(course.price || 1499).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
            </div>
          ))}
          </div>
        </div>

        {courses.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <p className="text-gray-500 text-base">{tc.noResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}
