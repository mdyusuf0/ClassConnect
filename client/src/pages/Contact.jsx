import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, MessageCircle, Send, 
  CheckCircle2, Clock, ShieldCheck, ChevronDown, Sparkles, HelpCircle 
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: 'Package Bundle Guidance', message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: 'Package Bundle Guidance', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const faqs = [
    {
      q: "How do I get instant access to courses after enrolling?",
      a: "Once you complete your registration and payment for any Package Bundle (Bronze, Silver, Gold, Diamond, or Platinum), your account is instantly activated and all bundled courses are unlocked in your Student Dashboard."
    },
    {
      q: "How does the referral commission payout work?",
      a: "When a student enrolls using your unique referral ID, commission (up to ₹3,000 per referral depending on the package) is credited to your wallet. You can request payouts anytime directly to your UPI or Bank Account."
    },
    {
      q: "Can complete beginners with no prior experience learn these courses?",
      a: "Yes! All 30+ courses are structured step-by-step from fundamental basics to advanced practical implementation, designed specifically for beginners and non-tech learners."
    },
    {
      q: "Is there live mentorship available for doubt clearing?",
      a: "Yes! We host weekly and daily live training sessions led by ClassConnect PRO Mentors and expert faculty where you can ask questions live and get real-time project feedback."
    },
    {
      q: "Will I receive course completion certificates?",
      a: "Yes! Professional digital certificates of completion are issued for every course completed on ClassConnect."
    }
  ];

  return (
    <div className="bg-[#F5F9FA] min-h-screen text-gray-900 overflow-x-hidden">
      {/* 1. Header Banner */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-[#001845] via-[#002B70] to-[#001845] text-white text-center overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-xs font-extrabold uppercase tracking-widest mb-4 shadow-md">
            <Sparkles size={14} className="text-amber-400" /> We Are Here To Help You
          </span>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
            Get In Touch With Our <span className="text-amber-400">Guidance Team</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
            Have questions about package bundles, course selection, or referral payouts? Our support mentors are available 7 days a week.
          </p>
        </div>
      </section>

      {/* 2. Main Contact Grid */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-xl relative">
            <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-gray-900 mb-2">Send Us A Message</h2>
            <p className="text-gray-600 text-xs md:text-sm mb-8">Fill out your details below and our mentorship team will reach out via WhatsApp or phone call.</p>

            {submitted && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3 animate-fade-in">
                <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
                <span>Thank you! Your message has been received. Our team will contact you within 2 hours.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Your Full Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    placeholder="Enter your name"
                    value={formData.name} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    placeholder="name@example.com"
                    value={formData.email} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent text-sm transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone / WhatsApp Number *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-600 text-xs font-bold">
                      +91
                    </span>
                    <input 
                      type="tel" 
                      name="phone" 
                      required 
                      placeholder="10 digit number"
                      value={formData.phone} 
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-r-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent text-sm transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Inquiry Topic</label>
                  <select 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent text-sm bg-white transition-all"
                  >
                    <option value="Package Bundle Guidance">Package Bundle Guidance</option>
                    <option value="Course Catalog Information">Course Catalog Information</option>
                    <option value="Referral Payout Support">Referral Payout Support</option>
                    <option value="Technical Login Issue">Technical Login Issue</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Your Message *</label>
                <textarea 
                  name="message" 
                  rows="4" 
                  required 
                  placeholder="How can we assist you with courses or package bundles?"
                  value={formData.message} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent text-sm transition-all"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-heading font-extrabold text-sm tracking-wider uppercase rounded-xl transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
              >
                <Send size={18} /> Send Message Now
              </button>
            </form>
          </div>

          {/* Right Column: Direct Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp Card */}
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 shadow-lg border border-emerald-700/50 relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={26} />
                </div>
                <div className="flex-grow">
                  <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-widest block mb-1">Instant Support</span>
                  <h3 className="font-heading font-extrabold text-xl mb-2">WhatsApp Direct Lines</h3>
                  <div className="space-y-1 text-sm font-semibold text-gray-200">
                    <p>📲 +91 8885490091</p>
                    <p>📲 +91 9014887314</p>
                  </div>
                  <a 
                    href="https://wa.me/+918885490091" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-extrabold text-xs tracking-wider uppercase transition-colors shadow-md"
                  >
                    Chat on WhatsApp Now
                  </a>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-container/10 text-primary-container flex items-center justify-center flex-shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Email Inquiry</span>
                <h4 className="font-heading font-bold text-base text-gray-900">info@classconnect.com</h4>
                <p className="text-xs text-gray-500 mt-1">Guaranteed reply within 2 hours during business hours.</p>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Academy Centers</span>
                <h4 className="font-heading font-bold text-base text-gray-900">Hyderabad & Mumbai, India</h4>
                <p className="text-xs text-gray-500 mt-1">ClassConnect Digital Learning Hubs</p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Operating Hours</span>
                <h4 className="font-heading font-bold text-base text-gray-900">Mon - Sat: 9:00 AM - 9:00 PM IST</h4>
                <p className="text-xs text-emerald-600 font-semibold mt-1">● WhatsApp Support Active Today</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive FAQ Accordion */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="pre-title">Got Questions?</span>
            <h2 className="font-heading font-extrabold text-3xl text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-600 text-sm mt-2">Quick answers to common questions about courses, package bundles, and referral payouts.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-[#F5F9FA] rounded-2xl border border-gray-200 overflow-hidden transition-all duration-200"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-heading font-bold text-base text-gray-900 hover:text-primary-container transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle size={18} className="text-amber-500 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown size={18} className={`text-gray-500 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-amber-500' : ''}`} />
                </button>

                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-gray-600 leading-relaxed border-t border-gray-200/60 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
