import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import store from '../data/mockStore.js';
import { 
  Star, Play, Clock, Users, Award, 
  ChevronRight, ChevronLeft, GraduationCap, Infinity, CheckCircle2, Heart, Zap, Globe, Sparkles, ArrowRight
} from 'lucide-react';
import { translations } from '../data/translations';

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

export default function Home({ currentLang = 'EN' }) {
  const courses = store.getCourses();
  const packages = store.getPackages();
  const [favorites, setFavorites] = useState({});

  const t = translations[currentLang]?.hero || translations.EN.hero;
  const tc = translations[currentLang]?.common || translations.EN.common;

  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroSlides = [
    {
      id: 0,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&h=900&fit=crop",
      tag: t.slides?.[0]?.tag || "Bilingual Visual Learning OS",
      part1: t.slides?.[0]?.part1 || "Master ",
      partAccent: t.slides?.[0]?.partAccent || "High-Income ",
      part2: t.slides?.[0]?.part2 || "skills that ",
      partUnderline: t.slides?.[0]?.partUnderline || "scale your career",
      subtitle: t.slides?.[0]?.subtitle || "Break free from generic tutorials. Build production-grade Web apps, AI agents & Design systems alongside senior industry mentors with 100% bilingual clarity.",
      unique: t.slides?.[0]?.unique || "100% Practical Training + Cryptographic Skill Credentials",
    },
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&h=900&fit=crop",
      tag: t.slides?.[1]?.tag || "Transformative Student Growth",
      part1: t.slides?.[1]?.part1 || "Transform ",
      partAccent: t.slides?.[1]?.partAccent || "Your Skills ",
      part2: t.slides?.[1]?.part2 || "with step-by-step ",
      partUnderline: t.slides?.[1]?.partUnderline || "live masterclasses",
      subtitle: t.slides?.[1]?.subtitle || "From fundamental basics to production-ready projects under 1-on-1 expert PRO Mentors in English & Telugu.",
      unique: t.slides?.[1]?.unique || "Real Live Project Labs + Direct Daily Referral Commission Payouts",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&h=900&fit=crop",
      tag: t.slides?.[2]?.tag || "Career Readiness & Innovation",
      part1: t.slides?.[2]?.part1 || "Build ",
      partAccent: t.slides?.[2]?.partAccent || "Future Tech ",
      part2: t.slides?.[2]?.part2 || "that empowers ",
      partUnderline: t.slides?.[2]?.partUnderline || "your digital success",
      subtitle: t.slides?.[2]?.subtitle || "Outcome-driven education designed for ambitious learners, creators, and future tech professionals.",
      unique: t.slides?.[2]?.unique || "Unified Workspace for Recorded Units, Live Sessions & Certificates",
    }
  ];

  // Auto-advance hero slides every 6s unless hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  };

  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeSlideData = heroSlides[currentSlide];

  return (
    <div className="bg-[#F5F9FA] min-h-screen">
      {/* 1. Interactive Full-Screen Hero Carousel (Reference Typography & Vivid Clear Images) */}
      <section 
        className="relative h-[650px] sm:h-[700px] lg:h-[760px] bg-gray-950 text-white overflow-hidden flex items-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Full-Screen Vivid Student Background Images */}
        {heroSlides.map((slide, idx) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img 
              src={slide.image} 
              alt={slide.part1}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000 ease-out" 
            />
            {/* Subtle Gradient Vignette: Keeps student image bright while making pure white text pop! */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/85 via-gray-950/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
          </div>
        ))}

        {/* Hero Content Container - Anchored Left with Refined Compact Typography */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-20 w-full py-12 md:py-16">
          <div className="max-w-xl text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-4 shadow-sm animate-fade-in">
              <Sparkles size={13} className="text-amber-400 animate-pulse" /> {activeSlideData.tag}
            </div>

            {/* Compact Headline Typography */}
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] animate-fade-in">
              {activeSlideData.part1}
              <span className="font-serif italic font-normal text-amber-400 pr-1.5">
                {activeSlideData.partAccent}
              </span>
              {activeSlideData.part2}
              <span className="relative inline-block text-white after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[3px] after:bg-gradient-to-r after:from-amber-400 after:via-orange-500 after:to-purple-500 after:rounded-full">
                {activeSlideData.partUnderline}
              </span>
            </h1>

            {/* Compact Subtitle Text */}
            <p className="text-slate-100 text-xs sm:text-sm font-normal leading-relaxed mb-5 max-w-md drop-shadow-md animate-fade-in">
              {activeSlideData.subtitle}
            </p>

            {/* Compact CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/courses" className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-heading font-bold text-xs tracking-wider uppercase px-6 py-3 rounded-full transition-all shadow-md active:scale-95 inline-flex items-center gap-1.5">
                {t.getStarted} <ArrowRight size={15} />
              </Link>
              <Link to="/packages" className="bg-white hover:bg-slate-100 text-gray-900 font-heading font-bold text-xs tracking-wider uppercase px-6 py-3 rounded-full transition-all shadow-md active:scale-95">
                Start Learning Free
              </Link>
            </div>
          </div>
        </div>

        {/* Cool Slide Controls: Left & Right Buttons */}
        <div className="absolute inset-y-0 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 rounded-full bg-black/40 hover:bg-amber-500 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-2xl pointer-events-auto active:scale-90 group"
            aria-label="Previous slide"
            title="Previous Slide"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="w-12 h-12 rounded-full bg-black/40 hover:bg-amber-500 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-2xl pointer-events-auto active:scale-90 group"
            aria-label="Next slide"
            title="Next Slide"
          >
            <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Bottom Slide Indicator Dots */}
        <div className="absolute bottom-6 inset-x-0 z-30 flex items-center justify-center gap-3">
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentSlide 
                  ? 'w-9 h-2.5 bg-amber-400 shadow-lg' 
                  : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. About Us Section */}
      <section className="py-16 md:py-20 bg-white border-y border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=500&fit=crop" alt="Bilingual OS" className="rounded-2xl shadow-md object-cover w-full h-64" />
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop" alt="Live Masterclasses" className="rounded-2xl shadow-md object-cover w-full h-64 mt-6" />
          </div>

          <div className="lg:col-span-7">
            <span className="pre-title">Bilingual Learning OS</span>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-gray-900 mb-4">
              We Unify <span className="text-secondary-container">Live & Recorded Learning</span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              ClassConnect replaces fragmented video tutorials with a unified bilingual workspace (English & Telugu). Master fullstack web development, mobile apps, generative AI tools, and performance marketing under expert PRO Mentors.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-gray-100">
              <div>
                <h3 className="font-heading font-extrabold text-3xl text-primary"><Counter target={10000} suffix="+" /></h3>
                <p className="text-xs font-semibold text-gray-500 uppercase mt-1">Active Learners</p>
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-3xl text-secondary-container"><Counter target={30} suffix="+" /></h3>
                <p className="text-xs font-semibold text-gray-500 uppercase mt-1">Courses</p>
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-3xl text-emerald-600"><Counter target={100} suffix="%" /></h3>
                <p className="text-xs font-semibold text-gray-500 uppercase mt-1">Real Projects</p>
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-3xl text-amber-500"><Counter target={4.8} /></h3>
                <p className="text-xs font-semibold text-gray-500 uppercase mt-1">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Courses Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="pre-title">Explore Catalog</span>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-gray-900">ClassConnect Courses</h2>
            <p className="text-gray-600 text-sm mt-2">Master 30 high-income digital skills with step-by-step practical guidance.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map(course => (
              <div key={course.id} className="premium-course-card group">
                <div className="card-media-wrapper">
                  <img src={course.thumbnail} alt={course.title} className="card-media-img" />
                  
                  {/* Top Overlay Badges */}
                  <div className="absolute top-3 right-3 z-10">
                    <button 
                      className="favorite-glass-btn"
                      onClick={(e) => toggleFavorite(course.id, e)}
                      aria-label="Save course"
                    >
                      <Heart size={16} fill={favorites[course.id] ? '#EE4A03' : 'none'} color={favorites[course.id] ? '#EE4A03' : '#FFFFFF'} />
                    </button>
                  </div>
                </div>

                <div className="card-body-content">
                  <h3 className="card-course-title">{course.title}</h3>
                  <p className="card-course-desc">{course.description}</p>
                  <div className="card-divider"></div>
                  <div className="card-footer-row">
                    <Link to={`/course/${course.id}`} className="card-action-btn">
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

          <div className="text-center mt-12">
            <Link to="/courses" className="px-8 py-3.5 bg-primary-container hover:bg-primary text-white font-heading font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md inline-flex items-center gap-2">
              {tc.viewAll} <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Packages Section */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-200 package-ambient-glow relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="pre-title">Save Up To 70%</span>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-gray-900">ClassConnect Package Bundles</h2>
            <p className="text-gray-600 text-sm mt-2">Get access to multiple courses in bundled packages and earn direct referral commissions!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
            {packages.map((pkg, idx) => (
              <div 
                key={pkg.id} 
                className="aceternity-package-card"
              >
                <div className="mb-3">
                  <span className="text-[11px] font-bold text-gray-400">#{'0' + (idx + 1)}</span>
                  <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-1">{pkg.name}</h3>
                  <p className="text-xs text-gray-500 font-medium">{pkg.courses?.length || 4} Masterclasses Included</p>
                </div>

                <div className="bg-gray-50/90 rounded-2xl p-3 border border-gray-200 mb-4 flex items-center justify-between gap-2 shadow-inner">
                  <Link to={`/register?package=${pkg.id}`} className="px-3.5 py-2 rounded-full font-heading font-extrabold text-[10px] uppercase bg-primary-container text-white hover:bg-primary transition-all">
                    {tc.enrollNow}
                  </Link>
                  <div className="text-right">
                    {pkg.originalPrice && (
                      <span className="block text-[10px] text-gray-400 line-through decoration-red-500 leading-none mb-0.5">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                    <span className="font-heading font-extrabold text-base text-gray-900 leading-none">₹{pkg.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-2 mb-4 text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-600" /> {tc.referralEarnings}: ₹{pkg.commission}
                </div>

                <ul className="space-y-2 text-xs text-gray-600 mb-4 flex-grow border-t border-gray-100 pt-3">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-[#F5F9FA]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-primary-container/10 text-primary-container flex items-center justify-center mb-6">
                <GraduationCap size={32} />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-3">Outcome-Focused Learning</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Designed around career transformation, practical software engineering, UI/UX design, AI integration, and digital growth.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6">
                <Globe size={32} />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-3">100% Bilingual OS</h3>
              <p className="text-gray-600 text-sm leading-relaxed">First-of-its-kind seamless Telugu and English switching across every screen, ensuring barrier-free education.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
                <Award size={32} />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-3">PRO Mentors & Credentials</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Receive live mentorship from industry faculty and earn cryptographically verifiable skill certificates.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
