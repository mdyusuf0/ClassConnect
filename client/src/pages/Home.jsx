import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import { 
  Star, Play, Clock, Users, Award, 
  ChevronRight, ChevronLeft, GraduationCap, Infinity, CheckCircle2, Heart, Zap, Globe, Sparkles, ArrowRight, Video, Quote, X, MessageSquare
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
  const [courses, setCourses] = useState([]);
  const [packages, setPackages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [videoTestimonials, setVideoTestimonials] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const coursesData = await api.getCoursesApi('All');
        setCourses(coursesData || []);

        const packagesData = await api.getPackagesApi();
        setPackages(packagesData || []);

        const videoData = await api.getVideoStoriesApi();
        setVideoTestimonials(videoData || []);

        const reviewsData = await api.getAdminReviewsApi();
        const approved = reviewsData ? reviewsData.filter(r => r.status === 'approved') : [];
        setTestimonials(approved);
      } catch (err) {
        console.warn('Failed to load dynamic home data:', err.message);
      }
    };
    fetchHomeData();
  }, []);

  const [favorites, setFavorites] = useState({});
  const [activeVideoModal, setActiveVideoModal] = useState(null);

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
      {/* 1. Interactive Full-Screen Hero Carousel */}
      <section 
        className="relative h-[650px] sm:h-[700px] lg:h-[760px] bg-gray-950 text-white overflow-hidden flex items-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
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
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/85 via-gray-950/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
          </div>
        ))}

        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-20 w-full py-12 md:py-16">
          <div className="max-w-xl text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-4 shadow-sm animate-fade-in">
              <Sparkles size={13} className="text-amber-400 animate-pulse" /> {activeSlideData.tag}
            </div>

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

            <p className="text-slate-100 text-xs sm:text-sm font-normal leading-relaxed mb-5 max-w-md drop-shadow-md animate-fade-in">
              {activeSlideData.subtitle}
            </p>

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

        <div className="absolute inset-y-0 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 rounded-full bg-black/40 hover:bg-amber-500 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-2xl pointer-events-auto active:scale-90 group"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="w-12 h-12 rounded-full bg-black/40 hover:bg-amber-500 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-2xl pointer-events-auto active:scale-90 group"
            aria-label="Next slide"
          >
            <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

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
              <div key={course.id || course._id} className="premium-course-card group">
                <div className="card-media-wrapper">
                  <img src={course.thumbnail} alt={course.title} className="card-media-img" />
                  
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

      {/* 5. Video Testimonials Cards Section */}
      <section className="py-16 md:py-24 bg-[#F5F9FA] border-t border-gray-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-widest mb-3 border border-amber-200">
              <Video size={14} className="text-amber-600" /> Authentic Student Stories
            </span>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-gray-900">
              Watch How Our Students Transformed Their Careers
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Real face-to-face stories from learners who built production apps, launched ad campaigns, and earned referral income.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {videoTestimonials.map((vt) => (
              <div 
                key={vt.id}
                className="h-[460px] rounded-[32px] overflow-hidden relative group shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2.5 border border-gray-200/80 bg-gray-950 flex flex-col justify-between"
              >
                <img 
                  src={vt.thumbnail} 
                  alt={vt.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />

                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

                <div className="relative z-10 p-4 flex items-start justify-between">
                  <span className="bg-white/95 backdrop-blur-md text-gray-900 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                    {vt.badge || 'STUDENT STORY'}
                  </span>

                  <img 
                    src={vt.avatar} 
                    alt={vt.name} 
                    className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-lg" 
                  />
                </div>

                <div className="relative z-10 flex items-center justify-center my-auto">
                  <button 
                    onClick={() => setActiveVideoModal(vt)}
                    className="w-16 h-16 rounded-full bg-white/95 text-[#001845] hover:bg-amber-500 hover:text-white flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 active:scale-95 border-2 border-white/50"
                    aria-label="Play video story"
                  >
                    <Play size={26} className="ml-1 fill-current" />
                  </button>
                </div>

                <div className="relative z-10 p-5 text-left bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent">
                  <span className="text-amber-400 text-[11px] font-extrabold uppercase tracking-wider block mb-1">
                    {vt.courseTag}
                  </span>

                  <h4 className="font-heading font-extrabold text-xl text-white mb-0.5 leading-snug">
                    {vt.name}
                  </h4>

                  <p className="text-gray-300 text-xs mb-3 font-medium">
                    {vt.role}
                  </p>

                  <p className="text-slate-200 text-xs font-normal leading-relaxed italic line-clamp-2 mb-4">
                    "{vt.quote}"
                  </p>

                  <button 
                    onClick={() => setActiveVideoModal(vt)}
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-amber-500 text-white border border-white/20 font-heading font-extrabold text-xs uppercase tracking-wider transition-all backdrop-blur-md flex items-center justify-center gap-1.5 shadow-md"
                  >
                    Watch Story <Play size={12} className="fill-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F5F9FA] p-8 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-primary-container/10 text-primary-container flex items-center justify-center mb-6">
                <GraduationCap size={32} />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-3">Outcome-Focused Learning</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Designed around career transformation, practical software engineering, UI/UX design, AI integration, and digital growth.</p>
            </div>

            <div className="bg-[#F5F9FA] p-8 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6">
                <Globe size={32} />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-3">100% Bilingual OS</h3>
              <p className="text-gray-600 text-sm leading-relaxed">First-of-its-kind seamless Telugu and English switching across every screen, ensuring barrier-free education.</p>
            </div>

            <div className="bg-[#F5F9FA] p-8 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
                <Award size={32} />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-3">PRO Mentors & Credentials</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Receive live mentorship from industry faculty and earn cryptographically verifiable skill certificates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Creative Bento Grid Student Reviews Section (AFTER Why Choose Us) */}
      <section className="py-16 md:py-24 bg-[#EBEFEF] border-t border-gray-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-gray-900 text-xs font-extrabold uppercase tracking-widest mb-3 border border-gray-300 shadow-sm">
              <MessageSquare size={14} className="text-amber-500" /> Student Reviews & Feedback
            </span>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-gray-900">
              What Our Indian Teenage Learners Say
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Real feedback from Indian students mastering tech, AI tools, and fullstack web development.
            </p>
          </div>

          {/* Asymmetric Bento Masonry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            
            {/* COLUMN 1 */}
            <div className="space-y-6">
              {/* Card 1: Top Cutout Circular Avatar Card */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200/80 relative pt-10">
                <Quote size={28} className="text-gray-800 fill-gray-800 mb-3" />
                <p className="text-gray-700 text-xs sm:text-sm font-medium leading-relaxed mb-6">
                  Learning React & Node on ClassConnect allowed me to build real-world web apps in just 60 days alongside senior PRO mentors.
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" alt="Rajesh Kumar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-heading font-extrabold text-xs text-gray-900">Rajesh Kumar</h5>
                    <span className="text-[11px] text-gray-500">@rajesh.tech</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Speech Bubble Card with 3 Circular Avatars below */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200/80 text-center">
                  <h4 className="font-heading font-extrabold text-lg text-gray-900 mb-2">I was very impressed!</h4>
                  <p className="text-gray-600 text-xs leading-relaxed mb-4">
                    From setting up Google Ads campaigns to deploying Fullstack projects, the live mentorship in Telugu was top tier.
                  </p>
                  <span className="text-[11px] font-bold text-gray-400">Venkatesh & Team</span>
                </div>
                {/* 3 Floating Avatar Circles overlapping below */}
                <div className="flex justify-center -mt-3 gap-2 relative z-10">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Student 1" className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover" />
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" alt="Student 2" className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover" />
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" alt="Student 3" className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover" />
                </div>
              </div>
            </div>

            {/* COLUMN 2 */}
            <div className="space-y-6">
              {/* Card 3: Center Rating & Headline Card */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200/80 text-center relative pb-10">
                <div className="flex justify-center gap-1 text-amber-400 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <h4 className="font-heading font-extrabold text-xl text-gray-900 mb-3">I really appreciate!!</h4>
                <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed mb-4">
                  The bilingual Telugu & English live masterclasses made complex backend concepts so easy to understand!
                </p>
                <div className="text-xs font-bold text-gray-900">Sneha Reddy</div>
                <div className="text-[11px] text-gray-400">@sneha_dev</div>
                <Quote size={28} className="text-gray-800 fill-gray-800 absolute bottom-4 right-4 opacity-90" />
              </div>

              {/* Card 4: Top Centered Avatar Badge Card */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200/80 text-center relative pt-10 mt-8">
                <div className="w-14 h-14 rounded-full border-4 border-white shadow-md overflow-hidden absolute -top-7 left-1/2 -translate-x-1/2">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" alt="Ananya Varma" className="w-full h-full object-cover" />
                </div>
                <h5 className="font-heading font-extrabold text-sm text-gray-900 mb-1">Good Job!</h5>
                <div className="flex justify-center gap-1 text-amber-400 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p className="text-gray-600 text-xs leading-relaxed italic">
                  "The direct daily referral commission payout system is 100% transparent and instant!"
                </p>
              </div>
            </div>

            {/* COLUMN 3 */}
            <div className="space-y-6">
              {/* Card 5: Full Portrait Indian Student Image Card */}
              <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-200/80 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=700&fit=crop" 
                  alt="Indian Student Learning" 
                  className="w-full h-56 object-cover rounded-2xl mb-4" 
                />
                <p className="text-gray-700 text-xs font-medium leading-relaxed mb-3">
                  Outcome-based practical training that actually helps you land software engineering internships.
                </p>
                <div className="text-right font-serif italic text-amber-600 font-bold text-sm">
                  Kavya Sharma
                </div>
              </div>

              {/* Card 6: Horizontal Split Card */}
              <div className="bg-white rounded-3xl p-4 shadow-md border border-gray-200/80 flex items-center gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=300&fit=crop" 
                  alt="Harish Varma" 
                  className="w-24 h-28 object-cover rounded-2xl flex-shrink-0" 
                />
                <div>
                  <Quote size={18} className="text-gray-800 fill-gray-800 mb-1" />
                  <p className="text-gray-700 text-[11px] font-medium leading-tight mb-2">
                    ClassConnect gave me the confidence to launch my own freelance agency while still in college.
                  </p>
                  <div className="text-xs font-bold text-gray-900">Harish Varma</div>
                  <div className="text-[10px] text-gray-500">Co-Founder DevStudio</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Video Story Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-gray-950 text-white rounded-3xl border border-white/20 p-6 max-w-3xl w-full shadow-2xl relative overflow-hidden">
            <button 
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
              aria-label="Close video player"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img src={activeVideoModal.avatar || activeVideoModal.thumbnail} alt={activeVideoModal.name} className="w-10 h-10 rounded-full border border-white/30 object-cover" />
              <div>
                <h4 className="font-heading font-extrabold text-lg text-white">{activeVideoModal.name}</h4>
                <span className="text-xs text-amber-400 font-semibold">{activeVideoModal.courseTag || 'ClassConnect Story'}</span>
              </div>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 mb-4">
              <iframe
                src={activeVideoModal.videoUrl}
                title={activeVideoModal.name}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p className="text-xs md:text-sm text-gray-300 italic">
              "{activeVideoModal.quote}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
