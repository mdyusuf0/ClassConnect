import React from 'react';
import './About.css';
import { Users, PlayCircle, Smile, Star, BookOpen, Clock, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="about-page">
      <div className="breadcrumb-hero">
        <div className="container">
          <h1 className="heading-lg">About Us</h1>
        </div>
      </div>

      <section className="about-content section-gap container">
        <div className="about-grid">
          <div className="about-text">
            <span className="pre-title">Know About Us</span>
            <h2 className="section-title">We Provide The <span className="highlight">Best Online Courses</span></h2>
            <p>
              ClassConnect Academy, founded by Surekha, is dedicated to empowering students worldwide with high-quality education. Our mission is to make learning accessible, engaging, and effective for everyone, regardless of their background or location. We believe in the power of education to transform lives and communities.
            </p>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" alt="About ClassConnect" />
          </div>
        </div>
      </section>

      <section className="counter-stats section-gap">
        <div className="container stats-grid">
          <div className="stat-card">
            <Users size={40} className="stat-icon" />
            <div className="stat-number">1000+</div>
            <div className="stat-label">Users</div>
          </div>
          <div className="stat-card">
            <PlayCircle size={40} className="stat-icon" />
            <div className="stat-number">500+</div>
            <div className="stat-label">Videos</div>
          </div>
          <div className="stat-card">
            <Smile size={40} className="stat-icon" />
            <div className="stat-number">100%</div>
            <div className="stat-label">Happy Students</div>
          </div>
          <div className="stat-card">
            <Star size={40} className="stat-icon" />
            <div className="stat-number">4.9</div>
            <div className="stat-label">Rating</div>
          </div>
        </div>
      </section>

      <section className="why-choose-us section-gap container">
        <div className="text-center">
          <span className="pre-title">Why Choose Us</span>
          <h2 className="section-title">Our Core Features</h2>
        </div>
        <div className="features-grid">
          <div className="feature-card card-edge-glow">
            <div className="feature-icon-wrapper">
              <BookOpen size={32} />
            </div>
            <h3>High Quality Courses</h3>
            <p>Comprehensive and up-to-date curriculum designed by industry experts to ensure you get the best education.</p>
          </div>
          <div className="feature-card card-edge-glow">
            <div className="feature-icon-wrapper">
              <Clock size={32} />
            </div>
            <h3>Life Time Access</h3>
            <p>Learn at your own pace with lifetime access to course materials, including future updates and additions.</p>
          </div>
          <div className="feature-card card-edge-glow">
            <div className="feature-icon-wrapper">
              <Award size={32} />
            </div>
            <h3>Expert Instructors</h3>
            <p>Learn directly from seasoned professionals who bring real-world experience and insights to the classroom.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
