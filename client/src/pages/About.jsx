import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Star, BookOpen, Award, CheckCircle2, ArrowRight, ShieldCheck, 
  Zap, Sparkles, Layers, Code, Smartphone, Layout, Cpu, TrendingUp, Lock, PhoneCall, Send, Phone
} from 'lucide-react';
import { translations } from '../data/translations';

export default function About({ currentLang = 'EN' }) {
  const t = translations[currentLang]?.about || translations.EN.about;
  const tc = translations[currentLang]?.common || translations.EN.common;

  const categories = [
    { title: 'Fullstack Web Development', desc: 'HTML5, CSS3, React 19, Next.js, Node.js & Microservices', icon: Code, color: 'bg-blue-500/10 text-blue-600' },
    { title: 'Mobile App Development', desc: 'React Native, Flutter, Swift, Android & iOS Native APIs', icon: Smartphone, color: 'bg-purple-500/10 text-purple-600' },
    { title: 'UI/UX & Visual Design', desc: 'Figma, Motion Graphics, Design Systems & Wireframing', icon: Layout, color: 'bg-pink-500/10 text-pink-600' },
    { title: 'AI & Data Science', desc: 'Python, OpenAI APIs, LLM Agents & Machine Learning', icon: Cpu, color: 'bg-emerald-500/10 text-emerald-600' },
    { title: 'Digital Marketing & Growth', desc: 'Performance Marketing, Google Ads, Meta Ads & Funnels', icon: TrendingUp, color: 'bg-amber-500/10 text-amber-600' },
    { title: 'Cyber Security & Cloud', desc: 'AWS, Azure, Ethical Hacking & DevOps Infrastructure', icon: Lock, color: 'bg-indigo-500/10 text-indigo-600' },
  ];

  return (
    <div className="bg-[#F5F9FA] min-h-screen text-gray-900 overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#001845] via-[#002B70] to-[#001845] text-white overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-xs font-extrabold uppercase tracking-widest mb-6 shadow-md">
            <Sparkles size={14} className="text-amber-400" /> {t.tag}
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight mb-6">
            Traditional online learning is fragmented. <span className="text-amber-400">ClassConnect unites everything.</span>
          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            {t.subtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/courses" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-heading font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2">
              {tc.viewAll} <ArrowRight size={16} />
            </Link>
            <Link to="/packages" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-heading font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all backdrop-blur-md">
              View Packages
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Core Constellation Metrics & Achievements */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-[#F5F9FA] border border-gray-200/80">
              <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-primary">{t.metrics.bilingual}</h3>
              <p className="text-xs font-semibold text-gray-500 mt-1">{t.metrics.bilingualSub}</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#F5F9FA] border border-gray-200/80">
              <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-amber-500">{t.metrics.learners}</h3>
              <p className="text-xs font-semibold text-gray-500 mt-1">{t.metrics.learnersSub}</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#F5F9FA] border border-gray-200/80">
              <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-emerald-600">{t.metrics.rating}</h3>
              <p className="text-xs font-semibold text-gray-500 mt-1">{t.metrics.ratingSub}</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#F5F9FA] border border-gray-200/80">
              <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-secondary-container">{t.metrics.projects}</h3>
              <p className="text-xs font-semibold text-gray-500 mt-1">{t.metrics.projectsSub}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 3 Pillars Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="pre-title">Core Foundation</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-gray-900">{t.pillarsTitle}</h2>
          <p className="text-gray-600 text-sm mt-2">Designed from the ground up for high outcome retention.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-primary-container/10 text-primary-container flex items-center justify-center mb-6">
              <Layers size={28} />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-3">{t.p1Title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{t.p1Desc}</p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6">
              <Award size={28} />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-3">{t.p2Title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{t.p2Desc}</p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
              <Zap size={28} />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-3">{t.p3Title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{t.p3Desc}</p>
          </div>
        </div>
      </section>

      {/* 4. Curated Learning Categories */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="pre-title">Curated Domains</span>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-gray-900">Explore Learning Ecosystems</h2>
            <p className="text-gray-600 text-sm mt-2">Comprehensive masterclass modules covering modern tech & business domains.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl border border-gray-200 bg-[#F5F9FA] hover:bg-white hover:shadow-lg transition-all group">
                  <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mb-4`}>
                    <IconComp size={24} />
                  </div>
                  <h4 className="font-heading font-extrabold text-lg text-gray-900 mb-2 group-hover:text-primary-container">{cat.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Contact Section / Handset Support Section */}
      <section id="contact" className="py-16 md:py-24 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="bg-gradient-to-br from-[#001845] via-[#002B70] to-[#001845] text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Tactile Handset / Info */}
            <div className="lg:col-span-5 text-center lg:text-left">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto lg:mx-0 mb-6 shadow-xl animate-pulse">
                <PhoneCall size={36} />
              </div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">24-Hour SLA Support Guarantee</span>
              <h3 className="font-heading font-extrabold text-3xl mb-4">Connect With Support Engineers</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Have questions about bilingual switching, course certificates, or referral payouts? Our academic counselors are available to assist you.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-xs font-semibold text-amber-300">
                <span>📲 +91 8885490091</span>
                <span>📲 +91 9014887314</span>
              </div>
            </div>

            {/* Quick Contact Link */}
            <div className="lg:col-span-7 flex justify-center lg:justify-end">
              <Link 
                to="/contact" 
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-heading font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-xl inline-flex items-center gap-3"
              >
                <Send size={18} /> Open Full Contact Page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
