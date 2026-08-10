import React, { useState } from 'react';
import './Contact.css';
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="contact-page">
      <div className="breadcrumb-hero">
        <div className="container">
          <h1 className="heading-lg">Contact Us</h1>
        </div>
      </div>

      <section className="contact-section section-gap container">
        <div className="contact-grid">
          <div className="contact-form-wrapper card-edge-glow">
            <h2>Get In Touch</h2>
            <p className="form-subtitle">Fill out the form below and we will get back to you shortly.</p>
            
            {submitted && (
              <div className="success-toast">
                Message sent successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <input type="text" name="name" placeholder="Your Name" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input type="email" name="email" placeholder="Your Email" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <input type="text" name="subject" placeholder="Subject" required value={formData.subject} onChange={handleChange} />
              </div>
              <div className="form-group">
                <textarea name="message" placeholder="Your Message" rows="5" required value={formData.message} onChange={handleChange}></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                <Send size={18} /> Send Message
              </button>
            </form>
          </div>

          <div className="contact-info">
            <div className="info-card card-edge-glow">
              <div className="info-icon"><Phone /></div>
              <div>
                <h3>Phone & WhatsApp</h3>
                <p>+91 98765 43210</p>
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="whatsapp-btn">
                  <MessageCircle size={18} /> Chat on WhatsApp
                </a>
              </div>
            </div>
            
            <div className="info-card card-edge-glow">
              <div className="info-icon"><Mail /></div>
              <div>
                <h3>Email Address</h3>
                <p>support@classconnect.com</p>
              </div>
            </div>

            <div className="info-card card-edge-glow">
              <div className="info-icon"><MapPin /></div>
              <div>
                <h3>Location</h3>
                <p>Mumbai, Maharashtra, India</p>
              </div>
            </div>

            <div className="map-wrapper card-edge-glow">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.116099557!2d72.7410999534241!3d19.08219783852033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" height="250" style={{border:0, borderRadius: '12px'}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Location Map">
              </iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
