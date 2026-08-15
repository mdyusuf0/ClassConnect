import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, ChevronLeft, Globe, Award, Zap, Sparkles, ArrowRight } from 'lucide-react';

const defaultSlides = [
  {
    title: '100% Practical Bilingual Learning OS',
    subtitle: 'English & Telugu',
    description: 'Break free from generic video tutorials. ClassConnect delivers production-grade training in both English and Telugu with live PRO Mentors, real project labs, and outcome-focused curriculum.',
    badge: 'BILINGUAL OS',
    icon: Globe,
    ctaText: 'Explore Courses',
    ctaLink: '/courses',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop',
  },
  {
    title: 'Cryptographic Skill Credentials & Live Labs',
    subtitle: '30+ Career-Ready Courses',
    description: 'Earn verifiable digital certificates for every completed course. Join daily live masterclasses with senior industry mentors. Build real projects for your portfolio.',
    badge: 'PRO CREDENTIALS',
    icon: Award,
    ctaText: 'View Packages',
    ctaLink: '/packages',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop',
  },
  {
    title: 'Direct Daily Referral Income & Wallet',
    subtitle: 'Earn While You Learn',
    description: 'Share ClassConnect with your network and earn ₹300 to ₹3,000 direct referral commission per signup. Track earnings in real-time from your personal dashboard.',
    badge: 'EARN DAILY',
    icon: Zap,
    ctaText: 'Join Now',
    ctaLink: '/register',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=500&fit=crop',
  },
];

export default function CourseIntroModal({ isOpen, onClose, slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dontShow, setDontShow] = useState(false);

  const activeSlides = slides && slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isOpen, activeSlides.length]);

  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (dontShow) {
      localStorage.setItem('cc_hide_intro', 'true');
    }
    onClose();
  };

  const prevSlide = () => setCurrentSlide(prev => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % activeSlides.length);

  const slide = activeSlides[currentSlide];
  const SlideIcon = slide.icon || Sparkles;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer"
          aria-label="Close intro"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col md:flex-row min-h-[420px]">
          {/* Left: Content */}
          <div className="flex-1 p-8 md:p-10 flex flex-col justify-center relative">
            {/* Slide Counter */}
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">
              Step {currentSlide + 1} of {activeSlides.length}
            </span>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-widest border border-amber-200 mb-4 w-fit">
              <SlideIcon size={13} className="text-amber-600" /> {slide.badge}
            </div>

            {/* Title */}
            <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-gray-900 mb-2 leading-tight">
              {slide.title}
            </h2>

            {/* Subtitle */}
            <p className="text-amber-600 font-bold text-sm mb-3">{slide.subtitle}</p>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-md">
              {slide.description}
            </p>

            {/* CTA Button */}
            <Link
              to={slide.ctaLink || '/courses'}
              onClick={handleClose}
              className="bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl inline-flex items-center gap-2 shadow-md transition-all w-fit"
            >
              {slide.ctaText} <ArrowRight size={15} />
            </Link>

            {/* Bottom: Navigation + Don't Show */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-amber-500 hover:text-white text-gray-600 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1.5 mx-2">
                  {activeSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentSlide
                          ? 'w-8 h-2.5 bg-amber-500'
                          : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-amber-500 hover:text-white text-gray-600 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dontShow}
                  onChange={e => setDontShow(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                Don't show again
              </label>
            </div>
          </div>

          {/* Right: Image */}
          <div className="hidden md:block w-[380px] relative overflow-hidden">
            {activeSlides.map((s, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              >
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
