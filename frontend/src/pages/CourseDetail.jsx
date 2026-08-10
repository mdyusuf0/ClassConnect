import React from 'react';
import { useParams, Link } from 'react-router-dom';
import store from '../data/mockStore';
import './CourseDetail.css';
import { Clock, BookOpen, BarChart, User, CheckCircle } from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const course = store.getCourseById(Number(id) || id);
  const packages = store.getPackages().filter(p => p.courses && p.courses.includes(course?.id));

  if (!course) {
    return (
      <div className="course-detail-page section-gap container text-center">
        <h2>Course Not Found</h2>
        <p>The course you are looking for does not exist or has been removed.</p>
        <Link to="/courses" className="btn btn-primary">Back to Courses</Link>
      </div>
    );
  }

  const learningOutcomes = [
    "Understand the core concepts and principles of the subject.",
    "Apply theoretical knowledge to practical, real-world scenarios.",
    "Develop critical thinking and problem-solving skills.",
    "Master essential tools and techniques relevant to the field.",
    "Build a portfolio of projects demonstrating your competence.",
    "Gain confidence to pursue advanced studies or career opportunities."
  ];

  return (
    <div className="course-detail-page">
      <div className="course-hero">
        <div className="container">
          <div className="hero-content">
            <span className="chip bg-secondary mb-3 inline-block">{course.category}</span>
            <h1 className="heading-lg">{course.title}</h1>
            <div className="course-hero-meta mt-4">
              <span className="meta-item"><User size={20} /> Instructor: Expert</span>
              <span className="meta-item"><Clock size={20} /> {course.duration || '4 Weeks'}</span>
              <span className="meta-item"><BookOpen size={20} /> {course.lessons || 12} Lessons</span>
              <span className="meta-item"><BarChart size={20} /> {course.level || 'Beginner'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container course-main section-gap">
        <div className="course-layout">
          <div className="course-content-left">
            <img 
              src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop'} 
              alt={course.title} 
              className="course-full-image" 
            />
            
            <div className="course-section mt-5">
              <h2>Course Description</h2>
              <p>{course.description}</p>
              <p className="mt-3">This comprehensive course dives deep into {course.category}, equipping you with the necessary skills to excel. Whether you are starting from scratch or looking to enhance your existing knowledge, this structured program provides a clear path to mastery.</p>
            </div>

            <div className="course-section mt-5">
              <h2>What You'll Learn</h2>
              <ul className="learning-list">
                {learningOutcomes.map((outcome, idx) => (
                  <li key={idx}>
                    <CheckCircle className="check-icon" size={20} />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="course-sidebar">
            <div className="sidebar-widget card-edge-glow">
              <h3>Included In Packages</h3>
              {packages.length > 0 ? (
                <div className="package-links">
                  {packages.map(pkg => (
                    <div key={pkg.id} className="package-mini-card">
                      <h4>{pkg.name} Package</h4>
                      <p className="pkg-price">₹{pkg.price}</p>
                      <Link to={`/register?package=${pkg.id}`} className="btn btn-secondary w-100">Enroll Now</Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p>This course is available individually.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
