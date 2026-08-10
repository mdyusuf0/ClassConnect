import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import store from '../data/mockStore';
import './Courses.css';
import { Clock, BookOpen, BarChart } from 'lucide-react';

export default function Courses() {
  const [activeTab, setActiveTab] = useState('All');
  const categories = ['All', 'Marketing', 'E-Commerce', 'AI & Tech', 'Content Creation', 'Social Media', 'Business'];

  const filteredCourses = activeTab === 'All' 
    ? store.getCourses() 
    : store.getCoursesByCategory(activeTab);

  return (
    <div className="courses-page">
      <div className="breadcrumb-hero">
        <div className="container">
          <h1 className="heading-lg">Our Courses</h1>
        </div>
      </div>

      <section className="courses-section section-gap container">
        <div className="category-tabs">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="courses-grid">
          {filteredCourses.map(course => (
            <Link to={`/course/${course.id}`} key={course.id} className="course-card card-edge-glow">
              <div className="course-thumbnail">
                <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop'} alt={course.title} />
                <span className="category-chip chip">{course.category}</span>
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-desc">{course.description}</p>
                <div className="course-meta">
                  <span className="meta-item"><Clock size={16} /> {course.duration || '4 Weeks'}</span>
                  <span className="meta-item"><BookOpen size={16} /> {course.lessons || 12} Lessons</span>
                  <span className="meta-item"><BarChart size={16} /> {course.level || 'Beginner'}</span>
                </div>
              </div>
            </Link>
          ))}
          {filteredCourses.length === 0 && (
            <div className="no-courses">
              <p>No courses found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
