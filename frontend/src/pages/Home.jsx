import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import store from '../data/mockStore.js';
import { 
  Star, Play, Clock, BookOpen, Users, Award, 
  ChevronRight, GraduationCap, Infinity, CheckCircle2 
} from 'lucide-react';
import './Home.css';

const Counter = ({ target, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.ceil(start));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={counterRef}>{count}{suffix}</span>;
};

const Home = () => {
  const courses = store.getCourses().slice(0, 8);
  const packages = store.getPackages();
  const testimonials = store.getTestimonials();

  // Intersection observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="hero-section section-gap fade-in">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="heading-lg">We Provide The Best Online Courses</h1>
            <p className="hero-subtitle">
              Join our digital skills academy to learn from the best instructors and enhance your career opportunities.
            </p>
            <div className="hero-actions">
              <Link to="/courses" className="btn btn-primary">
                Get Started <ChevronRight size={20} />
              </Link>
            </div>
          </div>
          <div className="hero-images">
            <div className="hero-image-gallery">
              <div className="hero-img main-img">
                <img src="https://via.placeholder.com/400x500" alt="Student" />
              </div>
              <div className="hero-img float-img-1">
                <img src="https://via.placeholder.com/200x250" alt="Learning" />
              </div>
              <div className="hero-img float-img-2">
                <img src="https://via.placeholder.com/250x200" alt="Success" />
              </div>
              <div className="floating-stat stat-1 card-edge-glow">
                <Users className="stat-icon primary" />
                <div>
                  <h4>1000+</h4>
                  <p>Users</p>
                </div>
              </div>
              <div className="floating-stat stat-2 card-edge-glow">
                <Play className="stat-icon secondary" />
                <div>
                  <h4>500+</h4>
                  <p>Videos</p>
                </div>
              </div>
              <div className="floating-stat stat-3 card-edge-glow">
                <Star className="stat-icon warning" />
                <div>
                  <h4>4.9</h4>
                  <p>Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Us Section */}
      <section className="about-section section-gap fade-in">
        <div className="container about-container">
          <div className="about-images">
            <div className="about-img-1">
              <img src="https://via.placeholder.com/350x450" alt="About us" />
            </div>
            <div className="about-img-2">
              <img src="https://via.placeholder.com/300x350" alt="About our classes" />
            </div>
          </div>
          <div className="about-content">
            <span className="pre-title">About Us</span>
            <h2 className="section-title">
              We Provide The <span className="highlight">Best Online Courses</span>
            </h2>
            <p className="about-text">
              ClassConnect is the leading digital academy committed to providing top-notch education. We empower students and professionals by teaching valuable skills needed in today's fast-paced digital world.
            </p>
            <div className="stats-row">
              <div className="stat-item">
                <h3 className="stat-number"><Counter target={1000} suffix="+" /></h3>
                <p>Users</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number"><Counter target={500} suffix="+" /></h3>
                <p>Videos</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number"><Counter target={100} suffix="%" /></h3>
                <p>Happy Students</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number"><Counter target={4.9} /></h3>
                <p>Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Courses Section */}
      <section className="courses-section section-gap fade-in">
        <div className="container">
          <div className="section-header text-center">
            <span className="pre-title">Learn Today</span>
            <h2 className="section-title">ClassConnect Courses</h2>
          </div>
          <div className="courses-grid">
            {courses.map(course => (
              <div key={course.id} className="course-card card-edge-glow">
                <div className="course-thumbnail">
                  <img src={course.thumbnail} alt={course.title} />
                  <span className="chip chip-primary category-chip">{course.category}</span>
                </div>
                <div className="course-info">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="instructor-name">by {course.instructor}</p>
                  <div className="course-meta">
                    <span className="meta-item"><Clock size={16} /> {course.duration}</span>
                    <span className="meta-item"><BookOpen size={16} /> {course.lessons} Lessons</span>
                  </div>
                  <div className="course-footer">
                    <span className="level-badge">{course.level}</span>
                    <Link to={`/course/${course.id}`} className="view-details">Details <ChevronRight size={16} /></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4" style={{ marginTop: '40px' }}>
            <Link to="/courses" className="btn btn-secondary">View All Courses</Link>
          </div>
        </div>
      </section>

      {/* 4. Packages Section */}
      <section className="packages-section section-gap fade-in">
        <div className="container">
          <div className="section-header text-center">
            <span className="pre-title">Get Membership</span>
            <h2 className="section-title">ClassConnect Packages</h2>
          </div>
          <div className="packages-grid">
            {packages.map(pkg => (
              <div key={pkg.id} className={`package-card card-edge-glow ${pkg.popular ? 'popular' : ''}`}>
                {pkg.popular && <span className="popular-badge">Most Popular</span>}
                <div className="package-header">
                  <h3 className="package-name">{pkg.name}</h3>
                  <div className="package-price">
                    <span className="current-price">₹{pkg.price.toLocaleString('en-IN')}</span>
                    {pkg.originalPrice && (
                      <span className="original-price">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>
                <div className="package-features">
                  <p className="commission-text">Referral Commission: ₹{pkg.commission}</p>
                  <p className="courses-included">{pkg.coursesIncluded} Courses Included</p>
                  <ul className="feature-list">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx}><CheckCircle2 size={18} className="check-icon" /> {feature}</li>
                    ))}
                  </ul>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }}>Enroll Now</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Video Testimonials Section */}
      <section className="video-testimonials-section section-gap fade-in">
        <div className="container">
          <div className="section-header text-center">
            <span className="pre-title">Success Stories</span>
            <h2 className="section-title">What our Students Say</h2>
          </div>
          <div className="video-grid">
            {[1, 2, 3, 4].map(item => (
              <div key={item} className="video-card card-edge-glow">
                <div className="video-placeholder">
                  <div className="play-button-overlay">
                    <Play size={32} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Text Testimonials Section */}
      <section className="testimonials-section section-gap fade-in">
        <div className="container">
          <div className="section-header text-center">
            <span className="pre-title">Reviews</span>
            <h2 className="section-title"><span className="highlight">Student</span> Testimonials</h2>
          </div>
          <div className="testimonials-carousel">
            {testimonials.map(test => (
              <div key={test.id} className="testimonial-card card-edge-glow">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(test.rating) ? "#ffc107" : "none"} color={i < Math.floor(test.rating) ? "#ffc107" : "#ccc"} />
                  ))}
                </div>
                <p className="quote">"{test.text}"</p>
                <div className="author-info">
                  <img src={test.avatar} alt={test.author} className="author-avatar" />
                  <div>
                    <h4 className="author-name">{test.author}</h4>
                    <p className="author-role">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Why Choose Us Section */}
      <section className="why-choose-us-section section-gap fade-in">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card card-edge-glow">
              <div className="icon-wrapper primary-bg">
                <GraduationCap size={32} />
              </div>
              <h3>High Quality Courses</h3>
              <p>Learn from meticulously crafted curriculum designed by industry professionals.</p>
            </div>
            <div className="feature-card card-edge-glow">
              <div className="icon-wrapper secondary-bg">
                <Infinity size={32} />
              </div>
              <h3>Life Time Access</h3>
              <p>Get unlimited access to your courses and learn at your own pace anytime, anywhere.</p>
            </div>
            <div className="feature-card card-edge-glow">
              <div className="icon-wrapper success-bg">
                <Award size={32} />
              </div>
              <h3>Expert Instructors</h3>
              <p>Receive training and mentorship from highly qualified and experienced trainers.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
